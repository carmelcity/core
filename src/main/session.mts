import { logger } from '../utils/index.mts'
import { multiaddr } from "@multiformats/multiaddr"
import { events } from '../swarm/index.mts'
import { createLibp2p } from 'libp2p'
import { getRelays } from '../system/index.mts'
import { makeConfig } from './config.mts'
import { createHelia } from 'helia'
import { broadcast, swarm } from '../swarm/index.mts'
import { EventChannel, EVENTS_PREFIX, NodeType, type NodeConfig } from '../types/index.mts'
import * as data from '../data/index.mts'

const TICK_TIME_SEC = 3

let counter: number = 0
let relay: any = undefined
let _instance: any = undefined
let needsRelays: boolean = false 
let peerId: string = ''

/**
 * 
 */
export let nodeType: NodeType = NodeType.Browser

/**
 * 
 * @returns 
 */
export const instance = () => _instance

/**
 * 
 */
const doNextTick =  async () => {    
    setTimeout(async () => {
        await nextTick()
    }, TICK_TIME_SEC * 1000)    
}

/**
 * 
 * @param addr 
 * @returns 
 */
const tryNextRelay = async (addr: string) => {
    if (!needsRelays) {
        return 
    }

    try {
      const res = await _instance.libp2p.dial(multiaddr(addr))
      return addr
    } catch (e) {
    }
}

/**
 * 
 * @returns 
 */
const dialRelaysIfNeeded = async () => {
    if (!needsRelays) {
        return 
    }

    const addresses = await getRelays()
    let r: any = ''
    let i = 0
    let total = addresses.length

    logger('Dialing relays ...')

    while (!r && i < total) {
      r = await tryNextRelay(addresses[i])
      i++
    }
    
    if (!r) {
      logger("Could not connect to any relay")
      return 
    }

    logger(`Connected to relay: ${r}`)
    relay = r
    return r
}

/**
 * 
 * @returns 
 */
const nextTick = async () => {    
    const swarmers = _instance.libp2p.services.pubsub.getSubscribers(`${EVENTS_PREFIX}:${EventChannel.Swarm}`)
    counter++

    if (!swarmers || swarmers.length <= 0) {
        logger('No connection yet')
        await dialRelaysIfNeeded()
        return doNextTick()
    }

    // assure everyone we're still here
    await broadcast.presence()

    // keep the swarm healthy
    await swarm.prune()

    // let's keep going
    return doNextTick()
}

/**
 * 
 */
const startListening = () => {
    _instance.libp2p.services.pubsub.subscribe(`${EVENTS_PREFIX}:${EventChannel.Swarm}`)
    _instance.libp2p.services.pubsub.addEventListener('message', events.onMessage)
}

/**
 * 
 * @returns 
 */
export const start = async () => {
    const nodeConfig: NodeConfig | undefined = await makeConfig()
    
    if (!nodeConfig) {
        logger('error: could not make the config')
        return 
    }

    const { blockstore, datastore } = nodeConfig
    nodeType = nodeConfig.type

    // start a libp2p node instance
    const libp2p: any = await createLibp2p(nodeConfig.p2p)
    peerId = `${libp2p.peerId.toString()}`

    const listenAddrs = libp2p.getMultiaddrs()
    
    if (!listenAddrs || listenAddrs.length == 0) {
        await libp2p.stop()
        logger(`error: could not start the node`)
        return 
    }

    // start the helia instance
    _instance = await createHelia({
        libp2p,
        blockstore, 
        datastore
    })

    // listen for events
    startListening()

    logger(`node started (peerId=${peerId} type=${nodeConfig.type})`)

    listenAddrs.map((addr: any) => {
        logger(`node listening on ${addr}`)
    })

    // initialize the data layer
    await data.initialize()

    return doNextTick()
}