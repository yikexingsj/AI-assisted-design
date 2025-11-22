import React from 'react';

export enum ToolType {
  TEXT_TO_IMAGE = 'text-to-image',
  IMAGE_CREATIVITY = 'image-creativity',
  IMAGE_EDITING = 'image-editing',
  GALLERY = 'gallery',
  COST_ANALYSIS = 'cost-analysis',
}

export interface ToolConfig {
  id: ToolType;
  title: string;
  englishTitle: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

export interface GeneratedItem {
  id: string;
  type: 'image' | 'video' | 'text';
  url?: string;
  content?: string;
  timestamp: number;
  prompt: string;
}

export type AspectRatio = "1:1" | "3:4" | "4:3" | "9:16" | "16:9";

export interface CostParams {
  aboveGroundArea: number;
  undergroundArea: number;
  floors: number;
  structureType: string;
  facadeMaterial: string;
}