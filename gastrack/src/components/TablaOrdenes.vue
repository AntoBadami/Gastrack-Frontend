<template>
  <v-data-table
    class="elevation-1"
    :headers="headers"
    :items="items"
  >
    <template #item.estado="{ item }">
      <EstadoChip :estado="item.estado" />
    </template>

    <template #item.acciones="{ item }">
      <!-- Botón ver detalle -->
      <v-icon
        size="22"
        style="cursor: pointer; margin-right: 10px;"
        @click="irADetalle(item.numero)"
      >
        mdi-file-document-outline
      </v-icon>

      <!-- Botón descargar PDF -->
      <v-icon
        size="22"
        style="cursor: pointer; color: white;"
        @click="descargarPdf(item.numero)"
      >
        mdi-file-pdf-box
      </v-icon>
    </template>

  </v-data-table>
</template>

<script setup>
  import { useRouter } from 'vue-router'
  import api from '@/services/api'
  import EstadoChip from './EstadoChip.vue'

  const router = useRouter()

  defineProps({
    headers: Array,
    items: Array,
  })

  async function descargarPdf (numeroOrden) {
    try {
      const response = await api.get(
        `/orden/conciliacion/${numeroOrden}`,
        {
          responseType: 'blob',
          headers: {
            Accept: 'application/pdf',
          },
        },
      )

      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = `conciliacion_${numeroOrden}.pdf`
      link.click()

      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error descargando PDF:', error)
      alert('No se pudo descargar el PDF')
    }
  }

  function irADetalle (numeroOrden) {
    router.push(`/orden/${numeroOrden}`)
  }
</script>
