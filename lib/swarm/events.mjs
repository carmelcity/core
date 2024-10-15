import { logger } from "../utils/index.mjs";
import { EventChannel, EventType } from '../types/index.mjs';
import { updatePeer } from "./main.mjs";
/**
 *
 */
export const SUPPORTED_CHANNELS = [
    EventChannel.Swarm
];
/**
 *
 */
export const SUPPORTED_EVENTS = [
    EventType.SwarmPresence
];
/**
 *
 * @param payload
 */
const onSwarmPresence = async (payload) => {
    const { senderId, senderType } = payload;
    await updatePeer(senderId, {
        peerId: senderId,
        nodeType: senderType,
        status: "new"
    });
};
/**
 *
 * @param payload
 * @returns
 */
const parsePayload = (payload) => {
    const { senderId, senderType, timestamp, channel, type, data } = payload;
    if (!senderId || !senderType || !timestamp || !channel || !type) {
        throw new Error('Invalid payload');
    }
    if (!SUPPORTED_CHANNELS.includes(channel)) {
        throw new Error('Unsupported channel');
    }
    if (!SUPPORTED_EVENTS.includes(type)) {
        throw new Error('Unsupported event');
    }
    return {
        senderId,
        senderType,
        timestamp,
        channel,
        type,
        data
    };
};
/**
 *
 * @param message
 * @returns
 */
export const onMessage = (message) => {
    try {
        const { detail } = message;
        const dataString = new TextDecoder().decode(detail.data);
        const payloadRaw = JSON.parse(dataString);
        const payload = parsePayload(payloadRaw);
        logger(`✓ received message (type=${payload.type})`);
        switch (payload.type) {
            case EventType.SwarmPresence:
                return onSwarmPresence(payload);
        }
    }
    catch (e) {
        console.log(e);
        logger(`received an invalid message: ${e.message}`);
    }
};
