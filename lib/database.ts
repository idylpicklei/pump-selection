import Database from "better-sqlite3";
import path from "path";

// Database interface
export interface Pump {
  id?: number;
  name: string;
  gpm_value: number;
  efficiency_min: number;
  efficiency_max: number;
  image_path: string;
  created_at?: string;
  updated_at?: string;
}

// Database utility class
class DatabaseManager {
  private db: Database.Database;

  constructor() {
    // Create database in the project root
    const dbPath = path.join(process.cwd(), "pump_data.db");
    this.db = new Database(dbPath);
    this.initializeDatabase();
  }

  private initializeDatabase() {
    // Create pumps table if it doesn't exist
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS pumps (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        gpm_value INTEGER NOT NULL,
        efficiency_min REAL NOT NULL,
        efficiency_max REAL NOT NULL,
        image_path TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    this.db.exec(createTableSQL);

    // Create trigger to update updated_at timestamp
    const triggerSQL = `
      CREATE TRIGGER IF NOT EXISTS update_pumps_timestamp 
      AFTER UPDATE ON pumps
      BEGIN
        UPDATE pumps SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
      END
    `;

    this.db.exec(triggerSQL);
  }

  // Insert a new pump
  insertPump(pump: Omit<Pump, "id" | "created_at" | "updated_at">): number {
    const stmt = this.db.prepare(`
      INSERT INTO pumps (name, gpm_value, efficiency_min, efficiency_max, image_path)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      pump.name,
      pump.gpm_value,
      pump.efficiency_min,
      pump.efficiency_max,
      pump.image_path
    );
    return result.lastInsertRowid as number;
  }

  // Get all pumps
  getAllPumps(): Pump[] {
    const stmt = this.db.prepare("SELECT * FROM pumps ORDER BY gpm_value");
    return stmt.all() as Pump[];
  }

  // Get pump by name
  getPumpByName(name: string): Pump | undefined {
    const stmt = this.db.prepare("SELECT * FROM pumps WHERE name = ?");
    return stmt.get(name) as Pump | undefined;
  }

  // Get pumps by GPM range
  getPumpsByGPMRange(minGPM: number, maxGPM: number): Pump[] {
    const stmt = this.db.prepare(
      "SELECT * FROM pumps WHERE gpm_value BETWEEN ? AND ? ORDER BY gpm_value"
    );
    return stmt.all(minGPM, maxGPM) as Pump[];
  }

  // Get pumps by efficiency range
  getPumpsByEfficiencyRange(
    minEfficiency: number,
    maxEfficiency: number
  ): Pump[] {
    const stmt = this.db.prepare(
      "SELECT * FROM pumps WHERE efficiency_min >= ? AND efficiency_max <= ? ORDER BY gpm_value"
    );
    return stmt.all(minEfficiency, maxEfficiency) as Pump[];
  }

  // Search pumps by name
  searchPumps(searchTerm: string): Pump[] {
    const stmt = this.db.prepare(
      "SELECT * FROM pumps WHERE name LIKE ? OR gpm_value LIKE ? ORDER BY gpm_value"
    );
    const searchPattern = `%${searchTerm}%`;
    return stmt.all(searchPattern, searchPattern) as Pump[];
  }

  // Update a pump
  updatePump(
    id: number,
    pump: Partial<Omit<Pump, "id" | "created_at" | "updated_at">>
  ): boolean {
    const fields = Object.keys(pump)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(pump);

    const stmt = this.db.prepare(`UPDATE pumps SET ${fields} WHERE id = ?`);
    const result = stmt.run(...values, id);

    return result.changes > 0;
  }

  // Delete a pump
  deletePump(id: number): boolean {
    const stmt = this.db.prepare("DELETE FROM pumps WHERE id = ?");
    const result = stmt.run(id);
    return result.changes > 0;
  }

  // Clear all pumps
  clearAllPumps(): void {
    this.db.exec("DELETE FROM pumps");
  }

  // Seed database with initial data
  seedDatabase(
    pumpData: Omit<Pump, "id" | "created_at" | "updated_at">[]
  ): void {
    const insertStmt = this.db.prepare(`
      INSERT OR REPLACE INTO pumps (name, gpm_value, efficiency_min, efficiency_max, image_path)
      VALUES (?, ?, ?, ?, ?)
    `);

    const insertMany = this.db.transaction((pumps) => {
      for (const pump of pumps) {
        insertStmt.run(
          pump.name,
          pump.gpm_value,
          pump.efficiency_min,
          pump.efficiency_max,
          pump.image_path
        );
      }
    });

    insertMany(pumpData);
  }

  // Close database connection
  close(): void {
    this.db.close();
  }
}

// Export singleton instance
let dbManager: DatabaseManager | null = null;

export function getDatabase(): DatabaseManager {
  if (!dbManager) {
    dbManager = new DatabaseManager();
  }
  return dbManager;
}

// Export the class for testing
export { DatabaseManager };
