import React from 'react'
import { format } from 'date-fns'
import { X, Download, Calendar, Tag, FileText, Volume2 } from 'lucide-react'
import { Memory } from '../lib/supabase'

interface MemoryViewerProps {
  memory: Memory | null
  isOpen: boolean
  onClose: () => void
}

export function MemoryViewer({ memory, isOpen, onClose }: MemoryViewerProps) {
  if (!isOpen || !memory) return null

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'EEEE, MMMM d, yyyy • h:mm a')
  }

  const renderFileContent = () => {
    if (!memory.file_url) return null

    switch (memory.file_type) {
      case 'image':
        return (
          <div className="max-w-full max-h-[70vh] overflow-auto">
            <img
              src={memory.file_url}
              alt={memory.title || 'Memory'}
              className="w-full h-auto rounded-xl shadow-lg"
            />
          </div>
        )

      case 'video':
        return (
          <div className="max-w-full max-h-[70vh]">
            <video
              src={memory.file_url}
              controls
              className="w-full h-auto rounded-xl shadow-lg"
              style={{ maxHeight: '70vh' }}
            />
          </div>
        )

      case 'audio':
        return (
          <div className="w-full p-8 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <Volume2 className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200">
                Audio Memory
              </h3>
            </div>
            <audio
              src={memory.file_url}
              controls
              className="w-full"
            />
          </div>
        )

      default:
        return (
          <div className="w-full p-8 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl">
            <div className="flex items-center justify-center space-x-4">
              <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">
                Text Memory
              </h3>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex-1">
            {memory.title && (
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {memory.title}
              </h2>
            )}
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(memory.created_at)}</span>
              </div>
              {memory.file_name && (
                <span className="truncate max-w-xs">{memory.file_name}</span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {memory.file_url && (
              <a
                href={memory.file_url}
                download={memory.file_name}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors duration-200"
                title="Download"
              >
                <Download className="h-5 w-5 text-gray-500" />
              </a>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors duration-200"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* File Content */}
          {renderFileContent()}

          {/* Description */}
          {memory.content && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Description
              </h3>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                {memory.content}
              </p>
            </div>
          )}

          {/* Tags */}
          {memory.tags.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {memory.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm font-medium rounded-full"
                  >
                    <Tag className="h-3 w-3" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          {memory.metadata && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Details
              </h3>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                <dl className="space-y-2">
                  {memory.file_size && (
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500 dark:text-gray-400">File Size:</dt>
                      <dd className="text-sm font-medium text-gray-900 dark:text-white">
                        {(memory.file_size / (1024 * 1024)).toFixed(2)} MB
                      </dd>
                    </div>
                  )}
                  {memory.metadata.dimensions && (
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500 dark:text-gray-400">Dimensions:</dt>
                      <dd className="text-sm font-medium text-gray-900 dark:text-white">
                        {memory.metadata.dimensions.width} × {memory.metadata.dimensions.height}
                      </dd>
                    </div>
                  )}
                  {memory.metadata.location && (
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500 dark:text-gray-400">Location:</dt>
                      <dd className="text-sm font-medium text-gray-900 dark:text-white">
                        {memory.metadata.location}
                      </dd>
                    </div>
                  )}
                  {memory.metadata.date_taken && (
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500 dark:text-gray-400">Date Taken:</dt>
                      <dd className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatDate(memory.metadata.date_taken)}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}