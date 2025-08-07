import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { useApp } from '../App'
import WordManagement from './WordManagement'
import CategoryManagement from './CategoryManagement'
import { 
  Search, 
  Volume2, 
  Filter, 
  BookOpen, 
  Target, 
  Brain, 
  Star,
  Grid3X3,
  List,
  Sparkles,
  Trophy,
  CheckCircle,
  Circle,
  Plus,
  Edit3,
  Trash2,
  MoreVertical,
  Tag,
  Settings
} from 'lucide-react'

const EnhancedWordLibrary = () => {
  const { words, setWords, categories, updateWordStatus, addXP } = useApp()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [knownFilter, setKnownFilter] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const [sortBy, setSortBy] = useState('alphabetical')
  
  // Word management state
  const [isWordManagementOpen, setIsWordManagementOpen] = useState(false)
  const [editingWord, setEditingWord] = useState(null)
  const [selectedWords, setSelectedWords] = useState(new Set())
  
  // Category management state
  const [isCategoryManagementOpen, setIsCategoryManagementOpen] = useState(false)

  const speakWord = (word) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word)
      utterance.rate = 0.8
      utterance.pitch = 1.2
      speechSynthesis.speak(utterance)
    }
  }

  const toggleWordStatus = (wordId, currentStatus) => {
    updateWordStatus(wordId, !currentStatus)
    if (!currentStatus) {
      addXP(10, 'word_learned')
    }
  }

  const handleAddWord = () => {
    setEditingWord(null)
    setIsWordManagementOpen(true)
  }

  const handleEditWord = (word) => {
    setEditingWord(word)
    setIsWordManagementOpen(true)
  }

  const handleDeleteWord = (wordId) => {
    if (window.confirm('Are you sure you want to delete this word?')) {
      setWords(prev => prev.filter(w => w.id !== wordId))
      addXP(5, 'word_deleted')
    }
  }

  const handleCloseWordManagement = () => {
    setIsWordManagementOpen(false)
    setEditingWord(null)
  }

  const handleOpenCategoryManagement = () => {
    setIsCategoryManagementOpen(true)
  }

  const handleCloseCategoryManagement = () => {
    setIsCategoryManagementOpen(false)
  }

  const filteredAndSortedWords = useMemo(() => {
    let filtered = words.filter(word => {
      const matchesSearch = word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           word.definition?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           word.category.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = selectedCategory === 'all' || word.category === selectedCategory
      const matchesDifficulty = selectedDifficulty === 'all' || word.difficulty === selectedDifficulty
      const matchesKnown = knownFilter === 'all' || 
                          (knownFilter === 'known' && word.known) ||
                          (knownFilter === 'unknown' && !word.known)

      return matchesSearch && matchesCategory && matchesDifficulty && matchesKnown
    })

    // Sort words
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'alphabetical':
          return a.word.localeCompare(b.word)
        case 'difficulty':
          const difficultyOrder = { easy: 1, medium: 2, hard: 3 }
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
        case 'category':
          return a.category.localeCompare(b.category)
        case 'status':
          return (b.known ? 1 : 0) - (a.known ? 1 : 0)
        default:
          return 0
      }
    })

    return filtered
  }, [words, searchTerm, selectedCategory, selectedDifficulty, knownFilter, sortBy])

  const categoryStats = useMemo(() => {
    const stats = {}
    categories.forEach(category => {
      const categoryWords = words.filter(w => w.category === category.id)
      const knownWords = categoryWords.filter(w => w.known)
      stats[category.id] = {
        total: categoryWords.length,
        known: knownWords.length,
        percentage: categoryWords.length > 0 ? Math.round((knownWords.length / categoryWords.length) * 100) : 0
      }
    })
    return stats
  }, [words, categories])

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'hard': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getCategoryColor = (categoryId) => {
    const category = categories.find(c => c.id === categoryId)
    return category?.color || 'from-gray-400 to-gray-500'
  }

  const WordCard = ({ word, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group relative"
    >
      <Card className={`h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
        word.known ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
      }`}>
        {/* Action Menu */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEditWord(word)}
              className="h-8 w-8 p-0 bg-white shadow-sm hover:bg-blue-50"
            >
              <Edit3 className="w-3 h-3 text-blue-600" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteWord(word.id)}
              className="h-8 w-8 p-0 bg-white shadow-sm hover:bg-red-50"
            >
              <Trash2 className="w-3 h-3 text-red-600" />
            </Button>
          </div>
        </div>

        <CardContent className="p-6 text-center space-y-4">
          <div className="relative">
            <div className="text-6xl mb-3">
{word.image_url ? (
  <img src={word.image_url} alt={word.word} className="w-16 h-16 mx-auto object-cover rounded-lg" />
) : word.emoji ? (
  word.emoji
) : (
  '📝'
)}
              
            </div>
            {word.known && (
              <CheckCircle className="absolute -top-2 -right-2 w-6 h-6 text-green-500 bg-white rounded-full" />
            )}
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">{word.word}</h3>
            {word.pronunciation && (
              <p className="text-sm text-gray-600 italic mb-2">{word.pronunciation}</p>
            )}
            {word.definition && (
              <p className="text-sm text-gray-700 mb-3">{word.definition}</p>
            )}
          </div>

          {word.example && (
            <div className="bg-gray-50 rounded-lg p-3 text-xs">
              <p className="text-gray-600 mb-1">Example:</p>
              <p className="text-gray-800 italic">"{word.example}"</p>
            </div>
          )}

          {word.funFact && (
            <div className="bg-yellow-50 rounded-lg p-3 text-xs border-l-3 border-yellow-400">
              <p className="text-yellow-600 mb-1 flex items-center">
                <Sparkles className="w-3 h-3 mr-1" />
                Fun Fact:
              </p>
              <p className="text-yellow-800">{word.funFact}</p>
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <Badge className={getDifficultyColor(word.difficulty)}>
              {word.difficulty}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {word.category}
            </Badge>
          </div>

          <div className="flex justify-center space-x-2">
            <Button
              onClick={() => speakWord(word.word)}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <Volume2 className="w-4 h-4" />
            </Button>
            
            <Button
              onClick={() => toggleWordStatus(word.id, word.known)}
              variant={word.known ? "default" : "outline"}
              size="sm"
              className={`flex-1 ${
                word.known 
                  ? 'bg-green-500 hover:bg-green-600 text-white' 
                  : 'hover:bg-green-50'
              }`}
            >
              {word.known ? <CheckCircle className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  const WordListItem = ({ word, index }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.02 }}
    >
      <Card className={`mb-3 transition-all duration-300 hover:shadow-md ${
        word.known ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
      }`}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="text-3xl">{word.image}</div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-lg font-semibold text-gray-800">{word.word}</h3>
                {word.known && <CheckCircle className="w-5 h-5 text-green-500" />}
              </div>
              
              {word.pronunciation && (
                <p className="text-sm text-gray-600 italic mb-1">{word.pronunciation}</p>
              )}
              
              {word.definition && (
                <p className="text-sm text-gray-700 mb-2">{word.definition}</p>
              )}
              
              <div className="flex flex-wrap gap-2">
                <Badge className={getDifficultyColor(word.difficulty)}>
                  {word.difficulty}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {word.category}
                </Badge>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={() => speakWord(word.word)}
                variant="outline"
                size="sm"
              >
                <Volume2 className="w-4 h-4" />
              </Button>
              
              <Button
                onClick={() => toggleWordStatus(word.id, word.known)}
                variant={word.known ? "default" : "outline"}
                size="sm"
                className={word.known ? 'bg-green-500 hover:bg-green-600 text-white' : 'hover:bg-green-50'}
              >
                {word.known ? <CheckCircle className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="flex items-center justify-center mb-2">
            <BookOpen className="w-10 h-10 mr-3 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-800">Word Library</h1>
          </div>
          <div className="flex items-center justify-center space-x-4">
            <p className="text-gray-600 text-lg">
              Explore and learn from our collection of {words.length} words
            </p>
            <div className="flex space-x-2">
              <Button
                onClick={handleAddWord}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Word
              </Button>
              <Button
                onClick={handleOpenCategoryManagement}
                variant="outline"
                className="border-indigo-300 text-indigo-600 hover:bg-indigo-50"
              >
                <Tag className="w-4 h-4 mr-2" />
                Manage Categories
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white shadow-lg">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-4">
                <div className="lg:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search words..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.emoji} {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={knownFilter} onValueChange={setKnownFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Words</SelectItem>
                    <SelectItem value="known">Known</SelectItem>
                    <SelectItem value="unknown">Learning</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alphabetical">A-Z</SelectItem>
                    <SelectItem value="difficulty">Difficulty</SelectItem>
                    <SelectItem value="category">Category</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    Showing {filteredAndSortedWords.length} of {words.length} words
                  </span>
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-600">
                      {words.filter(w => w.known).length} learned
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => setViewMode('grid')}
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => setViewMode('list')}
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Category Overview */}
        {selectedCategory === 'all' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Category Overview
                </CardTitle>
                <CardDescription>
                  Your progress across different word categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                  {categories.map(category => {
                    const stats = categoryStats[category.id] || { total: 0, known: 0, percentage: 0 }
                    return (
                      <div
                        key={category.id}
                        className="text-center p-3 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        <div className="text-2xl mb-2">{category.emoji}</div>
                        <div className="text-sm font-medium text-gray-800 mb-1">{category.name}</div>
                        <div className="text-xs text-gray-600 mb-2">
                          {stats.known}/{stats.total} words
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${stats.percentage}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{stats.percentage}%</div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Words Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {filteredAndSortedWords.length === 0 ? (
            <Card className="bg-white shadow-lg">
              <CardContent className="p-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No words found</h3>
                <p className="text-gray-600">Try adjusting your search or filters</p>
              </CardContent>
            </Card>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedWords.map((word, index) => (
                <WordCard key={word.id} word={word} index={index} />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAndSortedWords.map((word, index) => (
                <WordListItem key={word.id} word={word} index={index} />
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Word Management Modal */}
      <WordManagement
        isOpen={isWordManagementOpen}
        onClose={handleCloseWordManagement}
        editingWord={editingWord}
      />

      {/* Category Management Modal */}
      <CategoryManagement
        isOpen={isCategoryManagementOpen}
        onClose={handleCloseCategoryManagement}
      />
    </div>
  )
}

export default EnhancedWordLibrary

