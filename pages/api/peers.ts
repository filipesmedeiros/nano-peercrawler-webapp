import type { NextApiHandler } from 'next'

import { getPeersUrl } from '@lib/constants'

const handler: NextApiHandler = async (_, res) => {
  res.json(await fetch(getPeersUrl).then(res => res.json()))
}

export default handler
