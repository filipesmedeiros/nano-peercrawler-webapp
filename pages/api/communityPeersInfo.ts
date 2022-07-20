import type { NextApiHandler } from 'next'

import { getCommunityPeersInfoUrl } from '@lib/constants'

const handler: NextApiHandler = async (_, res) => {
  res.json(await fetch(getCommunityPeersInfoUrl).then(res => res.json()))
}

export default handler
