import api from '@/services/api'

export async function descargarPdf (numeroOrden) {
  try {
    const response = await api.get(
      `/orden/conciliacion/${numeroOrden}`,
      {
        responseType: 'blob',
        headers: {
          Accept: 'application/pdf',
        },
      },
    )

    const blob = new Blob([response.data], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = `conciliacion_${numeroOrden}.pdf`
    link.click()

    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error descargando PDF:', error)
    alert('No se pudo descargar el PDF')
  }
}
