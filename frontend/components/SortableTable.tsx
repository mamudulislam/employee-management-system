import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

export type SortOrder = 'asc' | 'desc' | null;

export interface SortConfig {
  key: string | null;
  order: SortOrder;
}

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

interface SortableTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  rowKey: keyof T;
  onRowClick?: (row: T) => void;
  className?: string;
  striped?: boolean;
}

export const SortableTable = React.forwardRef<HTMLTableElement, SortableTableProps<any>>(
  (
    {
      data,
      columns,
      rowKey,
      onRowClick,
      className = '',
      striped = true,
    },
    ref
  ) => {
    const [sortConfig, setSortConfig] = useState<SortConfig>({
      key: null,
      order: null,
    });

    const sortedData = useMemo(() => {
      let sortableData = [...data];

      if (sortConfig.key && sortConfig.order) {
        sortableData.sort((a, b) => {
          const aValue = a[sortConfig.key as string];
          const bValue = b[sortConfig.key as string];

          if (aValue === bValue) return 0;

          let comparison = 0;
          if (typeof aValue === 'string' && typeof bValue === 'string') {
            comparison = aValue.localeCompare(bValue);
          } else if (typeof aValue === 'number' && typeof bValue === 'number') {
            comparison = aValue - bValue;
          } else if (aValue instanceof Date && bValue instanceof Date) {
            comparison = aValue.getTime() - bValue.getTime();
          } else {
            comparison = String(aValue).localeCompare(String(bValue));
          }

          return sortConfig.order === 'asc' ? comparison : -comparison;
        });
      }

      return sortableData;
    }, [data, sortConfig]);

    const handleSort = (key: string) => {
      let order: SortOrder = 'asc';

      if (sortConfig.key === key) {
        if (sortConfig.order === 'asc') {
          order = 'desc';
        } else if (sortConfig.order === 'desc') {
          order = null;
        }
      }

      setSortConfig({ key: order ? key : null, order });
    };

    const SortIcon = ({ column }: { column: string }) => {
      if (!sortConfig.key || sortConfig.key !== column) {
        return <ChevronsUpDown size={14} className="text-slate-400" />;
      }
      return sortConfig.order === 'asc' ? (
        <ChevronUp size={14} className="text-indigo-600" />
      ) : (
        <ChevronDown size={14} className="text-indigo-600" />
      );
    };

    return (
      <div className={`overflow-x-auto ${className}`}>
        <table ref={ref} className="w-full text-left text-sm">
          <thead>
            <tr className="border-b-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className="px-6 py-4 font-semibold text-slate-900 dark:text-white"
                >
                  {column.sortable !== false ? (
                    <button
                      onClick={() => handleSort(String(column.key))}
                      className="flex items-center gap-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      {column.label}
                      <SortIcon column={String(column.key)} />
                    </button>
                  ) : (
                    column.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, index) => (
              <tr
                key={String(row[rowKey])}
                onClick={() => onRowClick?.(row)}
                className={`border-b border-slate-200 dark:border-slate-700 transition-colors ${
                  striped && index % 2 === 0
                    ? 'bg-slate-50 dark:bg-slate-800/50'
                    : 'bg-white dark:bg-slate-900'
                } ${
                  onRowClick
                    ? 'hover:bg-indigo-50 dark:hover:bg-indigo-900/20 cursor-pointer'
                    : ''
                }`}
              >
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className="px-6 py-4 text-slate-700 dark:text-slate-300"
                  >
                    {column.render
                      ? column.render(row[column.key], row)
                      : String(row[column.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {sortedData.length === 0 && (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            No data available
          </div>
        )}
      </div>
    );
  }
);

SortableTable.displayName = 'SortableTable';

export default SortableTable;
