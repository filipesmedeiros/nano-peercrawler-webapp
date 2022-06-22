import clsx from 'clsx'
import { SortDirection } from 'lib/types'
import { Children, FC, PropsWithChildren } from 'react'

import ArrowDown from './icons/ArrowDown'
import ArrowUp from './icons/ArrowUp'

export interface SubComponents {
  Head: FC<PropsWithChildren>
  Body: FC<PropsWithChildren>
  HeadCell: FC<
    PropsWithChildren<{
      sortDirection?: SortDirection
      onClick?: (prevDirection: SortDirection) => void
      noPadding?: boolean
    }>
  >
  Row: FC<PropsWithChildren>
  Cell: FC<
    PropsWithChildren<{
      noPadding?: boolean
      center?: boolean
    }>
  >
}

const Table: FC<PropsWithChildren> & SubComponents = ({ children }) => {
  return (
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-100 relative shadow">
      {children}
    </table>
  )
}

Table.Head = ({ children }) => (
  <thead className="text-xs text-gray-700 uppercase dark:text-gray-100">
    <tr>{children}</tr>
  </thead>
)
Table.Head.displayName = 'TableHead'

Table.HeadCell = ({ children, sortDirection, onClick, noPadding = false }) => (
  <th
    scope="col"
    className={clsx(
      'bg-blue-200 dark:bg-gray-700 sticky top-0 first:rounded-tl last:rounded-tr dark:hover:bg-blue-900',
      onClick && 'hover:cursor-pointer hover:bg-blue-600 hover:text-white',
      !noPadding && 'p-4'
    )}
    onClick={() => onClick?.(sortDirection)}
  >
    <div className="flex items-center">
      {children}
      {sortDirection !== undefined && (
        <div className="shrink-0">
          {sortDirection === 'asc' ? (
            <ArrowDown />
          ) : (
            sortDirection === 'desc' && <ArrowUp />
          )}
        </div>
      )}
    </div>
  </th>
)
Table.HeadCell.displayName = 'TableHeadCell'

Table.Body = ({ children }) => <tbody className="">{children}</tbody>
Table.Body.displayName = 'TableBody'

Table.Row = ({ children }) => (
  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
    {children}
  </tr>
)
Table.Row.displayName = 'TableRow'

Table.Cell = ({ children, noPadding = false, center = false }) => (
  <td className={clsx('w-4', !noPadding && 'p-4', center && 'p-1 text-center')}>
    {children}
  </td>
)
Table.Cell.displayName = 'TableCell'

export default Table
