'use client';

import React, { useState } from 'react';
import { ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline';

interface ShareLinkProps {
  link: string;
}

const ShareLink: React.FC<ShareLinkProps> = ({ link }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="flex items-center space-x-2 mb-4">
      <span className="text-sm">Share this link to join the session:</span>
      <div className="flex-1 bg-gray-100 p-2 rounded">
        <span className="text-blue-600">{link}</span>
      </div>
      <button
        onClick={copyToClipboard}
        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded transition duration-150 ease-in-out flex items-center"
        title="Copy to clipboard"
      >
        {copied ? (
          <CheckIcon className="h-5 w-5" />
        ) : (
          <ClipboardIcon className="h-5 w-5" />
        )}
      </button>
    </div>
  );
};

export default ShareLink;