export function formatearTiempo (ms) {
  const totalSeg = Math.floor(ms / 1000)
  const h = String(Math.floor(totalSeg / 3600)).padStart(2, '0')
  const m = String(Math.floor((totalSeg % 3600) / 60)).padStart(2, '0')
  const s = String(totalSeg % 60).padStart(2, '0')
  return `${h}:${m}:${s}`
}
export function calcularETA (orden, masa, caudal) {
  if (!masa || !caudal || caudal <= 0) {
    return 'Sin datos'
  }

  const restantes = orden.value.preset + orden.value.pesoInicial - masa
  if (restantes <= 0) {
    return '00:00:00'
  }

  const segundos = restantes / caudal
  return formatearTiempo(segundos * 1000)
}
