const StatusDot = ({ status, className = '', ...props }) => {
  const colors = {
    synced: 'bg-success',
    pending: 'bg-warning',
    error: 'bg-error',
    conflict: 'bg-warning',
    offline: 'bg-gray-400',
    active: 'bg-success',
    inactive: 'bg-gray-400'
  }
  
  return (
    <div 
      className={`status-dot ${colors[status] || 'bg-gray-400'} ${className}`}
      {...props}
    />
  )
}

export default StatusDot