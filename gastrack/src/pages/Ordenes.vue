<template>
  <MainLayout>
    <v-container class="pa-4">
      <h1>Ordenes</h1>

      <!-- Filtros -->
      <v-row class="mb-4" align="center">

        <!-- Filtro por estado -->
        <v-col cols="12" sm="4">
          <FiltroEstado v-model:estado="filtroEstado" />
        </v-col>

        <!-- Barra de busqueda -->
        <v-col cols="12" sm="4">
          <v-text-field
            label="Buscar por numero"
            v-model="busquedaNumero"
            type="number"
            clearable
          />
        </v-col>

      </v-row>

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
  const busquedaNumero = ref("")

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

  //filtros
  const ordenesFiltradas = computed(() => {
    let lista = [...orders.value]

    // Filtro por estado
    if (filtroEstado.value) {
      lista = lista.filter(o => o.estado === filtroEstado.value)
    }

    // busqueda numero de orden
    if (busquedaNumero.value) {
      const texto = busquedaNumero.value.toString().trim()
      lista = lista.filter(o =>
        o.numero?.toString().includes(texto)
      )
    }

    return lista
  })

</script>
