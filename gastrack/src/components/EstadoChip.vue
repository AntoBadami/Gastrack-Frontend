<template>
    <v-chip :color="color" dark>
        {{ estado }}
    </v-chip>
</template>

<script setup>
    const props = defineProps({
    estado: String
    })

    const color = computed(() => {
    switch (props.estado) {
        case 'Finalizada': return 'green'
        case 'En proceso': return 'blue'
        case 'Pendiente':  return 'grey'
        default: return 'primary'
    }
    })
</script>
