<template>
  <MainLayout>
    <v-container fluid class="pa-0">

      <!-- Banner -->
      <v-row no-gutters>
        <v-col cols="12">
          <v-img
            src="@/assets/banner.png"
            class="banner-img"
            cover
          >
            <!-- Overlay opcional (por ahora vacío) -->
          </v-img>
        </v-col>
      </v-row>

      <v-container fluid class="pa-6">
        <v-row>
          <v-col cols="12">
            <h1 class="mb-4">Estadísticas Generales</h1>
            <EstadisticasOrdenes />
          </v-col>
        </v-row>
      </v-container>

    </v-container>
  </MainLayout>
</template>

<script setup>
  import MainLayout from '@/layouts/MainLayout.vue'
  import EstadisticasOrdenes from '@/components/EstadisticasOrdenes.vue'

</script>

<style>
  .v-list-item {
    border-radius: 12px;
  }
</style>
