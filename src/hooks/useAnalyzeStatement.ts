import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useUsageTracking } from './useUsageTracking'

export const useAnalyzeStatement = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const analyzeStatement = async (content: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const { data: session } = await supabase.auth.getSession()
      if (!session.session) throw new Error('No authenticated session')

      const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-statement`
      
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.session.access_token}`,
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
        },
        body: JSON.stringify({ content })
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (!data || !data.analysis) {
        throw new Error("Invalid response format from the function")
      }
      
      return data.analysis
    } catch (err) {
      console.error('Analysis error:', err)
      setError(err instanceof Error ? err : new Error('Failed to analyze statement'))
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    analyzeStatement,
    isLoading,
    error
  }
}