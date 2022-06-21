import { Address6 } from 'ip-address'
import useDebounce from 'lib/hooks/useDebounce'
import { useMemo, useState } from 'react'
import useSWR from 'swr'

import PeerTable from '@components/PeerTable'
import Spinner from '@components/Spinner'
import Search from '@components/icons/Search'

import { PeerInfo } from '../lib/types'

const Home = () => {
  const { data: peers } = useSWR<PeerInfo[]>('/api/peers')

  const [peerIdOrIpSearch, setPeerIdOrIpSearch] = useState('')
  const peerIdOrIpSearchDebounced = useDebounce(peerIdOrIpSearch)

  return (
    <>
      {!peers && (
        <div className="w-screen h-screen grid place-content-center">
          <Spinner />
        </div>
      )}
      {peers && (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 px-3 py-2 bg-blue-200 dark:bg-blue-900 dark:text-white w-fit rounded">
            <Search />
            <input
              className="bg-transparent"
              onInput={e => setPeerIdOrIpSearch(e.currentTarget.value)}
              value={peerIdOrIpSearch}
            />
          </div>
          <PeerTable
            peers={peers}
            peerIdOrIpSearch={peerIdOrIpSearchDebounced}
          />
        </div>
      )}
    </>
  )
}

export default Home
