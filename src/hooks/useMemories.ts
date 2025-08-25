import { useEffect, useState } from 'react'
import { supabase, type Memory } from '../lib/supabase'
import toast from 'react-hot-toast'

export function useMemories() {
  const [memories, setMemories] = useState<Memory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  useEffect(() => {
    fetchMemories()
  }, [searchQuery, selectedTags])

  const fetchMemories = async () => {

    setLoading(true)
    try {
      let query = supabase
        .from('memories')
        .select('*')
        .order('created_at', { ascending: false })

      // Apply search filter
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`)
      }

      // Apply tag filter
      if (selectedTags.length > 0) {
        query = query.overlaps('tags', selectedTags)
      }

      const { data, error } = await query

      if (error) throw error

      setMemories(data || [])
    } catch (error) {
      console.error('Error fetching memories:', error)
      toast.error('Failed to load memories')
    } finally {
      setLoading(false)
    }
  }

  const addMemory = async (memoryData: Partial<Memory>) => {

    try {
      const { data, error } = await supabase
        .from('memories')
        .insert([memoryData])
        .select()
        .single()

      if (error) throw error

      setMemories(prev => [data, ...prev])
      toast.success('Memory saved successfully!')
      return data
    } catch (error) {
      console.error('Error adding memory:', error)
      toast.error('Failed to save memory')
      throw error
    }
  }

  const updateMemory = async (id: string, updates: Partial<Memory>) => {
    try {
      const { data, error } = await supabase
        .from('memories')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      setMemories(prev =>
        prev.map(memory => (memory.id === id ? { ...memory, ...data } : memory))
      )
      toast.success('Memory updated successfully!')
      return data
    } catch (error) {
      console.error('Error updating memory:', error)
      toast.error('Failed to update memory')
      throw error
    }
  }

  const deleteMemory = async (id: string) => {
    try {
      const { error } = await supabase.from('memories').delete().eq('id', id)

      if (error) throw error

      setMemories(prev => prev.filter(memory => memory.id !== id))
      toast.success('Memory deleted successfully!')
    } catch (error) {
      console.error('Error deleting memory:', error)
      toast.error('Failed to delete memory')
      throw error
    }
  }

  const getAllTags = () => {
    const tagSet = new Set<string>()
    memories.forEach(memory => {
      memory.tags.forEach(tag => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
  }

  const getMemoriesOnThisDay = () => {
    const today = new Date()
    const todayString = `${today.getMonth() + 1}-${today.getDate()}`
    
    return memories.filter(memory => {
      const memoryDate = new Date(memory.created_at)
      const memoryString = `${memoryDate.getMonth() + 1}-${memoryDate.getDate()}`
      return memoryString === todayString && memoryDate.getFullYear() !== today.getFullYear()
    })
  }

  return {
    memories,
    loading,
    searchQuery,
    setSearchQuery,
    selectedTags,
    setSelectedTags,
    addMemory,
    updateMemory,
    deleteMemory,
    getAllTags,
    getMemoriesOnThisDay,
    refetch: fetchMemories,
  }
}