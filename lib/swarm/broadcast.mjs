import { logger } from "../utils/index.mjs";
import * as session from '../main/session.mjs';
import { EVENTS_PREFIX, EventType } from "../types/index.mjs";
/**
 *
 */
const makePayload = (type, data) => {
    const [channel] = type.split('/');
    return Object.assign({
        senderId: `${session.instance().libp2p.peerId}`,
        senderType: session.nodeType,
        timestamp: `${Date.now()}`,
        channel,
        type
    }, data && { ...data });
};
/**
 *
 * @param channel
 * @param type
 * @param data
 */
export const message = async (type, data = undefined) => {
    const payload = makePayload(type, data);
    await session.instance().libp2p.services.pubsub.publish(`${EVENTS_PREFIX}:${payload.channel}`, new TextEncoder().encode(JSON.stringify(payload)));
    logger(`✓ broadcasted message (type=${payload.type})`);
};
/**
 *
 * @returns
 */
export const presence = async () => {
    return message(EventType.SwarmPresence);
};
