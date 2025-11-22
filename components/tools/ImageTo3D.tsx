import React, { useState } from 'react';
import { fileToBase64, generateImageFromImage } from '../../services/geminiService';
import { Upload, Box } from 'lucide-react';

const ImageTo3D: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const base64 = await fileToBase64(e.target.files[0]);
      setImage(`data:image/png;base64,${base64}`);
    }
  };

  const handleGenerate = async () => {
    if (!image) return;
    setLoading(true);
    try {
      // Since Gemini doesn't output OBJ files directly yet via simple API calls in this context,
      // we generate a "3D View Sheet" or "Isometric render" as a proxy for the visual functionality.
      const prompt = "Create a high-quality 3D isometric render view of this architectural design. Show 3 different angles: Front, Side, and Top view on a clean white background. Make it look like a 3D model rendering.";
      const res = await generateImageFromImage(prompt, image.split(',')[1], 'image/png');
      setResult(res);
    } catch (e) {
      alert("3D Generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center max-w-3xl mx-auto space-y-8 text-center">
      <div className="w-full bg-orange-50 border-2 border-dashed border-orange-200 rounded-xl p-12 relative">
        {!image ? (
           <>
             <Box size={64} className="text-orange-300 mx-auto mb-4" />
             <h3 className="text-xl font-zongyi text-gray-700">上传平面图或立面图</h3>
             <p className="text-gray-500">Upload 2D plan or elevation</p>
           </>
        ) : (
            <img src={image} alt="Input" className="max-h-64 mx-auto shadow-lg rounded" />
        )}
        <input type="file" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
      </div>

      <button 
        onClick={handleGenerate}
        disabled={!image || loading}
        className="bg-red-600 text-black font-zongyi text-xl px-12 py-4 rounded-full shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
      >
        {loading ? '建模计算中 (Processing)...' : '生成三维模型视图 (Generate 3D View)'}
      </button>

      {result && (
        <div className="w-full bg-white p-4 rounded-xl shadow-2xl border border-gray-100 mt-8">
          <h4 className="font-zongyi text-left mb-4">结果预览 (3D Visualization)</h4>
          <img src={result} alt="3D Result" className="w-full rounded" />
        </div>
      )}
    </div>
  );
};

export default ImageTo3D;