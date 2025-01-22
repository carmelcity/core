import { multiaddr } from "@multiformats/multiaddr"
import { events } from '../swarm'
import { getRelays } from '../system'
import { broadcast, swarm } from '../swarm'
import { EventChannel, EVENTS_PREFIX } from '../types'
import * as data from '../data'

const TICK_TIME_SEC = 3

let tick: number = 0
let relay: any = undefined
let _instance: any = undefined
let needsRelays: boolean = false 
let peerId: string = ''

/**
 * 
 */
export let logger: any = undefined

/**
 * 
 */
export let nodeType = 'sentinel'

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
    tick++

    if (!swarmers || swarmers.length <= 0) {
        logger(`[${tick}] no connection yet`)
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
export const start = async (instance: any, type: string, log: any) => {
    if (_instance) return 

    _instance = instance
    peerId = _instance.libp2p.peerId
    nodeType = type
    logger = log

    // listen for events
    startListening()

    logger(`Node started (peerId=${peerId}`)
    
    // initialize the data layer
    await data.initialize()

    return doNextTick()
}