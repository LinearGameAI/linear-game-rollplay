import React from 'react'
import { useKeyButtonConfig, KeyButtonConfig } from '../context/KeyButtonContext'

export default function ControlPanel() {
  const { config, setConfig } = useKeyButtonConfig()

  const handleChange = (key: keyof KeyButtonConfig, value: string) => {
    const numValue = parseInt(value) || 0
    setConfig({
      ...config,
      [key]: numValue,
    })
  }

  return (
    <div className="hidden fixed top-8 right-8 z-50 p-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 select-none w-64">
      <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Control Panel</h3>
      
      <div className="space-y-4">
        {/* Width Control */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs text-white/70">
            <label htmlFor="width-input">Width (px)</label>
            <span>{config.width}px</span>
          </div>
          <input
            id="width-input"
            type="range"
            min="30"
            max="120"
            value={config.width}
            onChange={(e) => handleChange('width', e.target.value)}
            className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer hover:bg-white/30 accent-white"
          />
        </div>

        {/* Height Control */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs text-white/70">
            <label htmlFor="height-input">Height (px)</label>
            <span>{config.height}px</span>
          </div>
          <input
            id="height-input"
            type="range"
            min="30"
            max="120"
            value={config.height}
            onChange={(e) => handleChange('height', e.target.value)}
            className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer hover:bg-white/30 accent-white"
          />
        </div>

        {/* Font Size Control */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs text-white/70">
            <label htmlFor="fontsize-input">Font Size (px)</label>
            <span>{config.fontSize}px</span>
          </div>
          <input
            id="fontsize-input"
            type="range"
            min="12"
            max="48"
            value={config.fontSize}
            onChange={(e) => handleChange('fontSize', e.target.value)}
            className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer hover:bg-white/30 accent-white"
          />
        </div>
      </div>
    </div>
  )
}
