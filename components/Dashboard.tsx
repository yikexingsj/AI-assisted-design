import React, { useState } from 'react';
import { ToolType, ToolConfig } from '../types';
import { 
  Type, 
  Palette, 
  Edit, 
  Grid, 
  Calculator 
} from 'lucide-react';

interface DashboardProps {
  onSelectTool: (tool: ToolType) => void;
}

const tools: ToolConfig[] = [
  { 
    id: ToolType.TEXT_TO_IMAGE, 
    title: "文字创意", 
    englishTitle: "Text to Image", 
    icon: <Type size={32} />, 
    color: "bg-blue-500",
    description: "Input text to generate creative visuals."
  },
  { 
    id: ToolType.IMAGE_CREATIVITY, 
    title: "图片创意", 
    englishTitle: "Image Creativity", 
    icon: <Palette size={32} />, 
    color: "bg-purple-500",
    description: "Single or double image generation."
  },
  { 
    id: ToolType.IMAGE_EDITING, 
    title: "图片编辑", 
    englishTitle: "Image Editing", 
    icon: <Edit size={32} />, 
    color: "bg-green-500",
    description: "Brush modify and inpaint."
  },
  { 
    id: ToolType.GALLERY, 
    title: "生成库", 
    englishTitle: "Gallery", 
    icon: <Grid size={32} />, 
    color: "bg-teal-500",
    description: "View your generated assets."
  },
  { 
    id: ToolType.COST_ANALYSIS, 
    title: "造价分析", 
    englishTitle: "Cost Analysis", 
    icon: <Calculator size={32} />, 
    color: "bg-red-500",
    description: "Estimate architectural costs."
  }
];

const Dashboard: React.FC<DashboardProps> = ({ onSelectTool }) => {
  const [hovered, setHovered] = useState<ToolType | null>(null);

  const radius = 220; // Radius of the circle in pixels
  const center = { x: 350, y: 350 }; // Center coordinate of the container
  const totalTools = tools.length;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white overflow-hidden relative">
      
      {/* Main Container */}
      <div 
        className="relative w-[700px] h-[700px] flex items-center justify-center"
        style={{ transform: 'scale(0.8) md:scale(1)' }}
      >
        
        {/* Connecting Ring (Optional visual aid) */}
        <div className="absolute inset-0 rounded-full border border-gray-100 m-auto w-[440px] h-[440px]" />

        {/* Center Piece */}
        <div className="absolute z-20 flex flex-col items-center justify-center bg-white rounded-full p-10 shadow-2xl border-4 border-gray-100 w-64 h-64 text-center transition-all duration-300">
          <div className="mb-4">
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-800 mx-auto">
              <path d="M3 21h18M5 21V7l8-4 8 4v14M6 10h12" />
            </svg>
          </div>
          <h1 className="text-2xl font-zongyi tracking-wider text-gray-900 leading-tight">
            刚刚好先生
            <br />
            <span className="text-lg text-gray-500 font-normal font-sans">Ai设计坊</span>
          </h1>
          {hovered && (
            <p className="mt-2 text-xs text-gray-400 font-sans absolute -bottom-8 w-full animate-fade-in">
              {tools.find(t => t.id === hovered)?.englishTitle}
            </p>
          )}
        </div>

        {/* Circular Items */}
        {tools.map((tool, index) => {
          const angle = (index * (360 / totalTools)) - 90; // Start from top
          const radian = (angle * Math.PI) / 180;
          const x = center.x + radius * Math.cos(radian) - 48; // Adjust for half width
          const y = center.y + radius * Math.sin(radian) - 48; // Adjust for half height

          return (
            <button
              key={tool.id}
              onClick={() => onSelectTool(tool.id)}
              onMouseEnter={() => setHovered(tool.id)}
              onMouseLeave={() => setHovered(null)}
              className={`absolute group flex flex-col items-center justify-center w-24 h-24 rounded-full shadow-lg transition-all duration-300 ease-out hover:scale-110 hover:z-30 cursor-pointer bg-white border-2 border-gray-100`}
              style={{ 
                left: `${x}px`, 
                top: `${y}px`,
                transform: `translate(-50%, -50%)` // Centering adjustment
              }}
            >
              {/* Colored Ring/Background */}
              <div className={`absolute inset-0 rounded-full opacity-10 group-hover:opacity-20 transition-opacity ${tool.color}`} />
              
              <div className={`text-gray-700 mb-1 transition-colors group-hover:text-black`}>
                {tool.icon}
              </div>
              
              {/* Title Box: Red Background, Black Text, ZongYi Font */}
              <div className="bg-red-600 px-2 py-0.5 rounded-sm shadow-sm mt-1 max-w-[120%]">
                <span className="text-[10px] md:text-xs font-zongyi text-black whitespace-nowrap block leading-none">
                  {tool.title}
                </span>
              </div>
              <span className="text-[8px] text-gray-400 mt-0.5 font-sans uppercase tracking-tight">
                {tool.englishTitle}
              </span>
            </button>
          );
        })}
      </div>
      
      <footer className="absolute bottom-4 text-gray-400 text-sm">
        &copy; 2025 Mr. Just Right AI Design Studio
      </footer>
    </div>
  );
};

export default Dashboard;