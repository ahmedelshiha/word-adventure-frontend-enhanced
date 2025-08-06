import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Switch } from './ui/switch'
import { Label } from './ui/label'
import { Badge } from './ui/badge'
import { 
  Palette, 
  Type, 
  Eye, 
  Sparkles, 
  Monitor,
  Sun,
  Moon,
  Zap,
  Settings,
  Check,
  RotateCcw
} from 'lucide-react'

const AppearanceSettings = ({ settings, onSettingChange, onSave, onReset }) => {
  const [previewMode, setPreviewMode] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const colorThemes = [
    {
      id: 'default',
      name: 'Default',
      description: 'Purple & Pink gradient',
      primary: 'from-purple-500 to-pink-500',
      secondary: 'from-purple-100 to-pink-100',
      accent: 'purple-600',
      preview: 'bg-gradient-to-r from-purple-500 to-pink-500'
    },
    {
      id: 'ocean',
      name: 'Ocean Blue',
      description: 'Blue & Cyan gradient',
      primary: 'from-blue-500 to-cyan-500',
      secondary: 'from-blue-100 to-cyan-100',
      accent: 'blue-600',
      preview: 'bg-gradient-to-r from-blue-500 to-cyan-500'
    },
    {
      id: 'nature',
      name: 'Nature Green',
      description: 'Green & Emerald gradient',
      primary: 'from-green-500 to-emerald-500',
      secondary: 'from-green-100 to-emerald-100',
      accent: 'green-600',
      preview: 'bg-gradient-to-r from-green-500 to-emerald-500'
    },
    {
      id: 'sunset',
      name: 'Sunset Orange',
      description: 'Orange & Red gradient',
      primary: 'from-orange-500 to-red-500',
      secondary: 'from-orange-100 to-red-100',
      accent: 'orange-600',
      preview: 'bg-gradient-to-r from-orange-500 to-red-500'
    },
    {
      id: 'royal',
      name: 'Royal Purple',
      description: 'Deep purple theme',
      primary: 'from-purple-600 to-indigo-600',
      secondary: 'from-purple-100 to-indigo-100',
      accent: 'purple-700',
      preview: 'bg-gradient-to-r from-purple-600 to-indigo-600'
    },
    {
      id: 'candy',
      name: 'Bubblegum Pink',
      description: 'Pink & Rose gradient',
      primary: 'from-pink-500 to-rose-500',
      secondary: 'from-pink-100 to-rose-100',
      accent: 'pink-600',
      preview: 'bg-gradient-to-r from-pink-500 to-rose-500'
    }
  ]

  const fontSizes = [
    { value: 'small', label: 'Small', description: 'Compact text size', className: 'text-sm' },
    { value: 'medium', label: 'Medium', description: 'Standard text size', className: 'text-base' },
    { value: 'large', label: 'Large', description: 'Larger text for better readability', className: 'text-lg' }
  ]

  const getCurrentTheme = () => {
    return colorThemes.find(theme => theme.id === settings.colorTheme) || colorThemes[0]
  }

  const getCurrentFontSize = () => {
    return fontSizes.find(size => size.value === settings.fontSize) || fontSizes[1]
  }

  const handleChange = (key, value) => {
    onSettingChange(key, value)
    setHasChanges(true)
  }

  const handleSave = () => {
    onSave()
    setHasChanges(false)
  }

  const handleReset = () => {
    onReset()
    setHasChanges(false)
  }

  const PreviewCard = () => {
    const theme = getCurrentTheme()
    const fontSize = getCurrentFontSize()
    
    return (
      <Card className="overflow-hidden">
        <div className={`h-20 bg-gradient-to-r ${theme.primary}`}>
          <div className="p-4 text-white">
            <h3 className={`font-bold ${fontSize.className}`}>Word Adventure</h3>
            <p className="text-sm opacity-90">Live Preview</p>
          </div>
        </div>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center space-x-3">
            <div className="text-4xl">🍎</div>
            <div>
              <h4 className={`font-semibold ${fontSize.className}`}>Apple</h4>
              <p className={`text-gray-600 ${fontSize.value === 'small' ? 'text-xs' : fontSize.value === 'large' ? 'text-base' : 'text-sm'}`}>
                A round fruit with red or green skin
              </p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Badge className={`bg-gradient-to-r ${theme.primary} text-white`}>
              Easy
            </Badge>
            <Badge variant="outline">Food</Badge>
          </div>
          
          <Button 
            size="sm" 
            className={`bg-gradient-to-r ${theme.primary} hover:opacity-90 text-white`}
          >
            <Check className="w-4 h-4 mr-1" />
            Mark as Known
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <Palette className="w-6 h-6 mr-2" />
            Appearance Settings
          </h2>
          <p className="text-gray-600">Customize the look and feel of the application</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="w-4 h-4 mr-2" />
            {previewMode ? 'Hide' : 'Show'} Preview
          </Button>
          
          {hasChanges && (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
              >
                <Check className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Panel */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Color Theme */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="w-5 h-5 mr-2" />
                Color Theme
              </CardTitle>
              <CardDescription>
                Choose a color scheme for the interface
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {colorThemes.map((theme) => (
                  <motion.div
                    key={theme.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      settings.colorTheme === theme.id 
                        ? 'border-purple-500 bg-purple-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleChange('colorTheme', theme.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full ${theme.preview}`} />
                      <div className="flex-1">
                        <h4 className="font-medium">{theme.name}</h4>
                        <p className="text-sm text-gray-600">{theme.description}</p>
                      </div>
                      {settings.colorTheme === theme.id && (
                        <Check className="w-5 h-5 text-purple-600" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Typography */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Type className="w-5 h-5 mr-2" />
                Typography
              </CardTitle>
              <CardDescription>
                Adjust text size and readability
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Font Size</Label>
                <Select
                  value={settings.fontSize}
                  onValueChange={(value) => handleChange('fontSize', value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontSizes.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        <div className="flex items-center space-x-2">
                          <span className={size.className}>{size.label}</span>
                          <span className="text-xs text-gray-500">- {size.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Visual Effects */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="w-5 h-5 mr-2" />
                Visual Effects
              </CardTitle>
              <CardDescription>
                Control animations and visual feedback
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Animations</Label>
                  <p className="text-xs text-gray-500">Enable smooth animations and transitions</p>
                </div>
                <Switch
                  checked={settings.animationsEnabled}
                  onCheckedChange={(checked) => handleChange('animationsEnabled', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Reduced Motion</Label>
                  <p className="text-xs text-gray-500">Reduce motion for accessibility</p>
                </div>
                <Switch
                  checked={settings.reducedMotion}
                  onCheckedChange={(checked) => handleChange('reducedMotion', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Display Mode */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Monitor className="w-5 h-5 mr-2" />
                Display Mode
              </CardTitle>
              <CardDescription>
                Theme and display preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium flex items-center">
                    <Moon className="w-4 h-4 mr-2" />
                    Dark Mode
                  </Label>
                  <p className="text-xs text-gray-500">Use dark theme (coming soon)</p>
                </div>
                <Switch
                  checked={settings.darkMode}
                  onCheckedChange={(checked) => handleChange('darkMode', checked)}
                  disabled
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium flex items-center">
                    <Zap className="w-4 h-4 mr-2" />
                    High Contrast
                  </Label>
                  <p className="text-xs text-gray-500">Increase contrast for better visibility</p>
                </div>
                <Switch
                  checked={settings.highContrast || false}
                  onCheckedChange={(checked) => handleChange('highContrast', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Panel */}
        {previewMode && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Eye className="w-5 h-5 mr-2" />
                    Live Preview
                  </CardTitle>
                  <CardDescription>
                    See how your changes will look
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PreviewCard />
                </CardContent>
              </Card>
              
              {/* Current Settings Summary */}
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-sm">Current Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Theme:</span>
                    <span className="font-medium">{getCurrentTheme().name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Font Size:</span>
                    <span className="font-medium">{getCurrentFontSize().label}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Animations:</span>
                    <span className="font-medium">{settings.animationsEnabled ? 'On' : 'Off'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Reduced Motion:</span>
                    <span className="font-medium">{settings.reducedMotion ? 'On' : 'Off'}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                handleChange('colorTheme', 'default')
                handleChange('fontSize', 'medium')
                handleChange('animationsEnabled', true)
                handleChange('reducedMotion', false)
              }}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset to Default
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                handleChange('fontSize', 'large')
                handleChange('reducedMotion', true)
                handleChange('highContrast', true)
              }}
            >
              <Eye className="w-4 h-4 mr-2" />
              Accessibility Mode
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                handleChange('animationsEnabled', false)
                handleChange('reducedMotion', true)
              }}
            >
              <Zap className="w-4 h-4 mr-2" />
              Performance Mode
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AppearanceSettings

