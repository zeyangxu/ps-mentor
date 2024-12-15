import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

export const useUsageTracking = () => {
  const [usageCount, setUsageCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchUsageCount = async () => {
      try {
        const { data: session } = await supabase.auth.getSession()
        if (!session.session?.user) return

        const { data, error } = await supabase
          .from('usage_tracking')
          .select('usage_count')
          .eq('user_id', session.session.user.id)
          .single()

        if (error) throw error

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

    fetchUsageCount()
  }, [toast])

  return {
    usageCount,
    isLoading,
    error
  }
}