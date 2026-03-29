'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function PedigreePage() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/ezra-piper-pedigree.html')
  }, [router])
  return (
    <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'Arial' }}>
      <p>Redirecting to Pedigree Explorer…</p>
    </div>
  )
}
