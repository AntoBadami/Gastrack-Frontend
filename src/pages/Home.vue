<template>
  <MainLayout>
    <v-container class="pa-0" fluid>

      <!-- Banner -->
      <v-row no-gutters>
        <v-col cols="12">
          <v-img
            class="banner-img"
            cover
            src="@/assets/banner.png"
          >
            <!-- Overlay opcional (por ahora vacío) -->
          </v-img>
        </v-col>
      </v-row>

      <v-container class="pa-6" fluid>
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
  import EstadisticasOrdenes from '@/components/EstadisticasOrdenes.vue'
  import MainLayout from '@/layouts/MainLayout.vue'

</script>

<style>
  .v-list-item {
    border-radius: 12px;
  }
</style>
