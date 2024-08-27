import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">AI-powered workshops</h1>
        <h2 className="text-xl font-bold">Design thinking supercharged with AI</h2>
      </div>
      
      <div className="flex flex-col gap-4">
        <Link href="/hmw" className='bg-blue-500 text-white p-2 rounded text-center'>
          Generate HMWs
        </Link>
        <Link href="/workshop" className='bg-blue-500 text-white p-2 rounded text-center'>
          Run Workshops
        </Link>
      </div>
    </main>
  );
}
