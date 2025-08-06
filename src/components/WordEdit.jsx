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
  Edit, 
  Save,
  X,
  Trash2,
  AlertCircle,
  Image as ImageIcon,
  Link,
  Upload
} from 'lucide-react'

const WordEdit = ({ word, onClose, onSuccess, onDelete }) => {
  const { words, setWords } = useApp()
  const [formData, setFormData] = useState({
    word: word.word || '',
    definition: word.definition || '',
    difficulty: word.difficulty || 'easy',
    imageType: word.imageType || 'emoji',
    image: word.image || '',
    imageUrl: word.imageType === 'url' ? word.image : '',
    imageFile: null
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewImage, setPreviewImage] = useState(
    word.imageType === 'url' || word.imageType === 'upload' ? word.image : null
  )
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.word.trim()) {
      newErrors.word = 'Word is required'
    }
    
    if (!formData.definition.trim()) {
      newErrors.definition = 'Definition is required'
    }
    
    if (formData.imageType === 'url' && !formData.imageUrl.trim()) {
      newErrors.imageUrl = 'Image URL is required'
    }
    
    if (formData.imageType === 'upload' && !formData.imageFile && !previewImage) {
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
      // Create updated word object
      const updatedWord = {
        ...word,
        word: formData.word.trim(),
        definition: formData.definition.trim(),
        difficulty: formData.difficulty,
        dateModified: new Date().toISOString()
      }
      
      // Handle image based on type
      if (formData.imageType === 'emoji') {
        updatedWord.image = formData.image.trim()
        updatedWord.imageType = 'emoji'
      } else if (formData.imageType === 'url') {
        updatedWord.image = formData.imageUrl.trim()
        updatedWord.imageType = 'url'
      } else if (formData.imageType === 'upload') {
        if (formData.imageFile) {
          // New file uploaded
          updatedWord.image = previewImage
          updatedWord.imageType = 'upload'
          updatedWord.fileName = formData.imageFile.name
        } else {
          // Keep existing image
          updatedWord.image = previewImage
          updatedWord.imageType = 'upload'
        }
      }
      
      // Update words list
      setWords(prev => prev.map(w => w.id === word.id ? updatedWord : w))
      
      // Show success message
      if (onSuccess) {
        onSuccess(updatedWord)
      }
      
      // Close modal after a short delay
      setTimeout(() => {
        if (onClose) {
          onClose()
        }
      }, 1500)
      
    } catch (error) {
      console.error('Error updating word:', error)
      setErrors({ submit: 'Failed to update word. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete(word)
    }
    if (onClose) {
      onClose()
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
                  <div className="space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('imageFile').click()}
                    >
                      <Upload className="h-4 w-4 mr-1" />
                      Change
                    </Button>
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

  if (showDeleteConfirm) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        onClick={(e) => e.target === e.currentTarget && setShowDeleteConfirm(false)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-md"
        >
          <Card className="bg-white shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-red-500 to-pink-500 text-white">
              <CardTitle className="text-xl font-bold flex items-center">
                <Trash2 className="h-5 w-5 mr-2" />
                Delete Word
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="text-6xl">⚠️</div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Are you sure you want to delete "{word.word}"?
                </h3>
                <p className="text-gray-600">
                  This action cannot be undone. The word will be permanently removed from your library.
                </p>
                
                <div className="flex space-x-3 pt-4">
                  <Button
                    onClick={() => setShowDeleteConfirm(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDelete}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    )
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
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold flex items-center">
                <Edit className="h-6 w-6 mr-2" />
                Edit Word
              </CardTitle>
              <div className="flex space-x-2">
                {word.isCustom && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="text-white hover:bg-white/20"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-white hover:bg-white/20"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
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
                      if (word.imageType === 'upload') {
                        setPreviewImage(word.image)
                      } else {
                        setPreviewImage(null)
                      }
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
                      if (word.imageType === 'url') {
                        setPreviewImage(word.image)
                        handleInputChange('imageUrl', word.image)
                      } else {
                        setPreviewImage(null)
                      }
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
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
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

export default WordEdit

