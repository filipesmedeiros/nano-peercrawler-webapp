import {
  ArchiveIcon,
  BadgeCheckIcon,
  BanIcon,
  ExternalLinkIcon,
  SortAscendingIcon,
  SortDescendingIcon,
  SwitchVerticalIcon,
} from '@heroicons/react/solid'
import { Address6 } from 'ip-address'
import { MergedPeerInfo, SortDirection } from 'lib/types'
import { useRouter } from 'next/router'
import { FC, useMemo, useState } from 'react'
import { useTimeoutWhen } from 'rooks'

export interface Props {
  peers: MergedPeerInfo[]
  peerIdOrIpSearch?: string
}

type Column = 'peer_id' | 'ip' | 'is_voting' | 'last_seen' | 'alias'

type TableSorting = {
  [key in Column]: SortDirection
}

const defaultSorting: TableSorting = {
  alias: undefined,
  peer_id: undefined,
  ip: undefined,
  is_voting: undefined,
  last_seen: undefined,
}

const PeerTable: FC<Props> = ({ peers, peerIdOrIpSearch }) => {
  const { push } = useRouter()

  const [tableSorting, setTableSorting] = useState<{
    currentSorted: Column | undefined
    sorting: TableSorting
  }>({ sorting: defaultSorting, currentSorted: undefined })

  const onColumnClick = (column: Column) => {
    const prevDirection = tableSorting.sorting[column]
    const newDirection =
      prevDirection === 'asc'
        ? 'desc'
        : prevDirection === 'desc'
        ? undefined
        : 'asc'
    setTableSorting({
      currentSorted: newDirection === undefined ? undefined : column,
      sorting: {
        ...defaultSorting,
        [column]: newDirection,
      },
    })
  }

  const sortedPeers = useMemo(() => {
    if (peers === undefined) return undefined

    const currentSorted = tableSorting.currentSorted
    const needsSorting = currentSorted !== undefined

    if (!needsSorting) return peers

    const sortDirection = tableSorting.sorting[currentSorted]

    const sortedPeers = [...peers].sort((a, b) => {
      let valueA = a[currentSorted]
      let valueB = b[currentSorted]

      if (currentSorted === 'peer_id') {
        valueA = valueA ?? ''
        valueB = valueB ?? ''
      } else if (currentSorted === 'last_seen') {
        valueA = valueA ?? 0
        valueB = valueB ?? 0
      } else if (currentSorted === 'is_voting') {
        valueA = valueA ?? false
        valueB = valueB ?? false
      } else if (currentSorted === 'ip') {
        try {
          valueA = new Address6(valueA as string).decimal()
        } catch {
          valueA = ''
        }
        try {
          valueB = new Address6(valueB as string).decimal()
        } catch {
          valueB = ''
        }
      } else if (currentSorted === 'alias') {
        valueA = valueA ?? ''
        valueB = valueB ?? ''
      }

      if (typeof valueA === 'string')
        return (
          sortDirection === 'asc' ? valueA : (valueB as string)
        ).localeCompare(sortDirection === 'asc' ? (valueB as string) : valueA)
      else if (typeof valueA === 'number')
        return (
          (sortDirection === 'asc' ? valueA : (valueB as number)) -
          ((sortDirection === 'asc' ? (valueB as number) : valueA) as number)
        )
      else if (typeof valueA === 'boolean')
        return (sortDirection === 'asc' ? valueA : valueB ?? false) ? 1 : -1
      else return 1
    })

    return sortedPeers
  }, [peers, tableSorting])

  const filteredPeers = useMemo(() => {
    if (!peerIdOrIpSearch) return sortedPeers
    else
      return sortedPeers?.filter(
        peer =>
          peer.ip?.includes(peerIdOrIpSearch) ||
          peer.peer_id?.includes(peerIdOrIpSearch)
      )
  }, [sortedPeers, peerIdOrIpSearch])

  const SortingIcon: FC<{ column: Column }> = ({ column }) => (
    <button
      className="hover:text-accent active:text-accent"
      onClick={() => onColumnClick(column)}
    >
      {tableSorting.sorting[column] === 'asc' ? (
        <SortDescendingIcon className="h-5 w-5" />
      ) : tableSorting.sorting[column] === 'desc' ? (
        <SortAscendingIcon className="h-5 w-5" />
      ) : (
        <SwitchVerticalIcon className="h-5 w-5" />
      )}
    </button>
  )

  const [copiedPeerId, setCopiedPeerId] = useState<string>()
  useTimeoutWhen(
    () => setCopiedPeerId(undefined),
    2e3,
    copiedPeerId !== undefined
  )

  return (
    <table className="table">
      <thead>
        <tr>
          <th className="p-0" />
          <th className="p-0" />
          <th>
            <div className="flex items-center gap-2">
              Alias
              <SortingIcon column="alias" />
            </div>
          </th>
          <th>
            <div className="flex items-center gap-2">
              Peer ID
              <SortingIcon column="peer_id" />
            </div>
          </th>
          <th>
            <div className="flex items-center gap-2">
              Peer IP
              <SortingIcon column="ip" />
            </div>
          </th>
          <th>
            <div className="flex items-center gap-2">
              Last seen
              <SortingIcon column="last_seen" />
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {filteredPeers?.map(
          ({
            telemetry,
            peer_id,
            ip,
            is_voting,
            last_seen,
            alias,
            account,
          }) => (
            <tr
              key={`${peer_id}-${ip}`}
              className="hover:active hover:cursor-pointer"
              onClick={() =>
                push({ pathname: '/[peerId]', query: { peerId: peer_id } })
              }
            >
              <td className="px-1">
                {is_voting && (
                  <span>
                    <ArchiveIcon className="h-5 w-5" />
                  </span>
                )}
              </td>
              <td className="px-1">
                {telemetry !== null && telemetry.sig_verified !== null ? (
                  telemetry.sig_verified ? (
                    <span className="text-green-500">
                      <BadgeCheckIcon className="h-5 w-5" />
                    </span>
                  ) : (
                    <span className="text-red-500">
                      <BanIcon className="h-5 w-5" />
                    </span>
                  )
                ) : (
                  '---'
                )}
              </td>
              <td>
                {account ? (
                  <span className="flex gap-2 items-center">
                    {alias ?? '---'}
                    <a
                      href={`https://nano.community/${account}`}
                      onClick={e => e.stopPropagation()}
                    >
                      <ExternalLinkIcon className="h-5 w-5 hover:text-accent" />
                    </a>
                  </span>
                ) : (
                  alias ?? '---'
                )}
              </td>
              <td>
                {peer_id ? (
                  <div
                    onClick={e => {
                      e.stopPropagation()
                      navigator.clipboard.writeText(peer_id)
                      setCopiedPeerId(peer_id)
                    }}
                    className="tooltip tooltip-secondary"
                    data-tip={
                      copiedPeerId === peer_id ? 'Copied!' : 'Click to copy'
                    }
                  >
                    {`${peer_id?.substring(0, 10)}...${peer_id?.substring(
                      peer_id.length - 10,
                      peer_id.length
                    )}`}
                  </div>
                ) : (
                  '---'
                )}
              </td>
              <td>{ip ?? '---'}</td>
              <td>
                {last_seen ? new Date(last_seen * 1e3).toLocaleString() : '---'}
              </td>
            </tr>
          )
        )}
      </tbody>
    </table>
  )
}

export default PeerTable
