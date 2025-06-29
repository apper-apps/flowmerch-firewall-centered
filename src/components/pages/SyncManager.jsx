import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Products from "@/components/pages/Products";
import StatusDot from "@/components/atoms/StatusDot";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import * as syncService from "@/services/api/syncService";

const SyncManager = () => {
  const [conflicts, setConflicts] = useState([])
  const [syncHistory, setSyncHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [resolving, setResolving] = useState({})
  
  useEffect(() => {
    loadSyncData()
  }, [])
  
  const loadSyncData = async () => {
    try {
      setLoading(true)
      setError('')
      const [conflictsData, historyData] = await Promise.all([
        syncService.getConflicts(),
        syncService.getSyncHistory()
      ])
      setConflicts(conflictsData)
      setSyncHistory(historyData)
    } catch (err) {
      setError('Failed to load sync data. Please try again.')
      console.error('Sync data error:', err)
    } finally {
      setLoading(false)
    }
  }
  
  const resolveConflict = async (conflictId, resolution) => {
    try {
      setResolving(prev => ({ ...prev, [conflictId]: true }))
      await syncService.resolveConflict(conflictId, resolution)
      toast.success('Conflict resolved successfully')
      await loadSyncData()
    } catch (err) {
      toast.error('Failed to resolve conflict')
      console.error('Resolve conflict error:', err)
    } finally {
      setResolving(prev => ({ ...prev, [conflictId]: false }))
    }
  }
  
  const triggerFullSync = async () => {
    try {
      setLoading(true)
      await syncService.triggerFullSync()
      toast.success('Full sync initiated')
      await loadSyncData()
    } catch (err) {
      toast.error('Failed to start sync')
      console.error('Full sync error:', err)
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadSyncData} />
  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sync Manager</h1>
          <p className="text-gray-600">Manage product synchronization and resolve conflicts</p>
        </div>
        <Button onClick={triggerFullSync}>
          <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
          Full Sync
        </Button>
      </div>
      
      {/* Sync Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mr-4">
              <ApperIcon name="CheckCircle" className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">1,247</p>
              <p className="text-sm text-gray-600">Products Synced</p>
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center mr-4">
              <ApperIcon name="AlertTriangle" className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{conflicts.length}</p>
              <p className="text-sm text-gray-600">Pending Conflicts</p>
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
              <ApperIcon name="Clock" className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">2m 34s</p>
              <p className="text-sm text-gray-600">Last Sync Duration</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Conflicts Section */}
      <div className="card">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Sync Conflicts</h2>
          <p className="text-sm text-gray-600">Resolve conflicts between local and remote data</p>
        </div>
        
        <div className="divide-y divide-gray-200">
          {conflicts.length === 0 ? (
            <Empty 
              message="No sync conflicts" 
              description="All your products are in sync!"
              icon="CheckCircle"
            />
          ) : (
            conflicts.map((conflict, index) => (
              <motion.div
                key={conflict.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
<h3 className="text-lg font-medium text-gray-900">
                        {conflict.product_name}
                      </h3>
                      <Badge variant="warning">Conflict</Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">Local Value</h4>
                        <p className="text-blue-800">
                          <span className="font-medium">{conflict.field}:</span> {conflict.local_value}
                        </p>
                        <p className="text-sm text-blue-600 mt-2">
                          Last updated: {format(new Date(conflict.local_timestamp), 'MMM d, HH:mm')}
                        </p>
                      </div>
                      
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-medium text-green-900 mb-2">Remote Value</h4>
                        <p className="text-green-800">
                          <span className="font-medium">{conflict.field}:</span> {conflict.remote_value}
                        </p>
                        <p className="text-sm text-green-600 mt-2">
                          Last updated: {format(new Date(conflict.remote_timestamp), 'MMM d, HH:mm')}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2 ml-6">
                    <Button
                      size="sm"
                      onClick={() => resolveConflict(conflict.Id, 'local')}
                      loading={resolving[conflict.Id]}
                      disabled={resolving[conflict.Id]}
                    >
                      Use Local
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => resolveConflict(conflict.Id, 'remote')}
                      loading={resolving[conflict.Id]}
                      disabled={resolving[conflict.Id]}
                    >
                      Use Remote
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
      
      {/* Sync History */}
      <div className="card">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Sync History</h2>
          <p className="text-sm text-gray-600">Recent synchronization operations</p>
        </div>
        
        <div className="divide-y divide-gray-200">
{syncHistory.map((sync, index) => (
            <motion.div
              key={sync.Id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-6 flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <StatusDot status={sync.status} />
                <div>
                  <p className="font-medium text-gray-900">{sync.operation}</p>
                  <p className="text-sm text-gray-600">{sync.description}</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {sync.products_affected} products
                </p>
                <p className="text-sm text-gray-500">
                  {format(new Date(sync.timestamp), 'MMM d, HH:mm')}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SyncManager