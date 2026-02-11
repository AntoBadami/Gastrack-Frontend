<template>
  <v-container fluid class="login-container d-flex justify-center align-center">
    <div class="login-wrapper">

      <!-- 🔹 Branding del sistema -->
      <div class="brand text-center mb-8">
        <h1 class="brand-title">GASTRACK</h1>
        <p class="brand-subtitle">CARGA DE CAMIONES DE GAS</p>
      </div>

      <!-- 🔹 Card de Login -->
      <v-card class="pa-6 elevation-6 rounded-xl login-card">
        <v-card-title class="text-h5 text-center">
          Iniciar Sesión
        </v-card-title>

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
            <v-text-field
              v-model="email"
              label="Usuario"
              prepend-inner-icon="mdi-email"
            />

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

    </div>
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

      authStore.setToken(token)

      router.push('/home')
    } catch (error_) {
      console.error(error_)
      error.value = 'Usuario o contraseña incorrectos.'
    }
  }

</script>

<style scoped>
.login-container {
  height: 100vh;
  background: radial-gradient(
    circle at center,
    #2c2f3a 0%,
    #1e1f26 60%,
    #15161c 100%
  );
}

.login-wrapper {
  width: 100%;
  max-width: 420px;            /* limita ancho del conjunto */
}

.brand-title {
  font-size: 48px;
  font-weight: 800;
  letter-spacing: 4px;         /* separación tipo logo */
  color: #ffffff;
}

.brand-subtitle {
  font-size: 14px;
  letter-spacing: 3px;
  color: #cccccc;
}

.login-card {
  backdrop-filter: blur(6px);  /* efecto moderno opcional */
}

</style>

