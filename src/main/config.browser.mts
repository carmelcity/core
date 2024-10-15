import { identify } from '@libp2p/identify'
import { noise } from '@chainsafe/libp2p-noise'
import { webSockets } from '@libp2p/websockets'
import { yamux } from '@chainsafe/libp2p-yamux'
import * as filters from '@libp2p/websockets/filters'
import { circuitRelayTransport } from '@libp2p/circuit-relay-v2'
import { webRTC } from '@libp2p/webrtc'
import { gossipsub } from '@chainsafe/libp2p-gossipsub'
import { ping } from '@libp2p/ping'
import { dcutr } from '@libp2p/dcutr'
import { NodeType, type NodeConfig } from '../types/index.mjs'
import type { Libp2pOptions } from 'libp2p'
import { IDBBlockstore } from 'blockstore-idb'

/**
 * 
 * @returns 
 */
export const makeConfig = async (): Promise<NodeConfig|undefined> => {  
  // const blockstore = new IDBBlockstore()
  return {
    type: NodeType.Browser,
    // blockstore,
    p2p: {
      start: true,
      addresses: {
          listen: [
            '/webrtc',
          ]
      },
      transports: [
          webSockets({
            filter: filters.all
          }),
          webRTC(),
          circuitRelayTransport({
            discoverRelays: 1
          })
      ],
      connectionEncrypters: [noise()],
      streamMuxers: [yamux()],
      connectionManager: {
        maxConnections: 10,
        inboundUpgradeTimeout: 10000
      },
        services: {
          ping: ping(),
          identify: identify(),
          pubsub: gossipsub(),
          dcutr: dcutr()
      }
    } as Libp2pOptions
  } as NodeConfig
}