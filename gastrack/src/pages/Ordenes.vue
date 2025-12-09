<template>
  <MainLayout>
    <v-container class="pa-4">
      <h1>Ordenes</h1>

      <v-card>
        <v-card-text>
          <TablaOrdenes :headers="headers" :items="orders" />
        </v-card-text>
      </v-card>

    </v-container>
  </MainLayout>
</template>

<script setup>
  import { onMounted, ref } from 'vue'
  import TablaOrdenes from '@/components/TablaOrdenes.vue'
  import MainLayout from '@/layouts/MainLayout.vue'
  import api from '@/services/api'

  const orders = ref([])

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

</script>
