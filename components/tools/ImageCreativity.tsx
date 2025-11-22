import React, { useState, useRef } from 'react';
import { GeneratedItem } from '../../types';
import { fileToBase64, generateImageFromImage } from '../../services/geminiService';
import { Loader2, Upload } from 'lucide-react';

interface ImageCreativityProps {
  onSave: (item: GeneratedItem) => void;
}

const ImageCreativity: React.FC<ImageCreativityProps> = ({ onSave }) => {
  const [mode, setMode] = useState<'single' | 'double'>('single');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [image1, setImage1] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  
  // We will focus on implementing the Single Image upload + prompt for this demo
  // The "Draw" functionality would require a complex Canvas setup, simplifying to upload for robust code.

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const base64 = await fileToBase64(e.target.files[0]);
      setImage1(base64);
    }
  };

  const handleGenerate = async () => {
    if (!prompt || !image1) return;
    setLoading(true);
    try {
      // Passing jpeg as default or detecting type if needed, but gemini accepts clean base64
      const res = await generateImageFromImage(prompt, image1, 'image/jpeg');
      setResult(res);
      onSave({
        id: Date.now().toString(),
        type: 'image',
        url: res,
        timestamp: Date.now(),
        prompt
      });
    } catch (e) {
      alert('Generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 pb-4">
        <button 
          onClick={() => setMode('single')}
          className={`text-lg font-zongyi pb-2 border-b-4 transition-colors ${mode === 'single' ? 'border-red-600 text-black' : 'border-transparent text-gray-400'}`}
        >
          单图创意 (Single)
        </button>
        <button 
           onClick={() => setMode('double')}
           className={`text-lg font-zongyi pb-2 border-b-4 transition-colors ${mode === 'double' ? 'border-red-600 text-black' : 'border-transparent text-gray-400'}`}
        >
          双图创意 (Double)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
           <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-gray-50 hover:bg-gray-100 transition-colors relative">
              {image1 ? (
                <img src={`data:image/png;base64,${image1}`} alt="Reference" className="max-h-64 object-contain" />
              ) : (
                <>
                  <Upload size={48} className="text-gray-300 mb-4" />
                  <p className="font-bold text-gray-500">上传参考图</p>
                  <p className="text-xs text-gray-400">Upload Reference</p>
                </>
              )}
              <input 
                type="file" 
                onChange={handleFileChange} 
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept="image/*"
              />
           </div>

           {mode === 'double' && (
              <div className="p-4 bg-yellow-50 text-yellow-700 rounded text-sm">
                Double image mode placeholder. In a full version, this would allow mixing two concepts.
              </div>
           )}

           <textarea
            className="w-full h-32 p-4 rounded-lg border border-gray-200 resize-none"
            placeholder="How should we transform this image?"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <button
            onClick={handleGenerate}
            disabled={loading || !image1}
            className="w-full py-3 bg-red-600 text-black font-zongyi rounded-lg disabled:opacity-50"
          >
            {loading ? '处理中...' : '开始生成 (GENERATE)'}
          </button>
        </div>

        <div className="lg:col-span-2 bg-black rounded-xl flex items-center justify-center p-4 min-h-[500px]">
           {result ? (
             <img src={result} alt="Result" className="max-h-full max-w-full rounded shadow-2xl" />
           ) : (
             <p className="text-gray-600 font-zongyi text-xl">等待生成结果...</p>
           )}
        </div>
      </div>
    </div>
  );
};

export default ImageCreativity;