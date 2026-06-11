import { useEffect, useRef, useState, FormEvent } from 'react';
import { Menu, X, ArrowRight, Compass, Shield, Database, Map, Landmark, Flame, CompassIcon } from 'lucide-react';
import RevealLayer from './components/RevealLayer';

// High-resolution Geology asset image mappings
const BG_IMAGE_1 = "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_195923_b0ba8ace-1d1d-4f2c-9a28-1ab84b330680.png&w=1280&q=85";
const BG_IMAGE_2 = "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_201152_bba90a12-bf12-459f-91f0-51f237dbaf3b.png&w=1280&q=85";

export default function App() {
  const mouseRef = useRef({ x: -999, y: -999 });
  const smoothRef = useRef({ x: -999, y: -999 });
  const rafRef = useRef<number | null>(null);
  
  const [cursorPos, setCursorPos] = useState({ x: -999, y: -999 });
  const [activeTab, setActiveTab] = useState('Course');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Custom interactive modal states
  const [showDigModal, setShowDigModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isSignedUp, setIsSignedUp] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (mouseRef.current.x === -999) {
        smoothRef.current = { x: e.clientX, y: e.clientY };
      }
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        if (mouseRef.current.x === -999) {
          smoothRef.current = { x: touch.clientX, y: touch.clientY };
        }
        mouseRef.current = { x: touch.clientX, y: touch.clientY };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        mouseRef.current = { x: touch.clientX, y: touch.clientY };
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    const tick = () => {
      if (mouseRef.current.x !== -999) {
        if (smoothRef.current.x === -999) {
          smoothRef.current = { ...mouseRef.current };
        } else {
          smoothRef.current.x += (mouseRef.current.x - smoothRef.current.x) * 0.1;
          smoothRef.current.y += (mouseRef.current.y - smoothRef.current.y) * 0.1;
        }
        setCursorPos({ x: smoothRef.current.x, y: smoothRef.current.y });
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const handleDigClick = () => {
    setShowDigModal(true);
  };

  const handleSignUpSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (userName && userEmail) {
      setIsSignedUp(true);
      setTimeout(() => {
        setShowSignUpModal(false);
        setIsSignedUp(false);
        setUserName('');
        setUserEmail('');
      }, 2500);
    }
  };

  return (
    <div 
      className="min-h-screen bg-white tracking-[-0.02em] select-none text-white overflow-hidden relative"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Target elements check: Header Navbar with absolute positioning and z-index */}
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between p-4 sm:p-5 bg-gradient-to-b from-black/60 to-transparent">
        {/* Left Side: Inline SVG Logo and Wordmark */}
        <div className="flex items-center gap-3">
          <svg 
            width="26" 
            height="26" 
            viewBox="0 0 256 256" 
            fill="#ffffff" 
            className="transition-transform hover:rotate-12 duration-500"
            id="lithos-navbar-logo"
            aria-label="Lithos Logo"
          >
            <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
          </svg>
          <span className="text-white text-2xl font-playfair italic select-none">Lithos</span>
        </div>

        {/* Center Pill: Desktop Navigation Menu */}
        <div 
          className="hidden md:flex absolute left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-2 py-1.5 items-center gap-1"
          id="desktop-navigation-pill"
        >
          {['Course', 'Field Guides', 'Geology', 'Plans', 'Live Tour'].map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  isActive 
                    ? 'text-white bg-white/20 shadow-sm border border-white/10' 
                    : 'text-white/80 hover:bg-white/20 hover:text-white'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Right Side: Desktop Sign Up Button */}
        <div className="hidden md:block">
          <button 
            type="button"
            onClick={() => setShowSignUpModal(true)}
            className="bg-white text-gray-900 text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-gray-100 transition-all duration-300 transform active:scale-95 cursor-pointer shadow-lg hover:shadow-white/10"
          >
            Sign Up
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button 
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-white hover:text-orange-400 p-2 rounded-full transition-colors focus:outline-none"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[90] bg-black/95 backdrop-blur-xl flex flex-col justify-between p-8 md:hidden transition-all duration-500 animate-fade-in">
          <div className="flex flex-col gap-8 mt-24">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <svg width="24" height="24" viewBox="0 0 256 256" fill="#ffffff">
                <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
              </svg>
              <span className="text-white text-2xl font-playfair italic">Lithos Navigation</span>
            </div>
            
            <div className="flex flex-col gap-4">
              {['Course', 'Field Guides', 'Geology', 'Plans', 'Live Tour'].map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`text-left px-4 py-3 rounded-xl text-lg font-medium transition-all ${
                      isActive 
                        ? 'text-orange-400 bg-white/10 border-l-4 border-orange-500' 
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-4 mb-8">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setShowSignUpModal(true);
              }}
              className="w-full bg-white text-gray-900 text-base font-semibold py-4 rounded-xl text-center shadow-lg hover:bg-gray-100 transition-all active:scale-95"
            >
              Sign Up
            </button>
            <p className="text-center text-xs text-white/40">Lithos © {new Date().getFullYear()} — Explore Deep Time</p>
          </div>
        </div>
      )}

      {/* Hero Section Container */}
      <section 
        className="relative w-full overflow-hidden h-screen bg-black" 
        style={{ height: '100dvh' }}
        id="lithos-geology-container"
      >
        {/* LAYER 1: Base Image (z-10) with Slow Ken Burns Zoom-Out */}
        <div 
          className="absolute inset-0 bg-center bg-cover bg-no-repeat z-10 hero-zoom pointer-events-none"
          style={{ backgroundImage: `url(${BG_IMAGE_1})` }}
          id="geology-base-image"
        />

        {/* Dynamic Dark Gradient Overlay to ensure heading readability and moody lighting */}
        <div className="absolute inset-0 bg-black/35 z-20 pointer-events-none" />

        {/* LAYER 2: Reveal Layer (z-30) showing BG_IMAGE_2 via spotlight canvas mask */}
        <RevealLayer 
          image={BG_IMAGE_2} 
          cursorX={cursorPos.x} 
          cursorY={cursorPos.y} 
        />

        {/* Hover Cue - Follows with subtle lag if user hasn't hovered or tapped yet */}
        {cursorPos.x === -999 && (
          <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none animate-pulse">
            <div className="flex flex-col items-center bg-black/60 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 shadow-2xl">
              <CompassIcon className="text-orange-400 w-8 h-8 animate-spin-slow mb-2" />
              <p className="text-xs text-white/80 font-mono uppercase tracking-widest text-center">Move cursor or tap to peel back layers</p>
            </div>
          </div>
        )}

        {/* LAYER 3: Heading (z-50) Absolute Top-Anchored */}
        <div 
          className="absolute top-[14%] left-0 right-0 flex flex-col items-center text-center px-5 pointer-events-none z-50"
          id="geology-main-header"
        >
          <h1 className="text-white leading-[0.95]" id="main-title">
            <span 
              className="block font-playfair italic font-normal text-5xl sm:text-7xl md:text-8xl hero-anim hero-reveal"
              style={{ letterSpacing: '-0.05em', animationDelay: '0.25s' }}
            >
              Layers hold
            </span>
            <span 
              className="block font-normal text-5xl sm:text-7xl md:text-8xl -mt-1 hero-anim hero-reveal"
              style={{ letterSpacing: '-0.08em', animationDelay: '0.42s' }}
            >
              tales of time
            </span>
          </h1>
        </div>

        {/* LAYER 4: Bottom-Left Paragraph (z-50) */}
        <div 
          className="hidden sm:block absolute bottom-14 left-10 md:left-14 max-w-[260px] z-50 hero-anim hero-fade"
          style={{ animationDelay: '0.7s' }}
          id="geology-bottom-left-desc"
        >
          <p className="text-sm text-white/80 leading-relaxed shadow-sm drop-shadow-md">
            Every layer of sediment records a chapter of our planet, from ancient seabeds to drifting ash, layered across millions of years beneath us.
          </p>
        </div>

        {/* LAYER 5: Bottom-Right Block (z-50) */}
        <div 
          className="absolute bottom-10 sm:bottom-24 left-5 right-5 sm:left-auto sm:right-10 md:right-14 max-w-full sm:max-w-[260px] flex flex-col items-start gap-4 sm:gap-5 z-50 hero-anim hero-fade"
          style={{ animationDelay: '0.85s' }}
          id="geology-bottom-right-action"
        >
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed shadow-sm drop-shadow-md">
            Our interactive maps let you peel back the crust to trace how stones, fossils, and deep time combine to shape the ground beneath your feet.
          </p>
          <button 
            type="button"
            onClick={handleDigClick}
            className="w-full sm:w-auto bg-[#e8702a] hover:bg-[#d2611f] text-white text-sm font-medium px-7 py-3 rounded-full transition-all duration-300 hover:scale-[1.03] active:scale-95 hover:shadow-lg hover:shadow-[#e8702a]/30 cursor-pointer text-center"
            id="start-digging-button"
          >
            Start Digging
          </button>
        </div>
      </section>

      {/* Interactive Modal: Excavation Information Logs */}
      {showDigModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[110] flex items-center justify-center p-4 animate-fade-in">
          <div 
            className="bg-[#121214] border border-white/10 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden"
            id="excavation-log-modal"
          >
            <button 
              type="button"
              onClick={() => setShowDigModal(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white p-1 rounded-full hover:bg-white/5 transition-all"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
              <div className="p-2 bg-orange-600/20 rounded-lg text-orange-400">
                <Compass className="w-6 h-6 animate-spin-slow" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-playfair italic">Lithos Excavation Log</h3>
                <p className="text-xs text-white/50 font-mono uppercase tracking-wider">Coordinates: Active Sector</p>
              </div>
            </div>

            {/* Simulated Geological Layer Readout */}
            <p className="text-sm text-white/80 mb-6 leading-relaxed">
              Below the surface profile, your cursor reveal acts as a magnetometer. Here are the core stratigraphic formations detected under this coordinate profile:
            </p>

            <div className="flex flex-col gap-4 font-sans text-sm pb-4">
              <div className="flex gap-4 items-start p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-orange-400 font-mono font-bold mt-0.5">A.</span>
                <div>
                  <h4 className="font-semibold text-white">Quaternary Holocene Soil (0 - 50m)</h4>
                  <p className="text-xs text-white/60 leading-relaxed mt-0.5">Glacial till, fertile alluvial sediment, and organic humus dating from present day to 11,700 years ago.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-orange-400 font-mono font-bold mt-0.5">B.</span>
                <div>
                  <h4 className="font-semibold text-white">Late Cretaceous Limestone (50m - 1.2km)</h4>
                  <p className="text-xs text-white/60 leading-relaxed mt-0.5">Densely compacted shell segments and marine calcite. Perfect evidence of highly dynamic prehistoric warm epicontinental shallow oceans.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-orange-400 font-mono font-bold mt-0.5">C.</span>
                <div>
                  <h4 className="font-semibold text-white">Precambrian Basement Complex (1.2km+)</h4>
                  <p className="text-xs text-white/60 leading-relaxed mt-0.5">Hardened granite gneiss and dark schist bands tracking tectonic accretion cycles from 2.1 billion years back.</p>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-4">
              <span className="text-xs text-white/40 font-mono">Stratigraphy Profile: Active</span>
              <button 
                type="button"
                onClick={() => setShowDigModal(false)}
                className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                Close Logs
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Modal: Desktop Sign Up Spot */}
      {showSignUpModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[110] flex items-center justify-center p-4 animate-fade-in">
          <div 
            className="bg-[#121214] border border-white/10 rounded-2xl max-w-sm w-full p-6 sm:p-8 shadow-2xl relative"
            id="signup-modal"
          >
            <button 
              type="button"
              onClick={() => setShowSignUpModal(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white p-1 rounded-full hover:bg-white/5 transition-all"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            {!isSignedUp ? (
              <form onSubmit={handleSignUpSubmit} className="flex flex-col gap-4">
                <div className="text-center mb-2">
                  <h3 className="text-xl font-bold font-playfair italic text-white">Join Lithos Field Guide</h3>
                  <p className="text-xs text-white/60 mt-1">Unlock interactive geology maps, Live stream tours, and structural crust analytics.</p>
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="user-name" className="text-xs text-white/70 font-medium">Your Name</label>
                  <input 
                    type="text" 
                    id="user-name"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="E.g. James Hutton"
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="user-email" className="text-xs text-white/70 font-medium">Email Address</label>
                  <input 
                    type="email" 
                    id="user-email"
                    required
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="E.g. james@unconformity.org"
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>

                <button 
                  type="submit"
                  className="bg-[#e8702a] hover:bg-[#d2611f] text-white text-sm font-semibold py-2.5 rounded-lg transition-transform active:scale-95 mt-2"
                >
                  Join Field Guides
                </button>
              </form>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-12 h-12 rounded-full bg-green-500/20 border border-green-500 flex items-center justify-center text-green-400 mb-4 animate-bounce">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-white">Welcome aboard, {userName}!</h4>
                <p className="text-xs text-white/60 mt-2">We have reserved your access slot. Strategic maps invitation dispatched!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
