import { logger } from '../utils/index.mjs';
import { multiaddr } from "@multiformats/multiaddr";
import { events } from '../swarm/index.mjs';
import { createLibp2p } from 'libp2p';
import { getRelays } from '../system/index.mjs';
import { createHelia } from 'helia';
import { broadcast, swarm } from '../swarm/index.mjs';
import { EventChannel, EVENTS_PREFIX, NodeType } from '../types/index.mjs';
import * as data from '../data/index.mjs';
const TICK_TIME_SEC = 3;
let counter = 0;
let relay = undefined;
let _instance = undefined;
let needsRelays = false;
let peerId = '';
/**
 *
 */
export let nodeType = NodeType.Browser;
/**
 *
 * @returns
 */
export const instance = () => _instance;
/**
 *
 */
const doNextTick = async () => {
    setTimeout(async () => {
        await nextTick();
    }, TICK_TIME_SEC * 1000);
};
/**
 *
 * @param addr
 * @returns
 */
const tryNextRelay = async (addr) => {
    if (!needsRelays) {
        return;
    }
    try {
        const res = await _instance.libp2p.dial(multiaddr(addr));
        return addr;
    }
    catch (e) {
    }
};
/**
 *
 * @returns
 */
const dialRelaysIfNeeded = async () => {
    if (!needsRelays) {
        return;
    }
    const addresses = await getRelays();
    let r = '';
    let i = 0;
    let total = addresses.length;
    logger('Dialing relays ...');
    while (!r && i < total) {
        r = await tryNextRelay(addresses[i]);
        i++;
    }
    if (!r) {
        logger("Could not connect to any relay");
        return;
    }
    logger(`Connected to relay: ${r}`);
    relay = r;
    return r;
};
/**
 *
 * @returns
 */
const nextTick = async () => {
    const swarmers = _instance.libp2p.services.pubsub.getSubscribers(`${EVENTS_PREFIX}:${EventChannel.Swarm}`);
    counter++;
    if (!swarmers || swarmers.length <= 0) {
        logger('No connection yet');
        await dialRelaysIfNeeded();
        return doNextTick();
    }
    // assure everyone we're still here
    await broadcast.presence();
    // keep the swarm healthy
    await swarm.prune();
    // let's keep going
    return doNextTick();
};
/**
 *
 */
const startListening = () => {
    _instance.libp2p.services.pubsub.subscribe(`${EVENTS_PREFIX}:${EventChannel.Swarm}`);
    _instance.libp2p.services.pubsub.addEventListener('message', events.onMessage);
};
/**
 *
 * @returns
 */
export const start = async (config) => {
    const nodeConfig = await config.makeConfig();
    if (!nodeConfig) {
        logger('Error: could not make the config');
        return;
    }
    needsRelays = nodeConfig.type != NodeType.Relay;
    const { blockstore, datastore } = nodeConfig;
    nodeType = nodeConfig.type;
    // start a libp2p node instance
    const libp2p = await createLibp2p(nodeConfig.p2p);
    peerId = `${libp2p.peerId.toString()}`;
    // start the helia instance
    _instance = await createHelia({
        libp2p,
        blockstore,
        datastore
    });
    // listen for events
    startListening();
    logger(`Node started (peerId=${peerId} type=${nodeConfig.type})`);
    // initialize the data layer
    await data.initialize();
    return doNextTick();
};
