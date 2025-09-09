import { getDatabase } from "../lib/database";
import fs from "fs";
import path from "path";

// Read the existing pump data from JSON
const pumpDataPath = path.join(process.cwd(), "public", "floWise.json");
const pumpData = JSON.parse(fs.readFileSync(pumpDataPath, "utf8"));

// Transform the data to match our database schema
const transformedData = pumpData.floWise.map((pump: any) => ({
  name: pump.name,
  gpm_value: pump.value,
  efficiency_min: pump.efficencyRange[0],
  efficiency_max: pump.efficencyRange[1],
  image_path: pump.imagePath,
}));

// Seed the database
const db = getDatabase();
db.seedDatabase(transformedData);

console.log(
  "Database seeded successfully with",
  transformedData.length,
  "pumps"
);

// List all pumps to verify
const allPumps = db.getAllPumps();
console.log("Pumps in database:");
allPumps.forEach((pump) => {
  console.log(
    `- ${pump.name}: ${pump.gpm_value} GPM (${pump.efficiency_min}-${pump.efficiency_max})`
  );
});

db.close();
