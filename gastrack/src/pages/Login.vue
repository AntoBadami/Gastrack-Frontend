<template>
    <v-container class="fill-height d-flex justify-center align-center">
        <v-card width="400" class="pa-6 elevation-4 rounded-lg">

        <v-card-title class="text-h5 text-center">Iniciar Sesión</v-card-title>

        <v-card-text>

            <v-alert
            v-if="error"
            type="error"
            class="mb-3"
            closable
            @click:close="error = ''"
            >
            {{ error }}
            </v-alert>

            <v-form @submit.prevent="handleLogin">
            <v-text-field
                v-model="email"
                label="Correo electrónico"
                prepend-inner-icon="mdi-email"
            />

            <v-text-field
                v-model="password"
                :type="showPass ? 'text' : 'password'"
                label="Contraseña"
                prepend-inner-icon="mdi-lock"
                :append-inner-icon="showPass ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showPass = !showPass"
            />

            <v-btn type="submit" block color="primary" class="mt-4">
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

const email = ref('')
const password = ref('')
const showPass = ref(false)
const error = ref('')

const router = useRouter()

const handleLogin = () => {
    // Validaciones basicas
    if (!email.value || !password.value) {
        error.value = 'Completá todos los campos.'
        return
    }

    if (!email.value.includes('@') || !email.value.includes('.')) {
        error.value = 'Ingresá un correo válido.'
        return
    }

    if (password.value.length < 8) {
        error.value = 'La contraseña debe tener al menos 8 caracteres.'
        return
    }

    // todo ok
    error.value = ''
    console.log('Login:', email.value, password.value)
    router.push('/home')
}
</script>

<style scoped>
    .fill-height { height: 100vh; }
</style>
