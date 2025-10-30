'use client'

import React, { useState, useEffect } from 'react'

export default function DebugPage() {
  const [debugInfo, setDebugInfo] = useState<string>('Loading...')

  useEffect(() => {
    const testData = async () => {
      try {
        const response = await fetch('/data/balloon5.csv')
        const text = await response.text()
        const lines = text.split('\n').slice(0, 5)
        
        setDebugInfo(`
          Fetch Status: ${response.status} ${response.ok ? 'OK' : 'ERROR'}
          Text Length: ${text.length}
          First 5 lines:
          ${lines.join('\n')}
          
          Current time: ${new Date().toLocaleString()}
        `)
      } catch (error) {
        setDebugInfo(`Error: ${error}`)
      }
    }
    testData()
  }, [])

  return (
    <main className="content-wrapper">
      <h1>Debug Page</h1>
      <pre style={{whiteSpace: 'pre-wrap', background: '#f0f0f0', padding: '20px'}}>
        {debugInfo}
      </pre>
    </main>
  )
}
