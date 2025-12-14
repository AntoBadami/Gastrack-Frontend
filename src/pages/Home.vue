<template>
  <MainLayout>
    <v-container fluid class="pa-4">
      <v-row>

        <!-- Columna izquierda -->
        <v-col cols="12" md="8">
          <h1 class="mb-4">Estadisticas Generales</h1>
          <EstadisticasOrdenes />
        </v-col>

        <!-- panel de alarmas -->
        <v-col cols="12" md="4">
          <v-card class="pa-4" elevation="2" style="max-height: 80vh; overflow-y: auto;">
            <h2 class="text-h6 mb-3">Alarmas</h2>

            <!-- Placeholder visual -->
            <div class="text-grey text-center py-6">
              Alarmas activas
            </div>

            <!-- Ejemplos de alarmas -->
            <v-list>
              <v-list-item rounded class="mb-2 bg-red-lighten-4">
                <v-list-item-title class="font-weight-bold">
                  Alarma 
                </v-list-item-title>
                <v-list-item-subtitle>
                  Ejemplo de descripción de alarma 
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item rounded class="mb-2 bg-red-lighten-4">
                <v-list-item-title class="font-weight-bold">
                  Alarma 
                </v-list-item-title>
                <v-list-item-subtitle>
                  Ejemplo de descripción de alarma 
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item rounded class="mb-2 bg-red-lighten-4">
                <v-list-item-title class="font-weight-bold">
                  Alarma 
                </v-list-item-title>
                <v-list-item-subtitle>
                  Ejemplo de descripción de alarma 
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>

          </v-card>
        </v-col>

      </v-row>
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
