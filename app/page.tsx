"use client";

import { useState } from "react";

interface PumpVariables {
  flowRate: number;
  pressure: number;
  pumpType: string;
  efficiency: number;
  material: string;
}

export default function Home() {
  const [variables, setVariables] = useState<PumpVariables>({
    flowRate: 0,
    pressure: 0,
    pumpType: "centrifugal",
    efficiency: 80,
    material: "stainless_steel",
  });

  const pumpTypes = [
    { value: "centrifugal", label: "Centrifugal" },
    { value: "positive_displacement", label: "Positive Displacement" },
    { value: "submersible", label: "Submersible" },
    { value: "diaphragm", label: "Diaphragm" },
    { value: "gear", label: "Gear Pump" },
  ];

  const materials = [
    { value: "stainless_steel", label: "Stainless Steel" },
    { value: "cast_iron", label: "Cast Iron" },
    { value: "bronze", label: "Bronze" },
    { value: "plastic", label: "Plastic" },
    { value: "titanium", label: "Titanium" },
  ];

  const handleVariableChange = (
    key: keyof PumpVariables,
    value: string | number
  ) => {
    setVariables((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Selected variables:", variables);
    // Here you can add logic to process the selection
    alert("Pump selection submitted! Check console for details.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            DPWD Pump Selection Tool
          </h1>
          <p className="text-gray-600">
            Select the appropriate variables for your pump application
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-xl p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Flow Rate */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Flow Rate (GPM)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={variables.flowRate}
                onChange={(e) =>
                  handleVariableChange(
                    "flowRate",
                    parseFloat(e.target.value) || 0
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter flow rate"
              />
            </div>

            {/* Pressure */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Pressure (PSI)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={variables.pressure}
                onChange={(e) =>
                  handleVariableChange(
                    "pressure",
                    parseFloat(e.target.value) || 0
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter pressure"
              />
            </div>

            {/* Pump Type */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Pump Type
              </label>
              <select
                value={variables.pumpType}
                onChange={(e) =>
                  handleVariableChange("pumpType", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {pumpTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Efficiency */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Efficiency (%)
              </label>
              <div className="relative">
                <input
                  type="range"
                  min="50"
                  max="95"
                  step="5"
                  value={variables.efficiency}
                  onChange={(e) =>
                    handleVariableChange("efficiency", parseInt(e.target.value))
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <span className="absolute -top-6 right-0 text-sm text-gray-600">
                  {variables.efficiency}%
                </span>
              </div>
            </div>

            {/* Material */}
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Material
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {materials.map((material) => (
                  <label
                    key={material.value}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="material"
                      value={material.value}
                      checked={variables.material === material.value}
                      onChange={(e) =>
                        handleVariableChange("material", e.target.value)
                      }
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      {material.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Selection Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Flow Rate:</span>
                <p className="text-gray-800">{variables.flowRate} GPM</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Pressure:</span>
                <p className="text-gray-800">{variables.pressure} PSI</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Pump Type:</span>
                <p className="text-gray-800">
                  {pumpTypes.find((t) => t.value === variables.pumpType)?.label}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Efficiency:</span>
                <p className="text-gray-800">{variables.efficiency}%</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Material:</span>
                <p className="text-gray-800">
                  {materials.find((m) => m.value === variables.material)?.label}
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 text-center">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Generate Pump Selection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
