import Link from 'next/link';
import { ArrowLeft, Heart, Shield, Clock, Users } from 'lucide-react';

export const metadata = {
  title: "About MindfulAI - Free AI Therapy & Mental Health Support",
  description: "Learn how MindfulAI provides free, anonymous AI therapy support 24/7. Our AI therapists help with anxiety, depression, stress, and crisis situations. No signup required.",
  keywords: "about mindfulai, AI therapy explained, how AI therapy works, free mental health support, anonymous counseling, AI therapist benefits"
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Chat
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Free AI Therapy Support
            <span className="block text-blue-600">When You Need It Most</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            MindfulAI provides free, anonymous mental health support through AI-powered therapy conversations. 
            Get help with anxiety, depression, stress, and crisis situations 24/7 - no signup required.
          </p>
        </div>

        {/* Key Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Heart className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">100% Free</h3>
            <p className="text-gray-600">No hidden costs, subscriptions, or payment required. Mental health support should be accessible to everyone.</p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Shield className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Anonymous</h3>
            <p className="text-gray-600">No registration, no personal data collection. Your conversations are private and stored only on your device.</p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">24/7 Available</h3>
            <p className="text-gray-600">Get support whenever you need it. Our AI therapists are available round the clock, even during emergencies.</p>
          </div>
          
          <div className="text-center">
            <div className="bg-orange-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Users className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Multiple Approaches</h3>
            <p className="text-gray-600">Choose from different AI therapist personalities using CBT, mindfulness, and solution-focused therapy methods.</p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-xl shadow-sm border p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How AI Therapy Works</h2>
          
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold flex-shrink-0">1</div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Start Conversations Instantly</h3>
                <p className="text-gray-600">No signup required. Simply visit our chat page and start talking about whatever is on your mind. Our AI understands natural conversation.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold flex-shrink-0">2</div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Analyzes & Responds</h3>
                <p className="text-gray-600">Our advanced AI analyzes your messages for emotional context, crisis indicators, and therapy needs, then responds with appropriate support and coping strategies.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold flex-shrink-0">3</div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Personalized Support</h3>
                <p className="text-gray-600">The AI remembers your conversations and adapts its responses to your specific needs, providing increasingly personalized mental health support.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mental Health Topics */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">We Help With</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Anxiety & Panic", description: "Breathing exercises, grounding techniques, and coping strategies for anxiety disorders and panic attacks." },
              { title: "Depression", description: "Support for low mood, hopelessness, and depression. CBT techniques and mood tracking tools." },
              { title: "Stress Management", description: "Work stress, academic pressure, and life challenges. Learn healthy coping mechanisms." },
              { title: "Crisis Support", description: "Immediate support during mental health crises with safety planning and emergency resources." },
              { title: "Relationship Issues", description: "Communication problems, breakups, family conflicts, and social anxiety support." },
              { title: "Sleep & Wellness", description: "Sleep hygiene, relaxation techniques, and overall mental wellness strategies." }
            ].map((topic, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{topic.title}</h3>
                <p className="text-gray-600">{topic.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-blue-600 rounded-xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">Get Free Mental Health Support Now</h2>
          <p className="text-blue-100 mb-6 text-lg">
            Join thousands who have found help through our AI therapy platform. Start your anonymous conversation today.
          </p>
          <Link 
            href="/chat" 
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Start Free Therapy Chat
          </Link>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 p-6 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-800">
            <strong>Important:</strong> MindfulAI provides AI-generated mental health support and is not a replacement for professional medical care. 
            If you are experiencing a mental health emergency, please contact emergency services immediately or call a crisis helpline.
          </p>
        </div>
      </div>
    </div>
  );
}
