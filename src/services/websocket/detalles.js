import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
let client = null
let subCabecera = null
let subOrden = null

export function conectarWebSocket (numero, onCabecera, onOrden) {
  const socket = new SockJS('https://gastrack.mooo.com/websocket', null, {
    withCredentials: true,
  })

  client = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    debug: () => {},
  })

  client.onConnect = () => {
    console.log('WebSocket conectado')
    subCabecera = suscribirseCabecera(client, numero, onCabecera)
    subOrden = suscribirseOrden(client, numero, onOrden)
  }

  client.activate()
}

export function suscribirseCabecera (client, numero, onCabecera) {
  return client.subscribe('/topic/cabecera', msg => {
    const data = JSON.parse(msg.body)
    if (data.numeroOrden !== Number(numero)) {
      return
    }
    onCabecera(data)
  })
}

export function suscribirseOrden (client, numero, onOrden) {
  return client.subscribe('/topic/orden', msg => {
    const data = JSON.parse(msg.body)
    if (data.numeroOrden !== Number(numero)) {
      return
    }
    onOrden(data)
  })
}

export function desuscribirCabecera () {
  if (subCabecera) {
    subCabecera.unsubscribe()
    subCabecera = null
  }
}

export function desuscribirOrden () {
  if (subOrden) {
    subOrden.unsubscribe()
    subOrden = null
  }
}
