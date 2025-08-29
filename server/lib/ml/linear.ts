export interface LinearModel {
  coefficients: number[];
  intercept: number;
  featureMeans: number[];
  featureStd: number[];
}

export interface TrainOptions {
  learningRate?: number;
  epochs?: number;
  l2?: number;
  batchSize?: number; // currently unused, simple GD
}

export interface TrainResult {
  model: LinearModel;
  rmse: number;
  r2: number;
  iterations: number;
}

function mean(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0) / Math.max(1, arr.length);
}

function std(arr: number[], m: number): number {
  const v = mean(arr.map((x) => (x - m) ** 2));
  return Math.sqrt(v) || 1; // avoid zero std
}

function dot(a: number[], b: number[]): number {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
}

export function standardizeFeatures(X: number[][]): {
  Xs: number[][];
  means: number[];
  stds: number[];
} {
  if (X.length === 0) return { Xs: [], means: [], stds: [] };
  const nFeatures = X[0].length;
  const means: number[] = Array(nFeatures).fill(0);
  const stds: number[] = Array(nFeatures).fill(1);

  for (let j = 0; j < nFeatures; j++) {
    const col = X.map((row) => row[j]);
    const m = mean(col);
    const s = std(col, m);
    means[j] = m;
    stds[j] = s === 0 ? 1 : s;
  }

  const Xs = X.map((row) => row.map((v, j) => (v - means[j]) / stds[j]));
  return { Xs, means, stds };
}

export function trainLinearRegression(
  X: number[][],
  y: number[],
  options: TrainOptions = {},
): TrainResult {
  if (X.length === 0 || y.length === 0 || X.length !== y.length) {
    throw new Error("Training data is empty or misaligned");
  }
  const { learningRate = 0.01, epochs = 1000, l2 = 0.001 } = options;

  const { Xs, means, stds } = standardizeFeatures(X);
  const nSamples = Xs.length;
  const nFeatures = Xs[0].length;

  let w = Array(nFeatures).fill(0) as number[];
  let b = 0;

  let prevLoss = Infinity;
  let noImprove = 0;
  const patience = 50;

  for (let epoch = 0; epoch < epochs; epoch++) {
    let gradW = Array(nFeatures).fill(0) as number[];
    let gradB = 0;
    let loss = 0;

    for (let i = 0; i < nSamples; i++) {
      const yPred = dot(w, Xs[i]) + b;
      const err = yPred - y[i];
      loss += err * err;
      for (let j = 0; j < nFeatures; j++) {
        gradW[j] += (2 / nSamples) * err * Xs[i][j];
      }
      gradB += (2 / nSamples) * err;
    }

    // L2 regularization
    for (let j = 0; j < nFeatures; j++) {
      gradW[j] += (2 * l2 * w[j]) / nSamples;
      loss += l2 * w[j] * w[j];
    }

    // Update weights
    for (let j = 0; j < nFeatures; j++) w[j] -= learningRate * gradW[j];
    b -= learningRate * gradB;

    const mse = loss / nSamples;
    const rmse = Math.sqrt(mse);

    if (rmse + 1e-8 < prevLoss) {
      prevLoss = rmse;
      noImprove = 0;
    } else {
      noImprove++;
      if (noImprove > patience) break;
    }
  }

  // Metrics on training set
  const preds = Xs.map((row) => dot(w, row) + b);
  const yMean = mean(y);
  const ssRes = y.reduce((s, yi, i) => s + (yi - preds[i]) ** 2, 0);
  const ssTot = y.reduce((s, yi) => s + (yi - yMean) ** 2, 0) || 1;
  const rmse = Math.sqrt(ssRes / nSamples);
  const r2 = 1 - ssRes / ssTot;

  return {
    model: {
      coefficients: w,
      intercept: b,
      featureMeans: means,
      featureStd: stds,
    },
    rmse,
    r2,
    iterations: Math.min(epochs, noImprove),
  };
}

export function predict(model: LinearModel, x: number[]): number {
  if (x.length !== model.coefficients.length) {
    throw new Error("Feature vector length mismatch");
  }
  const xs = x.map((v, j) => (v - model.featureMeans[j]) / model.featureStd[j]);
  return dot(model.coefficients, xs) + model.intercept;
}
