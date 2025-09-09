import { NextRequest, NextResponse } from "next/server";
import { getDatabase, Pump } from "@/lib/database";

// GET /api/pumps - Get all pumps or filtered pumps
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const db = getDatabase();

    // Get query parameters
    const minGPM = searchParams.get("minGPM");
    const maxGPM = searchParams.get("maxGPM");
    const minEfficiency = searchParams.get("minEfficiency");
    const maxEfficiency = searchParams.get("maxEfficiency");
    const search = searchParams.get("search");

    let pumps: Pump[];

    if (search) {
      // Search pumps by name or GPM
      pumps = db.searchPumps(search);
    } else if (minGPM && maxGPM) {
      // Filter by GPM range
      pumps = db.getPumpsByGPMRange(parseInt(minGPM), parseInt(maxGPM));
    } else if (minEfficiency && maxEfficiency) {
      // Filter by efficiency range
      pumps = db.getPumpsByEfficiencyRange(
        parseFloat(minEfficiency),
        parseFloat(maxEfficiency)
      );
    } else {
      // Get all pumps
      pumps = db.getAllPumps();
    }

    return NextResponse.json({ pumps });
  } catch (error) {
    console.error("Error fetching pumps:", error);
    return NextResponse.json(
      { error: "Failed to fetch pumps" },
      { status: 500 }
    );
  }
}

// POST /api/pumps - Create a new pump
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = getDatabase();

    const newPump = {
      name: body.name,
      gpm_value: body.gpm_value,
      efficiency_min: body.efficiency_min,
      efficiency_max: body.efficiency_max,
      image_path: body.image_path || "",
    };

    const id = db.insertPump(newPump);
    const pump = db.getPumpByName(newPump.name);

    return NextResponse.json({ pump }, { status: 201 });
  } catch (error) {
    console.error("Error creating pump:", error);
    return NextResponse.json(
      { error: "Failed to create pump" },
      { status: 500 }
    );
  }
}

// PUT /api/pumps - Update a pump
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const db = getDatabase();

    const { id, ...updateData } = body;
    const success = db.updatePump(id, updateData);

    if (success) {
      const updatedPump = db.getPumpByName(updateData.name);
      return NextResponse.json({ pump: updatedPump });
    } else {
      return NextResponse.json({ error: "Pump not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error updating pump:", error);
    return NextResponse.json(
      { error: "Failed to update pump" },
      { status: 500 }
    );
  }
}

// DELETE /api/pumps - Delete a pump
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Pump ID is required" },
        { status: 400 }
      );
    }

    const db = getDatabase();
    const success = db.deletePump(parseInt(id));

    if (success) {
      return NextResponse.json({ message: "Pump deleted successfully" });
    } else {
      return NextResponse.json({ error: "Pump not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error deleting pump:", error);
    return NextResponse.json(
      { error: "Failed to delete pump" },
      { status: 500 }
    );
  }
}
