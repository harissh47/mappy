declare module 'ml-gmm' {
    export class GMM {
        constructor(options: { nClusters: number, initialization: string });
        train(data: number[][]): void;
        predict(data: number[][]): number[];
    }
} 