import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { Badge } from './ui/badge'
import { useApp } from '../App'
import { 
  Plus, 
  Save, 
  X, 
  Edit3,
  Trash2,
  Palette,
  Tag,
  FileText,
  Smile,
  AlertCircle,
  Check,
  Grid3X3,
  List
} from 'lucide-react'

const CategoryManagement = ({ isOpen, onClose }) => {
  const { categories, setCategories, words, setWords, addXP } = useApp()
  const [newCategory, setNewCategory] = useState({
    name: '',
    emoji: '',
    color: 'from-blue-400 to-indigo-400',
    description: ''
  })
  const [editingCategory, setEditingCategory] = useState(null)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [viewMode, setViewMode] = useState('grid')

  const colorOptions = [
    { value: 'from-red-400 to-orange-400', label: 'Red-Orange', preview: 'bg-gradient-to-r from-red-400 to-orange-400' },
    { value: 'from-green-400 to-blue-400', label: 'Green-Blue', preview: 'bg-gradient-to-r from-green-400 to-blue-400' },
    { value: 'from-purple-400 to-pink-400', label: 'Purple-Pink', preview: 'bg-gradient-to-r from-purple-400 to-pink-400' },
    { value: 'from-yellow-400 to-orange-400', label: 'Yellow-Orange', preview: 'bg-gradient-to-r from-yellow-400 to-orange-400' },
    { value: 'from-blue-400 to-indigo-400', label: 'Blue-Indigo', preview: 'bg-gradient-to-r from-blue-400 to-indigo-400' },
    { value: 'from-pink-400 to-purple-400', label: 'Pink-Purple', preview: 'bg-gradient-to-r from-pink-400 to-purple-400' },
    { value: 'from-green-400 to-emerald-400', label: 'Green-Emerald', preview: 'bg-gradient-to-r from-green-400 to-emerald-400' },
    { value: 'from-orange-400 to-red-400', label: 'Orange-Red', preview: 'bg-gradient-to-r from-orange-400 to-red-400' },
    { value: 'from-teal-400 to-cyan-400', label: 'Teal-Cyan', preview: 'bg-gradient-to-r from-teal-400 to-cyan-400' },
    { value: 'from-amber-400 to-yellow-400', label: 'Amber-Yellow', preview: 'bg-gradient-to-r from-amber-400 to-yellow-400' }
  ]

  const validateCategory = (categoryData) => {
    const newErrors = {}
    
    if (!categoryData.name.trim()) {
      newErrors.name = 'Category name is required'
    } else if (categoryData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    } else if (categoryData.name.length > 30) {
      newErrors.name = 'Name must be less than 30 characters'
    }
    
    if (!categoryData.emoji.trim()) {
      newErrors.emoji = 'Emoji is required'
    }
    
    if (categoryData.description && categoryData.description.length > 200) {
      newErrors.description = 'Description must be less than 200 characters'
    }
    
    // Check for duplicate names (excluding current category when editing)
    const existingCategory = categories.find(c => 
      c.name.toLowerCase() === categoryData.name.toLowerCase() && 
      (!editingCategory || c.id !== editingCategory.id)
    )
    if (existingCategory) {
      newErrors.name = 'A category with this name already exists'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field, value) => {
    if (editingCategory) {
      setEditingCategory(prev => ({ ...prev, [field]: value }))
    } else {
      setNewCategory(prev => ({ ...prev, [field]: value }))
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleAddCategory = async () => {
    if (!validateCategory(newCategory)) return
    
    setIsSubmitting(true)
    
    try {
      const categoryData = {
        ...newCategory,
        id: `custom_${Date.now()}`,
        subcategories: [],
        isCustom: true
      }
      
      setCategories(prev => [...prev, categoryData])
      addXP(20, 'category_created')
      
      // Reset form
      setNewCategory({
        name: '',
        emoji: '',
        color: 'from-blue-400 to-indigo-400',
        description: ''
      })
      
    } catch (error) {
      console.error('Error adding category:', error)
      setErrors({ submit: 'Failed to add category. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditCategory = (category) => {
    setEditingCategory({ ...category })
  }

  const handleUpdateCategory = async () => {
    if (!validateCategory(editingCategory)) return
    
    setIsSubmitting(true)
    
    try {
      setCategories(prev =>
        prev.map(cat =>
          cat.id === editingCategory.id ? editingCategory : cat
        )
      )
      
      addXP(10, 'category_updated')
      setEditingCategory(null)
      
    } catch (error) {
      console.error('Error updating category:', error)
      setErrors({ submit: 'Failed to update category. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteCategory = (categoryId) => {
    const category = categories.find(c => c.id === categoryId)
    
    // Don't allow deleting default categories
    if (!category?.isCustom) {
      alert('Cannot delete default categories')
      return
    }
    
    // Check if category has words
    const wordsInCategory = words.filter(w => w.category === categoryId)
    
    if (wordsInCategory.length > 0) {
      const confirmMessage = `This category contains ${wordsInCategory.length} word(s). These words will be moved to the "Objects & Things" category. Continue?`
      if (!window.confirm(confirmMessage)) return
      
      // Move words to default category
      setWords(prev =>
        prev.map(word =>
          word.category === categoryId ? { ...word, category: 'objects' } : word
        )
      )
    }
    
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(prev => prev.filter(cat => cat.id !== categoryId))
      addXP(5, 'category_deleted')
    }
  }

  const getCategoryStats = (categoryId) => {
    const categoryWords = words.filter(w => w.category === categoryId)
    const knownWords = categoryWords.filter(w => w.known)
    return {
      total: categoryWords.length,
      known: knownWords.length,
      percentage: categoryWords.length > 0 ? Math.round((knownWords.length / categoryWords.length) * 100) : 0
    }
  }

  const CategoryCard = ({ category }) => {
    const stats = getCategoryStats(category.id)
    const isCustom = category.isCustom
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="group relative"
      >
        <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          {/* Action Menu */}
          {isCustom && (
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditCategory(category)}
                  className="h-8 w-8 p-0 bg-white shadow-sm hover:bg-blue-50"
                >
                  <Edit3 className="w-3 h-3 text-blue-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteCategory(category.id)}
                  className="h-8 w-8 p-0 bg-white shadow-sm hover:bg-red-50"
                >
                  <Trash2 className="w-3 h-3 text-red-600" />
                </Button>
              </div>
            </div>
          )}

          <CardContent className="p-6 text-center space-y-4">
            <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center text-2xl`}>
              {category.emoji}
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">{category.name}</h3>
              {category.description && (
                <p className="text-sm text-gray-600 mb-3">{category.description}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="text-sm text-gray-600">
                {stats.known}/{stats.total} words learned
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${stats.percentage}%` }}
                />
              </div>
              <div className="text-xs text-gray-500">{stats.percentage}% complete</div>
            </div>

            <div className="flex justify-center space-x-2">
              <Badge variant={isCustom ? "default" : "secondary"}>
                {isCustom ? "Custom" : "Default"}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {stats.total} words
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  const CategoryListItem = ({ category }) => {
    const stats = getCategoryStats(category.id)
    const isCustom = category.isCustom
    
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="group"
      >
        <Card className="transition-all duration-300 hover:shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center text-xl`}>
                {category.emoji}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
                  <Badge variant={isCustom ? "default" : "secondary"} className="text-xs">
                    {isCustom ? "Custom" : "Default"}
                  </Badge>
                </div>
                
                {category.description && (
                  <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                )}
                
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-600">
                    {stats.known}/{stats.total} words ({stats.percentage}%)
                  </div>
                  <div className="flex-1 max-w-32">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full"
                        style={{ width: `${stats.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {isCustom && (
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditCategory(category)}
                    className="hover:bg-blue-50"
                  >
                    <Edit3 className="w-4 h-4 text-blue-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteCategory(category.id)}
                    className="hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  if (!isOpen) return null

  const currentData = editingCategory || newCategory

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
          className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Tag className="w-6 h-6" />
                <h2 className="text-2xl font-bold">Category Management</h2>
              </div>
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

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Add/Edit Category Form */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Plus className="w-5 h-5 mr-2" />
                      {editingCategory ? 'Edit Category' : 'Add New Category'}
                    </CardTitle>
                    <CardDescription>
                      {editingCategory ? 'Update category details' : 'Create a new word category'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Category Name */}
                    <div className="space-y-2">
                      <Label htmlFor="categoryName" className="flex items-center">
                        <FileText className="w-4 h-4 mr-2" />
                        Category Name *
                      </Label>
                      <Input
                        id="categoryName"
                        placeholder="e.g., Science & Technology"
                        value={currentData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className={errors.name ? 'border-red-500' : ''}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Emoji */}
                    <div className="space-y-2">
                      <Label htmlFor="categoryEmoji" className="flex items-center">
                        <Smile className="w-4 h-4 mr-2" />
                        Emoji *
                      </Label>
                      <Input
                        id="categoryEmoji"
                        placeholder="🔬"
                        value={currentData.emoji}
                        onChange={(e) => handleInputChange('emoji', e.target.value)}
                        className={`text-2xl text-center ${errors.emoji ? 'border-red-500' : ''}`}
                      />
                      {errors.emoji && (
                        <p className="text-red-500 text-sm flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.emoji}
                        </p>
                      )}
                    </div>

                    {/* Color */}
                    <div className="space-y-2">
                      <Label className="flex items-center">
                        <Palette className="w-4 h-4 mr-2" />
                        Color Theme
                      </Label>
                      <div className="grid grid-cols-5 gap-2">
                        {colorOptions.map((color) => (
                          <button
                            key={color.value}
                            type="button"
                            onClick={() => handleInputChange('color', color.value)}
                            className={`w-8 h-8 rounded-full ${color.preview} border-2 transition-all ${
                              currentData.color === color.value 
                                ? 'border-gray-800 scale-110' 
                                : 'border-gray-300 hover:scale-105'
                            }`}
                            title={color.label}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label htmlFor="categoryDescription">
                        Description (optional)
                      </Label>
                      <Textarea
                        id="categoryDescription"
                        placeholder="Brief description of this category"
                        value={currentData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows={3}
                        className={errors.description ? 'border-red-500' : ''}
                      />
                      {errors.description && (
                        <p className="text-red-500 text-sm flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.description}
                        </p>
                      )}
                    </div>

                    {/* Preview */}
                    <div className="space-y-2">
                      <Label>Preview</Label>
                      <div className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${currentData.color} flex items-center justify-center text-xl mr-3`}>
                          {currentData.emoji || '❓'}
                        </div>
                        <div>
                          <div className="font-semibold">{currentData.name || 'Category Name'}</div>
                          {currentData.description && (
                            <div className="text-sm text-gray-600">{currentData.description}</div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      {editingCategory ? (
                        <>
                          <Button
                            onClick={handleUpdateCategory}
                            disabled={isSubmitting}
                            className="flex-1"
                          >
                            {isSubmitting ? (
                              <div className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Updating...
                              </div>
                            ) : (
                              <div className="flex items-center">
                                <Save className="w-4 h-4 mr-2" />
                                Update
                              </div>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setEditingCategory(null)}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button
                          onClick={handleAddCategory}
                          disabled={isSubmitting}
                          className="w-full"
                        >
                          {isSubmitting ? (
                            <div className="flex items-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Adding...
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <Plus className="w-4 h-4 mr-2" />
                              Add Category
                            </div>
                          )}
                        </Button>
                      )}
                    </div>

                    {/* Error Message */}
                    {errors.submit && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm flex items-center">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          {errors.submit}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Categories List */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Existing Categories</CardTitle>
                        <CardDescription>
                          Manage your word categories ({categories.length} total)
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant={viewMode === 'grid' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setViewMode('grid')}
                        >
                          <Grid3X3 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant={viewMode === 'list' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setViewMode('list')}
                        >
                          <List className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {viewMode === 'grid' ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {categories.map((category) => (
                          <CategoryCard key={category.id} category={category} />
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {categories.map((category) => (
                          <CategoryListItem key={category.id} category={category} />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default CategoryManagement

