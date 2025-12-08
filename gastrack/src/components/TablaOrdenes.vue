<template>
    <v-data-table
        :headers="headers"
        :items="items"
        class="elevation-1"
    >
        <template #item.estado="{ item }">
        <EstadoChip :estado="item.estado" />
        </template>

        <template #item.acciones="{ item }">
            <v-icon
                size="22"
                style="cursor: pointer;"
                @click="irADetalle(item.numero)"
            >
                mdi-file-document-outline
            </v-icon>
        </template>

    </v-data-table>
</template>

<script setup>
    import EstadoChip from './EstadoChip.vue'
    import { useRouter } from 'vue-router'

    const router = useRouter()

    defineProps({
    headers: Array,
    items: Array
    })

    function irADetalle(numero) {
        router.push(`/orden/${numeroOrden}`)
    }
</script>
