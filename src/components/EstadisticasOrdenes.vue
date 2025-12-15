<template>
  <div>

    <v-row>

      <!-- Izquierda -->
      <v-col cols="12" md="8">

        <!-- Tarjetas -->
        <v-row class="mb-6">
          <v-col cols="12" sm="6" md="4">
            <v-card class="pa-3" elevation="1">
              <h3>Total de órdenes</h3>
              <p class="text-h5">{{ totalOrdenes }}</p>
            </v-card>
          </v-col>

          <v-col
            v-for="(cantidad, estado) in ordenesPorEstado"
            :key="estado"
            cols="12"
            sm="6"
            md="4"
          >
            <v-card class="pa-3" elevation="1">
              <h3>{{ estado }}</h3>
              <p class="text-h5">{{ cantidad }}</p>
            </v-card>
          </v-col>
        </v-row>

        <!-- Gráfico -->
        <v-card class="pa-4">
          <h3 class="mb-3">Distribución</h3>

          <apexchart
            type="pie"
            height="280"
            :options="chartOptions"
            :series="chartSeries"
          />
        </v-card>

      </v-col>

      <!-- Derecha -->
      <v-col cols="12" md="4">

        <v-card class="pa-4">
          <h3 class="mb-3">Últimas órdenes</h3>

          <div v-if="ultimasOrdenes.length === 0">
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

      </v-col>

    </v-row>

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
