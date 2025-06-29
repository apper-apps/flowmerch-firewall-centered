import { useState } from 'react'
import ApperIcon from '@/components/ApperIcon'

const SearchBar = ({ 
  placeholder = 'Search...', 
  onSearch, 
  className = '',
  value = '',
  onChange
}) => {
  const [searchTerm, setSearchTerm] = useState(value)
  
  const handleSearch = (e) => {
    const term = e.target.value
    setSearchTerm(term)
    if (onChange) {
      onChange(term)
    }
    if (onSearch) {
      onSearch(term)
    }
  }
  
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <ApperIcon name="Search" className="h-4 w-4 text-gray-400" />
      </div>
      <input
        type="text"
        className="form-field pl-10 w-full"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleSearch}
      />
    </div>
  )
}

export default SearchBar