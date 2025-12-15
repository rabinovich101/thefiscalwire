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
import { useTheme } from "@/components/providers/ThemeProvider";

interface HeatmapSidebarProps {
  selectedIndex: HeatmapIndex;
  onIndexChange: (index: HeatmapIndex) => void;
  selectedDataType: string;
  onDataTypeChange: (dataType: string) => void;
  isMobile?: boolean;
}

export function HeatmapSidebar({
  selectedIndex,
  onIndexChange,
  selectedDataType,
  onDataTypeChange,
  isMobile = false,
}: HeatmapSidebarProps) {
  const { theme } = useTheme();
  const isLightMode = theme === "light";
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
    <div
      className={`flex flex-col h-full overflow-hidden ${isMobile ? 'w-full' : 'w-[220px] min-w-[220px]'}`}
      style={{
        backgroundColor: 'var(--heatmap-bg)',
        borderRightColor: isMobile ? 'transparent' : 'var(--heatmap-border)',
        borderRightWidth: isMobile ? '0' : '1px',
        borderRightStyle: 'solid',
      }}
    >
      {/* Map Filter Header */}
      <div
        className="px-4 py-3"
        style={{
          borderBottomColor: 'var(--heatmap-border)',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
        }}
      >
        <h2
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: 'var(--heatmap-help-text)' }}
        >
          Map Filter
        </h2>
      </div>

      {/* Index Selection */}
      <div
        className="px-3 py-2 space-y-0.5"
        style={{
          borderBottomColor: 'var(--heatmap-border)',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
        }}
      >
        {INDEX_INFO.map((indexInfo) => (
          <button
            key={indexInfo.id}
            onClick={() => onIndexChange(indexInfo.id)}
            className="w-full text-left px-3 py-1.5 rounded text-sm transition-colors"
            style={{
              backgroundColor: selectedIndex === indexInfo.id ? '#1d4ed8' : 'transparent',
              color: selectedIndex === indexInfo.id ? '#ffffff' : 'var(--heatmap-sector-label)',
              fontWeight: selectedIndex === indexInfo.id ? 500 : 400,
            }}
            onMouseEnter={(e) => {
              if (selectedIndex !== indexInfo.id) {
                e.currentTarget.style.backgroundColor = 'var(--heatmap-surface)';
                e.currentTarget.style.color = 'var(--foreground)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedIndex !== indexInfo.id) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--heatmap-sector-label)';
              }
            }}
          >
            {indexInfo.name}
          </button>
        ))}
      </div>

      {/* Data Type Dropdown */}
      <div
        className="px-3 py-3"
        style={{
          borderBottomColor: 'var(--heatmap-border)',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
        }}
      >
        <div className="relative">
          <button
            onClick={() => setIsDataTypeOpen(!isDataTypeOpen)}
            className="w-full flex items-center justify-between px-3 py-2 rounded text-sm transition-colors"
            style={{
              backgroundColor: 'var(--heatmap-surface)',
              borderColor: 'var(--heatmap-border)',
              borderWidth: '1px',
              borderStyle: 'solid',
              color: 'var(--foreground)',
            }}
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
              <div
                className="absolute left-0 right-0 top-full mt-1 rounded-lg shadow-xl z-50 max-h-[400px] overflow-y-auto"
                style={{
                  backgroundColor: 'var(--heatmap-surface)',
                  borderColor: 'var(--heatmap-border)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                }}
              >
                {DATA_TYPE_CATEGORIES.map((category) => {
                  const options = groupedDataTypes[category.id];
                  if (options.length === 0) return null;

                  return (
                    <div key={category.id}>
                      <div
                        className="px-3 py-2 text-xs font-semibold uppercase tracking-wider sticky top-0"
                        style={{
                          backgroundColor: 'var(--heatmap-bg)',
                          color: 'var(--heatmap-help-text)',
                        }}
                      >
                        {category.label}
                      </div>
                      {options.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => {
                            onDataTypeChange(option.id);
                            setIsDataTypeOpen(false);
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 text-sm transition-colors"
                          style={{
                            backgroundColor: selectedDataType === option.id ? '#1d4ed8' : 'transparent',
                            color: selectedDataType === option.id ? '#ffffff' : 'var(--heatmap-sector-label)',
                          }}
                          onMouseEnter={(e) => {
                            if (selectedDataType !== option.id) {
                              e.currentTarget.style.backgroundColor = 'var(--heatmap-bg)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (selectedDataType !== option.id) {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }
                          }}
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
