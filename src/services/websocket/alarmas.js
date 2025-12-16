import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

let client = null
let subs = []

export function conectarAlarmasWS ({
  onNuevaAlarma,
}) {
  const socket = new SockJS('https://lbiondi.mooo.com/websocket')

  client = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
  })

  client.onConnect = () => {
    subs.push(
      client.subscribe('/topic/alarma/alarmaNueva', msg =>
        onNuevaAlarma(JSON.parse(msg.body)),
      ),
    )
  }

  client.activate()
}

export function desconectarAlarmasWS () {
  for (const s of subs) {
    s.unsubscribe()
  }
  subs = []

  if (client) {
    client.deactivate()
    client = null
  }
}
