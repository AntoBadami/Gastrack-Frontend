<template>
  <MainLayout>
    <v-container class="pa-4">
      <h1>Histórico de Alarmas</h1>

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
          <v-select
            label="Filtro de Aceptación"
            :items="opcionesAceptacion"
            v-model="filtroAceptacion"
            clearable
            prepend-icon="mdi-check-circle-outline"
          ></v-select>
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
             class="mt-4"
             prominent
             border="left"
          >
            No se encontraron alarmas que coincidan con los filtros aplicados.
          </v-alert>
          <v-alert v-if="!cargando && alarmas.length === 0"
             type="warning"
             class="mt-4"
             prominent
             border="left"
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
const filtroAceptacion = ref(null)

// Nuevos filtros de fecha
const fechaDesde = ref(null)
const fechaHasta = ref(null)

// Opciones para el v-select de filtroAceptacion
const opcionesAceptacion = [
  { title: 'Todas', value: null },
  { title: 'Aceptadas', value: true },
  { title: 'No Aceptadas', value: false },
]

// headers para la tabla de alarmas
const headers = [
  { title: 'Fecha Emisión', value: 'fechaEmision' },
  { title: 'Fecha Aceptación', value: 'fechaAceptacion' },
  { title: 'Tipo', value: 'tipo' },
  { title: 'Nro. Orden', value: 'numeroOrden' },
  { title: 'Aceptada', value: 'aceptada' },
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
      fechaEmisionISO: a['fecha-emision'], 
      fechaEmision: new Date(a['fecha-emision']).toLocaleString(),
      fechaAceptacion: a['fecha-aceptacion'] ? new Date(a['fecha-aceptacion']).toLocaleString() : null,
      tipo: a.tipo,
      numeroOrden: a['numero-orden'],
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

  // Filtro por estado de Aceptación
  if (filtroAceptacion.value !== null) {
    lista = lista.filter(a => a.aceptada === filtroAceptacion.value)
  }

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

  return lista
})

//Ejecutar la carga al montar el componente
onMounted(cargarAlarmas)
</script>