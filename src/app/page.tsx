import Link from "next/link";
import Image from "next/image";
import { APP_NAME } from "@/constants";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Decorative background blur elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float"></div>
      <div className="absolute top-[20%] right-[-10%] w-[30%] h-[30%] bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float-delayed"></div>
      
      {/* Navbar (Glassmorphism) */}
      <nav className="flex items-center justify-between px-4 sm:px-8 py-3 sm:py-5 glass-panel sticky top-0 z-50 mx-2 sm:mx-4 mt-2 sm:mt-4 rounded-2xl">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
            <span className="text-primary-content font-bold text-xs sm:text-sm tracking-wider">PF</span>
          </div>
          <span className="font-extrabold text-lg sm:text-xl tracking-tight text-base-content hidden sm:block">
            {APP_NAME}
          </span>
        </div>
        <div className="flex gap-2 sm:gap-4 items-center shrink-0">
          <Link href="/login" className="text-base-content/70 hover:text-base-content font-medium text-xs sm:text-sm transition-colors">
            Sign In
          </Link>
          <Link href="/signup" className="btn btn-primary btn-sm sm:btn-sm rounded-full px-4 sm:px-6 shadow-md shadow-primary/20 hover:-translate-y-0.5 transition-transform text-xs sm:text-sm">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-between px-8 lg:px-20 py-12 lg:py-0 max-w-7xl mx-auto w-full gap-12 z-10">
        
        {/* Left: Copy & CTA */}
        <div className="flex-1 text-center lg:text-left flex flex-col items-center lg:items-start pt-10 lg:pt-0">
          <div className="inline-flex items-center justify-center gap-2 mb-6 sm:mb-8 px-4 py-2 text-[11px] sm:text-sm font-semibold rounded-full bg-primary/5 border border-primary/20 text-primary shadow-sm leading-snug max-w-full">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="whitespace-nowrap">The New Home for Creative Portfolios</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black max-w-2xl leading-[1.1] mb-4 sm:mb-6 tracking-tight text-base-content">
            Share Your <br className="hidden lg:block"/>
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent inline-block pb-1 sm:pb-2">
              Visual Story
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-base-content/60 max-w-xl mb-8 sm:mb-10 leading-relaxed font-medium px-4 sm:px-0">
            A beautifully designed platform to upload stunning photos and videos, connect with creators worldwide, and build your professional portfolio.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 w-full sm:w-auto px-6 sm:px-0">
            <Link href="/signup" className="btn btn-primary btn-md sm:btn-lg rounded-full px-6 sm:px-8 shadow-xl shadow-primary/30 hover:scale-105 transition-transform group">
              Start Creating Free
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            <Link href="/feed" className="btn btn-outline btn-md sm:btn-lg rounded-full px-6 sm:px-8 hover:bg-base-200 hover:border-base-300 hover:text-base-content border-base-300 text-base-content/70">
              Explore Feed
            </Link>
          </div>
          
          {/* Trust Indicators */}
          <div className="mt-12 flex items-center gap-4 opacity-70">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-base-200 overflow-hidden">
                  <Image src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" width={40} height={40} />
                </div>
              ))}
            </div>
            <div className="text-sm font-medium">
              <span className="text-primary font-bold">10,000+</span> creators already joined
            </div>
          </div>
        </div>

        {/* Right: Floating UI Presentation */}
        <div className="flex-1 relative w-full max-w-lg lg:max-w-none h-[500px] lg:h-[700px] hidden md:block">
          {/* Main App Mockup */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md aspect-[4/5] glass-panel rounded-3xl p-4 shadow-2xl animate-float flex flex-col gap-4">
            {/* Mock Header */}
            <div className="flex items-center gap-3 pb-2 border-b border-base-content/10">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent to-secondary"></div>
              <div>
                <div className="w-24 h-4 bg-base-content/20 rounded-md mb-1"></div>
                <div className="w-16 h-3 bg-base-content/10 rounded-md"></div>
              </div>
            </div>
            {/* Mock Image */}
            <div className="flex-1 rounded-2xl bg-base-200 relative overflow-hidden group">
              <Image src="https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?q=80&w=800&auto=format&fit=crop" alt="Photography" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            {/* Mock Actions */}
            <div className="flex gap-4 pt-1">
              <div className="w-8 h-8 rounded-full bg-error/10 text-error flex items-center justify-center">❤️</div>
              <div className="w-8 h-8 rounded-full bg-base-content/5 flex items-center justify-center">💬</div>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-[20%] left-[-10%] glass-panel px-6 py-4 rounded-2xl shadow-xl animate-float-delayed flex items-center gap-3">
            <div className="text-3xl">✨</div>
            <div>
              <div className="text-sm font-bold text-base-content">4.9/5 Rating</div>
              <div className="text-xs text-base-content/50">From top artists</div>
            </div>
          </div>

          <div className="absolute bottom-[15%] right-[-5%] glass-panel px-6 py-4 rounded-2xl shadow-xl animate-float flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-bold text-base-content">Video Support</div>
              <div className="text-xs text-base-content/50">Upload up to 100MB</div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
