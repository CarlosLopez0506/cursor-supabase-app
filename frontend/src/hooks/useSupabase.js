/**
 * Generic data fetching hook for Supabase.
 * Purpose: Centralized way to query Supabase tables. Components MUST use this hook, never fetch Supabase directly.
 * Modify: Add auth, realtime subscriptions, or more filter types here.
 *
 * @example
 * // Simple fetch
 * const { data, loading, error, refetch } = useSupabase('products')
 *
 * @example
 * // With filters
 * const { data } = useSupabase('orders', { status: 'pending' })
 *
 * @example
 * // With order and limit
 * const { data } = useSupabase('events', null, { column: 'created_at', ascending: false }, 50)
 *
 * @param {string} tableName - Supabase table name
 * @param {Object} [filters] - Optional. { key: value } pairs for .eq filters
 * @param {Object} [order] - Optional. { column, ascending } for .order()
 * @param {number} [limit] - Optional. Max rows to return
 * @returns {{ data: any[], loading: boolean, error: Error|null, refetch: () => Promise<void> }}
 */
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../services/supabase'

export function useSupabase(tableName, filters = {}, order = null, limit = null) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    if (!tableName) {
      setData([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      let query = supabase.from(tableName).select('*')

      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value != null && value !== '') {
          query = query.eq(key, value)
        }
      })

      if (order) {
        query = query.order(order.column, { ascending: order.ascending ?? true })
      }

      if (limit) {
        query = query.limit(limit)
      }

      const { data: rows, error: err } = await query

      if (err) {
        // #region agent log
        fetch('http://127.0.0.1:7880/ingest/7232c866-1cb8-4790-a571-c910d66c0e38', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Debug-Session-Id': '0d4ff0',
          },
          body: JSON.stringify({
            sessionId: '0d4ff0',
            runId: 'supabase-fetch',
            hypothesisId: 'H1-network-or-permission',
            location: 'frontend/src/hooks/useSupabase.js:60',
            message: 'Supabase query error',
            data: {
              tableName,
              filters,
              errorMessage: err.message,
              errorName: err.name,
            },
            timestamp: Date.now(),
          }),
        }).catch(() => {})
        // #endregion agent log
        throw err
      }

      // #region agent log
      fetch('http://127.0.0.1:7880/ingest/7232c866-1cb8-4790-a571-c910d66c0e38', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Debug-Session-Id': '0d4ff0',
        },
        body: JSON.stringify({
          sessionId: '0d4ff0',
          runId: 'supabase-fetch',
          hypothesisId: 'H2-success-shape',
          location: 'frontend/src/hooks/useSupabase.js:74',
          message: 'Supabase query success',
          data: {
            tableName,
            rowCount: Array.isArray(rows) ? rows.length : null,
          },
          timestamp: Date.now(),
        }),
      }).catch(() => {})
      // #endregion agent log

      setData(rows || [])
    } catch (err) {
      setError(err)
      setData([])
    } finally {
      setLoading(false)
    }
  }, [tableName, JSON.stringify(filters), order?.column, order?.ascending, limit])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}
