<template>
  <MainLayout>

    <v-container class="pa-4">

      <h1 class="mt-4">Detalle de Orden #{{ numero }}</h1>
      <h3 class="mt-4">Cod Ext: {{ orden.codigoExterno }}</h3>
      <v-card v-if="orden && orden.id" class="mt-4">
        <v-card-title>Información de la Orden</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="4">
              <strong>Estado:</strong> {{ estadoOrden(orden.estado) }}
            </v-col>

            <v-col v-if="orden.estado== 'PESAJE_INICIAL_REGISTRADO'" cols="12" md="4">
              <strong>Carga:</strong> {{ isHabilitadaCarga(orden.cargaHabilitada) }}
            </v-col>

            <v-col cols="12" md="4">
              <strong>Fecha de registro:</strong> {{ new Date(orden.fechaRecepcionInicial).toLocaleString() }}
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="4">
              <strong>Empresa:</strong> {{ orden.cliente.razonSocial }}
            </v-col>

            <v-col cols="12" md="4">
              <strong>Camión:</strong> {{ orden.camion.patente }}
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="4">
              <strong>Producto:</strong> {{ orden.producto.nombre }}
            </v-col>

            <v-col cols="12" md="4">
              <strong>Preset:</strong> {{ orden.preset }}
            </v-col>
            <v-col cols="12" md="4">
              <strong>Fecha de carga prevista:</strong> {{ new Date(orden.fechaCargaPrevista).toLocaleString() }}
            </v-col>
          </v-row>

        </v-card-text>
      </v-card>

      <v-card class="mt-4">
        <v-card-title>Detalle de Carga</v-card-title>
        <v-divider />

        <v-card-text>
          <v-row>
            <v-col v-if="orden.estado != 'PENDIENTE_PESAJE_INICIAL'" cols="12" md="6">
              <strong>Peso inicial:</strong>
              {{ orden.pesoInicial }}
              <br>
              {{ new Date(orden.fechaPesajeInicial).toLocaleString() }}
            </v-col>

            <v-col v-if="orden.estado == 'FINALIZADO'" cols="12" md="6">
              <strong>Peso final:</strong>
              {{ orden.pesoFinal }}
              <br>
              {{ new Date(orden.fechaPesajeFinal).toLocaleString() }}
            </v-col>
          </v-row>
          <v-row>
            <v-col v-if="(orden.estado == 'PESAJE_INICIAL_REGISTRADO' && orden.cargaHabilitada) || orden.estado == 'ORDEN_CERRADA_PARA_CARGA'|| orden.estado == 'FINALIZADO'" cols="12" md="6">
              <strong>Fecha de inicio de carga:</strong>
              {{ new Date(orden.fechaInicioCarga).toLocaleString() }}
            </v-col>

            <v-col v-if="orden.estado == 'ORDEN_CERRADA_PARA_CARGA' || orden.estado == 'FINALIZADO'" cols="12" md="6">
              <strong>Fecha de fin de carga:</strong>
              {{ new Date(orden.fechaFinCarga).toLocaleString() }}
            </v-col>
          </v-row>
          <v-divider class="my-4" />
          <h3 v-if="(orden.estado == 'PESAJE_INICIAL_REGISTRADO' && orden.cargaHabilitada) || orden.estado == 'ORDEN_CERRADA_PARA_CARGA'|| orden.estado == 'FINALIZADO'">Última medición recibida</h3>
          <v-row v-if="(orden.estado == 'PESAJE_INICIAL_REGISTRADO' && orden.cargaHabilitada) || orden.estado == 'ORDEN_CERRADA_PARA_CARGA'|| orden.estado == 'FINALIZADO'">
            <v-col cols="12" md="3">
              <strong>Masa acumulada:</strong>
              {{ detalle.masaAcumulada || orden.ultimaMasaAcumulada }}
            </v-col>

            <v-col cols="12" md="3">
              <strong>Densidad:</strong>
              {{ detalle.densidad || orden.ultimaDensidad }}
            </v-col>

            <v-col cols="12" md="3">
              <strong>Temperatura:</strong>
              {{ detalle.temperatura || orden.ultimaTemperatura }}
            </v-col>

            <v-col cols="12" md="3">
              <strong>Caudal:</strong>
              {{ detalle.caudal || orden.ultimoCaudal }}
            </v-col>

            <v-col cols="12" md="3">
              <strong>Última medición:</strong>
              {{ detalle.fecha || new Date(orden.fechaFinCarga).toLocaleString() }}
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Card: Gráficos -->
      <v-card v-if="orden.estado== 'PESAJE_INICIAL_REGISTRADO' && orden.cargaHabilitada" class="mt-4">
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

      <!-- Card: Resultados y descarga PDF -->
      <v-card v-if="orden.estado == 'FINALIZADO'" class="mt-4">
        <v-card-title>Resultados</v-card-title>
        <v-divider />

        <v-card-text>

          <v-row v-if="conciliacion">
            <v-col cols="12" md="4">
              <strong>Producto cargado:</strong> {{ conciliacion.productoCargado }} <strong>kg</strong>
            </v-col>

            <v-col cols="12" md="4">
              <strong>Neto balanza:</strong> {{ conciliacion.netoBalanza }} <strong>kg</strong>
            </v-col>

            <v-col cols="12" md="4">
              <strong>Diferencia:</strong> {{ conciliacion.diferencia }} <strong>kg</strong>
            </v-col>

            <v-col cols="12" md="4">
              <strong>Promedio caudal:</strong> {{ conciliacion.promedioCaudal }} <strong>m³/s</strong>
            </v-col>

            <v-col cols="12" md="4">
              <strong>Promedio temperatura:</strong> {{ conciliacion.promedioTemperatura }} <strong>°C</strong>
            </v-col>

            <v-col cols="12" md="4">
              <strong>Promedio densidad:</strong> {{ conciliacion.promedioDensidad }} <strong>kg/m³</strong>
            </v-col>
          </v-row>
          <v-divider class="my-4" />

          <v-btn color="red" variant="tonal" @click="descargarPdf(numero)">
            Descargar PDF de la Orden
          </v-btn>

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
  import { nextTick, onMounted, ref } from 'vue'

  import { useRoute } from 'vue-router'
  import MainLayout from '@/layouts/MainLayout.vue'
  import api from '@/services/api'

  import { descargarPdf } from '@/services/conciliacion.js'

  const route = useRoute()
  const numero = route.params.numeroOrden
  const orden = ref({})
  const detalle = ref({
    masaAcumulada: 0,
    densidad: 0,
    temperatura: 0,
    caudal: 0,
    fecha: null,
  })
  const conciliacion = ref(null)

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

      conectarWebSocket() // ⬅️ OK
    } catch (error) {
      console.error('Error cargando orden', error)
    }
  })
  watch(orden, async o => {
    if (!o || !o.estado) return

    // Si está habilitado para carga → inicializar gráficos
    if (o.estado === 'PESAJE_INICIAL_REGISTRADO' && o.cargaHabilitada) {
      await nextTick()
      crearGraficos()
    }

    // Si está FINALIZADO → pedir conciliación
    if (o.estado === 'FINALIZADO') {
      try {
        const res = await api.get(`/orden/conciliacion/${numero}`)

        function fix (n) {
          return Number(n).toFixed(2)
        }

        conciliacion.value = {
          numeroOrden: res.data['Número de orden'],
          codigoExterno: res.data['Código externo'],
          pesajeInicial: fix(res.data['Pesaje inicial']),
          pesajeFinal: fix(res.data['Pesaje final']),
          productoCargado: fix(res.data['Producto cargado']),
          netoBalanza: fix(res.data['Neto por balanza']),
          diferencia: fix(res.data['Diferencia entre balanza y caudalímetro']),
          promedioCaudal: fix(res.data['Promedio caudal']),
          promedioTemperatura: fix(res.data['Promedio temperatura']),
          promedioDensidad: fix(res.data['Promedio densidad']),
        }
      } catch (error) {
        console.error('Error obteniendo conciliación', error)
      }
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
        scales: {
          x: {
            ticks: {
              display: false,
            },
          },
        },
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
    const max = 100
    chart.data.labels.push(label)
    chart.data.datasets[0].data.push(value)

    if (chart.data.labels.length > max) {
      chart.data.labels.shift()
      chart.data.datasets[0].data.shift()
    }

    chart.update()
  }
  function estadoOrden (estado) {
    switch (estado) {
      case 'PENDIENTE_PESAJE_INICIAL': {
        return 'Pendiente de pesaje inicial'
      }
      case 'PESAJE_INICIAL_REGISTRADO': {
        return 'Pesaje inicial registrado'
      }
      case 'ORDEN_CERRADA_PARA_CARGA': {
        return 'Orden cerrada para carga'
      }
      case 'FINALIZADO': {
        return 'Finalizado'
      }
      default: {
        return estado
      }
    }
  }
  function isHabilitadaCarga (habilitado) {
    return habilitado ? 'Abierta' : 'Cerrada'
  }
</script>
