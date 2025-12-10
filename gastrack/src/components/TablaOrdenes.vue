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
  import { descargarPdf } from '@/services/conciliacion.js'
  import EstadoChip from './EstadoChip.vue'
  const router = useRouter()

  defineProps({
    headers: Array,
    items: Array,
  })

  function irADetalle (numeroOrden) {
    router.push(`/orden/${numeroOrden}`)
  }
</script>
