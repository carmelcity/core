import { logger } from "../utils/index.mts"
import { CID } from 'multiformats/cid'
import { dagCbor } from '@helia/dag-cbor'
import dotenv from 'dotenv'
import path from 'path'
import * as core from './core.mts'
import { session } from "../main/index.mts"

let _dag: any = undefined

const CARMEL_HOME = `${process.env.CARMEL_HOME}`

dotenv.config({ path: path.resolve(CARMEL_HOME, '.env') })

/**
 * 
 */
export const initialize = async () => {
    _dag = dagCbor(session.instance())

    await core.initialize()

    logger(`initialized data ✓`)
}

export const put = async (data: any) => {
    const res = await _dag.add(data)
    const cid = res.toString()

    logger(`→ added data (cid=${cid}) ✓`)
    
    return cid
}

export const get = async (cid: any) => {
    const obj = await _dag.get(CID.parse(cid));

    logger(`← got data (cid=${cid}) ✓`)
}