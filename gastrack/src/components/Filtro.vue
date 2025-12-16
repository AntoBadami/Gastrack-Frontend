<template>
  <div class="filtro-estado-wrapper">

    <v-select
      v-model="estadoSeleccionado"
      clearable
      item-title="label"
      item-value="value"
      :items="items"
      label="Filtrar por estado"
    />
  </div>
</template>

<script setup>
  import { ref, watch } from 'vue'

  const emit = defineEmits(['update:estado'])

  const estadosConst = [
    'PENDIENTE PESAJE INICIAL',
    'PESAJE INICIAL REGISTRADO',
    'ORDEN CERRADA PARA CARGA',
    'FINALIZADO',
    'ORDEN CANCELADA',
  ]

  // Convierte estado. ejemplo: "PENDIENTE_PESAJE_INICIAL" -> "Pendiente pesaje inicial"
  function formatEstadoLabel (estado) {
    if (!estado) return ''
    return estado
      .toLowerCase()
      .replace(/_/g, ' ')
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
  }

  const items = estadosConst.map(e => ({
    label: formatEstadoLabel(e),
    value: e,
  }))

  const estadoSeleccionado = ref(null)

  watch(estadoSeleccionado, val => {
    emit('update:estado', val)
  })

</script>

<style scoped>
.filtro-estado-wrapper {
  min-width: 260px;
}
</style>
