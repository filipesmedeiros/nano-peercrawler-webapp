---
to: pages/api/<%= name %>.ts
---
import type { NextApiHandler } from 'next'

import checkToken from '@lib/middlewares/checkToken'

// remove if not needed
export type ResponseBody = any // change to correct type

const handler: NextApiHandler<ResponseBody> = (req, res) => {
  try {
    checkToken(req, res)
    
    // handle request
  } catch {
    res.redirect('/login')
  }
}

export default handler



