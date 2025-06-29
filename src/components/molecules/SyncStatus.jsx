import StatusDot from '@/components/atoms/StatusDot'
import Badge from '@/components/atoms/Badge'
import { format } from 'date-fns'

const SyncStatus = ({ status, lastSync, conflictCount = 0, className = '' }) => {
  const getStatusText = () => {
    switch (status) {
      case 'synced': return 'Synced'
      case 'pending': return 'Syncing...'
      case 'error': return 'Error'
      case 'conflict': return 'Conflicts'
      default: return 'Unknown'
    }
  }
  
  const getStatusVariant = () => {
    switch (status) {
      case 'synced': return 'success'
      case 'pending': return 'warning'
      case 'error': return 'error'
      case 'conflict': return 'warning'
      default: return 'default'
    }
  }
  
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <StatusDot status={status} />
      <Badge variant={getStatusVariant()}>
        {getStatusText()}
      </Badge>
      {lastSync && (
        <span className="text-xs text-gray-500">
          {format(new Date(lastSync), 'MMM d, HH:mm')}
        </span>
      )}
      {conflictCount > 0 && (
        <Badge variant="warning" size="sm">
          {conflictCount} conflicts
        </Badge>
      )}
    </div>
  )
}

export default SyncStatus