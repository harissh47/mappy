declare module 'ml-kmeans' {
  export function kmeans(
    data: number[][],
    k: number,
    options?: {
      maxIterations?: number;
      tolerance?: number;
      distanceFunction?: (a: number[], b: number[]) => number;
    }
  ): {
    clusters: number[];
    centroids: number[][];
  };
} 