import { SearchIcon } from '@heroicons/react/solid'
import { Address6 } from 'ip-address'
import { useMemo, useState } from 'react'
import useSWR from 'swr'

import PeerTable from '@components/PeerTable'
import Spinner from '@components/Spinner'

import useDebounce from '@lib/hooks/useDebounce'
import { NanoCommunityPeerInfo, PeerInfo } from '@lib/types'
import { isLocationEqual } from '@lib/utils'

const Home = () => {
  const { data: peers } = useSWR<PeerInfo[]>('/api/peers')
  const { data: communityPeersDetails } = useSWR<NanoCommunityPeerInfo[]>(
    '/api/communityPeersInfo'
  )

  const mergedPeers = useMemo(
    () =>
      peers?.map(peer => ({
        ...peer,
        ...communityPeersDetails?.find(({ address, port }) =>
          isLocationEqual(
            { ip: address, port },
            { ip: peer.ip, port: peer.port }
          )
        ),
      })),
    [peers, communityPeersDetails]
  )

  const [peerIdOrIpSearch, setPeerIdOrIpSearch] = useState('')
  const peerIdOrIpSearchDebounced = useDebounce(peerIdOrIpSearch)

  return (
    <>
      {!mergedPeers && (
        <div className="w-screen h-screen grid place-content-center">
          <Spinner />
        </div>
      )}
      {mergedPeers && (
        <div className="flex flex-col gap-2 overflow-x-scroll">
          <div className="form-control sticky left-0">
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
          <PeerTable peers={mergedPeers} search={peerIdOrIpSearchDebounced} />
        </div>
      )}
    </>
  )
}

export default Home
