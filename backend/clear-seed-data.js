// One-off utility: removes the sample/dummy opportunities inserted by seed.js
// (source: "seed"), leaving only real opportunities discovered via the AI
// search feature (source: "ai") or added manually.
//
// Usage: npm run clear-seed

const mongoose = require("mongoose");
require("dotenv").config();
const { Opportunity } = require("./models");

async function main() {
  await mongoose.connect(process.env.MONGO_URL, { dbName: process.env.DB_NAME });
  const result = await Opportunity.deleteMany({ source: "seed" });
  console.log(`Removed ${result.deletedCount} sample opportunities.`);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});