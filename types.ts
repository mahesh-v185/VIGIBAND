
export interface Slide {
  id: number;
  title: string;
  subtitle?: string;
  content: string[];
  duration: number; // in seconds
  type: 'title' | 'story' | 'problem' | 'solution' | 'how-it-works' | 'market' | 'business-model' | 'competitive' | 'roadmap' | 'ask' | 'impact' | 'thank-you';
  script: string;
}

export interface ChartData {
  name: string;
  value: number;
  label?: string;
}

export interface ComparisonData {
  feature: string;
  vigiband: string | boolean;
  medical: string | boolean;
  consumer: string | boolean;
}
