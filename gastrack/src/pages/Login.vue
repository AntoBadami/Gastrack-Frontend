<template>
  <v-container class="fill-height d-flex justify-center align-center">
    <v-card width="400" class="pa-6 rounded-lg elevation-4">
      <v-card-title class="text-h5 text-center">Iniciar Sesión</v-card-title>

      <v-card-text>
        <v-form @submit.prevent="login">
          <v-text-field
            v-model="email"
            label="Correo electrónico"
            type="email"
            prepend-inner-icon="mdi-email"
            required
          />

          <v-text-field
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            label="Contraseña"
            prepend-inner-icon="mdi-lock"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showPassword = !showPassword"
            required
          />

          <v-btn
            type="submit"
            block
            class="mt-4"
            color="primary"
          >
            Ingresar
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const showPassword = ref(false)

const login = () => {
  console.log('Email:', email.value)
  console.log('Password:', password.value)
  // Acá haces la llamada a tu backend
}
</script>

<style scoped>
.fill-height {
  height: 100vh;
}
</style>
