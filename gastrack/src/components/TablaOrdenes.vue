<template>
    <v-data-table
        :headers="headers"
        :items="items"
        class="elevation-1"
    >
        <template #item.estado="{ item }">
        <EstadoChip :estado="item.estado" />
        </template>
    </v-data-table>
</template>

<script setup>
    import EstadoChip from './EstadoChip.vue'

    defineProps({
    headers: Array,
    items: Array
    })
</script>
