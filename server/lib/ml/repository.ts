import Database from "../database";
import { LinearModel } from "./linear";

export type StoredModel = {
  name: string;
  version: number;
  createdAt: Date;
  model: LinearModel;
  metrics: { rmse: number; r2: number };
  trainingCount: number;
};

export type TrainingExample = {
  features: number[];
  label: number; // creditsPerYear
  meta?: any;
  createdAt: Date;
};

export class MLRepository {
  private static instance: MLRepository;
  static getInstance(): MLRepository {
    if (!this.instance) this.instance = new MLRepository();
    return this.instance;
  }

  private modelsCol() {
    return Database.getInstance().getDb().collection<StoredModel>("ml_models");
  }
  private examplesCol() {
    return Database.getInstance()
      .getDb()
      .collection<TrainingExample>("ml_training_examples");
  }

  async saveModel(doc: StoredModel) {
    await this.modelsCol().insertOne(doc as any);
  }

  async getLatestModel(
    name = "carbonEstimatorV1",
  ): Promise<StoredModel | null> {
    return await this.modelsCol()
      .find({ name })
      .sort({ version: -1, createdAt: -1 })
      .limit(1)
      .next();
  }

  async nextVersion(name = "carbonEstimatorV1"): Promise<number> {
    const last = await this.getLatestModel(name);
    return (last?.version ?? 0) + 1;
  }

  async addExample(example: TrainingExample) {
    await this.examplesCol().insertOne(example as any);
  }

  async getAllExamples(limit = 10000): Promise<TrainingExample[]> {
    const cursor = this.examplesCol().find({}).limit(limit);
    const arr: TrainingExample[] = [];
    for await (const doc of cursor) arr.push(doc);
    return arr;
  }

  async countExamples(): Promise<number> {
    return this.examplesCol().countDocuments();
  }
}
