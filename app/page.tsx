'use client'
import React, { FormEvent, FunctionComponent, useState } from 'react';
import useSWR from 'swr';
import { Input } from "@/components/ui/input";
import ThreadItem from '@/components/ThreadItem';
import { Thread } from './api/search/route';

// Fetcher for the useSWR hook
const fetcher = (url: string) => fetch(url).then(res => res.json());

const Home: FunctionComponent = () => {
  const [query, setQuery] = useState('');

  // Fetch threads using the useSWR hook. 
  // Uses built-in functionality to provide a fast and reactive ui
  const { data: threads, error } = useSWR<Thread[]>(
    `/api/search?query=${encodeURIComponent(query)}`,
    fetcher
  );


  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-700 p-8">
      
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8 animate-slideInTop">
          <h1 className="text-white text-6xl font-bold mb-4">Query</h1>
          <h2 className="text-blue-100 text-2xl">Enter your question below!</h2>
        </div>

        <form className="mb-8 animate-slideInTop">
            <Input
              className="bg-white text-black flex-grow"
              placeholder="What would you like to know?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
        </form>

        <p className="text-blue-100 text-center mb-8 animate-slideInTop">
          Find similar problems, with similar solutions!
        </p>

        {!threads && !error ? (
          <div className="text-white text-center">Loading...</div>
        ) : (
          <div className="space-y-6 animate-fadeIn">
            {threads?.map((thread, index) => (
              <ThreadItem key={index} thread={thread} />
            ))}
            {threads?.length === 0 && query && (
              <p className="text-white text-center">No results found. Try a different query!</p>
            )}
            {error && <p className="text-red-500 text-center">Failed to load data. Please try again.</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
