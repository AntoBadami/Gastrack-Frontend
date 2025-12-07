<template>
    <MainLayout>
        <v-container class="pa-4">
        <h1>Ordenes</h1>

        <v-card>
            <v-card-text>
                <TablaOrdenes :headers="headers" :items="orders" />
            </v-card-text>
        </v-card>

        </v-container>
    </MainLayout>
</template>

<script setup>
    import MainLayout from '@/layouts/MainLayout.vue'
    import TablaOrdenes from '@/components/TablaOrdenes.vue'
    import { ref } from 'vue'

    const headers = [
    { title: 'Número de orden', key: 'numero' },
    { title: 'Estado actual', key: 'estado' },
    { title: 'Camión', key: 'camion' },
    { title: 'Preset', key: 'preset' },
    { title: 'Carga actual', key: 'carga' },
    { title: 'Última temperatura', key: 'temperatura' },
    { title: 'Densidad', key: 'densidad' },
    { title: 'Caudal', key: 'caudal' }
    ]

    //datos de prueba
    const orders = ref([
    {
        numero: 'ORD-001',
        estado: 'En proceso',
        camion: 'Camion 12',
        preset: '5000 L',
        carga: '3200 L',
        temperatura: '18°C',
        densidad: '0.82',
        caudal: '200 L/min'
    },
    {
        numero: 'ORD-002',
        estado: 'Finalizada',
        camion: 'Camion 34',
        preset: '8000 L',
        carga: '8000 L',
        temperatura: '19°C',
        densidad: '0.84',
        caudal: '210 L/min'
    }
    ])
</script>