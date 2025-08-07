import Link from 'next/link';
import { Heart, ArrowLeft, Shield, Eye, Clock, Trash2 } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <Link 
              href="/"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <div className="flex items-center space-x-2">
              <Heart className="h-6 w-6 text-blue-600" />
              <span className="font-semibold text-gray-900">Privacy & Security</span>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Privacy is Our Priority</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-600 mb-8">
              MindfulChat is designed with privacy-first principles. We believe mental health support 
              should be accessible without compromising your anonymity.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="flex items-start space-x-3">
                <Shield className="h-8 w-8 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Account Required</h3>
                  <p className="text-gray-600">
                    Start chatting immediately. No email, phone number, or personal information needed.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Eye className="h-8 w-8 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Local Storage Only</h3>
                  <p className="text-gray-600">
                    Your conversations are saved on your device only. We never see or store your messages.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="h-8 w-8 text-purple-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Temporary Sessions</h3>
                  <p className="text-gray-600">
                    Sessions automatically expire after 24 hours. Start fresh whenever you want.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Trash2 className="h-8 w-8 text-red-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">You Control Your Data</h3>
                  <p className="text-gray-600">
                    Clear your session anytime. All data is immediately and permanently deleted.
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">What We Collect</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
              <li><strong>Anonymous Usage Analytics:</strong> Basic patterns like page visits and feature usage (no personal data)</li>
              <li><strong>Crisis Detection:</strong> Automated scanning for safety keywords (processed locally, not stored)</li>
              <li><strong>Technical Data:</strong> Browser type and device info for functionality (standard web analytics)</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">What We Never Collect</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
              <li>Your conversations or messages</li>
              <li>Personal identifying information</li>
              <li>IP addresses or location data</li>
              <li>Contact information or social profiles</li>
              <li>Payment or financial information</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">AI Processing</h2>
            <p className="text-gray-600 mb-4">
              Your messages are sent to OpenAI's API for processing to generate therapeutic responses. 
              OpenAI's data usage policy applies to these interactions. We do not store or access 
              the content of these exchanges.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Security</h2>
            <p className="text-gray-600 mb-4">
              All communications are encrypted in transit using HTTPS. Since we don't store personal 
              data on our servers, there's minimal risk of data breaches affecting your privacy.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mt-8">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Questions About Privacy?</h3>
              <p className="text-blue-800">
                Our privacy approach is designed to give you peace of mind while getting the support you need. 
                If you have questions about how we protect your privacy, please contact us.
              </p>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mt-6">
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">Important Disclaimer</h3>
              <p className="text-yellow-800">
                MindfulChat provides AI-powered support but is not a replacement for professional mental 
                health care. In crisis situations, please contact emergency services or call 988 
                (National Suicide Prevention Lifeline).
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
