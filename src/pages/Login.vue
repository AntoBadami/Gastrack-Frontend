<template>
  <v-container class="fill-height d-flex justify-center align-center">
    <v-card class="pa-6 elevation-4 rounded-lg" width="400">

      <v-card-title class="text-h5 text-center">Iniciar Sesión</v-card-title>

      <v-card-text>

        <v-alert
          v-if="error"
          class="mb-3"
          closable
          type="error"
          @click:close="error = ''"
        >
          {{ error }}
        </v-alert>

        <v-form @submit.prevent="handleLogin">
          <v-text-field v-model="email" label="Usuario" prepend-inner-icon="mdi-email" />

          <v-text-field
            v-model="password"
            :append-inner-icon="showPass ? 'mdi-eye-off' : 'mdi-eye'"
            label="Contraseña"
            prepend-inner-icon="mdi-lock"
            :type="showPass ? 'text' : 'password'"
            @click:append-inner="showPass = !showPass"
          />

          <v-btn block class="mt-4" color="primary" type="submit">
            Ingresar
          </v-btn>
        </v-form>

      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import api from '@/services/api'
  import { useAuthStore } from '@/stores/auth'

  const email = ref('')
  const password = ref('')
  const showPass = ref(false)
  const error = ref('')

  const router = useRouter()
  const authStore = useAuthStore()

  async function handleLogin () {
    if (!email.value || !password.value) {
      error.value = 'Completá todos los campos.'
      return
    }

    try {
      const params = new URLSearchParams()
      params.append('username', email.value)
      params.append('password', password.value)

      const res = await api.post('/login', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })

      const token = res.data

      // 👇 ACÁ está la diferencia importante
      authStore.setToken(token)

      router.push('/home')
    } catch (error_) {
      console.error(error_)
      error.value = 'Usuario o contraseña incorrectos.'
    }
  }

</script>

<style scoped>
.fill-height {
    height: 100vh;
}
</style>
