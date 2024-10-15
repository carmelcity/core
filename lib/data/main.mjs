import { logger } from "../utils/index.mjs";
import { CID } from 'multiformats/cid';
import { dagCbor } from '@helia/dag-cbor';
import * as core from './core.mjs';
// import { session } from "../main/index.mjs"
// export let _dag: any = undefined
/**
 *
 */
export const initialize = async () => {
    // _dag = dagCbor(session.instance())
    await core.initialize();
    logger(`Initialized data ✓`);
};
// export const put = async (data: any) => {
//     // const res = await _dag.add(data)
//     // const cid = res.toString()
//     // logger(`→ Added data (cid=${cid}) ✓`)
//     // return cid
// }
// export const get = async (cid: any) => {
//     // const obj = await _dag.get(CID.parse(cid));
//     // logger(`← Got data (cid=${cid}) ✓`)
// }
