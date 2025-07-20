import React from 'react';
import { NavLink } from 'react-router-dom';
import Register from './Register';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-orange-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute top-10 left-5 w-96 h-96 bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-32 right-5 w-80 h-80 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse [animation-delay:1s]"></div>
        <div className="absolute bottom-10 left-1/4 w-72 h-72 bg-gradient-to-r from-orange-600/20 to-red-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse [animation-delay:2s]"></div>
        <div className="absolute bottom-32 right-1/4 w-64 h-64 bg-gradient-to-r from-emerald-600/20 to-teal-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse [animation-delay:3s]"></div>
      </div>

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-30" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
        aria-hidden="true"
      ></div>

      {/* Main content container */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 xl:px-12">
        
        {/* Hero Section */}
        <section className="text-center mb-12 lg:mb-20 max-w-6xl">
          <div className="mb-6">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-300 border border-orange-500/30 backdrop-blur-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" aria-hidden="true"></span>
              AI-Powered Communication Platform
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white mb-6 lg:mb-8 leading-tight tracking-tight">
            Master Your
            <span className="block bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent drop-shadow-lg">
              Communication
            </span>
            <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Like Never Before
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-8 lg:mb-12 leading-relaxed max-w-4xl mx-auto font-light">
            Transform conversations into insights with intelligent chat systems, AI-powered video analysis, and comprehensive analytics that adapt to your communication needs.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center items-center">
            <NavLink 
            to='/register'
              className="group relative px-8 lg:px-12 py-4 lg:py-5 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 text-black rounded-2xl font-bold text-base lg:text-lg shadow-2xl hover:shadow-orange-500/30 transition-all duration-300 transform hover:scale-105 hover:from-orange-500 hover:to-amber-400 w-full sm:w-auto focus:outline-none focus:ring-4 focus:ring-orange-500/50"
              aria-label="Start your communication journey"
            >
              <span className="relative z-10 flex items-center justify-center">
                Start Chatting
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" aria-hidden="true"></div>
            </NavLink>
            
            <button 
              className="group relative px-8 lg:px-12 py-4 lg:py-5 border-2 border-green-500/50 text-green-300 rounded-2xl font-semibold text-base lg:text-lg hover:bg-green-500/10 hover:border-green-400 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/20 backdrop-blur-sm w-full sm:w-auto focus:outline-none focus:ring-4 focus:ring-green-500/50"
              aria-label="Watch product demonstration"
            >
              <span className="flex items-center justify-center">
                Watch Demo
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-9-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
            </button>
          </div>
        </section>

        {/* Center Dashboard Preview */}
        <section className="mb-12 lg:mb-20 relative" aria-label="Dashboard preview">
          <div className="w-80 h-80 sm:w-96 sm:h-96 lg:w-[32rem] lg:h-[32rem] xl:w-[36rem] xl:h-[36rem] mx-auto relative">
            {/* Decorative rotating rings */}
            <div className="absolute inset-0 rounded-3xl border-2 border-orange-500/20 animate-spin [animation-duration:20s]" aria-hidden="true"></div>
            <div className="absolute inset-6 rounded-3xl border-2 border-green-500/20 animate-spin [animation-duration:15s] [animation-direction:reverse]" aria-hidden="true"></div>
            <div className="absolute inset-12 rounded-3xl border border-amber-500/30 animate-pulse" aria-hidden="true"></div>
            
            {/* Main dashboard container */}
            <div className="absolute inset-16 rounded-3xl bg-gradient-to-br from-gray-900/80 via-black/60 to-orange-950/80 backdrop-blur-xl border border-orange-500/20 overflow-hidden shadow-2xl">
              {/* Mock dashboard content */}
              <div className="p-4 lg:p-6 h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2" aria-hidden="true">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  </div>
                  <div className="w-6 h-6 bg-gradient-to-r from-orange-400 to-amber-400 rounded-lg" aria-hidden="true"></div>
                </div>
                
                {/* Chat interface simulation */}
                <div className="flex-1 space-y-3" aria-hidden="true">
                  <div className="flex justify-start">
                    <div className="bg-gray-800/50 rounded-2xl rounded-bl-sm p-2 max-w-[70%]">
                      <div className="w-full h-2 bg-gray-700/50 rounded mb-1"></div>
                      <div className="w-3/4 h-2 bg-gray-700/50 rounded"></div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-orange-600/30 rounded-2xl rounded-br-sm p-2 max-w-[70%]">
                      <div className="w-full h-2 bg-orange-400/50 rounded mb-1"></div>
                      <div className="w-2/3 h-2 bg-orange-400/50 rounded"></div>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-gray-800/50 rounded-2xl rounded-bl-sm p-2 max-w-[70%]">
                      <div className="w-4/5 h-2 bg-gray-700/50 rounded"></div>
                    </div>
                  </div>
                  {/* Video preview mock */}
                  <div className="bg-green-600/20 rounded-lg p-2 border border-green-500/30">
                    <div className="w-full h-3 bg-green-400/30 rounded mb-1"></div>
                    <div className="w-1/2 h-2 bg-green-400/20 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto" aria-label="Key features">
          <FeatureCard
            icon={
              <svg className="w-7 h-7 lg:w-8 lg:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            }
            title="Smart Chat"
            description="Intelligent conversations with AI-powered responses, context awareness, and seamless multi-platform integration for enhanced communication."
            colorScheme="orange"
          />

          <FeatureCard
            icon={
              <svg className="w-7 h-7 lg:w-8 lg:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            }
            title="AI Video Summary"
            description="Transform lengthy videos into concise, actionable summaries with AI-powered analysis and key insight extraction."
            colorScheme="green"
          />

          <FeatureCard
            icon={
              <svg className="w-7 h-7 lg:w-8 lg:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
            title="Advanced Analytics"
            description="Deep insights into communication patterns with AI-driven recommendations for engagement optimization and performance tracking."
            colorScheme="teal"
          />
        </section>

        {/* Bottom CTA Section */}
        <section className="mt-16 lg:mt-24 text-center max-w-4xl">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">Transform</span> Your Communication?
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            Join thousands of users already using our AI-powered platform to communicate smarter.
          </p>
          <button 
            className="group relative px-10 py-4 bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 text-white rounded-2xl font-bold text-lg shadow-2xl hover:shadow-green-500/30 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-500/50"
            aria-label="Get started with free account"
          >
            <span className="relative z-10">Get Started Free</span>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" aria-hidden="true"></div>
          </button>
        </section>
      </main>
    </div>
  );
}

// Feature Card Component for better code organization
function FeatureCard({ icon, title, description, colorScheme }) {
  const colorClasses = {
    orange: {
      background: 'from-gray-900/50 via-black/30 to-orange-950/50',
      border: 'border-orange-500/20 hover:border-orange-400/40',
      shadow: 'hover:shadow-orange-500/10',
      iconBg: 'from-orange-500 to-amber-600'
    },
    green: {
      background: 'from-gray-900/50 via-black/30 to-green-950/50',
      border: 'border-green-500/20 hover:border-green-400/40',
      shadow: 'hover:shadow-green-500/10',
      iconBg: 'from-green-500 to-emerald-600'
    },
    amber: {
      background: 'from-gray-900/50 via-black/30 to-amber-950/50',
      border: 'border-amber-500/20 hover:border-amber-400/40',
      shadow: 'hover:shadow-amber-500/10',
      iconBg: 'from-amber-500 to-orange-600'
    },
    teal: {
      background: 'from-gray-900/50 via-black/30 to-teal-950/50',
      border: 'border-teal-500/20 hover:border-teal-400/40',
      shadow: 'hover:shadow-teal-500/10',
      iconBg: 'from-teal-500 to-green-600'
    }
  };

  const colors = colorClasses[colorScheme];

  return (
    <div className={`group p-6 lg:p-8 bg-gradient-to-br ${colors.background} backdrop-blur-xl rounded-3xl border ${colors.border} hover:shadow-2xl ${colors.shadow} transition-all duration-300 transform hover:scale-105`}>
      <div className={`w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br ${colors.iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
        {icon}
      </div>
      <h3 className="text-xl lg:text-2xl font-bold text-white mb-4">{title}</h3>
      <p className="text-gray-300 leading-relaxed text-sm lg:text-base">
        {description}
      </p>
    </div>
  );
}