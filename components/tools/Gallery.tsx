import React from 'react';
import { GeneratedItem } from '../../types';

interface GalleryProps {
  items: GeneratedItem[];
}

const Gallery: React.FC<GalleryProps> = ({ items }) => {
  return (
    <div className="space-y-6">
      <h3 className="font-zongyi text-2xl">生成记录 (Project Library)</h3>
      {items.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p>暂无生成内容 (No items yet)</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item.id} className="group relative aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all">
              <img src={item.url} alt={item.prompt} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100">
                <p className="text-white text-xs line-clamp-2 mb-2">{item.prompt}</p>
                <span className="text-gray-300 text-[10px]">{new Date(item.timestamp).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Gallery;