import { session } from "../main"
import { type EventPayload, EventChannel, EventType } from '../types'
import { updatePeer } from "./main"

/**
 * 
 */
export const SUPPORTED_CHANNELS = [
    EventChannel.Swarm
]

/**
 * 
 */
export const SUPPORTED_EVENTS = [
    EventType.SwarmPresence
]

/**
 * 
 * @param payload 
 */
const onSwarmPresence = async (payload: EventPayload) => {
    const { senderId, senderType } = payload

    await updatePeer(senderId, {
        peerId: senderId,
        nodeType: senderType,
        status: "new"
    })
}

/**
 * 
 * @param payload 
 * @returns 
 */
const parsePayload = (payload: any): EventPayload => {
    const { 
        senderId, 
        senderType, 
        timestamp,
        channel,
        type,
        data
    } = payload

    if (!senderId || !senderType || !timestamp || !channel || !type) {
        throw new Error('Invalid payload')
    }

    if (!SUPPORTED_CHANNELS.includes(channel)) {
        throw new Error('Unsupported channel')
    }

    if (!SUPPORTED_EVENTS.includes(type)) {
        throw new Error('Unsupported event')
    }

    return {
        senderId,  
        senderType, 
        timestamp,
        channel,
        type,
        data
    } as EventPayload
}

/**
 * 
 * @param message 
 * @returns 
 */
export const onMessage = (message: any) => {
    try {
        const { detail } = message
        const dataString = new TextDecoder().decode(detail.data)
        const payloadRaw = JSON.parse(dataString)

        const payload: EventPayload = parsePayload(payloadRaw)
        session.logger(`✓ received message (type=${payload.type})`)

        switch(payload.type) {
            case EventType.SwarmPresence:
            return onSwarmPresence(payload)
        }
    } catch (e: any) {
        console.log(e)
        session.logger(`received an invalid message: ${e.message}`)
    }
}