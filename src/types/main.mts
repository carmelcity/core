import type { Libp2pOptions } from "libp2p"
import { type Blockstore } from 'interface-blockstore'
import { type Datastore } from 'interface-datastore'

/**
 * 
 */
export enum NodeType {
    Relay = 1,
    Sentinel = 2,
    Browser = 3
}

/**
 * 
 */
export interface NodeConfig {
    peerId?: string
    type: NodeType
    blockstore: Blockstore
    datastore?: Datastore
    p2p: Libp2pOptions
}