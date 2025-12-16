<template>
  <v-navigation-drawer
    location="left"
    :model-value="modelValue"
    temporary
    width="400"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-toolbar flat>
      <v-toolbar-title>Alarmas activas</v-toolbar-title>
    </v-toolbar>

    <v-divider />

    <v-list v-if="alarmas.length > 0" class="pa-2">
      <v-list-item
        v-for="alarma in alarmas"
        :key="`${alarma.numeroOrden}-${alarma.tipoAlarma}`"
        class="mb-3"
      >
        <v-card
          class="w-100"
          rounded="lg"
          variant="outlined"
        >
          <v-card-title class="text-subtitle-1 font-weight-bold">
            Orden #{{ alarma.numeroOrden }}
          </v-card-title>

          <v-card-subtitle class="text-body-2">
            {{ tipoAlarmaLabel(alarma.tipoAlarma) }}
          </v-card-subtitle>

          <v-card-text class="text-caption">
            {{ new Date(alarma.fecha).toLocaleString() }}
          </v-card-text>

          <v-divider />

          <v-card-actions class="justify-end">
            <v-btn
              size="small"
              variant="text"
              @click="irADetalle(alarma.numeroOrden)"
            >
              Detalle
            </v-btn>

            <v-dialog max-width="500">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  color="primary"
                  size="small"
                  variant="flat"
                >
                  Aceptar
                </v-btn>
              </template>

              <template #default="{ isActive }">
                <v-card title="Aceptar alarma">
                  <v-card-text>
                    Observación sobre la alarma de la orden #{{ alarma.numeroOrden }}

                    <v-textarea
                      v-model="observaciones[alarma.numeroOrden]"
                      label="Observación"
                      rows="3"
                    />
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer />
                    <v-btn
                      color="green"
                      @click="aceptarAlarma(alarma, isActive)"
                    >
                      Aceptar
                    </v-btn>
                    <v-btn
                      color="red"
                      variant="text"
                      @click="isActive.value = false"
                    >
                      Cancelar
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </template>
            </v-dialog>
          </v-card-actions>
        </v-card>
      </v-list-item>
    </v-list>

    <v-card-text v-else class="text-center">
      No hay alarmas pendientes
    </v-card-text>
  </v-navigation-drawer>
</template>

<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import api from '@/services/api'
  import { useAuthStore } from '@/stores/auth'

  const router = useRouter()
  const auth = useAuthStore()

  const observaciones = ref({})

  defineProps({
    modelValue: Boolean,
    alarmas: Array,
  })

  const emit = defineEmits(['update:modelValue', 'alarma-aceptada'])

  function tipoAlarmaLabel (tipo) {
    if (tipo === 'ALTA_TEMPERATURA') return 'Exceso de temperatura'
    return tipo
  }

  function irADetalle (numeroOrden) {
    router.push(`/orden/${numeroOrden}`)
  }

  async function aceptarAlarma (alarma, dialog) {
    try {
      const payload = {
        numeroOrden: alarma.numeroOrden,
        tipoAlarma: 'ALTA_TEMPERATURA',
        observacion: observaciones.value[alarma.numeroOrden] || '',
        usermail: auth.email,
      }
      await api.put('/alarma/aceptar', payload, { withCredentials: true })
      emit('alarma-aceptada', alarma)
      dialog.value = false
    } catch (error) {
      console.error('Error aceptando alarma', error)
    }
  }

</script>
