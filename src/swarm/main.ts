import { session } from '../main'

/**
 * 
 */
export let swarm: any = {}

/**
 * 
 */
export const prune = async () => {
    const peerIds = Object.keys(swarm)

    session.logger(`✓ pruned swarm (new size ${peerIds.length})`, 'swarm')

    peerIds.map((peerId: any) => {
       session.logger(`  → peer ${peerId}`, 'swarm')
    })
}

/**
 * 
 * @param peerId 
 * @returns 
 */
export const getPeer = (peerId: string) => {
    return swarm[peerId]
}

/**
 * 
 * @param peerId 
 * @param data 
 * @returns 
 */
export const addPeer = (peerId: string, data: any = {}) => {
    if (getPeer(peerId)) {
        session.logger(`${peerId} is already part of the swarm`, 'swarm')
        return 
    }

    const since = `${Date.now()}`
    swarm[peerId] = ({ peerId, since, ...data })
}

/**
 * 
 * @param peerId 
 * @param data 
 * @returns 
 */
export const updatePeer = async (peerId: string, data: any = { }) => {
    let peer = getPeer(peerId)

    if (!peer) {
        return addPeer(peerId, data)
    }

    const lastUpdate = `${Date.now()}`
    swarm[peerId] = { ...peer, ...data, lastUpdate }

    session.logger(`✓ updated swarm peer ${peerId} (new swarm size: ${Object.keys(swarm).length})`, 'swarm')
}

/**
 * 
 * @param peerId 
 * @returns 
 */
export const removePeer = (peerId: string) => {
    if (!getPeer(peerId)) {
        session.logger(`${peerId} is not part of the swarm`, 'swarm')
        return 
    }

    delete swarm[peerId]

    session.logger(`✓ removed ${peerId} from the swarm`, 'swarm')
}