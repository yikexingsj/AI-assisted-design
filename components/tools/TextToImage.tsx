import React, { useState } from 'react';
import { AspectRatio, GeneratedItem } from '../../types';
import { generateImage } from '../../services/geminiService';
import { Loader2, Download } from 'lucide-react';

interface TextToImageProps {
  onSave: (item: GeneratedItem) => void;
}

const TextToImage: React.FC<TextToImageProps> = ({ onSave }) => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("1:1");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setResult(null);
    try {
      const base64Image = await generateImage(prompt, aspectRatio);
      setResult(base64Image);
      onSave({
        id: Date.now().toString(),
        type: 'image',
        url: base64Image,
        timestamp: Date.now(),
        prompt
      });
    } catch (error) {
      alert("Failed to generate image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
      <div className="space-y-6">
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
          <label className="block font-zongyi text-lg mb-4">创意描述 (Prompt)</label>
          <textarea
            className="w-full h-40 p-4 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent resize-none font-sans text-gray-700"
            placeholder="Describe your architectural concept... (e.g., A futuristic museum in a forest, minimalist concrete structure)"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>

        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
          <label className="block font-zongyi text-lg mb-4">图幅比例 (Aspect Ratio)</label>
          <div className="grid grid-cols-5 gap-2">
            {(["1:1", "3:4", "4:3", "9:16", "16:9"] as AspectRatio[]).map((ratio) => (
              <button
                key={ratio}
                onClick={() => setAspectRatio(ratio)}
                className={`py-2 px-1 text-sm font-bold rounded border ${
                  aspectRatio === ratio 
                    ? 'bg-black text-white border-black' 
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                }`}
              >
                {ratio}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !prompt}
          className={`w-full py-4 rounded-xl font-zongyi text-xl transition-all transform hover:-translate-y-1 shadow-lg ${
            loading || !prompt 
              ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
              : 'bg-red-600 text-black hover:shadow-red-200'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin" /> 生成中...
            </span>
          ) : (
            '立即生成 (GENERATE)'
          )}
        </button>
      </div>

      <div className="bg-gray-100 rounded-2xl flex items-center justify-center min-h-[400px] border-2 border-dashed border-gray-300 relative overflow-hidden">
        {result ? (
          <div className="relative w-full h-full flex items-center justify-center p-2">
            <img src={result} alt="Generated" className="max-w-full max-h-full object-contain rounded shadow-lg" />
            <a 
              href={result} 
              download={`design-${Date.now()}.png`}
              className="absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 text-black"
            >
              <Download size={24} />
            </a>
          </div>
        ) : (
          <div className="text-center text-gray-400">
            <p className="font-zongyi text-2xl mb-2">预览区域</p>
            <p>Preview Area</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextToImage;