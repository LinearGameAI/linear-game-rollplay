'use client'
import React, { useState } from 'react'
import { useKeyButtonConfig, KeyButtonConfig } from '../context/KeyButtonContext'
import { usePostSessionService } from '../services'

export default function ControlPanel() {
  const { mutateAsync } = usePostSessionService()
  const { config, setConfig } = useKeyButtonConfig()
  const [prompt, setPrompt] = useState('')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)

  const handleChange = (key: keyof KeyButtonConfig, value: string) => {
    const numValue = parseInt(value) || 0
    setConfig({
      ...config,
      [key]: numValue,
    })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
    }
  }

  const handleSubmit = () => {
    if (prompt && selectedImage) {
      mutateAsync({
        prompt,
        image: selectedImage,
      })
    } else {
      console.warn('Prompt or image is missing')
    }
  }

  return (
    <div className="fixed top-8 right-8 z-50 p-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 select-none w-64">
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

        {/* Divider */}
        <div className="border-t border-white/10 my-4"></div>

        {/* Prompt Input */}
        <div className="flex flex-col gap-1">
          <label htmlFor="prompt-input" className="text-xs text-white/70">Prompt</label>
          <textarea
            id="prompt-input"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt..."
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-white/40 resize-none"
            rows={3}
          />
        </div>

        {/* Image Upload */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-white/70">Upload Image</label>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="flex items-center justify-center w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm cursor-pointer hover:bg-white/20 transition-colors"
            >
              <span>{selectedImage ? selectedImage.name : 'Choose Image'}</span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full px-4 py-2 bg-white/20 hover:bg-white/30 border border-white/30 rounded-lg text-white text-sm font-medium transition-colors"
        >
          Submit
        </button>
      </div>
    </div>
  )
}
