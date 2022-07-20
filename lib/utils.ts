import { Address6 } from 'ip-address'

export const isLocationEqual = (
  location1: { ip?: string | null; port?: number | null },
  location2: { ip?: string | null; port?: number | null }
) =>
  location1?.ip &&
  location2?.ip &&
  new Address6(location1.ip).decimal() ===
    new Address6(location2.ip).decimal() &&
  location1.port === location2.port
