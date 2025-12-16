<template>
  <v-data-table :headers="headers" :items="items" :items-per-page="10" class="elevation-1">
    <template v-slot:item="{ item }">
      <tr :class="{ 'warning-row': !item.aceptada }"> 
        <td>{{ item.fechaEmision }}</td>
        <td>{{ item.fechaAceptacion || '---' }}</td>
        <td>{{ item.tipoAlarma }}</td>
        <td>{{ item.numeroOrden }}</td>
        <td>
          <v-chip :color="item.aceptada ? 'green' : 'white'" dark small>
            {{ item.aceptada ? 'Si' : 'No' }}
          </v-chip>
        </td>
        <td>{{ item.usuario || 'N/A' }}</td>
        <td>{{ item.observacion || 'Sin observación' }}</td>
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

<style scoped>
/* Estilo para las filas de alarmas NO aceptadas (Warning sutil) */
.warning-row {
  background-color: red; 
}
</style>