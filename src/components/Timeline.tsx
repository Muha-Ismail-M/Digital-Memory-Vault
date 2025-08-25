import React, { useMemo } from 'react'
import { format, isToday, isYesterday, isThisYear } from 'date-fns'
import { Memory } from '../lib/supabase'
import { MemoryCard } from './MemoryCard'
import { Calendar, Clock } from 'lucide-react'

interface TimelineProps {
  memories: Memory[]
  loading: boolean
  onEditMemory: (memory: Memory) => void
  onDeleteMemory: (id: string) => void
  onViewMemory: (memory: Memory) => void
}

interface GroupedMemories {
  [key: string]: Memory[]
}

export function Timeline({ 
  memories, 
  loading, 
  onEditMemory, 
  onDeleteMemory, 
  onViewMemory 
}: TimelineProps) {
  const groupedMemories = useMemo(() => {
    const grouped: GroupedMemories = {}

    memories.forEach(memory => {
      const date = new Date(memory.created_at)
      
      // Create a key for grouping (YYYY-MM-DD)
      const dateKey = format(date, 'yyyy-MM-dd')
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = []
      }
      grouped[dateKey].push(memory)
    })

    return grouped
  }, [memories])

  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString)
    
    if (isToday(date)) {
      return 'Today'
    } else if (isYesterday(date)) {
      return 'Yesterday'
    } else if (isThisYear(date)) {
      return format(date, 'EEEE, MMMM d')
    } else {
      return format(date, 'EEEE, MMMM d, yyyy')
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(2)].map((_, j) => (
                  <div key={j} className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-80 animate-pulse" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (memories.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center">
          <div className="p-6 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <Calendar className="h-12 w-12 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No memories yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Start building your digital memory vault by uploading your first photo, video, or note.
          </p>
        </div>
      </div>
    )
  }

  const sortedDateKeys = Object.keys(groupedMemories).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="space-y-12">
        {sortedDateKeys.map(dateKey => (
          <div key={dateKey} className="space-y-6">
            {/* Date Header */}
            <div className="flex items-center space-x-3 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatDateHeader(dateKey)}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {groupedMemories[dateKey].length} memory{groupedMemories[dateKey].length !== 1 ? 'es' : ''}
                </p>
              </div>
            </div>

            {/* Memories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupedMemories[dateKey].map(memory => (
                <MemoryCard
                  key={memory.id}
                  memory={memory}
                  onEdit={onEditMemory}
                  onDelete={onDeleteMemory}
                  onView={onViewMemory}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button (for future implementation) */}
      {memories.length > 50 && (
        <div className="text-center py-8">
          <button className="px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl transition-colors duration-200">
            Load More Memories
          </button>
        </div>
      )}
    </div>
  )
}