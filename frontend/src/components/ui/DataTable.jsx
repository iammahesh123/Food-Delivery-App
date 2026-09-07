import React, { useState } from 'react';
import { ArrowUpDown, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import Button from './Button';
import './DataTable.css';

const DataTable = ({
  columns,
  data = [],
  keyField = 'id',
  selectable = false,
  selectedRows = [],
  onSelectRow,
  onSelectAll,
  bulkActions = [],
  searchPlaceholder = 'Search records...',
  pageSize = 10,
  emptyMessage = 'No records found.',
  className = '',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' | 'desc'
  const [currentPage, setCurrentPage] = useState(1);

  // Client Filtering
  const filteredData = data.filter((item) => {
    if (!searchTerm) return true;
    return Object.values(item).some(
      (val) => val && String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Sorting
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = a[sortField];
    const bVal = b[sortField];
    if (aVal === bVal) return 0;
    if (aVal == null) return 1;
    if (bVal == null) return -1;
    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const isAllSelected =
    paginatedData.length > 0 &&
    paginatedData.every((item) => selectedRows.includes(item[keyField]));

  return (
    <div className={`datatable-container ${className}`}>
      {/* Table Header Bar */}
      <div className="datatable-toolbar">
        <div className="datatable-search">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={searchPlaceholder}
            className="search-input"
          />
        </div>
        {selectedRows.length > 0 && bulkActions.length > 0 && (
          <div className="datatable-bulk-bar">
            <span className="selected-count">{selectedRows.length} selected</span>
            <div className="bulk-actions">
              {bulkActions.map((action, idx) => (
                <Button
                  key={idx}
                  size="sm"
                  variant={action.variant || 'secondary'}
                  onClick={() => action.onClick(selectedRows)}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Semantic Table */}
      <div className="table-responsive-wrapper">
        <table className="enterprise-table">
          <thead>
            <tr>
              {selectable && (
                <th className="select-col">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={(e) => onSelectAll && onSelectAll(e.target.checked, paginatedData)}
                    aria-label="Select all rows"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={`${col.sortable ? 'sortable-col' : ''} ${col.align ? `align-${col.align}` : ''}`}
                  style={{ width: col.width }}
                >
                  <div className="th-content">
                    <span>{col.title}</span>
                    {col.sortable && <ArrowUpDown size={14} className="sort-icon" />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row) => {
                const isSelected = selectedRows.includes(row[keyField]);
                return (
                  <tr key={row[keyField]} className={isSelected ? 'row-selected' : ''}>
                    {selectable && (
                      <td className="select-col">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onSelectRow && onSelectRow(row[keyField])}
                          aria-label={`Select row ${row[keyField]}`}
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={col.align ? `align-${col.align}` : ''}
                      >
                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="table-empty-cell"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="datatable-footer">
        <span className="footer-record-count">
          Showing {sortedData.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{' '}
          {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} entries
        </span>
        <div className="pagination-controls">
          <Button
            size="sm"
            variant="ghost"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            aria-label="Previous Page"
          >
            <ChevronLeft size={16} />
          </Button>
          <span className="page-indicator">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            size="sm"
            variant="ghost"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            aria-label="Next Page"
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
