<template>
  <MainLayout>
    <v-container class="pa-4">
      <h1>Ordenes</h1>

      <!-- Filtro -->
      <FiltroEstado v-model:estado="filtroEstado" />

      <v-card>
        <v-card-text>
          <TablaOrdenes :headers="headers" :items="ordenesFiltradas" />
        </v-card-text>
      </v-card>

    </v-container>
  </MainLayout>
</template>

<script setup>
  import { onMounted, ref, computed } from 'vue'
  import TablaOrdenes from '@/components/TablaOrdenes.vue'
  import FiltroEstado from '@/components/Filtro.vue'
  import MainLayout from '@/layouts/MainLayout.vue'
  import api from '@/services/api'

  const orders = ref([])
  const filtroEstado = ref(null)

  const headers = [
    { title: 'Numero', value: 'numero' },
    { title: 'Estado', value: 'estado' },
    { title: 'Camion', value: 'camion' },
    { title: 'Preset', value: 'preset' },
    { title: 'Detalle', value: 'acciones', sortable: false },
  ]

  onMounted(async () => {
    try {
      const res = await api.get('/orden')
      console.log('DATA:', res.data)

      orders.value = res.data.map(o => ({
        numero: o['numero-orden'],
        estado: o.estado,
        camion: o.camion,
        preset: o.preset,
      }))
    } catch (error) {
      console.error('ERROR:', error)
    }
  })

  /* aplica el filtro */
  const ordenesFiltradas = computed(() => {
    if (!filtroEstado.value) return orders.value

    return orders.value.filter(o => o.estado === filtroEstado.value)
  })

</script>
