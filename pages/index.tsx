import { SearchIcon } from '@heroicons/react/solid'
import useDebounce from 'lib/hooks/useDebounce'
import { useState } from 'react'
import useSWR from 'swr'

import PeerTable from '@components/PeerTable'
import Spinner from '@components/Spinner'

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
        <div className="flex flex-col gap-2 overflow-x-scroll">
          <div className="form-control">
            <label className="input-group w-fit">
              <span>
                <SearchIcon className="h-5 w-5" />
              </span>

              <input
                className="input input-bordered"
                onInput={e => setPeerIdOrIpSearch(e.currentTarget.value)}
                value={peerIdOrIpSearch}
                placeholder="Search"
              />
            </label>
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
