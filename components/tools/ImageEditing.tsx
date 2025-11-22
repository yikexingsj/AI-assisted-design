import React, { useState, useRef, useEffect } from 'react';
import { GeneratedItem } from '../../types';
import { fileToBase64, generateImageFromImage } from '../../services/geminiService';
import { Eraser, Pen, Upload, Undo } from 'lucide-react';

interface ImageEditingProps {
  onSave: (item: GeneratedItem) => void;
}

const ImageEditing: React.FC<ImageEditingProps> = ({ onSave }) => {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const base64 = await fileToBase64(e.target.files[0]);
      setImage(`data:image/png;base64,${base64}`);
      setResult(null);
    }
  };

  // Initialize canvas when image loads
  useEffect(() => {
    if (image && canvasRef.current && imageRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            canvas.width = imageRef.current.width;
            canvas.height = imageRef.current.height;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(imageRef.current, 0, 0);
        }
    }
  }, [image]);

  const startDrawing = (e: React.MouseEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.beginPath(); // Reset path
    }
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    ctx.lineWidth = 20;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)'; // Red marker
    
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handleGenerate = async () => {
    if (!canvasRef.current || !prompt) return;
    setLoading(true);
    
    // In a real scenario, we might send the mask separately.
    // For this demo using Flash-Image, we send the marked up image + prompt "Change the red marked area to..."
    const markedImageBase64 = canvasRef.current.toDataURL('image/png').split(',')[1];

    try {
      const res = await generateImageFromImage(
          `Fix the area marked in red: ${prompt}`, 
          markedImageBase64, 
          'image/png'
      );
      setResult(res);
    } catch (e) {
      alert("Editing failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex gap-4 items-center bg-gray-50 p-4 rounded-lg">
        <div className="relative">
            <button className="flex items-center gap-2 bg-white px-4 py-2 border rounded hover:bg-gray-50">
                <Upload size={16} /> 上传图片
            </button>
            <input type="file" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
        </div>
        <div className="h-8 w-px bg-gray-300 mx-2"></div>
        <span className="text-sm text-gray-500 font-zongyi">
            <Pen size={16} className="inline mr-1" /> 
            使用画笔标记修改位置 (Mark area to edit)
        </span>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        <div className="flex-1 bg-gray-200 relative rounded-lg overflow-hidden border shadow-inner flex items-center justify-center">
             {!image && <p className="text-gray-500">Upload an image to start editing</p>}
             {image && (
                 <>
                    <img 
                        ref={imageRef} 
                        src={image} 
                        alt="Source" 
                        className="hidden" 
                        onLoad={() => {
                            // Trigger re-render for canvas setup
                            setImage(image); 
                        }} 
                    />
                    <canvas
                        ref={canvasRef}
                        onMouseDown={startDrawing}
                        onMouseUp={stopDrawing}
                        onMouseMove={draw}
                        onMouseLeave={stopDrawing}
                        className="max-w-full max-h-full object-contain cursor-crosshair"
                    />
                 </>
             )}
        </div>
        
        {result && (
             <div className="flex-1 bg-black rounded-lg flex items-center justify-center">
                 <img src={result} className="max-w-full max-h-full object-contain" alt="Edited" />
             </div>
        )}
      </div>

      <div className="h-20 flex gap-4">
        <input 
            type="text" 
            placeholder="Describe the change (e.g., change material to wood, add a window)..." 
            className="flex-1 p-4 border rounded-lg font-sans"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
        />
        <button 
            onClick={handleGenerate}
            disabled={loading || !image}
            className="px-8 bg-red-600 text-black font-zongyi text-xl rounded-lg disabled:opacity-50"
        >
            {loading ? 'Generating...' : '修 改'}
        </button>
      </div>
    </div>
  );
};

export default ImageEditing;