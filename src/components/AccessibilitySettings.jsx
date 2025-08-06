/**
 * Accessibility Settings Component
 * Provides comprehensive accessibility options for inclusive learning
 */

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Eye, EyeOff, Volume2, VolumeX, Type, Palette, 
  MousePointer, Keyboard, Settings, Save, RotateCcw,
  Sun, Moon, Contrast, ZoomIn, ZoomOut
} from 'lucide-react'

const AccessibilitySettings = ({ onClose }) => {
  const [settings, setSettings] = useState({
    // Visual settings
    fontSize: 'medium', // small, medium, large, extra-large
    fontFamily: 'default', // default, dyslexic, serif
    highContrast: false,
    darkMode: false,
    reducedMotion: false,
    colorBlindFriendly: false,
    
    // Audio settings
    soundEnabled: true,
    speechRate: 1.0, // 0.5 to 2.0
    speechVolume: 1.0, // 0.0 to 1.0
    backgroundMusic: false,
    
    // Interaction settings
    keyboardNavigation: true,
    focusIndicators: true,
    clickDelay: 0, // 0, 500, 1000ms
    autoAdvance: false,
    
    // Learning settings
    showHints: true,
    repeatInstructions: false,
    simplifiedInterface: false,
    progressIndicators: true
  })

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('word_adventure_accessibility')
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings))
      } catch (error) {
        console.error('Failed to load accessibility settings:', error)
      }
    }
  }, [])

  // Apply settings to document
  useEffect(() => {
    applySettings(settings)
  }, [settings])

  const applySettings = (newSettings) => {
    const root = document.documentElement
    
    // Font size
    const fontSizeMap = {
      small: '14px',
      medium: '16px',
      large: '18px',
      'extra-large': '22px'
    }
    root.style.setProperty('--base-font-size', fontSizeMap[newSettings.fontSize])
    
    // Font family
    if (newSettings.fontFamily === 'dyslexic') {
      root.style.setProperty('--font-family', 'OpenDyslexic, Arial, sans-serif')
    } else if (newSettings.fontFamily === 'serif') {
      root.style.setProperty('--font-family', 'Georgia, serif')
    } else {
      root.style.setProperty('--font-family', 'Inter, system-ui, sans-serif')
    }
    
    // High contrast
    if (newSettings.highContrast) {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }
    
    // Dark mode
    if (newSettings.darkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    
    // Reduced motion
    if (newSettings.reducedMotion) {
      root.style.setProperty('--animation-duration', '0s')
      root.style.setProperty('--transition-duration', '0s')
    } else {
      root.style.removeProperty('--animation-duration')
      root.style.removeProperty('--transition-duration')
    }
    
    // Color blind friendly
    if (newSettings.colorBlindFriendly) {
      root.classList.add('colorblind-friendly')
    } else {
      root.classList.remove('colorblind-friendly')
    }
    
    // Focus indicators
    if (newSettings.focusIndicators) {
      root.classList.add('enhanced-focus')
    } else {
      root.classList.remove('enhanced-focus')
    }
  }

  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
  }

  const saveSettings = () => {
    localStorage.setItem('word_adventure_accessibility', JSON.stringify(settings))
    // Show success message
    const event = new CustomEvent('accessibility-settings-saved')
    window.dispatchEvent(event)
  }

  const resetSettings = () => {
    const defaultSettings = {
      fontSize: 'medium',
      fontFamily: 'default',
      highContrast: false,
      darkMode: false,
      reducedMotion: false,
      colorBlindFriendly: false,
      soundEnabled: true,
      speechRate: 1.0,
      speechVolume: 1.0,
      backgroundMusic: false,
      keyboardNavigation: true,
      focusIndicators: true,
      clickDelay: 0,
      autoAdvance: false,
      showHints: true,
      repeatInstructions: false,
      simplifiedInterface: false,
      progressIndicators: true
    }
    setSettings(defaultSettings)
  }

  const SettingGroup = ({ title, icon: Icon, children }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-4">
        <Icon className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  )

  const ToggleSetting = ({ label, description, value, onChange, icon: Icon }) => (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        {Icon && <Icon className="w-4 h-4 text-gray-500" />}
        <div>
          <label className="text-sm font-medium text-gray-900">{label}</label>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          value ? 'bg-purple-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            value ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )

  const SelectSetting = ({ label, description, value, options, onChange, icon: Icon }) => (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        {Icon && <Icon className="w-4 h-4 text-gray-500" />}
        <div>
          <label className="text-sm font-medium text-gray-900">{label}</label>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )

  const SliderSetting = ({ label, description, value, min, max, step, onChange, icon: Icon }) => (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          {Icon && <Icon className="w-4 h-4 text-gray-500" />}
          <div>
            <label className="text-sm font-medium text-gray-900">{label}</label>
            {description && (
              <p className="text-xs text-gray-500 mt-1">{description}</p>
            )}
          </div>
        </div>
        <span className="text-sm text-gray-600">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
      />
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-50 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Accessibility Settings</h2>
              <p className="text-gray-600 mt-1">Customize your learning experience</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Settings className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Visual Settings */}
            <SettingGroup title="Visual Settings" icon={Eye}>
              <SelectSetting
                label="Font Size"
                description="Adjust text size for better readability"
                value={settings.fontSize}
                options={[
                  { value: 'small', label: 'Small' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'large', label: 'Large' },
                  { value: 'extra-large', label: 'Extra Large' }
                ]}
                onChange={(value) => updateSetting('fontSize', value)}
                icon={Type}
              />
              
              <SelectSetting
                label="Font Family"
                description="Choose a font that's easier to read"
                value={settings.fontFamily}
                options={[
                  { value: 'default', label: 'Default' },
                  { value: 'dyslexic', label: 'Dyslexic Friendly' },
                  { value: 'serif', label: 'Serif' }
                ]}
                onChange={(value) => updateSetting('fontFamily', value)}
                icon={Type}
              />
              
              <ToggleSetting
                label="High Contrast"
                description="Increase contrast for better visibility"
                value={settings.highContrast}
                onChange={(value) => updateSetting('highContrast', value)}
                icon={Contrast}
              />
              
              <ToggleSetting
                label="Dark Mode"
                description="Use dark theme to reduce eye strain"
                value={settings.darkMode}
                onChange={(value) => updateSetting('darkMode', value)}
                icon={Moon}
              />
              
              <ToggleSetting
                label="Reduced Motion"
                description="Minimize animations and transitions"
                value={settings.reducedMotion}
                onChange={(value) => updateSetting('reducedMotion', value)}
                icon={EyeOff}
              />
              
              <ToggleSetting
                label="Color Blind Friendly"
                description="Use patterns and shapes in addition to colors"
                value={settings.colorBlindFriendly}
                onChange={(value) => updateSetting('colorBlindFriendly', value)}
                icon={Palette}
              />
            </SettingGroup>

            {/* Audio Settings */}
            <SettingGroup title="Audio Settings" icon={Volume2}>
              <ToggleSetting
                label="Sound Effects"
                description="Enable or disable sound effects"
                value={settings.soundEnabled}
                onChange={(value) => updateSetting('soundEnabled', value)}
                icon={settings.soundEnabled ? Volume2 : VolumeX}
              />
              
              <SliderSetting
                label="Speech Rate"
                description="Adjust how fast words are spoken"
                value={settings.speechRate}
                min={0.5}
                max={2.0}
                step={0.1}
                onChange={(value) => updateSetting('speechRate', value)}
                icon={Volume2}
              />
              
              <SliderSetting
                label="Speech Volume"
                description="Adjust speech volume level"
                value={settings.speechVolume}
                min={0.0}
                max={1.0}
                step={0.1}
                onChange={(value) => updateSetting('speechVolume', value)}
                icon={Volume2}
              />
              
              <ToggleSetting
                label="Background Music"
                description="Play soft background music while learning"
                value={settings.backgroundMusic}
                onChange={(value) => updateSetting('backgroundMusic', value)}
                icon={Volume2}
              />
            </SettingGroup>

            {/* Interaction Settings */}
            <SettingGroup title="Interaction Settings" icon={MousePointer}>
              <ToggleSetting
                label="Keyboard Navigation"
                description="Navigate using keyboard shortcuts"
                value={settings.keyboardNavigation}
                onChange={(value) => updateSetting('keyboardNavigation', value)}
                icon={Keyboard}
              />
              
              <ToggleSetting
                label="Enhanced Focus Indicators"
                description="Show clear focus outlines for keyboard navigation"
                value={settings.focusIndicators}
                onChange={(value) => updateSetting('focusIndicators', value)}
                icon={MousePointer}
              />
              
              <SelectSetting
                label="Click Delay"
                description="Add delay to prevent accidental clicks"
                value={settings.clickDelay}
                options={[
                  { value: 0, label: 'None' },
                  { value: 500, label: '0.5 seconds' },
                  { value: 1000, label: '1 second' }
                ]}
                onChange={(value) => updateSetting('clickDelay', parseInt(value))}
                icon={MousePointer}
              />
              
              <ToggleSetting
                label="Auto Advance"
                description="Automatically move to next word after correct answer"
                value={settings.autoAdvance}
                onChange={(value) => updateSetting('autoAdvance', value)}
                icon={MousePointer}
              />
            </SettingGroup>

            {/* Learning Settings */}
            <SettingGroup title="Learning Settings" icon={Settings}>
              <ToggleSetting
                label="Show Hints"
                description="Display helpful hints during learning"
                value={settings.showHints}
                onChange={(value) => updateSetting('showHints', value)}
                icon={Eye}
              />
              
              <ToggleSetting
                label="Repeat Instructions"
                description="Automatically repeat instructions"
                value={settings.repeatInstructions}
                onChange={(value) => updateSetting('repeatInstructions', value)}
                icon={Volume2}
              />
              
              <ToggleSetting
                label="Simplified Interface"
                description="Use a cleaner, less cluttered interface"
                value={settings.simplifiedInterface}
                onChange={(value) => updateSetting('simplifiedInterface', value)}
                icon={Settings}
              />
              
              <ToggleSetting
                label="Progress Indicators"
                description="Show progress bars and completion status"
                value={settings.progressIndicators}
                onChange={(value) => updateSetting('progressIndicators', value)}
                icon={Settings}
              />
            </SettingGroup>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={resetSettings}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset to Defaults
            </button>
            
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  saveSettings()
                  onClose()
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default AccessibilitySettings

