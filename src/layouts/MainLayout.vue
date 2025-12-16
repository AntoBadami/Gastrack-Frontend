<template>
  <v-app>

    <!-- navbar -->
    <v-app-bar app color="primary" dark>
      <v-toolbar-title class="font-weight-bold">Gastrack</v-toolbar-title>

      <!-- links -->
      <v-btn text to="/home">Inicio</v-btn>
      <v-btn text to="/ordenes">Ordenes</v-btn>
      <v-btn text to="/alarmas">Historial de alarmas</v-btn>

      <v-spacer />

      <!-- cerrar sesion -->
      <v-btn text @click="logout">
        Cerrar sesión
      </v-btn>
    </v-app-bar>

    <v-main class="mt-4">
      <slot />
    </v-main>

  </v-app>
</template>

<script setup>
  import { useRouter } from 'vue-router'
  const router = useRouter()

  function logout () {
    // limpia tokens
    router.push('/')
  }
</script>
