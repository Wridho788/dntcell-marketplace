'use client'

import { AlertCircle } from 'lucide-react'

export function ApiConfigWarning() {
  const hasApiUrl = typeof window !== 'undefined' && process.env.NEXT_PUBLIC_API_URL

  if (hasApiUrl) return null

  return (
    <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-amber-800 mb-1">
            Backend API Not Configured
          </h3>
          <p className="text-sm text-amber-700 mb-2">
            The app is running in demo mode. To enable full functionality, please configure the backend API URL in environment variables.
          </p>
          <details className="text-xs text-amber-600">
            <summary className="cursor-pointer font-medium hover:text-amber-800">
              How to fix this?
            </summary>
            <ol className="list-decimal list-inside mt-2 space-y-1 pl-2">
              <li>Go to Vercel Dashboard → Your Project → Settings → Environment Variables</li>
              <li>Add: <code className="bg-amber-100 px-1 py-0.5 rounded">NEXT_PUBLIC_API_URL</code></li>
              <li>Value: Your backend API URL (e.g., https://api.example.com/api)</li>
              <li>Redeploy the application</li>
            </ol>
          </details>
        </div>
      </div>
    </div>
  )
}
