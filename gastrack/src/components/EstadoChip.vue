<template>
  <v-chip :color="color" dark>
    {{ estado }}
  </v-chip>
</template>

<script setup>
  const props = defineProps({
    estado: String,
  })

  const color = computed(() => {
    switch (props.estado) {
      case 'PENDIENTE PESAJE INICIAL': { return 'grey'
      }
      case 'PESAJE INICIAL REGISTRADO': { return 'blue'
      }
      case 'ORDEN CERRADA PARA CARGA': { return 'orange'
      }
      case 'FINALIZADO': { return 'green'
      }
      case 'ORDEN CANCELADA': { return 'red'
      }
      default: { return 'primary'
      }
    }
  })
</script>
