import { useState } from 'react'

export default function SearchFilter({ filters, onChange }) {
  const [searchText, setSearchText] = useState(filters.search || '')

  // only actually search when you press enter or click away
  function applySearch() {
    onChange({ ...filters, search: searchText })
  }

  function handleKey(e) {
    if (e.key === 'Enter') applySearch()
  }

  function clearAll() {
    setSearchText('')
    onChange({ search: '', status: '', priority: '' })
  }

  const hasFilters = filters.search || filters.status || filters.priority

  return (
    <div className="filters">
      <input
        type="text"
        placeholder="search tasks..."
        value={searchText}
        onChange={e => setSearchText(e.target.value)}
        onKeyDown={handleKey}
        onBlur={applySearch}
        className="search-input"
      />

      <select
        value={filters.status}
        onChange={e => onChange({ ...filters, status: e.target.value })}
        className="filter-select"
      >
        <option value="">all statuses</option>
        <option value="pending">pending</option>
        <option value="completed">completed</option>
      </select>

      <select
        value={filters.priority}
        onChange={e => onChange({ ...filters, priority: e.target.value })}
        className="filter-select"
      >
        <option value="">all priorities</option>
        <option value="high">high</option>
        <option value="medium">medium</option>
        <option value="low">low</option>
      </select>

      {hasFilters && (
        <button className="btn" onClick={clearAll}>clear</button>
      )}
    </div>
  )
}
