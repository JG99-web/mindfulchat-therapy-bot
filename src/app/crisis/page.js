import Link from 'next/link';
import { Phone, Globe, MessageCircle, Heart, ArrowLeft, AlertTriangle } from 'lucide-react';

export default function CrisisPage() {
  // UK Crisis Resources (Primary)
  const ukResources = [
    {
      name: "Samaritans",
      phone: "116 123",
      description: "Free, confidential emotional support 24/7 for anyone experiencing feelings of distress or despair.",
      website: "https://samaritans.org",
      available: "24/7"
    },
    {
      name: "Crisis Text Line UK",
      phone: "Text SHOUT to 85258",
      description: "Free, confidential 24/7 text support service for anyone in crisis.",
      website: "https://giveusashout.org",
      available: "24/7"
    },
    {
      name: "NHS 111",
      phone: "111",
      description: "For urgent medical help or mental health crisis when it's not a 999 emergency.",
      website: "https://www.nhs.uk/using-the-nhs/nhs-services/urgent-and-emergency-care/nhs-111/",
      available: "24/7"
    },
    {
      name: "Mind Infoline",
      phone: "0300 123 3393",
      description: "Information and support for mental health problems and signposting to local services.",
      website: "https://mind.org.uk",
      available: "Monday-Friday 9am-6pm"
    },
    {
      name: "CALM (Campaign Against Living Miserably)",
      phone: "0800 58 58 58",
      description: "Leading a movement against suicide, specifically for men but open to all.",
      website: "https://thecalmzone.net",
      available: "Daily 5pm-midnight"
    },
    {
      name: "Childline",
      phone: "0800 1111",
      description: "Free, private and confidential service for children and young people up to 19.",
      website: "https://childline.org.uk",
      available: "24/7"
    }
  ];

  // US Crisis Resources (Secondary)
  const usResources = [
    {
      name: "National Suicide Prevention Lifeline",
      phone: "988",
      description: "24/7 free and confidential support for people in distress, as well as prevention and crisis resources.",
      website: "https://suicidepreventionlifeline.org",
      available: "24/7"
    },
    {
      name: "Crisis Text Line",
      phone: "Text HOME to 741741",
      description: "Free, 24/7 support for those in crisis. Text with a trained crisis counselor.",
      website: "https://crisistextline.org",
      available: "24/7"
    },
    {
      name: "SAMHSA National Helpline",
      phone: "1-800-662-4357",
      description: "Free, confidential treatment referral service for individuals facing mental health or substance abuse disorders.",
      website: "https://samhsa.gov",
      available: "24/7"
    },
    {
      name: "National Domestic Violence Hotline",
      phone: "1-800-799-7233",
      description: "24/7 confidential support for domestic violence survivors and their loved ones.",
      website: "https://thehotline.org",
      available: "24/7"
    },
    {
      name: "LGBTQ National Hotline",
      phone: "1-888-843-4564",
      description: "Confidential support for LGBTQ individuals and their allies.",
      website: "https://lgbthotline.org",
      available: "Monday-Friday 4pm-12am ET, Saturday 12pm-5pm ET"
    },
    {
      name: "Veterans Crisis Line",
      phone: "1-800-273-8255 (Press 1)",
      description: "24/7 confidential support for veterans in crisis and their families.",
      website: "https://veteranscrisisline.net",
      available: "24/7"
    }
  ];

  const internationalResources = [
    { country: "Canada", phone: "1-833-456-4566", name: "Talk Suicide Canada" },
    { country: "Australia", phone: "13 11 14", name: "Lifeline" },
    { country: "New Zealand", phone: "1737", name: "Need to Talk?" },
    { country: "Ireland", phone: "116 123", name: "Samaritans" },
    { country: "South Africa", phone: "0800 567 567", name: "South African Anxiety and Depression Group" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Link 
                href="/"
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </Link>
              <Heart className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-semibold text-gray-900">Crisis Resources</span>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Emergency Alert */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-lg font-semibold text-red-900 mb-2">
                If you are in immediate danger
              </h2>
              <p className="text-red-800 mb-4">
                If you are having thoughts of suicide or are in immediate danger, please:
              </p>
              <ul className="list-disc list-inside text-red-800 space-y-1 mb-4">
                <li><strong>UK:</strong> Call 999 for emergencies or 111 for urgent help</li>
                <li><strong>US:</strong> Call 911 for emergencies</li>
                <li>Go to your nearest emergency room/A&E</li>
                <li><strong>UK:</strong> Call Samaritans: <strong>116 123</strong> (free from any phone)</li>
                <li><strong>US:</strong> Call National Suicide Prevention Lifeline: <strong>988</strong></li>
                <li>Stay with a trusted friend or family member</li>
              </ul>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="tel:116123"
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call UK Samaritans: 116 123
                </a>
                <a
                  href="tel:988"
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call US: 988
                </a>
                <a
                  href="sms:85258&body=SHOUT"
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Text UK: SHOUT to 85258
                </a>
                <a
                  href="sms:741741&body=HOME"
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Text US: HOME to 741741
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* UK Crisis Resources */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">United Kingdom Crisis Resources</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {ukResources.map((resource, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{resource.name}</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-blue-600" />
                    <a 
                      href={`tel:${resource.phone.replace(/[^0-9]/g, '')}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {resource.phone}
                    </a>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Globe className="h-4 w-4 text-blue-600 mt-0.5" />
                    <a 
                      href={resource.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Visit Website
                    </a>
                  </div>
                  <p className="text-gray-600 text-sm">{resource.description}</p>
                  <p className="text-xs text-gray-500">
                    <strong>Available:</strong> {resource.available}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* US Crisis Resources */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">United States Crisis Resources</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {usResources.map((resource, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{resource.name}</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-blue-600" />
                    <a 
                      href={`tel:${resource.phone.replace(/[^0-9]/g, '')}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {resource.phone}
                    </a>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Globe className="h-4 w-4 text-blue-600 mt-0.5" />
                    <a 
                      href={resource.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Visit Website
                    </a>
                  </div>
                  <p className="text-gray-600 text-sm">{resource.description}</p>
                  <p className="text-xs text-gray-500">
                    <strong>Available:</strong> {resource.available}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* International Resources */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">International Crisis Resources</h2>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {internationalResources.map((resource, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-gray-900">{resource.country}</h4>
                  <p className="text-sm text-gray-600">{resource.name}</p>
                  <a 
                    href={`tel:${resource.phone.replace(/[^0-9]/g, '')}`}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    {resource.phone}
                  </a>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-4">
              For a comprehensive list of international crisis resources, visit{" "}
              <a 
                href="https://findahelpline.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                findahelpline.com
              </a>
            </p>
          </div>
        </section>

        {/* Coping Strategies */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Immediate Coping Strategies</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Grounding Techniques</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• <strong>5-4-3-2-1:</strong> Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste</li>
                <li>• Focus on your breathing: Inhale for 4, hold for 4, exhale for 4</li>
                <li>• Hold an ice cube or splash cold water on your face</li>
                <li>• Listen to calming music or nature sounds</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Reach Out</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Call a trusted friend or family member</li>
                <li>• Text someone you trust</li>
                <li>• Join an online support community</li>
                <li>• Contact a crisis helpline</li>
                <li>• Go to a public place where others are present</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Return to Chat */}
        <div className="text-center">
          <Link 
            href="/chat" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            Continue Anonymous Chat
          </Link>
        </div>
      </main>
    </div>
  );
}
