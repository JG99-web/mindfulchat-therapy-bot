import Link from 'next/link';
import { Heart, MessageCircle, Shield, Clock, Waves, Lightbulb, Users, BarChart3 } from 'lucide-react';
import AccessibilitySettings from '../components/AccessibilitySettings';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 transition-colors duration-200">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                <Heart className="h-7 w-7 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">MindfulChat</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#features" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:bg-blue-50">Features</a>
                <a href="#about" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:bg-blue-50">About</a>
                <Link href="/privacy" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:bg-blue-50">Privacy</Link>
                <Link href="/crisis" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:bg-blue-50">Crisis Resources</Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 tracking-tight leading-tight">
            Anonymous Mental Health Support
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
            Connect with a professional-quality therapy bot in complete privacy. 
            No registration required, no personal information stored. 
            Get the support you need, when you need it.
          </p>
          
          <div className="space-y-4 sm:space-y-0 sm:space-x-6 sm:flex sm:justify-center mt-12">
            <Link 
              href="/chat" 
              className="inline-flex items-center px-10 py-4 border border-transparent text-lg font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <MessageCircle className="mr-3 h-6 w-6" />
              Start Anonymous Chat
            </Link>
            <Link 
              href="/crisis" 
              className="inline-flex items-center px-10 py-4 border-2 border-gray-300 text-lg font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              Crisis Resources
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Professional Mental Health Support</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Advanced AI therapy with cutting-edge features designed for your well-being</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Complete Anonymity</h3>
              <p className="text-gray-600 leading-relaxed">
                No accounts, no personal data collection. Your privacy is our priority.
              </p>
            </div>
            
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Professional Quality</h3>
              <p className="text-gray-600 leading-relaxed">
                AI trained on therapeutic techniques and professional mental health practices.
              </p>
            </div>
            
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Waves className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Breathing Exercises</h3>
              <p className="text-gray-600 leading-relaxed">
                Interactive guided breathing for immediate anxiety and stress relief.
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lightbulb className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Environmental Therapy</h3>
              <p className="text-gray-600 leading-relaxed">
                AI-powered analysis of your space and mood for personalized environment optimization.
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Multiple Therapist Personas</h3>
              <p className="text-gray-600 leading-relaxed">
                Choose from 6 distinct AI therapist personalities: Cass (nurturing), Zen (mindful), Ash (motivating), Joy (uplifting), Sage (analytical), Luna (creative).
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Mood Tracking & Analytics</h3>
              <p className="text-gray-600 leading-relaxed">
                Track your daily mood, energy, and stress levels with detailed insights, patterns, and personalized recommendations for better mental health.
              </p>
            </div>
            
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">24/7 Availability</h3>
              <p className="text-gray-600 leading-relaxed">
                Get support whenever you need it, day or night.
              </p>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div id="about" className="mt-20 bg-white rounded-lg shadow-sm p-8 border border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">About MindfulChat</h2>
          <div className="prose prose-lg mx-auto text-gray-600">
            <p className="mb-4">
              MindfulChat provides anonymous, professional-quality mental health support through 
              an AI-powered therapy bot. We understand that seeking help can feel overwhelming, 
              and sometimes the barrier of having to reveal your identity can prevent you from 
              getting the support you need.
            </p>
            <p className="mb-4">
              Our therapy bot is designed to provide empathetic, evidence-based responses that 
              mirror the quality of care you would receive from a trained mental health professional. 
              While this service is not a replacement for professional therapy in crisis situations, 
              it can provide valuable support and coping strategies.
            </p>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-6">
              <p className="text-sm text-yellow-800">
                <strong>Important:</strong> This AI therapy bot is not a replacement for professional 
                mental health care. If you are experiencing a mental health emergency, please contact 
                emergency services or a crisis hotline immediately.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Accessibility Settings */}
      <AccessibilitySettings />
    </div>
  );
}
