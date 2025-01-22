import { session } from '../main'
import { EVENTS_PREFIX, EventType } from "../types"

/**
 *  
 */
const makePayload = (type: EventType, data: any) => {
    const [channel] = type.split('/')

    return Object.assign({
            senderId: `${session.instance().libp2p.peerId}`,
            senderType: session.nodeType,
            timestamp: `${Date.now()}`,
            channel,
            type
    }, data && { ...data })
}

/**
 * 
 * @param channel
 * @param type 
 * @param data
 */
export const message = async (type: EventType, data: any = undefined) => {
    const payload = makePayload(type, data)
    await session.instance().libp2p.services.pubsub.publish(`${EVENTS_PREFIX}:${payload.channel}`, new TextEncoder().encode(JSON.stringify(payload)))
    session.logger(`✓ broadcasted message (type=${payload.type})`)
}

/**
 * 
 * @returns 
 */
export const presence = async () => {
    return message(EventType.SwarmPresence)
}