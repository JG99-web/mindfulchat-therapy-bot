'use client';

import { useState } from 'react';
import { Settings, Type, Eye, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function AccessibilitySettings() {
  const [isOpen, setIsOpen] = useState(false);
  const { fontSize, highContrast, changeFontSize, toggleHighContrast } = useTheme();

  const fontSizes = [
    { value: 'small', label: 'Small', size: 'text-sm' },
    { value: 'medium', label: 'Medium', size: 'text-base' },
    { value: 'large', label: 'Large', size: 'text-lg' },
    { value: 'xlarge', label: 'Extra Large', size: 'text-xl' }
  ];

  return (
    <>
      {/* Settings Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-colors duration-200 z-50"
        aria-label="Open accessibility settings"
      >
        <Settings className="h-6 w-6" />
      </button>

      {/* Settings Panel */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Accessibility Settings
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close settings"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Settings Content */}
            <div className="p-6 space-y-6">
              {/* Font Size */}
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <Type className="h-5 w-5" />
                  <div>
                    <label className="text-sm font-medium text-gray-900">
                      Font Size
                    </label>
                    <p className="text-xs text-gray-500">
                      Choose comfortable text size
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {fontSizes.map((size) => (
                    <button
                      key={size.value}
                      onClick={() => changeFontSize(size.value)}
                      className={`p-2 text-center rounded-md border transition-colors ${
                        fontSize === size.value
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <span className={size.size}>{size.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* High Contrast */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Eye className="h-5 w-5" />
                  <div>
                    <label className="text-sm font-medium text-gray-900">
                      High Contrast
                    </label>
                    <p className="text-xs text-gray-500">
                      Improves text visibility
                    </p>
                  </div>
                </div>
                <button
                  onClick={toggleHighContrast}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    highContrast ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                  aria-pressed={highContrast}
                  aria-label={`${highContrast ? 'Disable' : 'Enable'} high contrast`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      highContrast ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-900 mb-2">
                  Mental Health Accessibility
                </h3>
                <p className="text-xs text-blue-700">
                  These settings are designed to make your experience more comfortable and accessible. 
                  Your preferences are saved locally and never shared.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
