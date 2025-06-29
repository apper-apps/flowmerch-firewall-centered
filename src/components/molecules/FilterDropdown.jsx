import { useState } from 'react'
import ApperIcon from '@/components/ApperIcon'

const FilterDropdown = ({ 
  options = [], 
  value, 
  onChange, 
  placeholder = 'Filter',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false)
  
  const handleSelect = (option) => {
    onChange(option.value)
    setIsOpen(false)
  }
  
  const selectedOption = options.find(opt => opt.value === value)
  
  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        className="form-field w-full flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ApperIcon name="ChevronDown" className="h-4 w-4 text-gray-400" />
      </button>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default FilterDropdown