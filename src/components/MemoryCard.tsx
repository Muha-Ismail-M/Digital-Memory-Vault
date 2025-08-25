import React, { useState } from 'react'
import { formatDistanceToNow, format } from 'date-fns'
import { 
  Calendar, 
  Tag, 
  Play, 
  Pause, 
  Volume2, 
  FileText, 
  Edit3, 
  Trash2,
  MoreVertical,
  Download,
  Eye
} from 'lucide-react'
import { Memory } from '../lib/supabase'

interface MemoryCardProps {
  memory: Memory
  onEdit: (memory: Memory) => void
  onDelete: (id: string) => void
  onView: (memory: Memory) => void
}

export function MemoryCard({ memory, onEdit, onDelete, onView }: MemoryCardProps) {
  const [showActions, setShowActions] = useState(false)
  const [audioPlaying, setAudioPlaying] = useState(false)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return {
      relative: formatDistanceToNow(date, { addSuffix: true }),
      absolute: format(date, 'MMMM d, yyyy • h:mm a')
    }
  }

  const handleAudioToggle = (audio: HTMLAudioElement) => {
    if (audioPlaying) {
      audio.pause()
      setAudioPlaying(false)
    } else {
      audio.play()
      setAudioPlaying(true)
    }
  }

  const renderFilePreview = () => {
    if (!memory.file_url) return null

    switch (memory.file_type) {
      case 'image':
        return (
          <div 
            className="relative w-full h-64 rounded-xl overflow-hidden cursor-pointer group"
            onClick={() => onView(memory)}
          >
            <img
              src={memory.file_url}
              alt={memory.title || 'Memory'}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
              <Eye className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        )
      
      case 'video':
        return (
          <div className="relative w-full h-64 rounded-xl overflow-hidden bg-black">
            <video
              src={memory.file_url}
              className="w-full h-full object-cover"
              controls
              preload="metadata"
            />
          </div>
        )
      
      case 'audio':
        return (
          <div className="relative w-full p-6 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl">
            <div className="flex items-center justify-center space-x-4">
              <Volume2 className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              <div className="flex-1">
                <audio
                  src={memory.file_url}
                  className="w-full"
                  controls
                  onPlay={() => setAudioPlaying(true)}
                  onPause={() => setAudioPlaying(false)}
                  onEnded={() => setAudioPlaying(false)}
                />
              </div>
            </div>
            {memory.title && (
              <p className="mt-3 text-sm font-medium text-purple-800 dark:text-purple-200 text-center">
                {memory.title}
              </p>
            )}
          </div>
        )
      
      default:
        return (
          <div className="w-full p-6 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl">
            <div className="flex items-center justify-center space-x-3">
              <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <span className="text-blue-800 dark:text-blue-200 font-medium">Text Memory</span>
            </div>
          </div>
        )
    }
  }

  const dateInfo = formatDate(memory.created_at)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] overflow-hidden">
      {/* File Preview */}
      {renderFilePreview()}

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            {memory.title && (
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
                {memory.title}
              </h3>
            )}
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span title={dateInfo.absolute}>{dateInfo.relative}</span>
              </div>
            </div>
          </div>

          {/* Actions Menu */}
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <MoreVertical className="h-4 w-4 text-gray-500" />
            </button>

            {showActions && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowActions(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 z-20">
                  <div className="py-2">
                    <button
                      onClick={() => {
                        onView(memory)
                        setShowActions(false)
                      }}
                      className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => {
                        onEdit(memory)
                        setShowActions(false)
                      }}
                      className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                    >
                      <Edit3 className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                    {memory.file_url && (
                      <a
                        href={memory.file_url}
                        download={memory.file_name}
                        className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                        onClick={() => setShowActions(false)}
                      >
                        <Download className="h-4 w-4" />
                        <span>Download</span>
                      </a>
                    )}
                    <button
                      onClick={() => {
                        onDelete(memory.id)
                        setShowActions(false)
                      }}
                      className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        {memory.content && (
          <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
            {memory.content}
          </p>
        )}

        {/* Tags */}
        {memory.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {memory.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-medium rounded-full"
              >
                <Tag className="h-3 w-3" />
                <span>{tag}</span>
              </span>
            ))}
            {memory.tags.length > 3 && (
              <span className="inline-flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-medium rounded-full">
                +{memory.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}