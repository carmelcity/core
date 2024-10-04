import * as Y from 'yjs'
import { fromUint8Array } from 'js-base64'
import { logger } from '../utils/index.mts'

export let instance = new Y.Doc()

export let addToCollection = async (msg: any, col: string) => {
    const now = `${Date.now()}`
 
    let messages = instance.getArray(col)
    messages.push([{ ...msg, now }])
 
    // await save()
 
    logger(`added a new element to [${col}] (new total ${messages.length})`, 'db')
}
 
export const state = async () => {
     const state = Y.encodeStateAsUpdate(instance)
     const stateBase64 = fromUint8Array(state)
     const timestamp = `${Date.now()}`
 
     return { main: stateBase64, timestamp }
}
 
//  export let save = async () => {
//      const mainDb = await JSONFilePreset(mainDbFile, {} as any)
//      const state = getState()
 
//      mainDb.data = state
 
//      await mainDb.write()
//  }
 
 // export let saveModel = async () => {
 //     const messages = main.getArray('messages').toArray()
 //     const messagesDb = await JSONFilePreset(messagesDbFile, {} as any)
 //     messagesDb.data = messages
 
 //     await messagesDb.write()
 // }
 
 // import { PGlite } from "@electric-sql/pglite"
 // import { adminpack } from '@electric-sql/pglite/contrib/adminpack'
 // import { amcheck } from '@electric-sql/pglite/contrib/amcheck'
 // import { bloom } from '@electric-sql/pglite/contrib/bloom'
 // import { auto_explain } from '@electric-sql/pglite/contrib/auto_explain'
 // import { btree_gin } from '@electric-sql/pglite/contrib/btree_gin';
 // import path from 'path'
 // import dotenv from 'dotenv'
 
 // const CARMEL_HOME = `${process.env.CARMEL_HOME}`
 
 // dotenv.config({ path: path.resolve(CARMEL_HOME, '.env') })
 
 // const db = new PGlite(path.resolve(CARMEL_HOME, 'db'), {
 //     extensions: { adminpack, amcheck, bloom, auto_explain, btree_gin }
 // })
 
 // await db.query("select 'Hello world' as message;");
 
 // await db.exec(`
 //     CREATE TABLE IF NOT EXISTS nodes (
 //       id SERIAL PRIMARY KEY,
 //       hash TEXT,
 //       type
 //       done BOOLEAN DEFAULT false
 //     );
 //     INSERT INTO todo (task, done) VALUES ('Install PGlite from NPM', true);
 //     INSERT INTO todo (task, done) VALUES ('Load PGlite', true);
 //     INSERT INTO todo (task, done) VALUES ('Create a table', true);
 //     INSERT INTO todo (task, done) VALUES ('Insert some data', true);
 //     INSERT INTO todo (task) VALUES ('Update a task');
 // `)
 
 // const ret = await db.query(`
 //     SELECT * from nodes WHERE id = 1;
 // `)
 
 // const ret = await db.query(
 //     'UPDATE todo SET task = $2, done = $3 WHERE id = $1',
 //     [5, 'Update a task using parametrised queries', true],
 // )