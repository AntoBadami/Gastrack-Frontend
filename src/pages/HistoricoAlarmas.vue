<template>
  <MainLayout>
    <v-container class="pa-4">
      <v-row class="mb-6">
        <v-col>
          <h1 class="text-h4 font-weight-bold">
            Histórico de Alarmas
          </h1>
        </v-col>
      </v-row>

      <v-row class="mb-6">
        <v-col cols="12" md="4">
          <v-card elevation="3">
            <v-card-title>Alarmas Hoy</v-card-title>
            <v-card-text class="text-h4 font-weight-bold">
              {{ alarmasHoy }}
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card elevation="3">
            <v-card-title>Alarmas del Mes</v-card-title>
            <v-card-text class="text-h4 font-weight-bold">
              {{ alarmasMes }}
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card elevation="3">
            <v-card-title>Promedio de Aceptación</v-card-title>
            <v-card-text class="text-h4 font-weight-bold">
              {{ promedioAceptacion }}
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>


      <v-row class="mb-4" align="center">

        <v-col cols="12" sm="3">
          <v-text-field
            label="Buscar por Nro de Orden"
            v-model="busquedaNumero"
            type="number"
            clearable
            prepend-icon="mdi-magnify"
          />
        </v-col>

        <v-col cols="12" sm="3">
          <v-text-field
            label="Fecha Emisión (Desde)"
            v-model="fechaDesde"
            type="date"
            clearable
            prepend-icon="mdi-calendar-start"
          />
        </v-col>
        
        <v-col cols="12" sm="3">
          <v-text-field
            label="Fecha Emisión (Hasta)"
            v-model="fechaHasta"
            type="date"
            clearable
            prepend-icon="mdi-calendar-end"
          />
        </v-col>
        <v-col class="text-right">
          <v-btn color="primary" @click="exportarCSV">
            Exportar CSV
          </v-btn>
        </v-col>

      </v-row>
      <v-card>
        <v-card-text>
          <TablaAlarmas :headers="headers" :items="alarmasFiltradas" />

          <div v-if="cargando" class="text-center pa-5">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
            <p>Cargando historial de alarmas...</p>
          </div>
          <v-alert v-if="!cargando && alarmas.length > 0 && alarmasFiltradas.length === 0"
             type="info"
             class="mt-4 border-s"
             prominent
          >
            No se encontraron alarmas que coincidan con los filtros aplicados.
          </v-alert>
          <v-alert v-if="!cargando && alarmas.length === 0"
             type="warning"
             class="mt-4 border-s"
             prominent
          >
            No se ha encontrado historial de alarmas en el sistema.
          </v-alert>

        </v-card-text>
      </v-card>

    </v-container>
  </MainLayout>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import TablaAlarmas from '@/components/TablaAlarmas.vue' 
import MainLayout from '@/layouts/MainLayout.vue'
import api from '@/services/api'

const alarmas = ref([])
const cargando = ref(false)
const busquedaNumero = ref("")

// Nuevos filtros de fecha
const fechaDesde = ref(null)
const fechaHasta = ref(null)

const ahora = new Date()

const alarmasHoy = computed(() => {
  return alarmas.value.filter(a => {
    const fecha = new Date(a.fechaEmisionISO)
    return fecha.toDateString() === ahora.toDateString()
  }).length
})

const alarmasMes = computed(() => {
  return alarmas.value.filter(a => {
    const fecha = new Date(a.fechaEmisionISO)
    return (
      fecha.getMonth() === ahora.getMonth() &&
      fecha.getFullYear() === ahora.getFullYear()
    )
  }).length
})

const promedioAceptacion = computed(() => {
  const aceptadas = alarmas.value.filter(a => a.fechaAceptacionISO)

  if (!aceptadas.length) return '—'

  const totalMs = aceptadas.reduce((acc, a) => {
    return acc + (
      new Date(a.fechaAceptacionISO).getTime() -
      new Date(a.fechaEmisionISO).getTime()
    )
  }, 0)

  const promedioMs = totalMs / aceptadas.length

  const minutos = Math.floor(promedioMs / 60000)
  const segundos = Math.floor((promedioMs % 60000) / 1000)

  return `${minutos}m ${segundos}s`
})

// Opciones para el v-select de filtroAceptacion
const opcionesAceptacion = [
  { title: 'Todas', value: null },
  { title: 'Aceptadas', value: true },
  { title: 'No Aceptadas', value: false },
]

// headers para la tabla de alarmas
const headers = [
  { title: 'Fecha Emisión', value: 'fecha' },
  { title: 'Fecha Aceptación', value: 'fechaAceptacion' },
  { title: 'Tipo', value: 'tipoAlarma' },
  { title: 'Nro. Orden', value: 'numeroOrden' },
  { title: 'Usuario', value: 'usuario' },
  { title: 'Observación', value: 'observacion', sortable: false },
]


// Función auxiliar para obtener la fecha de emisión en formato YYYY-MM-DD para la comparación
const getDateOnly = (dateTimeString) => {
    // La propiedad 'fechaEmision' en el mapeo devuelve una string de fecha y hora localizada,
    // por lo que necesitamos convertirla o usar el formato ISO directamente si fuera posible.
    const date = new Date(dateTimeString);
    if (isNaN(date.getTime())) return null; // Retorna null si no es una fecha válida
    
    // Devuelve la fecha en formato ISO (YYYY-MM-DD), cortando la hora.
    return date.toISOString().slice(0, 10);
};


const cargarAlarmas = async () => {
  cargando.value = true
  try {
    const res = await api.get('/alarma') 
    
    // Mapeo de los campos del backen
    alarmas.value = res.data.map(a => ({
      // Almacenamos la fecha de emisión en formato ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ) para fácil filtrado
      // y también la versión localizada para la vista.
      fechaEmisionISO: a.fecha,
      fechaEmision: new Date(a.fecha).toLocaleString(),

      fechaAceptacionISO: a.fechaAceptacion || null,
      fechaAceptacion: a.fechaAceptacion
        ? new Date(a.fechaAceptacion).toLocaleString()
        : null,
      tipoAlarma: a.tipoAlarma,
      numeroOrden: a['numeroOrden'],
      aceptada: a.aceptada,
      observacion: a.observacion,
      usuario: a.usuario,
    }))
  } catch (error) {
    console.error('ERROR al cargar las alarmas:', error)
  } finally {
    cargando.value = false
  }
}

//Filtro Computado
const alarmasFiltradas = computed(() => {
  let lista = [...alarmas.value]

  // Filtro por número de orden
  if (busquedaNumero.value) {
    const texto = busquedaNumero.value.toString().trim()
    lista = lista.filter(a =>
      a.numeroOrden?.toString().includes(texto)
    )
  }

  // Filtro por Rango de Fecha de Emisión
  if (fechaDesde.value || fechaHasta.value) {
    const inicio = fechaDesde.value ? new Date(fechaDesde.value).getTime() : 0 // 0 = inicio de los tiempos
    const fin = fechaHasta.value ? new Date(fechaHasta.value).getTime() + (24 * 60 * 60 * 1000) - 1 : Infinity // +1 día -1ms para incluir todo el día de 'fechaHasta'

    lista = lista.filter(a => {
      const fechaEmisionTimestamp = new Date(a.fechaEmisionISO).getTime()
      
      // Comprobar si la fecha está dentro del rango
      const esPosteriorAInicio = fechaEmisionTimestamp >= inicio
      const esAnteriorAFin = fechaEmisionTimestamp <= fin
      
      return esPosteriorAInicio && esAnteriorAFin
    })
  }
   lista.sort((a, b) => {
    // No aceptadas primero
    if (a.aceptada !== b.aceptada) {
      return a.aceptada ? 1 : -1
    }

    //Más recientes primero
    return new Date(b.fechaEmisionISO) - new Date(a.fechaEmisionISO)
  })

  return lista
})

//Ejecutar la carga al montar el componente
onMounted(cargarAlarmas)

function exportarCSV () {
  if (!alarmasFiltradas.value.length) return

  const headers = [
    'Fecha Emisión',
    'Fecha Aceptación',
    'Tipo',
    'Nro Orden',
    'Usuario',
    'Observación'
  ]

  const filas = alarmasFiltradas.value.map(a => [
    a.fechaEmision,
    a.fechaAceptacion || '',
    a.tipoAlarma,
    a.numeroOrden,
    a.usuario || '',
    a.observacion || ''
  ])

  const contenido = [
    headers.join(','),
    ...filas.map(f => f.join(','))
  ].join('\n')

  const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = 'historial_alarmas.csv'
  link.click()
}
</script>