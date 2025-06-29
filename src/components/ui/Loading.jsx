import { motion } from 'framer-motion'

const Loading = ({ className = '', size = 'default' }) => {
  const sizes = {
    sm: 'space-y-3',
    default: 'space-y-4',
    lg: 'space-y-6'
  }
  
  const skeletonVariants = {
    loading: {
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }
  
  return (
    <div className={`animate-pulse ${className}`}>
      <div className={`${sizes[size]}`}>
        {/* Header skeleton */}
        <div className="space-y-2">
          <motion.div 
            variants={skeletonVariants}
            animate="loading"
            className="h-8 bg-gray-200 rounded w-1/4"
          />
          <motion.div 
            variants={skeletonVariants}
            animate="loading"
            className="h-4 bg-gray-200 rounded w-1/2"
          />
        </div>
        
        {/* Content skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              variants={skeletonVariants}
              animate="loading"
              className="card p-6"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-8 bg-gray-200 rounded w-1/2" />
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded" />
                  <div className="h-3 bg-gray-200 rounded w-5/6" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Table skeleton */}
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <motion.div 
              variants={skeletonVariants}
              animate="loading"
              className="h-6 bg-gray-200 rounded w-1/3"
            />
          </div>
          <div className="divide-y divide-gray-200">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                variants={skeletonVariants}
                animate="loading"
                className="p-4 flex items-center space-x-4"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="w-4 h-4 bg-gray-200 rounded" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                </div>
                <div className="h-6 bg-gray-200 rounded w-16" />
                <div className="h-4 bg-gray-200 rounded w-12" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Loading