'use client'
import React, { useState, useEffect } from 'react'
import { 
  Globe, 
  RefreshCw, 
  Clock, 
  Check, 
  XCircle, 
  AlertTriangle,
  BarChart3,
  Settings,
  Play,
  Pause,
  Trash2,
  Download,
  Upload,
  Filter,
  Search
} from 'lucide-react'
import AuthGuard from '@/components/AuthGuard'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { useTranslationService } from '@/lib/translationService'
import toast from 'react-hot-toast'

interface TranslationJob {
  id: string
  content_type: 'recipe' | 'newsletter' | 'category' | 'tag'
  content_id: string
  target_language: string
  priority: 'low' | 'normal' | 'high' | 'urgent'
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
  error_message: string | null
  retry_count: number
  max_retries: number
  created_at: string
  updated_at: string
  processed_at: string | null
}

interface TranslationStats {
  total: number
  pending: number
  processing: number
  completed: number
  failed: number
  cancelled: number
}

export default function TranslationManagementPage() {
  const { user } = useAuth()
  const { getLanguageName, supportedLanguages } = useTranslationService()
  const [jobs, setJobs] = useState<TranslationJob[]>([])
  const [stats, setStats] = useState<TranslationStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('all')
  const [isProcessing, setIsProcessing] = useState(false)

  // Check if user is admin
  const isAdmin = user?.role === 'admin'

  useEffect(() => {
    if (isAdmin) {
      fetchTranslationJobs()
      fetchTranslationStats()
    }
  }, [isAdmin])

  const fetchTranslationJobs = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('translation_jobs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)

      if (error) throw error
      setJobs(data || [])
    } catch (error) {
      console.error('Error fetching translation jobs:', error)
      toast.error('Failed to fetch translation jobs')
    } finally {
      setLoading(false)
    }
  }

  const fetchTranslationStats = async () => {
    try {
      const { data, error } = await supabase
        .from('translation_jobs')
        .select('status')

      if (error) throw error

      const stats: TranslationStats = {
        total: data?.length || 0,
        pending: data?.filter(job => job.status === 'pending').length || 0,
        processing: data?.filter(job => job.status === 'processing').length || 0,
        completed: data?.filter(job => job.status === 'completed').length || 0,
        failed: data?.filter(job => job.status === 'failed').length || 0,
        cancelled: data?.filter(job => job.status === 'cancelled').length || 0
      }

      setStats(stats)
    } catch (error) {
      console.error('Error fetching translation stats:', error)
    }
  }

  const processTranslationJob = async (jobId: string) => {
    setIsProcessing(true)
    try {
      const response = await fetch('/api/translate/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobId }),
      })

      if (!response.ok) {
        throw new Error('Failed to process translation job')
      }

      toast.success('Translation job processed successfully')
      fetchTranslationJobs()
      fetchTranslationStats()
    } catch (error) {
      console.error('Error processing translation job:', error)
      toast.error('Failed to process translation job')
    } finally {
      setIsProcessing(false)
    }
  }

  const retryFailedJob = async (jobId: string) => {
    try {
      const { error } = await supabase
        .from('translation_jobs')
        .update({
          status: 'pending',
          retry_count: 0,
          error_message: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', jobId)

      if (error) throw error

      toast.success('Job queued for retry')
      fetchTranslationJobs()
      fetchTranslationStats()
    } catch (error) {
      console.error('Error retrying job:', error)
      toast.error('Failed to retry job')
    }
  }

  const cancelJob = async (jobId: string) => {
    try {
      const { error } = await supabase
        .from('translation_jobs')
        .update({
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', jobId)

      if (error) throw error

      toast.success('Job cancelled')
      fetchTranslationJobs()
      fetchTranslationStats()
    } catch (error) {
      console.error('Error cancelling job:', error)
      toast.error('Failed to cancel job')
    }
  }

  const deleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this translation job?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('translation_jobs')
        .delete()
        .eq('id', jobId)

      if (error) throw error

      toast.success('Job deleted')
      fetchTranslationJobs()
      fetchTranslationStats()
    } catch (error) {
      console.error('Error deleting job:', error)
      toast.error('Failed to delete job')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'processing':
        return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />
      case 'completed':
        return <Check className="h-4 w-4 text-green-600" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'cancelled':
        return <AlertTriangle className="h-4 w-4 text-gray-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'normal':
        return 'bg-blue-100 text-blue-800'
      case 'low':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredJobs = jobs.filter(job => {
    const matchesFilter = filter === 'all' || job.status === filter
    const matchesSearch = searchTerm === '' || 
      job.content_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.content_type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLanguage = selectedLanguage === 'all' || job.target_language === selectedLanguage
    
    return matchesFilter && matchesSearch && matchesLanguage
  })

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You need administrator privileges to access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Translation Management</h1>
          <p className="text-gray-600">Monitor and manage translation jobs across the platform</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Total Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center">
                <RefreshCw className="h-8 w-8 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Processing</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.processing}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center">
                <Check className="h-8 w-8 text-green-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center">
                <XCircle className="h-8 w-8 text-red-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Failed</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.failed}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-gray-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Cancelled</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.cancelled}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg p-4 shadow-sm border mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Languages</option>
                {supportedLanguages.map(lang => (
                  <option key={lang} value={lang}>{getLanguageName(lang)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilter('all')
                  setSearchTerm('')
                  setSelectedLanguage('all')
                }}
                className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Jobs Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Translation Jobs</h2>
              <button
                onClick={fetchTranslationJobs}
                disabled={loading}
                className="flex items-center space-x-2 px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
              <span className="ml-2 text-gray-600">Loading translation jobs...</span>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-12">
              <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No translation jobs found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Content
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Language
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 capitalize">
                            {job.content_type}
                          </div>
                          <div className="text-sm text-gray-500">
                            {job.content_id.substring(0, 8)}...
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {getLanguageName(job.target_language)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(job.status)}
                          <span className="ml-2 text-sm text-gray-900 capitalize">
                            {job.status}
                          </span>
                        </div>
                        {job.error_message && (
                          <div className="text-xs text-red-600 mt-1">
                            {job.error_message}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(job.priority)}`}>
                          {job.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(job.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {job.status === 'pending' && (
                            <button
                              onClick={() => processTranslationJob(job.id)}
                              disabled={isProcessing}
                              className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                              title="Process Job"
                            >
                              <Play className="h-4 w-4" />
                            </button>
                          )}
                          {job.status === 'failed' && (
                            <button
                              onClick={() => retryFailedJob(job.id)}
                              className="text-green-600 hover:text-green-900"
                              title="Retry Job"
                            >
                              <RefreshCw className="h-4 w-4" />
                            </button>
                          )}
                          {(job.status === 'pending' || job.status === 'processing') && (
                            <button
                              onClick={() => cancelJob(job.id)}
                              className="text-orange-600 hover:text-orange-900"
                              title="Cancel Job"
                            >
                              <Pause className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteJob(job.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete Job"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 