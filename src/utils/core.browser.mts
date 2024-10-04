import debug from 'debug'

const LOG = debug('carmel')

/**
 * 
 * @param msg 
 * @param func 
 * @returns 
 */
export const logger = (msg: string, func: string = '') => msg.trim() && (func ? LOG(`[${func}]`, msg) : LOG(msg))

/**
 * 
 * @param msg 
 * @param func 
 */
export const error = (msg: string, func: string = '') => {
    logger(`Error: ${msg}`, func)
}