"use client";

import { LineChart } from "@mui/x-charts/LineChart";
import { useState, useEffect } from "react";
import DecidePump from "./openAi";

interface PumpVariables {
  pressure: number;
  staticWaterLevel: number;
  pumpSettingDepth: number;
  gallonsPerMinute: number;
}

interface Pump {
  name: string;
  efficencyRange: [number, number];
  value: number;
  imagePath: string;
}

interface FilterState {
  minGPM: number;
  maxGPM: number;
  minEfficiency: number;
  maxEfficiency: number;
  searchTerm: string;
  showImages: boolean;
}

export default function Home() {
  const [variables, setVariables] = useState<PumpVariables>({
    pressure: 60,
    staticWaterLevel: 100,
    pumpSettingDepth: 7,
    gallonsPerMinute: 18,
  });

  const [selectedPump, setSelectedPump] = useState<string | null>(null);
  const [pumpData, setPumpData] = useState<Pump[]>([]);
  const [filteredPumps, setFilteredPumps] = useState<Pump[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    minGPM: 0,
    maxGPM: 100,
    minEfficiency: 0,
    maxEfficiency: 100,
    searchTerm: "",
    showImages: false,
  });

  // Load pump data on component mount
  useEffect(() => {
    const loadPumpData = async () => {
      try {
        const response = await fetch("/floWise.json");
        const data = await response.json();
        setPumpData(data.floWise);
        setFilteredPumps(data.floWise);
      } catch (error) {
        console.error("Error loading pump data:", error);
      }
    };
    loadPumpData();
  }, []);

  // Apply filters whenever filters change
  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...pumpData];

      // Filter by GPM range
      filtered = filtered.filter(
        (pump) => pump.value >= filters.minGPM && pump.value <= filters.maxGPM
      );

      // Filter by efficiency range
      filtered = filtered.filter(
        (pump) =>
          pump.efficencyRange[0] >= filters.minEfficiency &&
          pump.efficencyRange[1] <= filters.maxEfficiency
      );

      // Filter by search term
      if (filters.searchTerm) {
        filtered = filtered.filter(
          (pump) =>
            pump.name
              .toLowerCase()
              .includes(filters.searchTerm.toLowerCase()) ||
            pump.value.toString().includes(filters.searchTerm)
        );
      }

      setFilteredPumps(filtered);
    };

    applyFilters();
  }, [filters, pumpData]);

  const handleVariableChange = (key: keyof PumpVariables, value: number) => {
    setVariables((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      minGPM: 0,
      maxGPM: 100,
      minEfficiency: 0,
      maxEfficiency: 100,
      searchTerm: "",
      showImages: false,
    });
  };

  const applyPresetFilter = (preset: string) => {
    switch (preset) {
      case "low-flow":
        setFilters({
          ...filters,
          minGPM: 0,
          maxGPM: 15,
          searchTerm: "",
        });
        break;
      case "medium-flow":
        setFilters({
          ...filters,
          minGPM: 15,
          maxGPM: 40,
          searchTerm: "",
        });
        break;
      case "high-flow":
        setFilters({
          ...filters,
          minGPM: 40,
          maxGPM: 100,
          searchTerm: "",
        });
        break;
      case "exact-match":
        setFilters({
          ...filters,
          minGPM: variables.gallonsPerMinute - 2,
          maxGPM: variables.gallonsPerMinute + 2,
          searchTerm: "",
        });
        break;
    }
  };

  const getImagePath = (pumpName: string) => {
    // Map pump names to their corresponding image files
    const imageMap: { [key: string]: string } = {
      "5gpm": "/FloWise/2025 FloWise-S-Series Pump Curve Book.jpg",
      "7gpm": "/FloWise/2025 FloWise-S-Series Pump 2.jpg",
      "10gpm": "/FloWise/2025 FloWise-S-Series Pump Curve Book 3.jpg",
      "13gpm": "/FloWise/2025 FloWise-S-Series Pump Curve Book 4.jpg",
      "18gpm": "/FloWise/2025 FloWise-S-Series Pump Curve Book 5.jpg",
      "25gpm": "/FloWise/2025 FloWise-S-Series Pump Curve Book 6.jpg",
      "35gpm": "/FloWise/2025 FloWise-S-Series Pump Curve Book 7.jpg",
      "40gpm": "/FloWise/2025 FloWise-S-Series Pump Curve Book 8.jpg",
      "55gpm": "/FloWise/2025 FloWise-S-Series Pump Curve Book 9.jpg",
      "60gpm": "/FloWise/2025 FloWise-S-Series Pump Curve Book 10.jpg",
      "80gpm": "/FloWise/2025 FloWise-S-Series Pump Curve Book 11.jpg",
    };
    return (
      imageMap[pumpName] || "/FloWise/2025 FloWise-S-Series Pump Curve Book.jpg"
    );
  };

  const generatePumpSelection = async () => {
    console.log("=== PUMP SELECTION GENERATION STARTED ===");
    console.log("Input Variables:", variables);

    try {
      // Automatically apply filters based on current input
      const targetGPM = variables.gallonsPerMinute;
      setFilters((prev) => ({
        ...prev,
        minGPM: Math.max(0, targetGPM - 5),
        maxGPM: targetGPM + 5,
        searchTerm: "",
      }));

      // Show images by default when generating pump selection
      setFilters((prev) => ({
        ...prev,
        showImages: true,
      }));

      console.log("Filters applied based on input values");
    } catch (error) {
      console.error("Error in pump selection:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Generate Pump Selection button clicked!");
    await generatePumpSelection();
  };

  // Calculate total head (pressure * 2.31 + static water level + pump setting depth)
  const totalHead =
    variables.pressure * 2.31 +
    variables.staticWaterLevel +
    (variables.pressure * 2.31 + variables.pumpSettingDepth);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            DPWD Pump Selection Tool
          </h1>
        </div>

        {/* Filtering Section */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              FloWise Pump Filter
            </h2>
            <button
              onClick={resetFilters}
              className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Reset Filters
            </button>
          </div>

          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* GPM Range */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">
                GPM Range
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={filters.minGPM}
                  onChange={(e) =>
                    handleFilterChange(
                      "minGPM",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="Min"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={filters.maxGPM}
                  onChange={(e) =>
                    handleFilterChange(
                      "maxGPM",
                      parseFloat(e.target.value) || 100
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="Max"
                />
              </div>
            </div>

            {/* Efficiency Range */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">
                Efficiency Range
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={filters.minEfficiency}
                  onChange={(e) =>
                    handleFilterChange(
                      "minEfficiency",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="Min"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={filters.maxEfficiency}
                  onChange={(e) =>
                    handleFilterChange(
                      "maxEfficiency",
                      parseFloat(e.target.value) || 100
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="Max"
                />
              </div>
            </div>

            {/* Search */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">
                Search
              </label>
              <input
                type="text"
                value={filters.searchTerm}
                onChange={(e) =>
                  handleFilterChange("searchTerm", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="Search pumps..."
              />
            </div>

            {/* Show Images Toggle */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">
                Display Options
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showImages"
                  checked={filters.showImages}
                  onChange={(e) =>
                    handleFilterChange("showImages", e.target.checked)
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="showImages" className="text-sm text-gray-900">
                  Show Pump Images
                </label>
              </div>
            </div>
          </div>

          {/* Quick Filter Presets */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Quick Filters:
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => applyPresetFilter("low-flow")}
                className="bg-blue-100 hover:bg-blue-200 text-blue-800 text-sm font-medium px-3 py-1 rounded-lg transition-colors duration-200"
              >
                Low Flow (0-15 GPM)
              </button>
              <button
                onClick={() => applyPresetFilter("medium-flow")}
                className="bg-green-100 hover:bg-green-200 text-green-800 text-sm font-medium px-3 py-1 rounded-lg transition-colors duration-200"
              >
                Medium Flow (15-40 GPM)
              </button>
              <button
                onClick={() => applyPresetFilter("high-flow")}
                className="bg-orange-100 hover:bg-orange-200 text-orange-800 text-sm font-medium px-3 py-1 rounded-lg transition-colors duration-200"
              >
                High Flow (40+ GPM)
              </button>
              <button
                onClick={() => applyPresetFilter("exact-match")}
                className="bg-purple-100 hover:bg-purple-200 text-purple-800 text-sm font-medium px-3 py-1 rounded-lg transition-colors duration-200"
              >
                Match Current GPM (±2)
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4">
            <p className="text-sm text-gray-800">
              Showing {filteredPumps.length} of {pumpData.length} pumps
            </p>
          </div>

          {/* Pump Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPumps.map((pump, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {pump.name}
                  </h3>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                    {pump.value} GPM
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-800">Efficiency Range:</span>
                    <span className="font-medium text-gray-900">
                      {pump.efficencyRange[0]} - {pump.efficencyRange[1]} GPM
                    </span>
                  </div>
                </div>

                {filters.showImages && (
                  <div className="mt-4">
                    <img
                      src={getImagePath(pump.name)}
                      alt={`${pump.name} pump curve`}
                      className="w-full h-48 object-cover rounded-lg border border-gray-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src =
                          "/FloWise/2025 FloWise-S-Series Pump Curve Book.jpg";
                      }}
                    />
                    <p className="text-xs text-gray-700 mt-2 text-center">
                      Pump Curve Chart
                    </p>
                  </div>
                )}

                <button
                  onClick={() => setSelectedPump(pump.name)}
                  className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Select This Pump
                </button>
              </div>
            ))}
          </div>

          {filteredPumps.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-700 text-lg">
                No pumps match your current filters.
              </p>
              <button
                onClick={resetFilters}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
