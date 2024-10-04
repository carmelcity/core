import { logger } from "../utils/index.mts"
import { type EventPayload, EventChannel, EventType } from '../types/index.mts'
import { updatePeer } from "./main.mts"

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
        messageType, 
        timestamp,
        channel,
        type,
        data
    } = payload

    if (!senderId || !senderType || !messageType || !timestamp || !channel || !type) {
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
        messageType, 
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
        const { topic } = detail 
        const dataString = new TextDecoder().decode(detail.data)
        const payloadRaw = JSON.parse(dataString)

        const payload: EventPayload = parsePayload(payloadRaw)
        logger(`✓ received message (type=${payload.type})`)

        switch(payload.type) {
            case EventType.SwarmPresence:
            return onSwarmPresence(payload)
        }
    } catch (e: any) {
        logger(`received an invalid message: ${e.message}`)
    }
}