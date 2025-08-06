import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Input } from './ui/input'
import { useApp } from '../App'
import WordUpload from './WordUpload'
import WordEdit from './WordEdit'
import CategoryManager from './CategoryManager'
import LoadingState from './LoadingState'
import ImageFallback from './ImageFallback'
import SwipeableCard from './SwipeableCard'
import { 
  Search, 
  Volume2, 
  Filter, 
  BookOpen,
  Check,
  X,
  Star,
  Plus,
  Edit,
  Trash2,
  Smartphone
} from 'lucide-react'

const WordLibrary = () => {
  const { words, updateWordStatus, setWords, categories } = useApp()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingWord, setEditingWord] = useState(null)
  const [uploadSuccess, setUploadSuccess] = useState(null)
  const [editSuccess, setEditSuccess] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  const filteredWords = words.filter(word => {
    const matchesSearch = word.word.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDifficulty = selectedDifficulty === 'all' || word.difficulty === selectedDifficulty
    const matchesStatus = selectedStatus === 'all' ||
      (selectedStatus === 'known' && word.known) ||
      (selectedStatus === 'unknown' && !word.known)
    const matchesCategory = selectedCategory === 'all' || word.category === selectedCategory

    return matchesSearch && matchesDifficulty && matchesStatus && matchesCategory
  })

  const speakWord = (word) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word)
      utterance.rate = 0.8
      utterance.pitch = 1.2
      speechSynthesis.speak(utterance)
    }
  }

  const toggleWordStatus = async (wordId, currentStatus) => {
    setIsLoading(true)
    // Simulate API call delay for better UX
    setTimeout(() => {
      updateWordStatus(wordId, !currentStatus)
      setIsLoading(false)
    }, 300)
  }

  const handleUploadSuccess = (newWord) => {
    setUploadSuccess(newWord)
    setTimeout(() => setUploadSuccess(null), 3000)
  }

  const handleEditWord = (word) => {
    setEditingWord(word)
    setShowEditModal(true)
  }

  const handleEditSuccess = (updatedWord) => {
    setEditSuccess(updatedWord)
    setTimeout(() => setEditSuccess(null), 3000)
  }

  const handleSwipeRight = (wordId, currentStatus) => {
    // Swipe right = mark as known
    if (!currentStatus) {
      toggleWordStatus(wordId, currentStatus)
    }
  }

  const handleSwipeLeft = (wordId, currentStatus) => {
    // Swipe left = mark as unknown
    if (currentStatus) {
      toggleWordStatus(wordId, currentStatus)
    }
  }

  const handleDeleteWord = (wordToDelete) => {
    setWords(prev => prev.filter(w => w.id !== wordToDelete.id))
    setEditSuccess({ word: wordToDelete.word, action: 'deleted' })
    setTimeout(() => setEditSuccess(null), 3000)
  }

  const difficultyColors = {
    easy: 'from-green-400 to-green-500',
    medium: 'from-yellow-400 to-yellow-500',
    hard: 'from-red-400 to-red-500'
  }

  const difficulties = ['all', 'easy', 'medium', 'hard']
  const statuses = ['all', 'known', 'unknown']
  const categoryOptions = [{ id: 'all', name: 'All Categories', emoji: '📚' }, ...categories]

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center">
        <h1 className="text-5xl font-bold text-purple-700 text-fun-shadow mb-2 flex items-center justify-center">
          <motion.span
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
            className="mr-3"
          >
            📚
          </motion.span>
          Word Library
        </h1>
        <p className="text-lg text-purple-600">
          Explore and manage your word collection
        </p>
        {isMobile && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-2 flex items-center justify-center text-sm text-purple-500 bg-purple-50 px-4 py-2 rounded-full"
          >
            <Smartphone className="h-4 w-4 mr-2" />
            Swipe cards left/right to toggle status
          </motion.div>
        )}
      </motion.div>

      <div className="flex justify-between items-center mb-6">
        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button
            onClick={() => setShowUploadModal(true)}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold px-6 py-3 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Word
          </Button>

          <Button
            onClick={() => setShowCategoryModal(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-6 py-3 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <BookOpen className="h-5 w-5 mr-2" />
            Manage Categories
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
      >
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-purple-500" />
            <Input
              type="text"
              placeholder="Search for words..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-lg rounded-2xl border-2 border-purple-200 focus:border-purple-400"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-purple-600" />
              <span className="text-purple-700 font-medium">Difficulty:</span>
              {difficulties.map((difficulty) => (
                <Button
                  key={difficulty}
                  onClick={() => setSelectedDifficulty(difficulty)}
                  variant={selectedDifficulty === difficulty ? "default" : "outline"}
                  size="sm"
                  className={`rounded-full ${
                    selectedDifficulty === difficulty 
                      ? 'bg-purple-500 text-white' 
                      : 'text-purple-600 border-purple-300'
                  }`}
                >
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </Button>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-purple-700 font-medium">Status:</span>
              {statuses.map((status) => (
                <Button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  variant={selectedStatus === status ? "default" : "outline"}
                  size="sm"
                  className={`rounded-full ${
                    selectedStatus === status
                      ? 'bg-purple-500 text-white'
                      : 'text-purple-600 border-purple-300'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>

            <div className="flex items-center space-x-2 flex-wrap">
              <span className="text-purple-700 font-medium">Category:</span>
              {categoryOptions.map((category) => (
                <Button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  className={`rounded-full ${
                    selectedCategory === category.id
                      ? 'bg-purple-500 text-white'
                      : 'text-purple-600 border-purple-300'
                  }`}
                >
                  <span className="mr-1">{category.emoji}</span>
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Results Count */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-center text-purple-600"
      >
        Showing {filteredWords.length} of {words.length} words
      </motion.div>

      {/* Words Grid */}
         <motion.div initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {isLoading && (
          <div className="col-span-full">
            <LoadingState message="Updating words..." type="inline" size="small" />
          </div>
        )}
        
        <AnimatePresence>
          {filteredWords.map((word, index) => (
            <motion.div
              key={word.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <SwipeableCard
                onSwipeRight={() => handleSwipeRight(word.id, word.known)}
                onSwipeLeft={() => handleSwipeLeft(word.id, word.known)}
                disabled={!isMobile}
                className="relative"
              >
                <Card className={`h-full transition-all duration-300 hover:shadow-xl ${
                  word.known 
                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' 
                    : 'bg-gradient-to-br from-gray-50 to-blue-50 border-gray-200'
                }`}>
                  <CardContent className="p-6 text-center space-y-4 relative">
                    {/* Status Badge */}
                    <div className="absolute top-2 right-2 flex space-x-1">
                      {word.isCustom && (
                        <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                          Custom
                        </div>
                      )}
                      {word.known && (
                        <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                          <Check className="h-3 w-3 mr-1" />
                          Known
                        </div>
                      )}
                    </div>

                  {/* Word Image */}
                  <motion.div
                    className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-200 to-orange-200 rounded-2xl flex items-center justify-center shadow-md overflow-hidden"
                    whileHover={{ rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    {word.imageType === 'url' || word.imageType === 'upload' ? (
                      <ImageFallback
                        src={word.image}
                        alt={word.word}
                        className="w-full h-full object-cover"
                        fallbackEmoji="��"
                        showRetry={true}
                      />
                    ) : (
                      <div className="text-4xl">{word.image}</div>
                    )}
                  </motion.div>

                  {/* Word Text */}
                  <h3 className="text-xl font-bold text-gray-800">{word.word}</h3>

                  {/* Category and Difficulty Badges */}
                  <div className="flex justify-center space-x-2 flex-wrap">
                    {word.category && (
                      <div className={`inline-block px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${
                        categories.find(cat => cat.id === word.category)?.color || 'from-gray-400 to-gray-500'
                      } text-white`}>
                        <span className="mr-1">
                          {categories.find(cat => cat.id === word.category)?.emoji || '📂'}
                        </span>
                        {categories.find(cat => cat.id === word.category)?.name || 'Other'}
                      </div>
                    )}
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${difficultyColors[word.difficulty]} text-white`}>
                      {word.difficulty.charAt(0).toUpperCase() + word.difficulty.slice(1)}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-center space-x-2">
                    <Button
                      onClick={() => speakWord(word.word)}
                      size="sm"
                      className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-10 h-10 p-0"
                    >
                      <Volume2 className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      onClick={() => toggleWordStatus(word.id, word.known)}
                      size="sm"
                      className={`rounded-full w-10 h-10 p-0 ${
                        word.known 
                          ? 'bg-red-500 hover:bg-red-600 text-white' 
                          : 'bg-green-500 hover:bg-green-600 text-white'
                      }`}
                    >
                      {word.known ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                    </Button>

                    {/* Edit button for custom words */}
                    {word.isCustom && (
                      <Button
                        onClick={() => handleEditWord(word)}
                        size="sm"
                        className="bg-purple-500 hover:bg-purple-600 text-white rounded-full w-10 h-10 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    </div>
                  </CardContent>
                </Card>
              </SwipeableCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filteredWords.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center py-12"
        >
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-purple-800 mb-2">No words found</h3>
          <p className="text-purple-600">Try adjusting your search or filters</p>
        </motion.div>
      )}

      {/* Success Notifications */}
      <AnimatePresence>
        {uploadSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-40"
          >
            <div className="flex items-center">
              <Check className="h-5 w-5 mr-2" />
              <span>Word "{uploadSuccess.word}" added successfully!</span>
            </div>
          </motion.div>
        )}
        
        {editSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg z-40 text-white ${
              editSuccess.action === 'deleted' ? 'bg-red-500' : 'bg-blue-500'
            }`}
          >
            <div className="flex items-center">
              {editSuccess.action === 'deleted' ? (
                <Trash2 className="h-5 w-5 mr-2" />
              ) : (
                <Edit className="h-5 w-5 mr-2" />
              )}
              <span>
                Word "{editSuccess.word}" {editSuccess.action === 'deleted' ? 'deleted' : 'updated'} successfully!
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <WordUpload
            onClose={() => setShowUploadModal(false)}
            onSuccess={handleUploadSuccess}
          />
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && editingWord && (
          <WordEdit
            word={editingWord}
            onClose={() => {
              setShowEditModal(false)
              setEditingWord(null)
            }}
            onSuccess={handleEditSuccess}
            onDelete={handleDeleteWord}
          />
        )}
      </AnimatePresence>

      {/* Category Manager Modal */}
      <AnimatePresence>
        {showCategoryModal && (
          <CategoryManager
            onClose={() => setShowCategoryModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default WordLibrary
