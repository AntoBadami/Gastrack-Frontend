<template>
    <MainLayout>
        
        <v-container class="pa-4">

            <v-btn variant="tonal" color="grey" @click="$router.back()">
                Volver
            </v-btn>

            <h1 class="mt-4">Detalle de Orden #{{ numero }}</h1>

            <v-card class="mt-4">
                <v-card-title>Información de la Orden</v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" md="4"><strong>Estado:</strong> {{ orden.estado }}</v-col>
                        <v-col cols="12" md="4"><strong>Camión:</strong> {{ orden.camion }}</v-col>
                        <v-col cols="12" md="4"><strong>Preset:</strong> {{ orden.preset }}</v-col>
                    </v-row>
                </v-card-text>
            </v-card>

            <v-card class="mt-4">
                <v-card-title>Detalles de Carga</v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" md="3"><strong>Masa acumulada:</strong> {{ detalle.masaAcumulada }}</v-col>
                        <v-col cols="12" md="3"><strong>Densidad:</strong> {{ detalle.densidad }}</v-col>
                        <v-col cols="12" md="3"><strong>Temperatura:</strong> {{ detalle.temperatura }}</v-col>
                        <v-col cols="12" md="3"><strong>Caudal:</strong> {{ detalle.caudal }}</v-col>
                    </v-row>
                </v-card-text>
            </v-card>

        </v-container>

    </MainLayout>
</template>

<script setup>
import MainLayout from '@/layouts/MainLayout.vue'
import api from '@/services/api'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const numero = route.params.numeroOrden

const orden = ref({})
const detalle = ref({})

onMounted(async () => {
    try {
        const resOrden = await api.get(`/orden/numeroOrden/${numero}`)
        orden.value = resOrden.data

        const resDetalle = await api.get(`/detalle/by-orden/${numero}`)
        detalle.value = resDetalle.data

    } catch (err) {
        console.error("ERROR cargando detalle:", err)
    }
})
</script>
