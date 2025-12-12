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

            <v-col v-if="orden.estado == 'PESAJE_INICIAL_REGISTRADO'" cols="12" md="4">
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

      <v-card v-if="orden.estado != 'PENDIENTE_PESAJE_INICIAL'" class="mt-4">
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
            <v-col
              v-if="(orden.estado == 'PESAJE_INICIAL_REGISTRADO' && orden.cargaHabilitada) || orden.estado == 'ORDEN_CERRADA_PARA_CARGA' || orden.estado == 'FINALIZADO'"
              cols="12"
              md="6"
            >
              <strong>Fecha de inicio de carga:</strong>
              {{ new Date(orden.fechaInicioCarga).toLocaleString() }}
            </v-col>

            <v-col v-if="orden.estado == 'ORDEN_CERRADA_PARA_CARGA' || orden.estado == 'FINALIZADO'" cols="12" md="6">
              <strong>Fecha de fin de carga:</strong>
              {{ new Date(orden.fechaFinCarga).toLocaleString() }}
            </v-col>
          </v-row>
          <v-row
            v-if="(orden.estado == 'PESAJE_INICIAL_REGISTRADO' && orden.cargaHabilitada) || orden.estado == 'ORDEN_CERRADA_PARA_CARGA' || orden.estado == 'FINALIZADO'"
          >
            <v-col cols="12" md="6">
              <strong>ETA:</strong>
              {{ eta }}
            </v-col>
            <v-col cols="12" md="6">
              <strong>Tiempo transcurrido:</strong>
              {{ tiempoTranscurrido }}
            </v-col>
          </v-row>
          <v-divider class="my-4" />
          <h3
            v-if="(orden.estado == 'PESAJE_INICIAL_REGISTRADO' && orden.cargaHabilitada) || orden.estado == 'ORDEN_CERRADA_PARA_CARGA' || orden.estado == 'FINALIZADO'"
          >
            Última medición recibida</h3>
          <v-row
            v-if="(orden.estado == 'PESAJE_INICIAL_REGISTRADO' && orden.cargaHabilitada) || orden.estado == 'ORDEN_CERRADA_PARA_CARGA' || orden.estado == 'FINALIZADO'"
          >
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
              {{ detalle.fecha || new Date(orden.fechaUltimoMedicion).toLocaleString() || '-' }}
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
      <!-- Card: Gráficos -->
      <v-card
        v-if="(orden.estado == 'PESAJE_INICIAL_REGISTRADO' && orden.cargaHabilitada) || orden.estado == 'ORDEN_CERRADA_PARA_CARGA' || orden.estado == 'FINALIZADO'"
        class="mt-4"
      >
        <GraficosDetalles ref="graficosRef" :detalle="detalle" />

      </v-card>

    </v-container>
  </MainLayout>
</template>

<script setup>
  import { nextTick, onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import GraficosDetalles from '@/components/GraficosDetalles.vue'
  import MainLayout from '@/layouts/MainLayout.vue'
  import api from '@/services/api'
  import { calcularETA, formatearTiempo } from '@/services/calculos'

  import { descargarPdf } from '@/services/conciliacion.js'
  import { conectarWebSocket, desuscribirCabecera } from '@/services/websocket'
  const graficosRef = ref(null)

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

  const graficosCreados = ref(false)

  const tiempoTranscurrido = ref('00:00:00')
  let timerInterval = null
  const eta = ref('00:00:00')
  let wsConectado = false

  onMounted(async () => {
    try {
      const resOrden = await api.get(`/orden/numeroOrden/${numero}`)
      orden.value = resOrden.data
      if (!wsConectado) {
        conectarWebSocket(numero, actualizarDatosDetalle, actualizarOrdenWebSocket)
        wsConectado = true
      }
    } catch (error) {
      console.error('Error de conexion websocket', error)
    }
  })
  watch(orden, async o => {
    if (!o || !o.estado) return

    // Si está habilitado para carga inicializar gráficos y contador
    if ((o.estado === 'PESAJE_INICIAL_REGISTRADO' && o.cargaHabilitada) && !graficosCreados.value) {
      await nextTick()
      graficosRef.value.crearGraficos()

      graficosCreados.value = true
      iniciarContador(o.fechaInicioCarga)
    }

    // Si esta cerrado para carga, desconectar WS y tomar datos de grafico desde endpoint
    if (o.estado === 'ORDEN_CERRADA_PARA_CARGA' || o.estado === 'FINALIZADO') {
      desuscribirCabecera()
      detenerContador(o.fechaFinCarga, o.fechaInicioCarga)

      try {
        const resDatos = await api.get(`/detalle/by-orden/${o.id}`)
        await nextTick()
        graficosRef.value.crearGraficos()

        for (const dato of resDatos.data) {
          actualizarDatosDesdeDetalle(dato)
        }
      } catch (error) {
        console.error('Error obteniendo datos de carga', error)
      }
    }
    // Si está FINALIZADO → pedir conciliación
    if (o.estado === 'FINALIZADO') {
      try {
        const res = await api.get(`/orden/conciliacion/${numero}`)

        conciliacion.value = {
          numeroOrden: res.data['Número de orden'],
          codigoExterno: res.data['Código externo'],
          pesajeInicial: res.data['Pesaje inicial'].toFixed(2),
          pesajeFinal: res.data['Pesaje final'].toFixed(2),
          productoCargado: res.data['Producto cargado'].toFixed(2),
          netoBalanza: res.data['Neto por balanza'].toFixed(2),
          diferencia: res.data['Diferencia entre balanza y caudalímetro'].toFixed(2),
          promedioCaudal: res.data['Promedio caudal'].toFixed(2),
          promedioTemperatura: res.data['Promedio temperatura'].toFixed(2),
          promedioDensidad: res.data['Promedio densidad'].toFixed(2),
        }
      } catch (error) {
        console.error('Error obteniendo conciliación', error)
      }
    }
  })

  function actualizarDatosDesdeDetalle (dato) {
    actualizarDatosDetalle({
      fechaUltimoMedicion: dato.fecha,
      ultimaMasaAcumulada: dato.masaAcumulada,
      ultimaDensidad: dato.densidad,
      ultimaTemperatura: dato.temperatura,
      ultimoCaudal: dato.caudal,
    })
  }

  function actualizarDatosDetalle (data) {
    const fechaFormat = new Date(data.fechaUltimoMedicion).toLocaleString()
    detalle.value.masaAcumulada = data.ultimaMasaAcumulada
    detalle.value.densidad = data.ultimaDensidad
    detalle.value.temperatura = data.ultimaTemperatura
    detalle.value.caudal = data.ultimoCaudal
    detalle.value.fecha = fechaFormat

    if (graficosRef.value) {
      graficosRef.value.actualizarGraficos({
        fechaUltimoMedicion: data.fechaUltimoMedicion,
        ultimaMasaAcumulada: data.ultimaMasaAcumulada,
        ultimaDensidad: data.ultimaDensidad,
        ultimaTemperatura: data.ultimaTemperatura,
        ultimoCaudal: data.ultimoCaudal,
      })
    }
    eta.value = calcularETA(
      orden,
      data.ultimaMasaAcumulada,
      data.ultimoCaudal,
    )
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
  function actualizarOrdenWebSocket (data) {
    // data viene del backend y ES UNA ORDEN COMPLETA
    orden.value = {
      ...orden.value, // conserva campos que no vienen en el WS
      ...data, // actualiza los recibidos
    }
  }

  function iniciarContador (fechaInicioCarga) {
    if (!fechaInicioCarga) return

    const inicio = new Date(fechaInicioCarga)

    if (timerInterval) clearInterval(timerInterval)

    timerInterval = setInterval(() => {
      const ahora = new Date()
      tiempoTranscurrido.value = formatearTiempo(ahora - inicio)
    }, 1000)
  }

  function detenerContador (fechaFinCarga, fechaInicioCarga) {
    if (timerInterval) {
      clearInterval(timerInterval)
      timerInterval = null
    }

    if (fechaFinCarga && fechaInicioCarga) {
      const inicio = new Date(fechaInicioCarga)
      const fin = new Date(fechaFinCarga)
      tiempoTranscurrido.value = formatearTiempo(fin - inicio)
    }
  }

</script>
