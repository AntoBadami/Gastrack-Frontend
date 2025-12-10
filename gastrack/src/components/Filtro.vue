<template>
  <v-row class="mb-4">

    <v-col cols="12" sm="4">
      <v-select
        label="Filtrar por estado"
        :items="items"
        v-model="estadoSeleccionado"
        item-title="label"
        item-value="value"
        clearable
      />
    </v-col>

  </v-row>
</template>

<script setup>
    import { ref, watch } from 'vue'

    const emit = defineEmits(['update:estado'])

    const estadosConst = [
        'PENDIENTE PESAJE INICIAL',
        'PESAJE INICIAL REGISTRADO',
        'ORDEN CERRADA PARA CARGA',
        'FINALIZADO',
        'ORDEN CANCELADA'
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
        value: e
    }))

    const estadoSeleccionado = ref(null)

    watch(estadoSeleccionado, (val) => {
        emit('update:estado', val)
    })

</script>
