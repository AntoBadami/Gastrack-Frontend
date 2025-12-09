<template>
  <MainLayout>

    <v-container class="pa-4">

      <v-btn color="grey" variant="tonal" @click="$router.back()">
        Volver
      </v-btn>

      <h1 class="mt-4">Detalle de Orden #{{ numero }}</h1>

      <v-card v-if="orden && orden.id" class="mt-4">
        <v-card-title>Información de la Orden</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="4"><strong>Estado:</strong> {{ orden.estado }}</v-col>
            <v-col cols="12" md="4"><strong>Camión:</strong> {{ orden.camion.patente }}</v-col>
            <v-col cols="12" md="4"><strong>Preset:</strong> {{ orden.preset }}</v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <v-card class="mt-4">
        <v-card-title>Último detalle de Carga</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="3">
              <strong>Masa acumulada:</strong>
              {{ detalle.masaAcumulada }}
            </v-col>

            <v-col cols="12" md="3">
              <strong>Densidad:</strong>
              {{ detalle.densidad }}
            </v-col>

            <v-col cols="12" md="3">
              <strong>Temperatura:</strong>
              {{ detalle.temperatura }}
            </v-col>

            <v-col cols="12" md="3">
              <strong>Caudal:</strong>
              {{ detalle.caudal }}
            </v-col>

            <v-col cols="12" md="3">
              <strong>Última medición:</strong>
              {{ detalle.fecha }}
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Card: Gráficos -->
      <v-card class="mt-4">
        <v-card-title>Gráficos en tiempo real</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <canvas ref="masaChart" style="height: 200px;" />
            </v-col>

            <v-col cols="12" md="6">
              <canvas ref="densidadChart" style="height: 200px;" />
            </v-col>

            <v-col cols="12" md="6">
              <canvas ref="temperaturaChart" style="height: 200px;" />
            </v-col>

            <v-col cols="12" md="6">
              <canvas ref="caudalChart" style="height: 200px;" />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

    </v-container>
  </MainLayout>
</template>

<script setup>
  import { Client } from '@stomp/stompjs'
  import { Chart } from 'chart.js/auto'
  import SockJS from 'sockjs-client'
  // WS
  import { onMounted, ref } from 'vue'

  import { useRoute } from 'vue-router'
  import MainLayout from '@/layouts/MainLayout.vue'

  import api from '@/services/api'

  const route = useRoute()
  const numero = route.params.numeroOrden

  const orden = ref({})
  const detalle = ref({
    masaAcumulada: 0,
    densidad: 0,
    temperatura: 0,
    caudal: 0,
    fecha: '-',
  })

  // Canvas refs
  const masaChart = ref(null)
  const densidadChart = ref(null)
  const temperaturaChart = ref(null)
  const caudalChart = ref(null)

  // Chart instances
  let masaChartInstance
  let densidadChartInstance
  let temperaturaChartInstance
  let caudalChartInstance

  onMounted(async () => {
    try {
      const resOrden = await api.get(`/orden/numeroOrden/${numero}`)
      orden.value = resOrden.data

      crearGraficos()
      conectarWebSocket()
    } catch (error) {
      console.error('Error cargando orden', error)
    }
  })

  function crearGraficos () {
    const baseConfig = label => ({
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label,
          data: [],
          tension: 0.3,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
      },
    })

    masaChartInstance = new Chart(masaChart.value, baseConfig('Masa'))
    densidadChartInstance = new Chart(densidadChart.value, baseConfig('Densidad'))
    temperaturaChartInstance = new Chart(temperaturaChart.value, baseConfig('Temperatura'))
    caudalChartInstance = new Chart(caudalChart.value, baseConfig('Caudal'))
  }

  function conectarWebSocket () {
    const socket = new SockJS('http://localhost:8080/cabecera-websocket', null, {
      withCredentials: true,
    })

    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: () => {},
    })

    client.onConnect = () => {
      console.log('✅ WebSocket conectado')

      client.subscribe('/topic/cabecera', message => {
        const data = JSON.parse(message.body)

        if (data.numeroOrden !== Number(numero)) return

        actualizarGraficos(data)
      })
    }

    client.onStompError = frame => {
      console.error('❌ STOMP error', frame)
    }

    client.activate()
  }

  function actualizarGraficos (data) {
    const fechaFormat = new Date(data.fechaUltimoMedicion).toLocaleString()

    pushDato(masaChartInstance, fechaFormat, data.ultimaMasaAcumulada)
    pushDato(densidadChartInstance, fechaFormat, data.ultimaDensidad)
    pushDato(temperaturaChartInstance, fechaFormat, data.ultimaTemperatura)
    pushDato(caudalChartInstance, fechaFormat, data.ultimoCaudal)

    // ✅ ACTUALIZAR CAMPOS VISIBLES
    detalle.value.masaAcumulada = data.ultimaMasaAcumulada
    detalle.value.densidad = data.ultimaDensidad
    detalle.value.temperatura = data.ultimaTemperatura
    detalle.value.caudal = data.ultimoCaudal
    detalle.value.fecha = fechaFormat
  }

  function pushDato (chart, label, value) {
    const max = 20
    chart.data.labels.push(label)
    chart.data.datasets[0].data.push(value)

    if (chart.data.labels.length > max) {
      chart.data.labels.shift()
      chart.data.datasets[0].data.shift()
    }

    chart.update()
  }
</script>
