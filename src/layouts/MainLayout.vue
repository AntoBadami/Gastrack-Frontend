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

      <v-btn icon @click="drawer = !drawer" class="mr-2">
        <v-badge :content="alarmas.length" :model-value="alarmas.length > 0" color="red">
          <v-icon :color="alarmas.length > 0 ? 'red' : 'white'" :class="{ 'blink-icon': hayAlarmaNueva }">
            mdi-alert-octagon
          </v-icon>
        </v-badge>
      </v-btn>

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


    <v-snackbar v-model="snackbar" color="red-darken-2" timeout="5000" location="bottom right">
      🚨 Nueva alarma en orden #{{ ultimaAlarma?.numeroOrden }}

      <template #actions>
        <v-btn variant="text" @click="drawer = true">
          Ver
        </v-btn>
      </template>
    </v-snackbar>

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
  const hayAlarmaNueva = ref(false)


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
            hayAlarmaNueva.value = true
          }
        },
      })
    },
    { immediate: true },
  )

  watch(drawer, (abierto) => {
  if (abierto) {
    hayAlarmaNueva.value = false
  }
  })

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

<style scoped>
.blink-icon {
  animation: blink 1s infinite;
}

@keyframes blink {
  0% { opacity: 1; }
  50% { opacity: 0.3; }
  100% { opacity: 1; }
}

</style>
