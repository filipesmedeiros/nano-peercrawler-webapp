import {
  ArchiveIcon,
  BadgeCheckIcon,
  BanIcon,
  ExternalLinkIcon,
  SortAscendingIcon,
  SortDescendingIcon,
  SwitchVerticalIcon,
} from '@heroicons/react/solid'
import Big from 'big.js'
import { Address6 } from 'ip-address'
import {
  ConfirmationQuorumResponse,
  MergedPeerInfo,
  SortDirection,
} from 'lib/types'
import { Unit, convert } from 'nanocurrency'
import { useRouter } from 'next/router'
import { FC, useMemo, useState } from 'react'
import { useTimeoutWhen } from 'rooks'
import useSWR from 'swr'

export interface Props {
  peers: MergedPeerInfo[]
  search?: string
  shortVersion: boolean
}

type Column =
  | 'ip'
  | 'is_voting'
  | 'last_seen'
  | 'alias'
  | 'account'
  | 'node_id'
  | 'weight'
  | 'weight_percentage'

type TableSorting = {
  [key in Column]: SortDirection
}

const defaultSorting: TableSorting = {
  weight_percentage: undefined,
  node_id: undefined,
  account: undefined,
  alias: undefined,
  ip: undefined,
  is_voting: undefined,
  last_seen: undefined,
  weight: undefined,
}

const PeerTable: FC<Props> = ({ peers, search, shortVersion }) => {
  const { push } = useRouter()

  const { data: networkData } =
    useSWR<ConfirmationQuorumResponse>('/api/networkData')

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
      let valueA: string | number | boolean | null | undefined | bigint =
        a[currentSorted === 'weight_percentage' ? 'weight' : currentSorted]
      let valueB: string | number | boolean | null | undefined | bigint =
        b[currentSorted === 'weight_percentage' ? 'weight' : currentSorted]

      if (
        currentSorted === 'alias' ||
        currentSorted === 'account' ||
        currentSorted === 'node_id'
      ) {
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
      } else if (currentSorted === 'weight') {
        valueA = BigInt(valueA ?? '0')
        valueB = BigInt(valueB ?? '0')
      } else if (currentSorted === 'weight_percentage') {
        valueA = BigInt(a.weight ?? '0')
        valueB = BigInt(b.weight ?? '0')
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
      else if (typeof valueA === 'bigint')
        return +(
          (sortDirection === 'asc' ? valueA : (valueB as bigint)) -
          ((sortDirection === 'asc' ? (valueB as bigint) : valueA) as bigint)
        ).toString()
      else return 1
    })

    return sortedPeers
  }, [peers, tableSorting])

  const filteredPeers = useMemo(() => {
    if (!search) return sortedPeers
    else
      return sortedPeers?.filter(
        peer =>
          peer.ip?.includes(search) ||
          peer.account?.includes(search) ||
          peer.node_id?.includes(search)
      )
  }, [sortedPeers, search])

  const SortingIcon: FC<{ column: Column }> = ({ column }) => (
    <button
      className="hover:text-accent active:text-accent"
      onClick={() => onColumnClick(column)}
      title="Change sorting direction"
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

  const [copiedText, setCopiedText] = useState<string>()
  useTimeoutWhen(() => setCopiedText(undefined), 2e3, copiedText !== undefined)

  return (
    <table className="table">
      <thead>
        <tr>
          <th className="p-0 !static" />
          <th className="p-0" />
          <th>
            <div className="flex items-center gap-2">
              Alias
              <SortingIcon column="alias" />
            </div>
          </th>
          <th>
            <div className="flex items-center gap-2">
              Account
              <SortingIcon column="account" />
            </div>
          </th>
          <th>
            <div className="flex items-center gap-2">
              Node ID
              <SortingIcon column="node_id" />
            </div>
          </th>
          {!shortVersion && (
            <th>
              <div className="flex items-center gap-2">
                Weight
                <SortingIcon column="weight" />
              </div>
            </th>
          )}
          <th>
            <div className="flex items-center gap-2">
              Weight %
              <SortingIcon column="weight_percentage" />
            </div>
          </th>
          <th>
            <div className="flex items-center gap-2">
              Peer IP/port
              <SortingIcon column="ip" />
            </div>
          </th>
          {!shortVersion && (
            <th>
              <div className="flex items-center gap-2">
                Last seen
                <SortingIcon column="last_seen" />
              </div>
            </th>
          )}
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
            node_id,
            weight,
            port,
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
                    <a
                      href={`https://nano.community/${account}`}
                      onClick={e => e.stopPropagation()}
                      title="nano.community rep page"
                    >
                      <ExternalLinkIcon className="h-5 w-5 hover:text-accent" />
                    </a>
                    {alias ?? '---'}
                  </span>
                ) : (
                  alias ?? '---'
                )}
              </td>
              <td>
                {account ? (
                  <div className="flex gap-2 items-center">
                    <a
                      href={`https://nanolooker.com/account/${account}`}
                      onClick={e => e.stopPropagation()}
                      title="Nanolooker account page"
                    >
                      <ExternalLinkIcon className="h-5 w-5 hover:text-accent" />
                    </a>
                    <div
                      onClick={e => {
                        e.stopPropagation()
                        navigator.clipboard.writeText(account)
                        setCopiedText(account)
                      }}
                      className="tooltip tooltip-accent"
                      data-tip={
                        copiedText === account ? 'Copied!' : 'Click to copy'
                      }
                    >
                      {`${account.substring(0, 10)}...${account.substring(
                        account.length - 5,
                        account.length
                      )}`}
                    </div>
                  </div>
                ) : (
                  '---'
                )}
              </td>
              <td>
                {node_id ? (
                  <div
                    onClick={e => {
                      e.stopPropagation()
                      navigator.clipboard.writeText(node_id)
                      setCopiedText(node_id)
                    }}
                    className="tooltip tooltip-accent"
                    data-tip={
                      copiedText === node_id ? 'Copied!' : 'Click to copy'
                    }
                  >
                    {`${node_id.substring(0, 10)}...${node_id.substring(
                      node_id.length - 5,
                      node_id.length
                    )}`}
                  </div>
                ) : (
                  '---'
                )}
              </td>
              {!shortVersion && (
                <td>
                  <div
                    onClick={e => {
                      e.stopPropagation()
                      navigator.clipboard.writeText(weight ?? '0')
                      setCopiedText(weight ?? '0')
                    }}
                    className="tooltip tooltip-accent"
                    data-tip={
                      copiedText === (weight ?? '0')
                        ? 'Copied raw amount!'
                        : 'Click to copy raw amount'
                    }
                  >
                    Ӿ
                    {(+convert(weight ?? '0', {
                      from: Unit.raw,
                      to: Unit.Nano,
                    })).toFixed(2)}
                  </div>
                </td>
              )}
              <td>
                {Big(weight ?? '0')
                  .div(networkData?.online_stake_total ?? '1')
                  .times(100)
                  .toFixed(2)}
                %
              </td>
              <td>
                {ip
                  ? `${
                      ip?.startsWith('::ffff:') ? ip?.substring(7) : `[${ip}]`
                    }:${port}`
                  : '---'}
              </td>
              {!shortVersion && (
                <td>
                  {last_seen
                    ? new Date(last_seen * 1e3).toLocaleString()
                    : '---'}
                </td>
              )}
            </tr>
          )
        )}
      </tbody>
    </table>
  )
}

export default PeerTable
