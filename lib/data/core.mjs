import * as Y from 'yjs';
// import { JSONFilePreset } from 'lowdb/node'
import path from 'path';
import dotenv from 'dotenv';
// import fs from 'fs-extra'
import { toUint8Array } from 'js-base64';
import { logger } from '../utils/index.mjs';
// const CARMEL_HOME = `${process.env.CARMEL_HOME}`
// dotenv.config({ path: path.resolve(CARMEL_HOME, '.env') })
// const dbRoot = path.resolve(CARMEL_HOME, 'db')
// const cacheRoot = path.resolve(CARMEL_HOME, 'cache')
// const mainDbFile = path.resolve(dbRoot, 'main.db.json')
export const initialize = async () => {
    // fs.existsSync(dbRoot) || fs.mkdirpSync(dbRoot)
    // fs.existsSync(cacheRoot) || fs.mkdirpSync(cacheRoot)
    // if (!fs.existsSync(mainDbFile)) {
    //     // first time
    //     logger("initialized DB without history")
    //     return 
    // }
    // const mainDb = await JSONFilePreset(mainDbFile, {} as any)
    // const { stateBase64 } = mainDb.data
    // const state = toUint8Array(stateBase64)
    // Y.applyUpdate(main, state)
    // await saveModel()
};
