import { SortDirection } from 'lib/types'
import type { FC, ReactNode } from 'react'

import ArrowDown from './icons/ArrowDown'
import ArrowUp from './icons/ArrowUp'

export interface Props {
  children?: ReactNode
}

export interface SubComponents {
  Head: FC<Props>
  Body: FC<Props>
  HeadCell: FC<
    Props & {
      sortDirection?: SortDirection
      onClick?: (prevDirection: SortDirection) => void
    }
  >
  Row: FC<Props>
  Cell: FC<Props>
}

const Table: FC<Props> & SubComponents = ({ children }) => {
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

Table.HeadCell = ({ children, sortDirection, onClick }) => (
  <th
    scope="col"
    className="p-4 bg-blue-200 dark:bg-gray-700 sticky top-0 first:rounded-tl last:rounded-tr hover:cursor-pointer hover:bg-blue-600 hover:text-white dark:hover:bg-blue-900"
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

Table.Cell = ({ children }) => <td className="w-4 p-4">{children}</td>
Table.Cell.displayName = 'TableCell'

export default Table
