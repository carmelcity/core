import { type NodeType } from "./main.mjs"

/**
 * 
 */
export const EVENTS_PREFIX = 'carmel'

/**
 * 
 */
export enum EventChannel {
    Swarm = "swarm"
}

/**
 * 
 */
export enum EventType {
    SwarmPresence = "swarm/presence"
}

/**
 * 
 */
export interface EventPayload {
    senderId: string
    senderType: NodeType
    timestamp: string
    channel: EventChannel
    type: EventType
    data?: any
}
