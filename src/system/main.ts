export const getRelays = async () => {
    const relays = [{
        domain: `r0.carmel.network`,
        port: 9009,
        peerId: `16Uiu2HAkzoD7NHWgVP8zJkSTubA4wrHSUphY7CMy736mamBDcemZ`
    }]

    const parsed = relays.map((relay: any) => `/dns4/${relay.domain}/tcp/${relay.port}/wss/p2p/${relay.peerId}`)

    return [
        ...parsed,

    ]
}