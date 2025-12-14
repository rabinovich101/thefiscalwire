"use client";

import { useState, useMemo } from "react";
import { ChevronDown, Check } from "lucide-react";
import {
  HeatmapIndex,
  INDEX_INFO,
  DATA_TYPE_OPTIONS,
  DATA_TYPE_CATEGORIES,
  DataTypeCategory,
} from "@/lib/stock-lists";

interface HeatmapSidebarProps {
  selectedIndex: HeatmapIndex;
  onIndexChange: (index: HeatmapIndex) => void;
  selectedDataType: string;
  onDataTypeChange: (dataType: string) => void;
}

export function HeatmapSidebar({
  selectedIndex,
  onIndexChange,
  selectedDataType,
  onDataTypeChange,
}: HeatmapSidebarProps) {
  const [isDataTypeOpen, setIsDataTypeOpen] = useState(false);

  // Get current data type label
  const selectedDataTypeLabel = useMemo(() => {
    const option = DATA_TYPE_OPTIONS.find((opt) => opt.id === selectedDataType);
    return option?.label || "1-Week";
  }, [selectedDataType]);

  // Group data type options by category
  const groupedDataTypes = useMemo(() => {
    const groups: Record<DataTypeCategory, typeof DATA_TYPE_OPTIONS> = {
      performance: [],
    };
    DATA_TYPE_OPTIONS.forEach((option) => {
      groups[option.category].push(option);
    });
    return groups;
  }, []);

  return (
    <div className="w-[220px] min-w-[220px] bg-[#111827] border-r border-[#1f2937] flex flex-col h-full overflow-hidden">
      {/* Map Filter Header */}
      <div className="px-4 py-3 border-b border-[#1f2937]">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Map Filter
        </h2>
      </div>

      {/* Index Selection */}
      <div className="px-3 py-2 space-y-0.5 border-b border-[#1f2937]">
        {INDEX_INFO.map((indexInfo) => (
          <button
            key={indexInfo.id}
            onClick={() => onIndexChange(indexInfo.id)}
            className={`
              w-full text-left px-3 py-1.5 rounded text-sm transition-colors
              ${
                selectedIndex === indexInfo.id
                  ? "bg-[#1d4ed8] text-white font-medium"
                  : "text-gray-300 hover:bg-[#1f2937] hover:text-white"
              }
            `}
          >
            {indexInfo.name}
          </button>
        ))}
      </div>

      {/* Data Type Dropdown */}
      <div className="px-3 py-3 border-b border-[#1f2937]">
        <div className="relative">
          <button
            onClick={() => setIsDataTypeOpen(!isDataTypeOpen)}
            className="w-full flex items-center justify-between px-3 py-2 bg-[#1f2937] border border-[#374151] rounded text-sm text-gray-200 hover:border-[#4b5563] transition-colors"
          >
            <span className="truncate">{selectedDataTypeLabel}</span>
            <ChevronDown
              className={`w-4 h-4 ml-2 flex-shrink-0 transition-transform ${
                isDataTypeOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isDataTypeOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsDataTypeOpen(false)}
              />

              {/* Menu */}
              <div className="absolute left-0 right-0 top-full mt-1 bg-[#1f2937] border border-[#374151] rounded-lg shadow-xl z-50 max-h-[400px] overflow-y-auto">
                {DATA_TYPE_CATEGORIES.map((category) => {
                  const options = groupedDataTypes[category.id];
                  if (options.length === 0) return null;

                  return (
                    <div key={category.id}>
                      <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-[#111827] sticky top-0">
                        {category.label}
                      </div>
                      {options.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => {
                            onDataTypeChange(option.id);
                            setIsDataTypeOpen(false);
                          }}
                          className={`
                            w-full flex items-center justify-between px-3 py-2 text-sm transition-colors
                            ${
                              selectedDataType === option.id
                                ? "bg-[#1d4ed8] text-white"
                                : "text-gray-300 hover:bg-[#374151]"
                            }
                          `}
                        >
                          <span>{option.label}</span>
                          {selectedDataType === option.id && (
                            <Check className="w-4 h-4" />
                          )}
                        </button>
                      ))}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

    </div>
  );
}
