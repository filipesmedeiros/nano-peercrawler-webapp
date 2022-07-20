import type { NextApiHandler } from 'next'

import { nanoRpcUrl } from '@lib/constants'

const handler: NextApiHandler = async (_, res) => {
  res.json(
    await fetch(nanoRpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'confirmation_quorum' }),
    }).then(res => res.json())
  )
}

export default handler
