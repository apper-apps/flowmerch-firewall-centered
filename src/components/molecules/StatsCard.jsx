import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const StatsCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'positive',
  icon,
  className = ''
}) => {
  const changeColor = changeType === 'positive' ? 'text-success' : 'text-error'
  const changeIcon = changeType === 'positive' ? 'TrendingUp' : 'TrendingDown'
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`card p-6 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 ${changeColor}`}>
              <ApperIcon name={changeIcon} className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">{change}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="p-3 bg-primary/10 rounded-lg">
            <ApperIcon name={icon} className="h-6 w-6 text-primary" />
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default StatsCard