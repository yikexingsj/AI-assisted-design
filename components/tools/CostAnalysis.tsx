import React, { useState } from 'react';
import { CostParams } from '../../types';
import { generateCostAnalysis } from '../../services/geminiService';
import { Loader2 } from 'lucide-react';

const CostAnalysis: React.FC = () => {
  const [params, setParams] = useState<CostParams>({
    aboveGroundArea: 1000,
    undergroundArea: 0,
    floors: 2,
    structureType: 'Reinforced Concrete',
    facadeMaterial: 'Glass Curtain Wall'
  });
  
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string>('');

  const handleChange = (field: keyof CostParams, value: any) => {
    setParams(prev => ({ ...prev, [field]: value }));
  };

  const handleCalculate = async () => {
    setLoading(true);
    const prompt = `
      Perform a detailed architectural cost estimation for a building with the following specs:
      - Above Ground Area: ${params.aboveGroundArea} sqm
      - Underground Area: ${params.undergroundArea} sqm
      - Floors: ${params.floors}
      - Structure: ${params.structureType}
      - Facade: ${params.facadeMaterial}
      
      Please provide:
      1. Estimated total construction cost (in CNY and USD).
      2. Cost per square meter.
      3. Breakdown of major costs (Civil works, MEP, Facade, Fit-out).
      4. Structural complexity adjustment factor.
      
      Format the output as a clean Markdown report with tables.
    `;

    try {
      const result = await generateCostAnalysis(prompt);
      setAnalysis(result || "Analysis failed.");
    } catch (error) {
      setAnalysis("Error generating analysis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 h-fit">
        <h3 className="font-zongyi text-xl mb-6 border-l-4 border-red-600 pl-3">项目参数 (Parameters)</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">地上建筑面积 (Above Ground m²)</label>
            <input 
              type="number" 
              value={params.aboveGroundArea}
              onChange={(e) => handleChange('aboveGroundArea', Number(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">地下建筑面积 (Underground m²)</label>
            <input 
              type="number" 
              value={params.undergroundArea}
              onChange={(e) => handleChange('undergroundArea', Number(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">建筑层数 (Floors)</label>
            <input 
              type="number" 
              value={params.floors}
              onChange={(e) => handleChange('floors', Number(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">建筑结构 (Structure)</label>
            <select 
              value={params.structureType}
              onChange={(e) => handleChange('structureType', e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option>Reinforced Concrete (钢筋混凝土)</option>
              <option>Steel Structure (钢结构)</option>
              <option>Timber (木结构)</option>
              <option>Masonry (砖混结构)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">立面材料 (Facade)</label>
            <input 
              type="text" 
              value={params.facadeMaterial}
              onChange={(e) => handleChange('facadeMaterial', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <button 
            onClick={handleCalculate}
            disabled={loading}
            className="w-full mt-4 py-3 bg-red-600 text-black font-zongyi text-lg rounded shadow hover:bg-red-500 transition-colors"
          >
            {loading ? <Loader2 className="animate-spin mx-auto" /> : '开始分析 (ANALYZE)'}
          </button>
        </div>
      </div>

      <div className="lg:col-span-2 bg-white p-8 rounded-xl border border-gray-100 shadow-sm overflow-y-auto max-h-[800px]">
        {analysis ? (
          <div className="prose prose-red max-w-none">
            {/* Basic Markdown rendering support could be added here, displaying raw text for simplicity in this React-only context without external MD parsers */}
            <pre className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed">
              {analysis}
            </pre>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50">
            <CalculatorIcon />
            <p className="mt-4 font-zongyi">等待数据输入...</p>
          </div>
        )}
      </div>
    </div>
  );
};

const CalculatorIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-gray-300">
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <line x1="8" y1="6" x2="16" y2="6" />
    <line x1="16" y1="14" x2="16" y2="14" />
    <line x1="12" y1="14" x2="12" y2="14" />
    <line x1="8" y1="14" x2="8" y2="14" />
    <line x1="16" y1="18" x2="16" y2="18" />
    <line x1="12" y1="18" x2="12" y2="18" />
    <line x1="8" y1="18" x2="8" y2="18" />
  </svg>
);

export default CostAnalysis;