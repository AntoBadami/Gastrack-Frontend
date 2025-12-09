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
        style="cursor: pointer; color: red;"
        @click="descargarPdf(item.numero)"
      >
        mdi-file-pdf-box
      </v-icon>
    </template>

  </v-data-table>
</template>

<script setup>
  import { useRouter } from 'vue-router'
  import EstadoChip from './EstadoChip.vue'

  const router = useRouter()

  defineProps({
    headers: Array,
    items: Array,
  })

  function descargarPdf (numeroOrden) {
    const url = `http://localhost:8080/api/v1/orden/conciliacion/${numeroOrden}`

    fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/pdf',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(async res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.blob()
      })
      .then(blob => {
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = `conciliacion_${numeroOrden}.pdf`
        link.click()
        window.URL.revokeObjectURL(link.href)
      })
      .catch(error => {
        console.error('Error descargando PDF:', error)
        alert('No se pudo descargar el PDF')
      })
  }

  function irADetalle (numeroOrden) {
    router.push(`/orden/${numeroOrden}`)
  }
</script>
