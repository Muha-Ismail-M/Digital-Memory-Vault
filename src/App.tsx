import React, { useState, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { Navbar } from './components/Navbar'
import { Timeline } from './components/Timeline'
import { UploadModal } from './components/UploadModal'
import { MemoryViewer } from './components/MemoryViewer'
import { useMemories } from './hooks/useMemories'
import { Memory } from './lib/supabase'

function App() {
  const {
    memories,
    loading: memoriesLoading,
    searchQuery,
    setSearchQuery,
    updateMemory,
    deleteMemory,
    getMemoriesOnThisDay,
  } = useMemories()

  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    const initialTheme = savedTheme || systemTheme
    setTheme(initialTheme)
    document.documentElement.classList.toggle('dark', initialTheme === 'dark')
  }, [])

  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  const handleEditMemory = async (memory: Memory) => {
    // For now, just show the memory viewer
    setSelectedMemory(memory)
  }

  const handleDeleteMemory = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this memory?')) {
      await deleteMemory(id)
    }
  }

  const handleViewMemory = (memory: Memory) => {
    setSelectedMemory(memory)
  }

  const onThisDayMemories = getMemoriesOnThisDay()

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 ${theme}`}>
      <Navbar
        onSearchChange={setSearchQuery}
        onUploadClick={() => setShowUploadModal(true)}
        onSettingsClick={() => setShowSettingsModal(true)}
        theme={theme}
        onThemeToggle={handleThemeToggle}
      />

      <main className="pb-8">
        {/* On This Day Section */}
        {onThisDayMemories.length > 0 && !searchQuery && (
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white mb-8">
              <h2 className="text-2xl font-bold mb-2">On This Day</h2>
              <p className="opacity-90 mb-4">
                {onThisDayMemories.length} memory{onThisDayMemories.length !== 1 ? 'es' : ''} from previous years
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {onThisDayMemories.slice(0, 3).map(memory => (
                  <div
                    key={memory.id}
                    onClick={() => handleViewMemory(memory)}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 cursor-pointer hover:bg-white/20 transition-colors duration-200"
                  >
                    <p className="text-sm opacity-75 mb-1">
                      {new Date(memory.created_at).getFullYear()}
                    </p>
                    <p className="font-medium truncate">
                      {memory.title || memory.file_name || 'Untitled Memory'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main Timeline */}
        <Timeline
          memories={memories}
          loading={memoriesLoading}
          onEditMemory={handleEditMemory}
          onDeleteMemory={handleDeleteMemory}
          onViewMemory={handleViewMemory}
        />
      </main>

      {/* Modals */}
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
      />

      <MemoryViewer
        memory={selectedMemory}
        isOpen={!!selectedMemory}
        onClose={() => setSelectedMemory(null)}
      />

      <Toaster
        position="top-right"
        toastOptions={{
          className: 'dark:bg-gray-800 dark:text-white',
          duration: 4000,
        }}
      />
    </div>
  )
}

export default App