<template>
  <v-app>

    <!-- navbar -->
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer" />
      <v-toolbar-title class="font-weight-bold">Gastrack</v-toolbar-title>

      <!-- links -->
      <v-btn text to="/home">Inicio</v-btn>
      <v-btn text to="/ordenes">Ordenes</v-btn>

      <v-spacer />

      <!-- cerrar sesion -->
      <v-btn text @click="logout">
        Cerrar sesión
      </v-btn>
    </v-app-bar>
    <DrawerAlarmas
      v-model="drawer"
      :alarmas="alarmas"
      @alarma-aceptada="eliminarAlarma"
    />

    <v-main class="mt-4">
      <slot />
    </v-main>

  </v-app>
</template>

<script setup>
  import { onUnmounted, ref, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import api from '@/services/api'
  import { conectarAlarmasWS, desconectarAlarmasWS } from '@/services/websocket/alarmas'
  import { useAuthStore } from '@/stores/auth'

  const auth = useAuthStore()
  const router = useRouter()

  const drawer = ref(false)
  const alarmas = ref([])

  function existe (alarma) {
    return alarmas.value.some(
      a =>
        a.numeroOrden === alarma.numeroOrden
        && a.tipoAlarma === alarma.tipoAlarma,
    )
  }

  watch(
    () => auth.isAuthenticated,
    async isAuth => {
      if (!isAuth) {
        alarmas.value = []
        desconectarAlarmasWS()
        return
      }
      try {
        const resAlarmas = await api.get(`/alarma/noAceptadas`)
        alarmas.value = resAlarmas.data
      } catch (error) {
        console.error('Error de al pedir alarmas', error)
      }
      conectarAlarmasWS({

        onNuevaAlarma (alarma) {
          if (!existe(alarma)) {
            alarmas.value.push(alarma)
          }
        },
      })
    },
    { immediate: true },
  )

  onUnmounted(() => {
    desconectarAlarmasWS()
  })
  function eliminarAlarma (alarma) {
    alarmas.value = alarmas.value.filter(
      a =>
        !(
          a.numeroOrden === alarma.numeroOrden
          && a.tipoAlarma === alarma.tipoAlarma
        ),
    )
  }

  function logout () {
    auth.logout()
    router.push('/')
  }
</script>
