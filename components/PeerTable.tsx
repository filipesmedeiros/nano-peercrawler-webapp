import { Address6 } from 'ip-address'
import { PeerInfo, SortDirection } from 'lib/types'
import { FC, useMemo, useState } from 'react'

import Table from './Table'

export interface Props {
  peers: PeerInfo[]
  peerIdOrIpSearch?: string
}

type Column = 'peer_id' | 'ip' | 'is_voting' | 'last_seen'

type TableSorting = {
  [key in Column]: SortDirection
}

const defaultSorting: TableSorting = {
  peer_id: undefined,
  ip: undefined,
  is_voting: undefined,
  last_seen: undefined,
}

const PeerTable: FC<Props> = ({ peers, peerIdOrIpSearch }) => {
  const [tableSorting, setTableSorting] = useState<{
    currentSorted: Column | undefined
    sorting: TableSorting
  }>({ sorting: defaultSorting, currentSorted: undefined })

  const onColumnClick =
    (column: Column) => (prevDirection: 'asc' | 'desc' | undefined) => {
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

  return (
    <Table>
      <Table.Head>
        <Table.HeadCell
          sortDirection={tableSorting.sorting.peer_id}
          onClick={onColumnClick('peer_id')}
        >
          Peer ID
        </Table.HeadCell>
        <Table.HeadCell
          sortDirection={tableSorting.sorting.ip}
          onClick={onColumnClick('ip')}
        >
          Peer IP
        </Table.HeadCell>
        <Table.HeadCell
          sortDirection={tableSorting.sorting.is_voting}
          onClick={onColumnClick('is_voting')}
        >
          Is peer voting?
        </Table.HeadCell>
        <Table.HeadCell
          sortDirection={tableSorting.sorting.last_seen}
          onClick={onColumnClick('last_seen')}
        >
          Last seen
        </Table.HeadCell>
      </Table.Head>
      <Table.Body>
        {filteredPeers?.map(peer => (
          <Table.Row key={`${peer.peer_id}-${peer.ip}`}>
            <Table.Cell>{peer.peer_id ?? '---'}</Table.Cell>
            <Table.Cell>{peer.ip ?? '---'}</Table.Cell>
            <Table.Cell>
              {peer.is_voting !== null ? (peer.is_voting ? '✅' : '❌') : '---'}
            </Table.Cell>
            <Table.Cell>
              {peer.last_seen
                ? new Date(peer.last_seen * 1e3).toLocaleString()
                : '---'}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
}

export default PeerTable
