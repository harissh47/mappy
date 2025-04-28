declare module 'ml' {
    export class GaussianMixture {
        constructor(options: { nComponents: number });
        fit(data: number[][]): void;
        predict(data: number[][]): number[];
    }
} 