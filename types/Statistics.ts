export interface SeriesData {
  date: string;
  arrows: number;
  score: number;
  scoredArrows: number;
  practiceCategory: string;
  practiceType: string;
  sessionId?: string;
}

export interface Series {
  name: string;
  data: SeriesData[];
}
