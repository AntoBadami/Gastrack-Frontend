<template>
  <div>

    <v-row class="mb-6">

      <!-- Tarjeta Total -->
      <v-col cols="12" sm="6" md="4">
        <v-card class="pa-3" elevation="1">
          <h3 class="text-subtitle-1">Total de órdenes</h3>
          <p class="text-h5 font-weight-bold">{{ totalOrdenes }}</p>
        </v-card>
      </v-col>

      <!-- Tarjetas por estado -->
      <v-col
        v-for="(cantidad, estado) in ordenesPorEstado"
        :key="estado"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card class="pa-3" elevation="1">
          <h3 class="text-subtitle-1">{{ estado }}</h3>
          <p class="text-h5 font-weight-bold">{{ cantidad }}</p>
        </v-card>
      </v-col>

    </v-row>

    <!-- Grafico -->
    <v-card class="pa-4 mb-6" elevation="1">
      <h3 class="text-subtitle-1 mb-3">Distribución</h3>

      <apexchart
        height="250"
        type="pie"
        :options="chartOptions"
        :series="chartSeries"
      />
    </v-card>

    <!-- ultimas ordenes -->
    <v-card class="pa-4" elevation="1">
      <h3 class="text-subtitle-1 mb-3">Ultimas ordenes</h3>

      <div v-if="ultimasOrdenes.length === 0" class="text-grey text-center py-4">
        No hay datos todavía.
      </div>

      <v-list v-else>
        <v-list-item
          v-for="(o, i) in ultimasOrdenes"
          :key="i"
        >
          <v-list-item-title>
            Orden #{{ o["numero-orden"] }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ o.estado }}
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import ApexChart from "vue3-apexcharts"
import api from "@/services/api"

const apexchart = ApexChart

const ordenes = ref([])

onMounted(async () => {
  try {
    const res = await api.get("/orden")
    ordenes.value = res.data
  } catch (error) {
    console.error("Error obteniendo órdenes", error)
  }
})

const totalOrdenes = computed(() => ordenes.value.length)

// Agrupa por estado
const ordenesPorEstado = computed(() => {
  const est = {}
  ordenes.value.forEach(o => {
    est[o.estado] = (est[o.estado] || 0) + 1
  })
  return est
})

// Datos para el grafico
const chartSeries = computed(() =>
  Object.values(ordenesPorEstado.value)
)

const chartOptions = computed(() => ({
  labels: Object.keys(ordenesPorEstado.value),
  legend: { position: "bottom" }
}))

// Ultimas 5 ordenes
const ultimasOrdenes = computed(() =>
  [...ordenes.value].slice(-5)
)
</script>

<style scoped>
</style>
