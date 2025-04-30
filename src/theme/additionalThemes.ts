
import { Theme } from "../models/types";

export const additionalThemes: Record<string, Theme> = {
  // Light themes
  lightBlue: {
    id: 'lightBlue',
    name: 'Light Blue',
    primaryColor: '#3B82F6',
    secondaryColor: '#60A5FA',
    backgroundColor: '#F9FAFB',
    textColor: '#1F2937',
    accentColor: '#2563EB'
  },
  roseGarden: {
    id: 'roseGarden',
    name: 'Rose Garden',
    primaryColor: '#EC4899',
    secondaryColor: '#F472B6',
    backgroundColor: '#FDF2F8',
    textColor: '#831843',
    accentColor: '#DB2777'
  },
  mintGreen: {
    id: 'mintGreen',
    name: 'Mint Green',
    primaryColor: '#10B981',
    secondaryColor: '#34D399',
    backgroundColor: '#F0FDF4',
    textColor: '#065F46',
    accentColor: '#059669'
  },
  // Dark themes
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    primaryColor: '#F9A8D4',
    secondaryColor: '#EC4899',
    backgroundColor: '#0F172A',
    textColor: '#E2E8F0',
    accentColor: '#F472B6'
  },
  matrix: {
    id: 'matrix',
    name: 'Matrix',
    primaryColor: '#86EFAC',
    secondaryColor: '#4ADE80',
    backgroundColor: '#022C22',
    textColor: '#D1FAE5',
    accentColor: '#10B981'
  },
  synthwave: {
    id: 'synthwave',
    name: 'Synthwave',
    primaryColor: '#C084FC',
    secondaryColor: '#A855F7',
    backgroundColor: '#0F1035',
    textColor: '#F5F3FF',
    accentColor: '#7C3AED'
  },
  // High contrast
  highContrastDark: {
    id: 'highContrastDark',
    name: 'High Contrast Dark',
    primaryColor: '#FBBF24',
    secondaryColor: '#F59E0B',
    backgroundColor: '#000000',
    textColor: '#FFFFFF',
    accentColor: '#D97706'
  },
  highContrastLight: {
    id: 'highContrastLight',
    name: 'High Contrast Light',
    primaryColor: '#7C3AED',
    secondaryColor: '#6D28D9',
    backgroundColor: '#FFFFFF',
    textColor: '#000000',
    accentColor: '#5B21B6'
  }
};
