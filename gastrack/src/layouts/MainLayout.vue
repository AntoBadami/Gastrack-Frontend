<template>
    <v-app>

        <!-- navbar -->
        <v-app-bar color="primary" dark app>
            <v-toolbar-title class="font-weight-bold">Gastrack</v-toolbar-title>

            <!-- links -->
            <v-btn text to="/home">Inicio</v-btn>
            <v-btn text to="/ordenes">Ordenes</v-btn>

            <v-spacer></v-spacer>

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

    const logout = () => {
        // limpia tokens
        router.push('/')
    }
</script>
