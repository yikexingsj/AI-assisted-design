import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import ToolContainer from './components/ToolContainer';
import { ToolType, ToolConfig, GeneratedItem } from './types';

// Tools
import TextToImage from './components/tools/TextToImage';
import ImageCreativity from './components/tools/ImageCreativity';
import ImageEditing from './components/tools/ImageEditing';
import Gallery from './components/tools/Gallery';
import CostAnalysis from './components/tools/CostAnalysis';

// Define tool config here to pass down title/color to container
import { Type, Palette, Edit, Grid, Calculator } from 'lucide-react';
const tools: ToolConfig[] = [
  { id: ToolType.TEXT_TO_IMAGE, title: "文字创意", englishTitle: "Text to Image", icon: <Type />, color: "bg-blue-500", description: "" },
  { id: ToolType.IMAGE_CREATIVITY, title: "图片创意", englishTitle: "Image Creativity", icon: <Palette />, color: "bg-purple-500", description: "" },
  { id: ToolType.IMAGE_EDITING, title: "图片编辑", englishTitle: "Image Editing", icon: <Edit />, color: "bg-green-500", description: "" },
  { id: ToolType.GALLERY, title: "生成库", englishTitle: "Gallery", icon: <Grid />, color: "bg-teal-500", description: "" },
  { id: ToolType.COST_ANALYSIS, title: "造价分析", englishTitle: "Cost Analysis", icon: <Calculator />, color: "bg-red-500", description: "" }
];

const App: React.FC = () => {
  const [activeToolId, setActiveToolId] = useState<ToolType | null>(null);
  const [galleryItems, setGalleryItems] = useState<GeneratedItem[]>([]);

  const handleSaveItem = (item: GeneratedItem) => {
    setGalleryItems(prev => [item, ...prev]);
  };

  const activeToolConfig = tools.find(t => t.id === activeToolId);

  const renderTool = () => {
    switch (activeToolId) {
      case ToolType.TEXT_TO_IMAGE:
        return <TextToImage onSave={handleSaveItem} />;
      case ToolType.IMAGE_CREATIVITY:
        return <ImageCreativity onSave={handleSaveItem} />;
      case ToolType.IMAGE_EDITING:
        return <ImageEditing onSave={handleSaveItem} />;
      case ToolType.GALLERY:
        return <Gallery items={galleryItems} />;
      case ToolType.COST_ANALYSIS:
        return <CostAnalysis />;
      default:
        return null;
    }
  };

  return (
    <>
      {activeToolId && activeToolConfig ? (
        <ToolContainer 
          tool={activeToolConfig} 
          onBack={() => setActiveToolId(null)}
        >
          {renderTool()}
        </ToolContainer>
      ) : (
        <Dashboard onSelectTool={setActiveToolId} />
      )}
    </>
  );
};

export default App;