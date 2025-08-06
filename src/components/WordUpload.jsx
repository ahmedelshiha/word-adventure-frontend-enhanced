import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { useApp } from '../App'
import { 
  Upload, 
  Image as ImageIcon, 
  Link, 
  Save,
  X,
  Check,
  AlertCircle
} from 'lucide-react'

const WordUpload = ({ onClose, onSuccess }) => {
  const { words, setWords, categories } = useApp()
  const [formData, setFormData] = useState({
    word: '',
    definition: '',
    difficulty: 'easy',
    category: categories.length > 0 ? categories[0].id : '',
    imageType: 'emoji', // 'emoji', 'upload', 'url'
    image: '',
    imageUrl: '',
    imageFile: null
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewImage, setPreviewImage] = useState(null)

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.word.trim()) {
      newErrors.word = 'Word is required'
    }
    
    if (!formData.definition.trim()) {
      newErrors.definition = 'Definition is required'
    }

    if (!formData.category) {
      newErrors.category = 'Category is required'
    }
    
    if (formData.imageType === 'url' && !formData.imageUrl.trim()) {
      newErrors.imageUrl = 'Image URL is required'
    }
    
    if (formData.imageType === 'upload' && !formData.imageFile) {
      newErrors.imageFile = 'Please select an image file'
    }
    
    if (formData.imageType === 'emoji' && !formData.image.trim()) {
      newErrors.image = 'Please enter an emoji'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          imageFile: 'Please select a valid image file'
        }))
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          imageFile: 'Image file must be less than 5MB'
        }))
        return
      }
      
      setFormData(prev => ({
        ...prev,
        imageFile: file
      }))
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewImage(e.target.result)
      }
      reader.readAsDataURL(file)
      
      // Clear error
      setErrors(prev => ({
        ...prev,
        imageFile: ''
      }))
    }
  }

  const handleImageUrlChange = (url) => {
    handleInputChange('imageUrl', url)
    if (url.trim()) {
      setPreviewImage(url)
    } else {
      setPreviewImage(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Create new word object
      const newWord = {
        id: Math.max(...words.map(w => w.id), 0) + 1,
        word: formData.word.trim(),
        definition: formData.definition.trim(),
        difficulty: formData.difficulty,
        category: formData.category,
        known: false,
        isCustom: true,
        dateAdded: new Date().toISOString()
      }
      
      // Handle image based on type
      if (formData.imageType === 'emoji') {
        newWord.image = formData.image.trim()
        newWord.imageType = 'emoji'
      } else if (formData.imageType === 'url') {
        newWord.image = formData.imageUrl.trim()
        newWord.imageType = 'url'
      } else if (formData.imageType === 'upload' && formData.imageFile) {
        // In a real app, you would upload the file to a server
        // For now, we'll use the data URL
        newWord.image = previewImage
        newWord.imageType = 'upload'
        newWord.fileName = formData.imageFile.name
      }
      
      // Add to words list
      setWords(prev => [...prev, newWord])
      
      // Show success message
      if (onSuccess) {
        onSuccess(newWord)
      }
      
      // Reset form
      setFormData({
        word: '',
        definition: '',
        difficulty: 'easy',
        category: categories.length > 0 ? categories[0].id : '',
        imageType: 'emoji',
        image: '',
        imageUrl: '',
        imageFile: null
      })
      setPreviewImage(null)
      
      // Close modal after a short delay
      setTimeout(() => {
        if (onClose) {
          onClose()
        }
      }, 1500)
      
    } catch (error) {
      console.error('Error adding word:', error)
      setErrors({ submit: 'Failed to add word. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderImageInput = () => {
    switch (formData.imageType) {
      case 'emoji':
        return (
          <div className="space-y-2">
            <Label htmlFor="emoji">Emoji</Label>
            <Input
              id="emoji"
              type="text"
              placeholder="Enter an emoji (e.g., 🍎)"
              value={formData.image}
              onChange={(e) => handleInputChange('image', e.target.value)}
              className={`text-2xl text-center ${errors.image ? 'border-red-500' : ''}`}
              maxLength={10}
            />
            {errors.image && (
              <p className="text-sm text-red-500 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.image}
              </p>
            )}
          </div>
        )
      
      case 'upload':
        return (
          <div className="space-y-2">
            <Label htmlFor="imageFile">Upload Image</Label>
            <div className="border-2 border-dashed border-purple-300 rounded-lg p-6 text-center">
              {previewImage ? (
                <div className="space-y-2">
                  <img 
                    src={previewImage} 
                    alt="Preview" 
                    className="w-24 h-24 object-cover rounded-lg mx-auto"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setPreviewImage(null)
                      setFormData(prev => ({ ...prev, imageFile: null }))
                    }}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-12 w-12 text-purple-400 mx-auto" />
                  <div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('imageFile').click()}
                    >
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Choose Image
                    </Button>
                    <input
                      id="imageFile"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              )}
            </div>
            {errors.imageFile && (
              <p className="text-sm text-red-500 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.imageFile}
              </p>
            )}
          </div>
        )
      
      case 'url':
        return (
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={formData.imageUrl}
              onChange={(e) => handleImageUrlChange(e.target.value)}
              className={errors.imageUrl ? 'border-red-500' : ''}
            />
            {previewImage && (
              <div className="mt-2">
                <img 
                  src={previewImage} 
                  alt="Preview" 
                  className="w-24 h-24 object-cover rounded-lg"
                  onError={() => {
                    setPreviewImage(null)
                    setErrors(prev => ({
                      ...prev,
                      imageUrl: 'Invalid image URL'
                    }))
                  }}
                />
              </div>
            )}
            {errors.imageUrl && (
              <p className="text-sm text-red-500 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.imageUrl}
              </p>
            )}
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <Card className="bg-white shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold flex items-center">
                <Upload className="h-6 w-6 mr-2" />
                Add New Word
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Word Name */}
              <div className="space-y-2">
                <Label htmlFor="word">Word *</Label>
                <Input
                  id="word"
                  type="text"
                  placeholder="Enter the word"
                  value={formData.word}
                  onChange={(e) => handleInputChange('word', e.target.value)}
                  className={`text-lg ${errors.word ? 'border-red-500' : ''}`}
                />
                {errors.word && (
                  <p className="text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.word}
                  </p>
                )}
              </div>

              {/* Definition */}
              <div className="space-y-2">
                <Label htmlFor="definition">Definition *</Label>
                <Textarea
                  id="definition"
                  placeholder="Enter the definition or meaning"
                  value={formData.definition}
                  onChange={(e) => handleInputChange('definition', e.target.value)}
                  className={`min-h-[80px] ${errors.definition ? 'border-red-500' : ''}`}
                />
                {errors.definition && (
                  <p className="text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.definition}
                  </p>
                )}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleInputChange('category', value)}
                >
                  <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center">
                          <span className="mr-2">{category.emoji}</span>
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.category}
                  </p>
                )}
              </div>

              {/* Difficulty Level */}
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty Level</Label>
                <Select
                  value={formData.difficulty}
                  onValueChange={(value) => handleInputChange('difficulty', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Image Type Selection */}
              <div className="space-y-2">
                <Label>Image Type</Label>
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant={formData.imageType === 'emoji' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      handleInputChange('imageType', 'emoji')
                      setPreviewImage(null)
                    }}
                    className="flex-1"
                  >
                    😊 Emoji
                  </Button>
                  <Button
                    type="button"
                    variant={formData.imageType === 'upload' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      handleInputChange('imageType', 'upload')
                      setPreviewImage(null)
                    }}
                    className="flex-1"
                  >
                    <Upload className="h-4 w-4 mr-1" />
                    Upload
                  </Button>
                  <Button
                    type="button"
                    variant={formData.imageType === 'url' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      handleInputChange('imageType', 'url')
                      setPreviewImage(null)
                    }}
                    className="flex-1"
                  >
                    <Link className="h-4 w-4 mr-1" />
                    URL
                  </Button>
                </div>
              </div>

              {/* Image Input */}
              {renderImageInput()}

              {/* Error Message */}
              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.submit}
                  </p>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Adding...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Save className="h-4 w-4 mr-2" />
                      Add Word
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

export default WordUpload
