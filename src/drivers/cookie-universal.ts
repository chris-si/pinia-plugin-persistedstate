import type { ICookie, ICookieSetOpts } from 'cookie-universal'
import type { StorageLike } from '~/core/types'

export type CookieSerializeOptions = ICookieSetOpts['opts']

export interface DriverOptions {
  /**
   * Cookie serialization options
   * @default undefined
   */
  cookieOptions?: CookieSerializeOptions

  /**
   * Number of cookies to split value into
   * @default 1
   */
  splitCookies?: number
}

/**
 * Storage driver for `cookie-universal`
 * @param cookie cookie object, SSR parsed if necessary
 * @param driverOptions driver options
 * @returns driver to use as `persist.storage`
 */
export function driver(
  cookie: ICookie,
  driverOptions?: DriverOptions,
): StorageLike {
  const { splitCookies = 1, cookieOptions } = driverOptions ?? {
    splitCookies: 1,
  }
  if (splitCookies < 1)
    throw new Error('Cannot split value into less than 1 cookie')

  return {
    getItem(key) {
      if (splitCookies === 1) {
        return cookie.get(key)
      } else {
        const indexes = [...Array(splitCookies).keys()]
        const chunks = indexes.map(i => cookie.get(`${key}_${i}`) as string)
        return chunks.join()
      }
    },
    setItem(key, value) {
      if (splitCookies === 1) {
        cookie.set(key, value, cookieOptions)
      } else {
        const chunkLength = Math.ceil(value.length / splitCookies)
        const chunks = value.match(new RegExp(`.{1, ${chunkLength}}`))

        if (chunks) {
          chunks.forEach((chunk, i) => {
            cookie.set(`${key}_${i}`, chunk, cookieOptions)
          })
        }
      }
    },
  }
}
