import { useState } from 'react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'
import { v4 as uuidv4 } from 'uuid'

interface UploadProgress {
  [key: string]: number
}

export function useFileUpload() {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({})

  const uploadFile = async (file: File): Promise<string> => {

    const fileExt = file.name.split('.').pop()
    const fileName = `${uuidv4()}.${fileExt}`
    const filePath = `public/${fileName}`

    const { data, error } = await supabase.storage
      .from('memories')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) throw error

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('memories')
      .getPublicUrl(filePath)

    return urlData.publicUrl
  }

  const uploadFiles = async (
    files: File[],
    onProgress?: (progress: number) => void
  ): Promise<Array<{ file: File; url: string; type: string }>> => {

    setUploading(true)
    const results: Array<{ file: File; url: string; type: string }> = []

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const fileId = `${file.name}-${Date.now()}`

        // Update progress for this specific file
        setUploadProgress(prev => ({ ...prev, [fileId]: 0 }))

        try {
          const url = await uploadFile(file)
          const fileType = getFileType(file)

          results.push({ file, url, type: fileType })

          // Update progress
          setUploadProgress(prev => ({ ...prev, [fileId]: 100 }))

          // Update overall progress
          if (onProgress) {
            onProgress(((i + 1) / files.length) * 100)
          }
        } catch (error) {
          console.error(`Error uploading ${file.name}:`, error)
          toast.error(`Failed to upload ${file.name}`)
          // Remove from progress tracking
          setUploadProgress(prev => {
            const newProgress = { ...prev }
            delete newProgress[fileId]
            return newProgress
          })
        }
      }
    } finally {
      setUploading(false)
      setUploadProgress({})
    }

    return results
  }

  const getFileType = (file: File): string => {
    const type = file.type.split('/')[0]
    switch (type) {
      case 'image':
        return 'image'
      case 'video':
        return 'video'
      case 'audio':
        return 'audio'
      default:
        return 'text'
    }
  }

  const deleteFile = async (url: string) => {

    try {
      // Extract file path from URL
      const urlParts = url.split('/')
      const fileName = urlParts[urlParts.length - 1]
      const filePath = `public/${fileName}`

      const { error } = await supabase.storage.from('memories').remove([filePath])

      if (error) throw error
    } catch (error) {
      console.error('Error deleting file:', error)
      toast.error('Failed to delete file')
      throw error
    }
  }

  return {
    uploading,
    uploadProgress,
    uploadFile,
    uploadFiles,
    deleteFile,
    getFileType,
  }
}