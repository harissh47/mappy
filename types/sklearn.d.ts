declare module 'sklearn' {
    export class GaussianMixture {
        constructor(options: { n_components: number, random_state: number });
        fit_predict(data: number[][]): number[];
    }
} 