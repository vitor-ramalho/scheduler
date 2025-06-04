import { useState, useMemo } from "react";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "../ui/table";

// Define column interface
export interface ColumnDef<T> {
  id: string;
  header: string;
  width?: string;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
}

// Define sorting configuration interface
interface SortConfig {
  key: string | null;
  direction: 'ascending' | 'descending';
}

// Define the main props interface
export interface DynamicTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  caption?: string;
  sortable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  tableProps?: React.HTMLAttributes<HTMLTableElement>;
  headerProps?: React.HTMLAttributes<HTMLTableSectionElement>;
  bodyProps?: React.HTMLAttributes<HTMLTableSectionElement>;
  footerProps?: React.HTMLAttributes<HTMLTableSectionElement>;
  onRowClick?: (row: T) => void;
  renderCustomCell?: (row: T, column: ColumnDef<T>) => React.ReactNode;
}

/**
 * DynamicTable Component
 * 
 * A reusable dynamic table using shadcn UI components with TypeScript support
 */
const List = <T extends Record<string, unknown>>({
  columns = [],
  data = [],
  caption,
  sortable = false,
  pagination = false,
  pageSize = 10,
  tableProps = {},
  headerProps = {},
  bodyProps = {},
  footerProps = {},
  onRowClick,
  renderCustomCell,
}: DynamicTableProps<T>) => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  
  // Sorting state
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: 'ascending'
  });

  // Handle sorting
  const handleSort = (columnId: string) => {
    if (!sortable) return;
    
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === columnId && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    setSortConfig({ key: columnId, direction });
  };

  // Sort data if sortable and sort configuration exists
  const sortedData = useMemo(() => {
    if (!sortable || !sortConfig.key) return data;
    
    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof T];
      const bValue = b[sortConfig.key as keyof T];
      
      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortable, sortConfig]);

  // Paginate data if pagination is enabled
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, pagination, currentPage, pageSize]);

  // Calculate total pages for pagination
  const totalPages = pagination ? Math.ceil(data.length / pageSize) : 0;

  // Handle page changes
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Get sort direction indicator
  const getSortDirectionIndicator = (columnId: string) => {
    if (!sortable || sortConfig.key !== columnId) return null;
    return sortConfig.direction === 'ascending' ? ' ↑' : ' ↓';
  };

  // Helper to get cell value - Fixed to avoid TypeScript error
  const getCellValue = (row: T, column: ColumnDef<T>): React.ReactNode => {
    if (renderCustomCell) {
      return renderCustomCell(row, column);
    }
    
    if (column.cell) {
      return column.cell(row);
    }
    
    if (column.accessorKey) {
      const value = row[column.accessorKey];
      // Convert to string or appropriate React node
      return typeof value === 'object' && value !== null 
        ? JSON.stringify(value) 
        : String(value);
    }
    
    // Now using type assertion to safely convert to string or appropriate React node
    const value = row[column.id as keyof T];
    return typeof value === 'object' && value !== null 
      ? JSON.stringify(value) 
      : String(value);
  };

  return (
    <>
      <Table {...tableProps}>
        {caption && <TableCaption>{caption}</TableCaption>}
        
        <TableHeader {...headerProps}>
          <TableRow>
            {columns.map((column) => (
              <TableHead 
                key={column.id}
                className={sortable ? "cursor-pointer" : ""}
                onClick={sortable ? () => handleSort(column.id) : undefined}
                style={{ width: column.width }}
              >
                {column.header}
                {getSortDirectionIndicator(column.id)}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        
        <TableBody {...bodyProps}>
          {paginatedData.length > 0 ? (
            paginatedData.map((row, rowIndex) => (
              <TableRow 
                key={String(row.id || rowIndex)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={onRowClick ? "cursor-pointer" : ""}
              >
                {columns.map((column) => (
                  <TableCell key={`${String(row.id || rowIndex)}-${column.id}`}>
                    {getCellValue(row, column)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-4">
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        
        {pagination && totalPages > 0 && (
          <TableFooter {...footerProps}>
            <TableRow>
              <TableCell colSpan={columns.length}>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, data.length)} of {data.length} entries
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 rounded border disabled:opacity-50"
                    >
                      Previous
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageToShow = currentPage > 3 ? 
                        (i + currentPage - 2 <= totalPages ? i + currentPage - 2 : totalPages - 4 + i) : 
                        i + 1;
                      
                      if (pageToShow > 0 && pageToShow <= totalPages) {
                        return (
                          <button
                            key={pageToShow}
                            onClick={() => handlePageChange(pageToShow)}
                            className={`px-3 py-1 rounded border ${currentPage === pageToShow ? 'bg-primary text-primary-foreground' : ''}`}
                          >
                            {pageToShow}
                          </button>
                        );
                      }
                      return null;
                    })}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 rounded border disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </>
  );
};

export default List;