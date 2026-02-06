<template>
  <v-data-table :headers="headers" :items="items" :items-per-page="10" class="elevation-1">
    <template v-slot:item="{ item }">
      <tr :class="{ 'warning-row': !item.aceptada }"> 
        <td>{{ item.fechaEmision }}</td>
        <td>{{ item.fechaAceptacion || '---' }}</td>
        <td>{{ item.tipoAlarma }}</td>
        <td>{{ item.numeroOrden }}</td>
        <td>{{ item.usuario || 'N/A' }}</td>
        <td>
          <v-chip v-if="!item.aceptada" color="error" variant="flat" size="small">
            Sin verificar
          </v-chip>

          <span v-else>
            {{ item.observacion || 'Sin observación' }}
          </span>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  headers: {
    type: Array,
    required: true,
  },
  items: {
    type: Array,
    required: true,
  },
})
</script>

<style>
.warning-row {
  background-color: rgba(244, 67, 54, 0.18); /* más intensidad */
  border-left: 5px solid #ff5252;
  box-shadow: inset 0 0 8px rgba(244, 67, 54, 0.4);
  transition: all 0.3s ease;
}

.warning-row td {
  color: inherit !important;
}

</style>
