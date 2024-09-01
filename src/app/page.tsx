'use client'

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import CreateSession from '@/components/CreateSession';

export default function Home() {
  const router = useRouter();
  const [shareableLink, setShareableLink] = useState<string | null>(null);

  const handleSessionCreated = (link: string) => {
    setShareableLink(link);
    const sessionId = link.split('/').pop()?.split('?')[0];
    router.push(`/session/${sessionId}`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">

      <header className="bg-gradient-to-r from-lime-300 to-lime-500 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4 transition-transform duration-300 ease-in-out hover:scale-105">
          AI-powered design thinking
        </h1>
        <p className="text-xl sm:text-2xl md:text-3xl font-medium text-lime-900 max-w-2xl mx-auto">
          Branding workshop made easy
        </p>
      </div>
    </header>

 

      <div className="w-full max-w-4xl mx-auto p-4 m-8 md:p-6 bg-gradient-to-br from-lime-100 to-green-100 rounded-xl shadow-lg">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-lime-800">Product Comparison</h2>
        <div className="grid grid-cols-3 gap-4 text-sm md:text-base">
          {/* Header */}
          <div className="col-span-1 bg-white rounded-tl-lg p-4 font-semibold text-lime-800">Features</div>
          <div className="col-span-1 bg-white p-4 font-semibold text-lime-800">Manual Workshop</div>
          <div className="col-span-1 bg-white rounded-tr-lg p-4 font-semibold text-lime-800">AI Workshop</div>

          {/* Row 1 */}
          <div className="col-span-1 bg-white p-4 flex items-center">
            <span className="text-gray-800">Cost</span>
          </div>
          <div className="col-span-1 bg-white p-4 flex items-center justify-center">
            $5,000 - $50,000
          </div>
          <div className="col-span-1 bg-white p-4 flex items-center justify-center">
            $5 per session
          </div>

          {/* Row 2 */}
          <div className="col-span-1 bg-white p-4 flex items-center">
            <span className="text-gray-800">Water Resistant</span>
          </div>
          <div className="col-span-1 bg-white p-4 flex items-center justify-center">
            Human expert
          </div>
          <div className="col-span-1 bg-white p-4 flex items-center justify-center">
            AI-powered
          </div>

          {/* Row 3 */}
          <div className="col-span-1 bg-white rounded-bl-lg p-4 flex items-center">
            <span className="text-gray-800">Availability</span>
          </div>
          <div className="col-span-1 bg-white p-4 flex items-center justify-center">
            Limited by schedules
          </div>
          <div className="col-span-1 bg-white rounded-br-lg p-4 flex items-center justify-center">
            24/7 on-demand
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className='text-2xl font-bold'>Start a new branding workshop session</h3>
        <CreateSession onSessionCreated={handleSessionCreated} />
        <h3 className='text-2xl font-bold'>Or join an existing workshop</h3>
        <Link href="/session" className='bg-blue-500 text-white p-2 rounded text-center'>
          Your workshops
        </Link>
        <Link href="/hmw" className='bg-blue-500 text-white p-2 rounded text-center'>
          Generate HMWs
        </Link>
      </div>
    </main>
  );
}