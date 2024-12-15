import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

export const useUsageTracking = () => {
  const [usageCount, setUsageCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { toast } = useToast()

  const fetchUsageCount = async () => {
    try {
      const { data: session } = await supabase.auth.getSession()
      if (!session.session?.user) return

      // First try to get existing record
      let { data, error } = await supabase
        .from('usage_tracking')
        .select('usage_count')
        .eq('user_id', session.session.user.id)
        .maybeSingle()

      // If no record exists, create one
      if (!data && !error) {
        const { data: newData, error: insertError } = await supabase
          .from('usage_tracking')
          .insert({ 
            user_id: session.session.user.id,
            usage_count: 0 
          })
          .select('usage_count')
          .single()

        if (insertError) throw insertError
        data = newData
      } else if (error) {
        throw error
      }

      setUsageCount(data?.usage_count || 0)
    } catch (err) {
      console.error('Error fetching usage count:', err)
      setError(err instanceof Error ? err : new Error('Failed to fetch usage count'))
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch usage count. Please try refreshing the page.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsageCount()
  }, [toast])

  return {
    usageCount,
    isLoading,
    error,
    fetchUsageCount // Expose the fetch function
  }
}