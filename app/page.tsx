"use client";

import { useState } from "react";

interface PumpVariables {
  pressure: number;
  staticWaterLevel: number;
  pumpSettingDepth: number;
}

export default function Home() {
  const [variables, setVariables] = useState<PumpVariables>({
    pressure: 60,
    staticWaterLevel: 100,
    pumpSettingDepth: 20,
  });

  const handleVariableChange = (key: keyof PumpVariables, value: number) => {
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

  // Calculate total head (pressure * 2.31 + static water level + pump setting depth)
  const totalHead =
    variables.pressure * 2.31 +
    variables.staticWaterLevel +
    variables.pumpSettingDepth;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            DPWD Pump Selection Tool
          </h1>
          <p className="text-gray-600">
            Enter the pressure and depth measurements for your pump application
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-xl p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pressure */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Pressure (PSI)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={variables.pressure.toString()}
                onChange={(e) =>
                  handleVariableChange(
                    "pressure",
                    parseFloat(e.target.value) || 0
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                placeholder="Enter pressure"
              />
              <p className="text-xs text-gray-500">
                Required pressure in pounds per square inch
              </p>
            </div>

            {/* Static Water Level */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Static Water Level (feet)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={variables.staticWaterLevel.toString()}
                onChange={(e) =>
                  handleVariableChange(
                    "staticWaterLevel",
                    parseFloat(e.target.value) || 0
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                placeholder="Enter static water level"
              />
              <p className="text-xs text-gray-500">
                Distance from ground surface to water level
              </p>
            </div>

            {/* Pump Setting Depth */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Pump Setting Depth (feet)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={variables.pumpSettingDepth.toString()}
                onChange={(e) =>
                  handleVariableChange(
                    "pumpSettingDepth",
                    parseFloat(e.target.value) || 0
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                placeholder="Enter pump setting depth"
              />
              <p className="text-xs text-gray-500">
                Depth where the pump will be installed
              </p>
            </div>
          </div>

          {/* Visual Representation */}
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Well Diagram
            </h3>
            <div className="relative h-64 bg-gradient-to-b from-blue-100 to-blue-300 rounded-lg border-2 border-blue-400">
              {/* Ground Surface */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-green-600"></div>
              <div className="absolute top-2 left-4 text-xs font-medium text-green-800">
                Ground Surface
              </div>

              {/* Static Water Level */}
              <div
                className="absolute left-4 right-4 border-l-2 border-blue-600"
                style={{
                  top: `${Math.min(
                    20 + variables.staticWaterLevel * 2,
                    200
                  )}px`,
                }}
              >
                <div className="absolute -left-6 top-0 text-xs font-medium text-blue-800">
                  Static Water Level: {variables.staticWaterLevel} ft
                </div>
              </div>

              {/* Pump Setting Depth */}
              <div
                className="absolute left-4 right-4 border-l-2 border-red-600"
                style={{
                  top: `${Math.min(
                    20 + variables.pumpSettingDepth * 2,
                    200
                  )}px`,
                }}
              >
                <div className="absolute -left-6 top-0 text-xs font-medium text-red-800">
                  Pump Setting: {variables.pumpSettingDepth} ft
                </div>
              </div>

              {/* Water Level Indicator */}
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-blue-500 opacity-60"></div>
              <div className="absolute bottom-2 left-4 text-xs font-medium text-white">
                Water
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Measurement Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Pressure:</span>
                <p className="text-gray-800">{variables.pressure} PSI</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">
                  Static Water Level:
                </span>
                <p className="text-gray-800">
                  {variables.staticWaterLevel} feet
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-600">
                  Pump Setting Depth:
                </span>
                <p className="text-gray-800">
                  {variables.pumpSettingDepth} feet
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Total Head:</span>
                <p className="text-gray-800">{totalHead.toFixed(1)} feet</p>
                <span className="text-xs text-gray-500">
                  (I didnt know what this was but i did pressure x 2.31 + water
                  level + pump setting depth)
                </span>
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
