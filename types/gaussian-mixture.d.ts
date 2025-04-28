declare module 'gaussian-mixture' {
  export default class GMM {
    constructor(options: {
      nClusters: number;
      covarianceType: string;
      initParams: string;
      maxIterations: number;
      tolerance: number;
      randomSeed?: number;
    });
    means: number[][];
    kmeansPlusPlusInit(data: number[][]): number[][];
    fit(data: number[][]): void;
    predict(data: number[][]): number[];
  }
} 