import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from '../contexts/ThemeContext';
import Script from 'next/script';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Free AI Therapy Bot | Anonymous Mental Health Support | MindfulAI",
  description: "Get free, anonymous AI therapy support 24/7. Talk to AI therapists about anxiety, depression, stress. Crisis support, mood tracking, breathing exercises. No signup required.",
  keywords: "free therapy, AI therapist, mental health support, anxiety help, depression chat, crisis support, anonymous therapy, online counseling, mental health bot, free counseling",
  authors: [{ name: "MindfulAI" }],
  creator: "MindfulAI",
  publisher: "MindfulAI",
  robots: "index, follow",
  openGraph: {
    title: "Free AI Therapy Bot - Anonymous Mental Health Support",
    description: "24/7 free AI therapy support for anxiety, depression, and stress. Anonymous, no signup required.",
    url: "https://mindfulchatai.com",
    siteName: "MindfulAI",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MindfulAI - Free AI Therapy Support"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Free AI Therapy Bot - Get Help Now",
    description: "Anonymous 24/7 mental health support. Talk to AI therapists about anxiety, depression, stress.",
    images: ["/og-image.jpg"]
  },
  author: "MindfulAI",
  viewport: "width=device-width, initial-scale=1",
  manifest: "/manifest.json",
  themeColor: "#8b5cf6",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MindfulAI"
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [
      { url: "/icons/icon-152x152.png", sizes: "152x152", type: "image/png" }
    ]
  }
};

export default function RootLayout({ children }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "name": "Free AI Therapy Bot - Mental Health Support",
    "description": "Free, anonymous AI therapy support for anxiety, depression, stress, and crisis situations. Available 24/7 with no signup required.",
    "url": "https://mindfulchatai.com",
    "specialty": "Mental Health",
    "audience": {
      "@type": "PeopleAudience",
      "audienceType": "People seeking mental health support"
    },
    "provider": {
      "@type": "Organization",
      "name": "MindfulAI",
      "description": "AI-powered mental health support platform"
    },
    "potentialAction": {
      "@type": "CommunicateAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://mindfulchatai.com/chat"
      }
    }
  };

  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
              page_title: document.title,
              page_location: window.location.href,
            });
          `}
        </Script>
        
        {/* Google Search Console Verification */}
        <meta name="google-site-verification" content={process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION} />
        
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#8b5cf6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MindfulAI" />
        <link rel="apple-touch-icon" href="/icons/icon-152x152.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased transition-colors duration-200`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
