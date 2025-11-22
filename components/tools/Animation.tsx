import React, { useState } from 'react';
import { generateVeoVideo } from '../../services/geminiService';
import { Loader2, Play } from 'lucide-react';

const Animation: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [status, setStatus] = useState('');

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setVideoUrl(null);
    setStatus('Initializing Veo model...');
    
    try {
      setStatus('Generating video (this may take a minute)...');
      const url = await generateVeoVideo(prompt);
      setVideoUrl(url);
      setStatus('Complete!');
    } catch (error: any) {
      console.error(error);
      setStatus(`Error: ${error.message || 'Generation failed'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
        <div className="mb-6">
           <h3 className="font-zongyi text-xl mb-2">文生动画 (Text to Animation)</h3>
           <p className="text-gray-500 text-sm">Powered by Google Veo. Requires a paid API key (Popup will appear).</p>
        </div>
        
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="A cinematic drone shot of a modern glass house on a cliff edge at sunset..."
          className="w-full h-32 p-4 rounded-lg border border-gray-200 mb-4 focus:ring-2 focus:ring-black resize-none"
        />

        <button
          onClick={handleGenerate}
          disabled={loading || !prompt}
          className="w-full py-4 bg-black text-white font-bold rounded-lg hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Play fill="currentColor" />}
          {loading ? 'Generating...' : 'Generate Video'}
        </button>

        {status && <p className="mt-4 text-center text-sm text-gray-600 animate-pulse">{status}</p>}
      </div>

      {videoUrl && (
        <div className="bg-black p-4 rounded-2xl shadow-2xl">
          <video 
            src={videoUrl} 
            controls 
            autoPlay 
            loop 
            className="w-full rounded-lg"
          />
          <div className="mt-4 flex justify-end">
            <a href={videoUrl} download="animation.mp4" className="text-white underline text-sm">Download MP4</a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Animation;