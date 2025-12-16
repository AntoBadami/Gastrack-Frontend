<template>
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
</template>

<script setup>
  import { Chart } from 'chart.js/auto'
  import { defineExpose, nextTick, ref } from 'vue'

  const props = defineProps({
    detalle: Object,
  })

  const masaChart = ref(null)
  const densidadChart = ref(null)
  const temperaturaChart = ref(null)
  const caudalChart = ref(null)

  let masaChartInstance
  let densidadChartInstance
  let temperaturaChartInstance
  let caudalChartInstance

  function crearGraficos () {
    destruirGraficos()

    const base = label => ({
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label,
            data: [],
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        scales: {
          x: { ticks: { display: false } },
        },
      },
    })

    masaChartInstance = new Chart(masaChart.value, base('Masa'))
    densidadChartInstance = new Chart(densidadChart.value, base('Densidad'))
    temperaturaChartInstance = new Chart(temperaturaChart.value, base('Temperatura'))
    caudalChartInstance = new Chart(caudalChart.value, base('Caudal'))
  }

  function destruirGraficos () {
    masaChartInstance?.destroy()
    densidadChartInstance?.destroy()
    temperaturaChartInstance?.destroy()
    caudalChartInstance?.destroy()
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

  function actualizarGraficos (data) {
    const fecha = new Date(data.fechaUltimoMedicion).toLocaleString()

    pushDato(masaChartInstance, fecha, data.ultimaMasaAcumulada)
    pushDato(densidadChartInstance, fecha, data.ultimaDensidad)
    pushDato(temperaturaChartInstance, fecha, data.ultimaTemperatura)
    pushDato(caudalChartInstance, fecha, data.ultimoCaudal)
  }

  defineExpose({
    crearGraficos,
    actualizarGraficos,
  })
</script>
