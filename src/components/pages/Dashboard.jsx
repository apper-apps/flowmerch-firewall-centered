import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import StatsCard from '@/components/molecules/StatsCard'
import SyncStatus from '@/components/molecules/SyncStatus'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import * as dashboardService from '@/services/api/dashboardService'

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  useEffect(() => {
    loadDashboardData()
  }, [])
  
  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError('')
      const [statsData, activityData] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getRecentActivity()
      ])
      setStats(statsData)
      setRecentActivity(activityData)
    } catch (err) {
      setError('Failed to load dashboard data. Please try again.')
      console.error('Dashboard error:', err)
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadDashboardData} />
  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Monitor your store's product sync and performance</p>
        </div>
        <Button>
          <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
          Sync All
        </Button>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Products"
          value={stats?.totalProducts?.toLocaleString() || '0'}
          change="+12%"
          changeType="positive"
          icon="Package"
        />
        <StatsCard
          title="Synced Today"
          value={stats?.syncedToday?.toLocaleString() || '0'}
          change="+8%"
          changeType="positive"
          icon="RefreshCw"
        />
        <StatsCard
          title="Pending Conflicts"
          value={stats?.pendingConflicts?.toLocaleString() || '0'}
          change="-3%"
          changeType="positive"
          icon="AlertTriangle"
        />
        <StatsCard
          title="Revenue Impact"
          value={`$${stats?.revenueImpact?.toLocaleString() || '0'}`}
          change="+15%"
          changeType="positive"
          icon="DollarSign"
        />
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sync Status Overview */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Sync Status Overview</h2>
              <Button variant="secondary" size="sm">
                <ApperIcon name="Settings" className="h-4 w-4 mr-2" />
                Configure
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-success/5 rounded-lg border border-success/20">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center mr-4">
                    <ApperIcon name="CheckCircle" className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Shopify Sync</h3>
                    <p className="text-sm text-gray-600">Last sync: 2 minutes ago</p>
                  </div>
                </div>
                <SyncStatus status="synced" lastSync={new Date()} />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-warning/5 rounded-lg border border-warning/20">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center mr-4">
                    <ApperIcon name="Clock" className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Google Sheets</h3>
                    <p className="text-sm text-gray-600">Syncing in progress</p>
                  </div>
                </div>
                <SyncStatus status="pending" />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-info/5 rounded-lg border border-info/20">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-info/10 rounded-lg flex items-center justify-center mr-4">
                    <ApperIcon name="Camera" className="h-5 w-5 text-info" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Image Scraping</h3>
                    <p className="text-sm text-gray-600">Processing 24 images</p>
                  </div>
                </div>
                <SyncStatus status="pending" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={activity.Id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-3"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activity.type === 'sync' ? 'bg-primary/10' :
                  activity.type === 'conflict' ? 'bg-warning/10' :
                  activity.type === 'error' ? 'bg-error/10' : 'bg-success/10'
                }`}>
                  <ApperIcon 
                    name={
                      activity.type === 'sync' ? 'RefreshCw' :
                      activity.type === 'conflict' ? 'AlertTriangle' :
                      activity.type === 'error' ? 'X' : 'Check'
                    } 
                    className={`h-4 w-4 ${
                      activity.type === 'sync' ? 'text-primary' :
                      activity.type === 'conflict' ? 'text-warning' :
                      activity.type === 'error' ? 'text-error' : 'text-success'
                    }`} 
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.title}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {activity.timestamp}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button variant="secondary" className="flex items-center justify-center p-4 h-auto">
            <div className="text-center">
              <ApperIcon name="Upload" className="h-6 w-6 mx-auto mb-2" />
              <div className="text-sm font-medium">Import CSV</div>
              <div className="text-xs text-gray-500">Bulk product import</div>
            </div>
          </Button>
          <Button variant="secondary" className="flex items-center justify-center p-4 h-auto">
            <div className="text-center">
              <ApperIcon name="FileText" className="h-6 w-6 mx-auto mb-2" />
              <div className="text-sm font-medium">Edit Descriptions</div>
              <div className="text-xs text-gray-500">Bulk description editor</div>
            </div>
          </Button>
          <Button variant="secondary" className="flex items-center justify-center p-4 h-auto">
            <div className="text-center">
              <ApperIcon name="Zap" className="h-6 w-6 mx-auto mb-2" />
              <div className="text-sm font-medium">Create Widget</div>
              <div className="text-xs text-gray-500">Add dynamic elements</div>
            </div>
          </Button>
          <Button variant="secondary" className="flex items-center justify-center p-4 h-auto">
            <div className="text-center">
              <ApperIcon name="Layers" className="h-6 w-6 mx-auto mb-2" />
              <div className="text-sm font-medium">Build Bundle</div>
              <div className="text-xs text-gray-500">Create product bundles</div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard