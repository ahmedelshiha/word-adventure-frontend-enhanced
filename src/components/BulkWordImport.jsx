/**
 * Bulk Word Import Component
 * Allows importing multiple words via CSV upload
 */

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Upload, Download, FileText, CheckCircle, AlertCircle, X } from 'lucide-react'
import api from '../services/api'

const BulkWordImport = ({ onWordsImported, onClose }) => {
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState(null)
  const [previewData, setPreviewData] = useState(null)
  const fileInputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = async (file) => {
    if (!file.name.endsWith('.csv')) {
      setUploadResult({
        success: false,
        message: 'Please upload a CSV file'
      })
      return
    }

    try {
      const text = await file.text()
      const preview = parseCSVPreview(text)
      setPreviewData(preview)
    } catch (error) {
      setUploadResult({
        success: false,
        message: 'Failed to read file: ' + error.message
      })
    }
  }

  const parseCSVPreview = (csvText) => {
    const lines = csvText.trim().split('\n')
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
    const rows = lines.slice(1, 6).map(line => {
      return line.split(',').map(cell => cell.trim().replace(/"/g, ''))
    })
    
    return {
      headers,
      rows,
      totalRows: lines.length - 1
    }
  }

  const handleImport = async () => {
    if (!previewData) return

    setUploading(true)
    setUploadResult(null)

    try {
      // Create a new file from the preview data for upload
      const csvContent = [
        previewData.headers.join(','),
        ...previewData.rows.map(row => row.join(','))
      ].join('\n')
      
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const file = new File([blob], 'words.csv', { type: 'text/csv' })

      const result = await api.bulkImportWords(file)
      
      setUploadResult({
        success: true,
        message: `Successfully imported ${result.imported} words`,
        details: result
      })
      
      // Notify parent component
      if (onWordsImported) {
        onWordsImported(result)
      }
      
    } catch (error) {
      setUploadResult({
        success: false,
        message: 'Import failed: ' + error.message
      })
    } finally {
      setUploading(false)
    }
  }

  const downloadTemplate = () => {
    const template = `word,category,image_url,pronunciation,definition
apple,fruits,https://example.com/apple.jpg,/ˈæpəl/,A round fruit that grows on trees
cat,animals,https://example.com/cat.jpg,/kæt/,A small domesticated carnivorous mammal
house,objects,https://example.com/house.jpg,/haʊs/,A building for human habitation`

    const blob = new Blob([template], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'word_import_template.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

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
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Bulk Import Words</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {!previewData ? (
            <div className="space-y-6">
              {/* Download Template */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <h3 className="font-medium text-blue-900">Need a template?</h3>
                    <p className="text-sm text-blue-700">Download our CSV template to get started</p>
                  </div>
                  <button
                    onClick={downloadTemplate}
                    className="inline-flex items-center px-3 py-2 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-white hover:bg-blue-50 transition-colors"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Template
                  </button>
                </div>
              </div>

              {/* File Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? 'border-purple-400 bg-purple-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Upload your CSV file
                </h3>
                <p className="text-gray-600 mb-4">
                  Drag and drop your file here, or click to browse
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                >
                  Choose File
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </div>

              {/* Format Requirements */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">CSV Format Requirements:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Required columns: word, category, image_url</li>
                  <li>• Optional columns: pronunciation, definition</li>
                  <li>• First row should contain column headers</li>
                  <li>• Use commas to separate values</li>
                  <li>• Wrap values containing commas in quotes</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Preview */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Preview ({previewData.totalRows} total rows)
                </h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {previewData.headers.map((header, index) => (
                          <th
                            key={index}
                            className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {previewData.rows.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {row.map((cell, cellIndex) => (
                            <td
                              key={cellIndex}
                              className="px-4 py-2 text-sm text-gray-900 max-w-xs truncate"
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {previewData.totalRows > 5 && (
                  <p className="text-sm text-gray-500 mt-2">
                    Showing first 5 rows of {previewData.totalRows} total rows
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  onClick={handleImport}
                  disabled={uploading}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {uploading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Import Words
                    </>
                  )}
                </button>
                <button
                  onClick={() => setPreviewData(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  Choose Different File
                </button>
              </div>
            </div>
          )}

          {/* Upload Result */}
          {uploadResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 p-4 rounded-lg border ${
                uploadResult.success
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                {uploadResult.success ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                )}
                <div className="flex-1">
                  <p className={`font-medium ${
                    uploadResult.success ? 'text-green-900' : 'text-red-900'
                  }`}>
                    {uploadResult.message}
                  </p>
                  {uploadResult.details && (
                    <div className="mt-2 text-sm text-gray-600">
                      <p>Imported: {uploadResult.details.imported}</p>
                      {uploadResult.details.skipped > 0 && (
                        <p>Skipped: {uploadResult.details.skipped}</p>
                      )}
                      {uploadResult.details.errors?.length > 0 && (
                        <div className="mt-2">
                          <p className="font-medium">Errors:</p>
                          <ul className="list-disc list-inside">
                            {uploadResult.details.errors.slice(0, 5).map((error, index) => (
                              <li key={index}>{error}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default BulkWordImport

