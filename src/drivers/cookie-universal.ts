import type { ICookie, ICookieSetOpts } from 'cookie-universal'
import type { StorageLike } from '~/core/types'

export type CookieSerializeOptions = ICookieSetOpts['opts']

/**
 * Storage driver for `cookie-universal`
 * @param cookie cookie object, SSR parsed if necessary
 * @param cookieOptions cookie serialization options
 * @returns driver to use as `persist.storage`
 */
export function driver(
  cookie: ICookie,
  cookieOptions?: CookieSerializeOptions,
): StorageLike {
  return {
    getItem(key) {
      return cookie.get(key)
    },
    setItem(key, value) {
      cookie.set(key, value, cookieOptions)
    },
  }
}
