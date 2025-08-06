import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { useApp } from '../App'
import { 
  X, 
  Plus, 
  Edit2, 
  Trash2, 
  Save,
  Palette,
  Smile
} from 'lucide-react'

const CategoryManager = ({ onClose }) => {
  const { categories, addCategory, updateCategory, deleteCategory } = useApp()
  const [newCategory, setNewCategory] = useState({ name: '', emoji: '📂' })
  const [editingCategory, setEditingCategory] = useState(null)
  const [editForm, setEditForm] = useState({ name: '', emoji: '' })

  const colorOptions = [
    'from-red-400 to-orange-400',
    'from-green-400 to-blue-400',
    'from-purple-400 to-pink-400',
    'from-green-400 to-emerald-400',
    'from-yellow-400 to-red-400',
    'from-pink-400 to-purple-400',
    'from-blue-400 to-indigo-400',
    'from-orange-400 to-red-400',
    'from-cyan-400 to-blue-400',
    'from-amber-400 to-orange-400'
  ]

  const emojiOptions = [
    '📂', '📚', '🍎', '🐱', '🏠', '🌳', '🎨', '⭐', '🎯', '🔥',
    '🌟', '💎', '🎪', '🎭', '🚀', '🎮', '🏆', '🎲', '🎵', '🎈'
  ]

  const [selectedColor, setSelectedColor] = useState(colorOptions[0])

  const handleAddCategory = () => {
    if (newCategory.name.trim()) {
      addCategory({
        name: newCategory.name.trim(),
        emoji: newCategory.emoji,
        color: selectedColor
      })
      setNewCategory({ name: '', emoji: '📂' })
      setSelectedColor(colorOptions[0])
    }
  }

  const handleEditStart = (category) => {
    setEditingCategory(category.id)
    setEditForm({ name: category.name, emoji: category.emoji, color: category.color })
  }

  const handleEditSave = () => {
    if (editForm.name.trim()) {
      updateCategory(editingCategory, {
        name: editForm.name.trim(),
        emoji: editForm.emoji,
        color: editForm.color
      })
      setEditingCategory(null)
      setEditForm({ name: '', emoji: '', color: '' })
    }
  }

  const handleEditCancel = () => {
    setEditingCategory(null)
    setEditForm({ name: '', emoji: '', color: '' })
  }

  const defaultCategories = [
    'food', 'animals', 'objects', 'nature', 'body', 'colors', 'numbers', 'actions'
  ]

  const isDefaultCategory = (categoryId) => {
    return defaultCategories.includes(categoryId)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold flex items-center">
              <Palette className="h-6 w-6 mr-2" />
              Manage Categories
            </CardTitle>
            <Button
              onClick={onClose}
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 max-h-[70vh] overflow-y-auto">
          {/* Add New Category */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Add New Category
            </h3>
            
            <div className="bg-purple-50 rounded-xl p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-purple-700 mb-2">
                    Category Name
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter category name..."
                    value={newCategory.name}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                    className="border-purple-200 focus:border-purple-400"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-purple-700 mb-2">
                    Choose Emoji
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {emojiOptions.map((emoji) => (
                      <Button
                        key={emoji}
                        size="sm"
                        variant={newCategory.emoji === emoji ? "default" : "outline"}
                        className={`w-10 h-10 p-0 ${
                          newCategory.emoji === emoji 
                            ? 'bg-purple-500 text-white' 
                            : 'border-purple-200 hover:border-purple-400'
                        }`}
                        onClick={() => setNewCategory(prev => ({ ...prev, emoji }))}
                      >
                        <span className="text-lg">{emoji}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-purple-700 mb-2">
                  Choose Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((color) => (
                    <Button
                      key={color}
                      size="sm"
                      variant="outline"
                      className={`w-16 h-8 p-0 bg-gradient-to-r ${color} border-2 ${
                        selectedColor === color ? 'border-purple-500' : 'border-gray-200'
                      }`}
                      onClick={() => setSelectedColor(color)}
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-purple-600">Preview:</span>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r ${selectedColor} text-white`}>
                    <span className="mr-1">{newCategory.emoji}</span>
                    {newCategory.name || 'Category Name'}
                  </div>
                </div>
                
                <Button
                  onClick={handleAddCategory}
                  disabled={!newCategory.name.trim()}
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </div>
            </div>
          </div>

          {/* Existing Categories */}
          <div>
            <h3 className="text-lg font-semibold text-purple-800 mb-4">
              Existing Categories
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((category) => (
                <Card key={category.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    {editingCategory === category.id ? (
                      <div className="space-y-4">
                        <Input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                          className="border-purple-200 focus:border-purple-400"
                        />
                        
                        <div className="flex flex-wrap gap-1">
                          {emojiOptions.map((emoji) => (
                            <Button
                              key={emoji}
                              size="sm"
                              variant={editForm.emoji === emoji ? "default" : "outline"}
                              className={`w-8 h-8 p-0 text-sm ${
                                editForm.emoji === emoji 
                                  ? 'bg-purple-500 text-white' 
                                  : 'border-purple-200 hover:border-purple-400'
                              }`}
                              onClick={() => setEditForm(prev => ({ ...prev, emoji }))}
                            >
                              {emoji}
                            </Button>
                          ))}
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {colorOptions.map((color) => (
                            <Button
                              key={color}
                              size="sm"
                              variant="outline"
                              className={`w-12 h-6 p-0 bg-gradient-to-r ${color} border ${
                                editForm.color === color ? 'border-purple-500' : 'border-gray-200'
                              }`}
                              onClick={() => setEditForm(prev => ({ ...prev, color }))}
                            />
                          ))}
                        </div>
                        
                        <div className="flex justify-end space-x-2">
                          <Button
                            onClick={handleEditCancel}
                            size="sm"
                            variant="outline"
                            className="border-gray-300"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleEditSave}
                            size="sm"
                            className="bg-green-500 hover:bg-green-600 text-white"
                          >
                            <Save className="h-4 w-4 mr-1" />
                            Save
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r ${category.color} text-white`}>
                            <span className="mr-1">{category.emoji}</span>
                            {category.name}
                          </div>
                          {isDefaultCategory(category.id) && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        
                        <div className="flex space-x-1">
                          <Button
                            onClick={() => handleEditStart(category)}
                            size="sm"
                            variant="outline"
                            className="border-blue-300 text-blue-600 hover:bg-blue-50"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          
                          {!isDefaultCategory(category.id) && (
                            <Button
                              onClick={() => deleteCategory(category.id)}
                              size="sm"
                              variant="outline"
                              className="border-red-300 text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </motion.div>
    </motion.div>
  )
}

export default CategoryManager
