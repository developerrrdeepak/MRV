import 'dotenv/config';
import Database from '../server/lib/database';
import { MLRepository } from '../server/lib/ml/repository';
import { trainLinearRegression } from '../server/lib/ml/linear';

async function main() {
  const db = Database.getInstance();
  await db.connect();
  const repo = MLRepository.getInstance();

  const count = await repo.countExamples();
  if (count < 10) {
    console.error(`Not enough training examples: ${count} (need >= 10)`);
    process.exit(2);
  }

  const examples = await repo.getAllExamples();
  const X = examples.map((e) => e.features);
  const y = examples.map((e) => e.label);
  const result = trainLinearRegression(X, y, { learningRate: 0.02, epochs: 2000, l2: 0.0005 });

  const version = await repo.nextVersion();
  await repo.saveModel({
    name: 'carbonEstimatorV1',
    version,
    createdAt: new Date(),
    model: result.model,
    metrics: { rmse: result.rmse, r2: result.r2 },
    trainingCount: examples.length,
  });

  console.log(JSON.stringify({ success: true, version, rmse: result.rmse, r2: result.r2, trainingCount: examples.length }));
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
