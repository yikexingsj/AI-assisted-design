import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { ToolConfig } from '../types';

interface ToolContainerProps {
  tool: ToolConfig;
  onBack: () => void;
  children: React.ReactNode;
}

const ToolContainer: React.FC<ToolContainerProps> = ({ tool, onBack, children }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="flex flex-col">
              <h2 className="text-xl font-zongyi bg-red-600 text-black px-3 py-1 inline-block shadow-sm transform -skew-x-6">
                <span className="transform skew-x-6 inline-block">{tool.title}</span>
              </h2>
              <span className="text-xs text-gray-400 mt-1 tracking-widest font-sans">{tool.englishTitle.toUpperCase()}</span>
            </div>
          </div>
          
          {/* Mini Logo for context */}
          <div className="hidden md:flex items-center gap-2 opacity-50">
            <div className={`w-3 h-3 rounded-full ${tool.color}`}></div>
            <span className="font-zongyi text-sm">刚刚好先生</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8">
        {children}
      </main>
    </div>
  );
};

export default ToolContainer;