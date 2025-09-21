import React from 'react'
import { RecordSessionModal } from '@/components/RecordSessionModal'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full max-w-5xl">
        <h1 className="text-4xl font-bold mb-8">TrainXR Exercise Tracking</h1>
        <RecordSessionModal 
          isOpen={false}
          onClose={() => {}}
          onSave={() => {}}
        />
      </div>
    </main>
  )
}