import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Badge } from './ui/badge'
import { useApp } from '../App'
import { 
  Plus, 
  Save, 
  X, 
  Upload, 
  Link, 
  Smile, 
  Volume2, 
  Eye, 
  Edit3,
  Trash2,
  ImageIcon,
  FileText,
  Lightbulb,
  Target,
  BookOpen,
  Check,
  AlertCircle
} from 'lucide-react'

const WordManagement = ({ isOpen, onClose, editingWord = null }) => {
  const { words, setWords, categories, addXP } = useApp()
  const [formData, setFormData] = useState({
    word: editingWord?.word || '',
    image: editingWord?.image || '',
    pronunciation: editingWord?.pronunciation || '',
    definition: editingWord?.definition || '',
    example: editingWord?.example || '',
    funFact: editingWord?.funFact || '',
    difficulty: editingWord?.difficulty || 'easy',
    category: editingWord?.category || 'food'
  })
  
  const [imageSource, setImageSource] = useState('emoji') // 'emoji', 'url', 'upload'
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [previewMode, setPreviewMode] = useState(false)
  const fileInputRef = useRef(null)

  const difficultyOptions = [
    { value: 'easy', label: 'Easy', color: 'bg-green-100 text-green-800', description: 'Simple words for beginners' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800', description: 'Intermediate vocabulary' },
    { value: 'hard', label: 'Hard', color: 'bg-red-100 text-red-800', description: 'Advanced words' }
  ]

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.word.trim()) {
      newErrors.word = 'Word is required'
    } else if (formData.word.length < 2) {
      newErrors.word = 'Word must be at least 2 characters'
    } else if (formData.word.length > 50) {
      newErrors.word = 'Word must be less than 50 characters'
    }
    
    if (!formData.image.trim()) {
      newErrors.image = 'Image/emoji is required'
    }
    
    if (!formData.definition.trim()) {
      newErrors.definition = 'Definition is required'
    } else if (formData.definition.length < 10) {
      newErrors.definition = 'Definition must be at least 10 characters'
    }
    
    if (formData.example && formData.example.length > 200) {
      newErrors.example = 'Example must be less than 200 characters'
    }
    
    if (formData.funFact && formData.funFact.length > 300) {
      newErrors.funFact = 'Fun fact must be less than 300 characters'
    }
    
    // Check for duplicate words (excluding current word when editing)
    const existingWord = words.find(w => 
      w.word.toLowerCase() === formData.word.toLowerCase() && 
      (!editingWord || w.id !== editingWord.id)
    )
    if (existingWord) {
      newErrors.word = 'This word already exists'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({ ...prev, image: 'Image must be less than 5MB' }))
        return
      }
      
      const reader = new FileReader()
      reader.onload = (e) => {
        handleInputChange('image', e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const speakWord = () => {
    if ('speechSynthesis' in window && formData.word) {
      const utterance = new SpeechSynthesisUtterance(formData.word)
      utterance.rate = 0.8
      utterance.pitch = 1.2
      speechSynthesis.speak(utterance)
    }
  }

  const handleSubmit = async () => {
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      const wordData = {
        ...formData,
        id: editingWord?.id || Date.now(),
        known: editingWord?.known || false
      }
      
      if (editingWord) {
        // Update existing word
        setWords(prev => prev.map(w => w.id === editingWord.id ? wordData : w))
        addXP(5, 'word_edited')
      } else {
        // Add new word
        setWords(prev => [...prev, wordData])
        addXP(15, 'word_created')
      }
      
      // Reset form
      setFormData({
        word: '',
        image: '',
        pronunciation: '',
        definition: '',
        example: '',
        funFact: '',
        difficulty: 'easy',
        category: 'food'
      })
      
      onClose()
    } catch (error) {
      console.error('Error saving word:', error)
      setErrors({ submit: 'Failed to save word. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderImageInput = () => {
    switch (imageSource) {
      case 'emoji':
        return (
          <div className="space-y-2">
            <Input
              placeholder="Enter emoji (e.g., 🍎, 🐱, 🏠)"
              value={formData.image}
              onChange={(e) => handleInputChange('image', e.target.value)}
              className="text-2xl text-center"
            />
            <p className="text-xs text-gray-500 text-center">
              Use emoji keyboard or copy from online emoji picker
            </p>
          </div>
        )
      
      case 'url':
        return (
          <div className="space-y-2">
            <Input
              placeholder="Enter image URL (https://...)"
              value={formData.image}
              onChange={(e) => handleInputChange('image', e.target.value)}
            />
            <p className="text-xs text-gray-500">
              Use a direct link to an image file
            </p>
          </div>
        )
      
      case 'upload':
        return (
          <div className="space-y-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
            >
              <Upload className="w-4 h-4 mr-2" />
              Choose Image File
            </Button>
            <p className="text-xs text-gray-500">
              Upload JPG, PNG, or GIF (max 5MB)
            </p>
          </div>
        )
      
      default:
        return null
    }
  }

  const renderPreview = () => (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-indigo-200">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-lg text-indigo-800">Word Preview</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="text-6xl mb-4">
          {formData.image.startsWith('data:') ? (
            <img src={formData.image} alt={formData.word} className="w-16 h-16 mx-auto object-cover rounded-lg" />
          ) : (
            formData.image || '❓'
          )}
        </div>
        
        <h3 className="text-2xl font-bold text-gray-800">{formData.word || 'Word'}</h3>
        
        {formData.pronunciation && (
          <p className="text-lg text-gray-600 italic">{formData.pronunciation}</p>
        )}
        
        {formData.definition && (
          <p className="text-gray-700">{formData.definition}</p>
        )}
        
        {formData.example && (
          <div className="bg-white rounded-lg p-3">
            <p className="text-sm text-gray-600 mb-1">Example:</p>
            <p className="text-gray-800 italic">"{formData.example}"</p>
          </div>
        )}
        
        {formData.funFact && (
          <div className="bg-yellow-50 rounded-lg p-3 border-l-4 border-yellow-400">
            <p className="text-sm text-yellow-600 mb-1 flex items-center">
              <Lightbulb className="w-4 h-4 mr-1" />
              Fun Fact:
            </p>
            <p className="text-yellow-800 text-sm">{formData.funFact}</p>
          </div>
        )}
        
        <div className="flex justify-center space-x-2">
          <Badge className={difficultyOptions.find(d => d.value === formData.difficulty)?.color}>
            {formData.difficulty}
          </Badge>
          <Badge variant="outline">
            {categories.find(c => c.id === formData.category)?.name || formData.category}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {editingWord ? <Edit3 className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                <h2 className="text-2xl font-bold">
                  {editingWord ? 'Edit Word' : 'Add New Word'}
                </h2>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPreviewMode(!previewMode)}
                  className="text-white hover:bg-white hover:bg-opacity-20"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {previewMode ? 'Edit' : 'Preview'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-white hover:bg-white hover:bg-opacity-20"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            {previewMode ? (
              renderPreview()
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Form Section */}
                <div className="space-y-6">
                  {/* Word Input */}
                  <div className="space-y-2">
                    <Label htmlFor="word" className="flex items-center">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Word *
                    </Label>
                    <div className="flex space-x-2">
                      <Input
                        id="word"
                        placeholder="Enter the word"
                        value={formData.word}
                        onChange={(e) => handleInputChange('word', e.target.value)}
                        className={errors.word ? 'border-red-500' : ''}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={speakWord}
                        disabled={!formData.word}
                      >
                        <Volume2 className="w-4 h-4" />
                      </Button>
                    </div>
                    {errors.word && (
                      <p className="text-red-500 text-sm flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.word}
                      </p>
                    )}
                  </div>

                  {/* Image/Emoji Input */}
                  <div className="space-y-3">
                    <Label className="flex items-center">
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Image/Emoji *
                    </Label>
                    
                    {/* Image Source Selector */}
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        variant={imageSource === 'emoji' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setImageSource('emoji')}
                      >
                        <Smile className="w-4 h-4 mr-1" />
                        Emoji
                      </Button>
                      <Button
                        type="button"
                        variant={imageSource === 'url' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setImageSource('url')}
                      >
                        <Link className="w-4 h-4 mr-1" />
                        URL
                      </Button>
                      <Button
                        type="button"
                        variant={imageSource === 'upload' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setImageSource('upload')}
                      >
                        <Upload className="w-4 h-4 mr-1" />
                        Upload
                      </Button>
                    </div>
                    
                    {renderImageInput()}
                    
                    {errors.image && (
                      <p className="text-red-500 text-sm flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.image}
                      </p>
                    )}
                  </div>

                  {/* Pronunciation */}
                  <div className="space-y-2">
                    <Label htmlFor="pronunciation">
                      Pronunciation (optional)
                    </Label>
                    <Input
                      id="pronunciation"
                      placeholder="e.g., /ˈæpəl/"
                      value={formData.pronunciation}
                      onChange={(e) => handleInputChange('pronunciation', e.target.value)}
                    />
                    <p className="text-xs text-gray-500">
                      Use phonetic spelling or IPA notation
                    </p>
                  </div>

                  {/* Definition */}
                  <div className="space-y-2">
                    <Label htmlFor="definition" className="flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      Definition *
                    </Label>
                    <Textarea
                      id="definition"
                      placeholder="A clear, simple definition of the word"
                      value={formData.definition}
                      onChange={(e) => handleInputChange('definition', e.target.value)}
                      rows={3}
                      className={errors.definition ? 'border-red-500' : ''}
                    />
                    {errors.definition && (
                      <p className="text-red-500 text-sm flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.definition}
                      </p>
                    )}
                  </div>
                </div>

                {/* Additional Details Section */}
                <div className="space-y-6">
                  {/* Category and Difficulty */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.emoji} {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="difficulty" className="flex items-center">
                        <Target className="w-4 h-4 mr-2" />
                        Difficulty
                      </Label>
                      <Select value={formData.difficulty} onValueChange={(value) => handleInputChange('difficulty', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {difficultyOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center space-x-2">
                                <span>{option.label}</span>
                                <span className="text-xs text-gray-500">- {option.description}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Example */}
                  <div className="space-y-2">
                    <Label htmlFor="example">
                      Example Sentence (optional)
                    </Label>
                    <Textarea
                      id="example"
                      placeholder="A sentence showing how to use this word"
                      value={formData.example}
                      onChange={(e) => handleInputChange('example', e.target.value)}
                      rows={2}
                      className={errors.example ? 'border-red-500' : ''}
                    />
                    {errors.example && (
                      <p className="text-red-500 text-sm flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.example}
                      </p>
                    )}
                  </div>

                  {/* Fun Fact */}
                  <div className="space-y-2">
                    <Label htmlFor="funFact" className="flex items-center">
                      <Lightbulb className="w-4 h-4 mr-2" />
                      Fun Fact (optional)
                    </Label>
                    <Textarea
                      id="funFact"
                      placeholder="An interesting fact about this word"
                      value={formData.funFact}
                      onChange={(e) => handleInputChange('funFact', e.target.value)}
                      rows={2}
                      className={errors.funFact ? 'border-red-500' : ''}
                    />
                    {errors.funFact && (
                      <p className="text-red-500 text-sm flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.funFact}
                      </p>
                    )}
                  </div>

                  {/* Image Preview */}
                  {formData.image && (
                    <div className="space-y-2">
                      <Label>Preview</Label>
                      <div className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg">
                        {formData.image.startsWith('data:') ? (
                          <img 
                            src={formData.image} 
                            alt="Preview" 
                            className="max-w-20 max-h-20 object-cover rounded-lg"
                          />
                        ) : (
                          <span className="text-4xl">{formData.image}</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Error Message */}
            {errors.submit && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {errors.submit}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              * Required fields
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Save className="w-4 h-4 mr-2" />
                    {editingWord ? 'Update Word' : 'Add Word'}
                  </div>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default WordManagement

