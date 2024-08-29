import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Build your brand</h1>
        <h2 className="text-xl font-bold">Design thinking supercharged with AI</h2>
      </div>

      <div className="my-8 w-full max-w-2xl">
        <div className="relative overflow-hidden rounded-lg shadow-lg backdrop-blur-sm bg-white/30 border border-white/20">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 animate-gradient-x opacity-50"></div>
          <table className="relative w-full border-collapse">
            <thead>
              <tr className="bg-white/50">
                <th className="border border-white/30 p-3 text-left">Feature</th>
                <th className="border border-white/30 p-3 text-left">Manual Workshop</th>
                <th className="border border-white/30 p-3 text-left font-bold text-blue-600">AI Workshop</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-white/30 p-3">Cost</td>
                <td className="border border-white/30 p-3">$5,000 - $50,000</td>
                <td className="border border-white/30 p-3 font-semibold text-blue-600">$10 per session</td>
              </tr>
              <tr>
                <td className="border border-white/30 p-3">Facilitator</td>
                <td className="border border-white/30 p-3">Human expert</td>
                <td className="border border-white/30 p-3 font-semibold text-blue-600">AI-powered</td>
              </tr>
              <tr>
                <td className="border border-white/30 p-3">Availability</td>
                <td className="border border-white/30 p-3">Limited by schedules</td>
                <td className="border border-white/30 p-3 font-semibold text-blue-600">24/7 on-demand</td>
              </tr>
              <tr>
                <td className="border border-white/30 p-3">Scalability</td>
                <td className="border border-white/30 p-3">Limited to physical space</td>
                <td className="border border-white/30 p-3 font-semibold text-blue-600">Unlimited participants</td>
              </tr>
              <tr>
                <td className="border border-white/30 p-3">Customization</td>
                <td className="border border-white/30 p-3">Depends on facilitator</td>
                <td className="border border-white/30 p-3 font-semibold text-blue-600">Highly adaptable</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        
        <Link href="/hmw" className='bg-blue-500 text-white p-2 rounded text-center'>
          Generate HMWs
        </Link>
        <Link href="/questions" className='bg-blue-500 text-white p-2 rounded text-center'>
          Old Workshops
        </Link>
      </div>
    </main>
  );
}