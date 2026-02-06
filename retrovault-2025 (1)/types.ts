
export interface GameMetadata {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: string;
}

export interface LatestGame {
  id: number;
  title: string;
  releaseDate: string;
  image: string;
  description: string;
}

export type ViewState = 'library' | 'game' | 'learn' | 'gallery';
