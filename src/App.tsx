import { useState, DragEvent, FormEvent, ChangeEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen, 
  Smile, 
  Award, 
  ShieldCheck, 
  Check, 
  Menu, 
  X, 
  ArrowRight, 
  ChevronDown, 
  Volume2, 
  Bell, 
  UploadCloud, 
  Lock, 
  Star,
  BookOpenCheck,
  Sparkles,
  RefreshCw,
  FileText,
  Gamepad2,
  LogOut,
  VolumeX,
  Lightbulb,
  Play,
  ArrowLeft
} from "lucide-react";

// Use direct path as a string to avoid compile-time image asset import checks
const logoImg = "/src/assets/images/smart_pikin_logo_1782388031030.jpg";

const bookLessons: Record<string, { paragraph: string; syllables: { word: string; guide: string }[]; phonicsTip: string }> = {
  "The Lion's Big Day": {
    paragraph: "The little lion wanted to roar. He took a deep breath and opened his mouth wide.",
    syllables: [
      { word: "lion", guide: "li · on" },
      { word: "wanted", guide: "want · ed" },
      { word: "opened", guide: "o · pened" }
    ],
    phonicsTip: "Focus on the short 'o' and long 'i' sounds in 'lion' and 'opened'. Encourage your child to say each syllable slowly."
  },
  "My First Space Trip": {
    paragraph: "We sat in the huge rocket. 10, 9, 8... blast off! The spaceship flew to the stars.",
    syllables: [
      { word: "rocket", guide: "rock · et" },
      { word: "spaceship", guide: "space · ship" },
      { word: "stars", guide: "stars (1 syllable)" }
    ],
    phonicsTip: "Blend 'sp' in 'spaceship'. Count down the numbers together to build reading rhythm!"
  },
  "Ocean Adventures": {
    paragraph: "The blue dolphin jumped high over the giant wave. She splashed water on our boat.",
    syllables: [
      { word: "dolphin", guide: "dol · phin" },
      { word: "jumped", guide: "jumped (1 syllable)" },
      { word: "splashed", guide: "splashed (1 syllable)" }
    ],
    phonicsTip: "The 'ph' in 'dolphin' makes the 'f' sound. Practise blending 'sh' in 'splashed'."
  },
  "The Magic Garden": {
    paragraph: "The colorful butterfly landed on a glowing flower. It whispered a happy secret.",
    syllables: [
      { word: "colorful", guide: "col · or · ful" },
      { word: "butterfly", guide: "but · ter · fly" },
      { word: "whispered", guide: "whis · pered" }
    ],
    phonicsTip: "Practice the 3-syllable word 'but · ter · fly' with claps for each part."
  },
  "How Things Work": {
    paragraph: "Our amazing brain controls everything we do. It sends super fast electrical signals.",
    syllables: [
      { word: "amazing", guide: "a · maz · ing" },
      { word: "controls", guide: "con · trols" },
      { word: "electrical", guide: "e · lec · tri · cal" }
    ],
    phonicsTip: "Praise your child for tackling multi-syllable words like 'e · lec · tri · cal' using phonics."
  },
  "World Explorer": {
    paragraph: "We traveled across the beautiful green continents. Every land has different animals and stories.",
    syllables: [
      { word: "traveled", guide: "trav · eled" },
      { word: "beautiful", guide: "beau · ti · ful" },
      { word: "continents", guide: "con · ti · nents" }
    ],
    phonicsTip: "Help your child break down 'continents' into three clear beats."
  }
};

export default function App() {
  // Navigation View state
  const [currentView, setCurrentView] = useState<'landing' | 'signup' | 'login' | 'books' | 'how' | 'features' | 'dashboard'>('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Spelling bee game states
  const [spellingActive, setSpellingActive] = useState(false);
  const [spellingWordIndex, setSpellingWordIndex] = useState(0);
  const [spellingInput, setSpellingInput] = useState("");
  const [spellingFeedback, setSpellingFeedback] = useState("");
  const [spellingScore, setSpellingScore] = useState(0);
  const [showSpellingHint, setShowSpellingHint] = useState(false);

  // ABC / 123 reading states
  const [abcTab, setAbcTab] = useState<'abc' | '123'>('abc');
  const [activeAbcLetter, setActiveAbcLetter] = useState<string | null>(null);
  const [activeNumberValue, setActiveNumberValue] = useState<number | null>(null);

  // Dashboard active feature selection
  const [activeDashboardFeature, setActiveDashboardFeature] = useState<'spelling' | 'abc123' | 'upload' | 'library'>('spelling');

  // Books page search & filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAgeFilter, setSelectedAgeFilter] = useState("All");
  const [selectedBook, setSelectedBook] = useState<any | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showPhonicsTips, setShowPhonicsTips] = useState(false);

  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Log In Form states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginError, setLoginError] = useState("");

  const navigateToSection = (sectionId: string) => {
    if (currentView !== 'landing') {
      setCurrentView('landing');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 150);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginSuccess(false);
    setFormSubmitted(false);
    setParentFirstName("");
    setChildFirstName("");
    setSpellingActive(false);
    setSpellingScore(0);
    setCurrentView('landing');
    window.scrollTo({ top: 0 });
  };

  // FAQ states (using an array of boolean flags or tracking selected index)
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Interactive Book Upload Modal state
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  // Sign up Form state
  const [parentFirstName, setParentFirstName] = useState("");
  const [parentLastName, setParentLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [childFirstName, setChildFirstName] = useState("");
  const [numChildren, setNumChildren] = useState("");
  const [selectedAges, setSelectedAges] = useState<string[]>([]);
  const [readingLevel, setReadingLevel] = useState("");
  const [referralSource, setReferralSource] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const faqs = [
    {
      q: "Is Smart Pikin free to use?",
      a: "Yes! Getting started is completely free. You can access a selection of books and AI features at no cost. Premium plans with unlimited books and advanced reports are available too."
    },
    {
      q: "What age group is Smart Pikin for?",
      a: "Smart Pikin supports children ages 3 to 14. The content, books, and AI feedback are all tailored to the age range you select for your child."
    },
    {
      q: "Can I upload my child's school books?",
      a: "Absolutely! You can upload PDFs or images of any book. Our AI will convert it into an interactive reading session with pronunciation coaching built in."
    },
    {
      q: "Is my child's data safe?",
      a: "Yes. We take child privacy very seriously. We never show ads, never share data with third parties, and fully comply with child safety guidelines."
    },
    {
      q: "Does it work without internet?",
      a: "The AI features require an internet connection. However, downloaded books can be read offline with limited features."
    }
  ];

  const bookLibrary = [
    { emoji: "🦁", title: "The Lion's Big Day", ages: "Ages 3–5", color: "from-orange-100 to-amber-50" },
    { emoji: "🚀", title: "My First Space Trip", ages: "Ages 4–6", color: "from-sky-100 to-indigo-50" },
    { emoji: "🌊", title: "Ocean Adventures", ages: "Ages 6–8", color: "from-blue-100 to-cyan-50" },
    { emoji: "🦋", title: "The Magic Garden", ages: "Ages 5–7", color: "from-pink-100 to-rose-50" },
    { emoji: "🧠", title: "How Things Work", ages: "Ages 9–12", color: "from-purple-100 to-indigo-50" },
    { emoji: "🌍", title: "World Explorer", ages: "Ages 8–12", color: "from-emerald-100 to-teal-50" },
  ];

  // Age options mapping
  const ageOptions = [
    { id: "age1", label: "3–5 yrs 🐣" },
    { id: "age2", label: "6–8 yrs 🌱" },
    { id: "age3", label: "9–11 yrs 📚" },
    { id: "age4", label: "12–14 yrs 🚀" },
  ];

  // Handle Age Pills selection
  const toggleAgeRange = (label: string) => {
    if (selectedAges.includes(label)) {
      setSelectedAges(selectedAges.filter((item) => item !== label));
    } else {
      setSelectedAges([...selectedAges, label]);
    }
  };

  // Simulated signup submit
  const handleSignupSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      setErrorMsg("Please accept the Terms of Service and Privacy Policy.");
      return;
    }
    setErrorMsg("");
    setIsSubmitting(true);

    try {
      // Simulate API or Webhook call (matching landing page's fallback behavior)
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setFormSubmitted(true);
    } catch (err) {
      setErrorMsg("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simulated Login submit
  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setLoginError("Please enter both email and password.");
      return;
    }
    setLoginError("");
    setIsLoggingIn(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setLoginSuccess(true);
    } catch (err) {
      setLoginError("Could not connect to service. Please try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Mock file drop handlers
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setUploadedFile(file);
    setUploadProgress(10);
    setAnalysisResult(null);
    
    // Simulate progression
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          triggerAIAnalysis(file.name);
          return 100;
        }
        return prev + 15;
      });
    }, 150);
  };

  const triggerAIAnalysis = (fileName: string) => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisResult(`Successfully imported "${fileName}" into Smart Pikin! Our AI has optimized this book with syllables breakdown, child-friendly audio guides, and generated 5 pronunciation milestone quizzes.`);
    }, 2000);
  };

  const resetUploadState = () => {
    setUploadedFile(null);
    setUploadProgress(0);
    setIsAnalyzing(false);
    setAnalysisResult(null);
  };

  return (
    <div className="min-h-screen bg-soft-pikin text-navy-pikin font-sans selection:bg-sky-pikin/30 selection:text-navy-pikin">
      
      {/* ─── NAVBAR ─── */}
      <nav className="bg-white sticky top-0 z-50 shadow-md shadow-sky-pikin/10">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          
          {/* Logo with backup layout */}
          <button 
            onClick={() => {
              setCurrentView('landing');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3 cursor-pointer text-left focus:outline-none border-none bg-transparent"
          >
            <img 
              src={logoImg} 
              alt="Smart Pikin Logo" 
              className="h-14 w-14 object-cover rounded-full border-2 border-sky-pikin"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <span className="font-display text-2xl text-navy-pikin tracking-tight flex items-center gap-1.5">
              📚 Smart Pikin
            </span>
          </button>

          {/* Desktop Nav Links */}
          <ul className="hidden md:flex items-center gap-6 font-bold text-[15px]">
            {isLoggedIn ? (
              <>
                <li>
                  <button 
                    onClick={() => {
                      setCurrentView('dashboard');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`hover:text-sky-pikin transition-colors font-bold cursor-pointer ${currentView === 'dashboard' ? 'text-sky-pikin underline decoration-2 underline-offset-4' : 'text-navy-pikin'}`}
                  >
                    My Dashboard 🏠
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      setCurrentView('books');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`hover:text-sky-pikin transition-colors font-bold cursor-pointer ${currentView === 'books' ? 'text-sky-pikin underline decoration-2 underline-offset-4' : 'text-navy-pikin'}`}
                  >
                    Books Library
                  </button>
                </li>
                <li>
                  <button 
                    onClick={handleLogout}
                    className="text-coral-pikin hover:text-coral-pikin/80 transition-colors font-extrabold cursor-pointer border border-coral-pikin/20 hover:border-coral-pikin px-4 py-2 rounded-full"
                  >
                    Log Out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <button 
                    onClick={() => {
                      setCurrentView('how');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`hover:text-sky-pikin transition-colors font-bold cursor-pointer ${currentView === 'how' ? 'text-sky-pikin underline decoration-2 underline-offset-4' : 'text-navy-pikin'}`}
                  >
                    How It Works
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      setCurrentView('features');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`hover:text-sky-pikin transition-colors font-bold cursor-pointer ${currentView === 'features' ? 'text-sky-pikin underline decoration-2 underline-offset-4' : 'text-navy-pikin'}`}
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      setCurrentView('books');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`hover:text-sky-pikin transition-colors font-bold cursor-pointer ${currentView === 'books' ? 'text-sky-pikin underline decoration-2 underline-offset-4' : 'text-navy-pikin'}`}
                  >
                    Books
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      setCurrentView('login');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-navy-pikin hover:text-sky-pikin transition-colors font-extrabold cursor-pointer"
                  >
                    Member Login
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      setCurrentView('signup');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="bg-coral-pikin text-white px-6 py-2.5 rounded-full font-extrabold hover:bg-coral-pikin/90 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-coral-pikin/20 cursor-pointer"
                  >
                    Sign Up
                  </button>
                </li>
              </>
            )}
          </ul>

          {/* Mobile Hamburger menu */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden p-2 rounded-lg text-navy-pikin hover:bg-soft-pikin transition-colors focus:outline-none cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation Panel */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-sky-pikin/10 overflow-hidden"
            >
              <ul className="px-6 py-4 flex flex-col gap-4 font-bold text-[15px]">
                {isLoggedIn ? (
                  <>
                    <li>
                      <button 
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setCurrentView('dashboard');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`block w-full text-left py-2 hover:text-sky-pikin transition-colors font-bold cursor-pointer ${currentView === 'dashboard' ? 'text-sky-pikin font-black' : 'text-navy-pikin'}`}
                      >
                        🏠 My Dashboard
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setCurrentView('books');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`block w-full text-left py-2 hover:text-sky-pikin transition-colors font-bold cursor-pointer ${currentView === 'books' ? 'text-sky-pikin font-black' : 'text-navy-pikin'}`}
                      >
                        📚 Books Library
                      </button>
                    </li>
                    <li className="pt-2">
                      <button 
                        onClick={() => {
                          setMobileMenuOpen(false);
                          handleLogout();
                        }}
                        className="w-full bg-coral-pikin/10 text-coral-pikin text-center py-3 rounded-full font-extrabold hover:bg-coral-pikin/20 transition-all cursor-pointer"
                      >
                        Log Out
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <button 
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setCurrentView('how');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`block w-full text-left py-2 hover:text-sky-pikin transition-colors font-bold cursor-pointer ${currentView === 'how' ? 'text-sky-pikin font-black' : 'text-navy-pikin'}`}
                      >
                        How It Works
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setCurrentView('features');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`block w-full text-left py-2 hover:text-sky-pikin transition-colors font-bold cursor-pointer ${currentView === 'features' ? 'text-sky-pikin font-black' : 'text-navy-pikin'}`}
                      >
                        Features
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setCurrentView('books');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`block w-full text-left py-2 hover:text-sky-pikin transition-colors font-bold cursor-pointer ${currentView === 'books' ? 'text-sky-pikin font-black' : 'text-navy-pikin'}`}
                      >
                        Books
                      </button>
                    </li>
                    <li className="pt-2 flex flex-col gap-2">
                      <button 
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setCurrentView('login');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="w-full bg-slate-100 text-navy-pikin text-center py-3 rounded-full font-extrabold hover:bg-slate-200 transition-all cursor-pointer"
                      >
                        Member Login
                      </button>
                      <button 
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setCurrentView('signup');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="w-full bg-coral-pikin text-white text-center py-3 rounded-full font-extrabold hover:bg-coral-pikin/95 active:scale-95 transition-all shadow-md shadow-coral-pikin/20 cursor-pointer"
                      >
                        Sign Up
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {currentView === 'landing' && (
        <>
          {/* ─── HERO SECTION ─── */}
          <section className="relative overflow-hidden bg-gradient-to-br from-cyan-100 via-amber-50 to-emerald-50 py-16 px-6 md:py-24">
        {/* Background decorative blob */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-pikin/10 rounded-full blur-3xl pointer-events-none -mr-40 -mt-20" />
        
        <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Hero text */}
          <div className="md:col-span-7 flex flex-col items-start text-left">
            <span className="inline-flex items-center gap-1.5 bg-sun-pikin/30 text-navy-pikin font-black text-xs tracking-wider uppercase px-4 py-1.5 rounded-full mb-6">
              🌟 AI-Powered Kids Reading App
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-navy-pikin leading-tight mb-6">
              Where Every Child <span className="text-sky-pikin">Learns to Read</span> with Confidence
            </h1>
            <p className="text-lg md:text-xl text-[#4a6080] leading-relaxed mb-8 max-w-xl">
              Smart Pikin uses advanced AI to help children read, pronounce, and improve — one fun story at a time. Parents stay in control. Kids stay engaged.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button 
                onClick={() => {
                  setCurrentView('signup');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center gap-2 bg-coral-pikin text-white font-extrabold text-lg px-8 py-4 rounded-full shadow-xl shadow-coral-pikin/30 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                Start Free Trial 🚀
              </button>
              <button 
                onClick={() => {
                  setCurrentView('how');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center gap-2 bg-white text-sky-pikin border-2 border-sky-pikin font-extrabold text-lg px-8 py-4 rounded-full hover:bg-sky-pikin hover:text-white transition-all cursor-pointer"
              >
                See How It Works
              </button>
            </div>
          </div>

          {/* Hero Image / Mascot */}
          <div className="md:col-span-5 flex justify-center">
            <motion.div 
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
              className="relative p-4"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-sky-pikin/20 to-sun-pikin/20 blur-2xl rounded-full" />
              <img 
                src={logoImg} 
                alt="Smart Pikin Reading Mascot" 
                className="w-80 h-80 md:w-96 md:h-96 object-cover rounded-[2.5rem] shadow-2xl relative z-10 border-4 border-white"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-2xl shadow-lg flex items-center gap-3 relative z-20 border border-sky-pikin/10">
                <div className="bg-emerald-100 p-2.5 rounded-full text-emerald-600">
                  <Volume2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold">Live AI Feedback</p>
                  <p className="text-sm font-black text-navy-pikin">"Great Job! Pronounced: Lion"</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── TRUST STRIP ─── */}
      <div className="bg-navy-pikin text-white py-6 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center items-center gap-x-12 gap-y-4">
          <div className="flex items-center gap-2 font-bold text-sm sm:text-base">
            <span className="text-xl">👨‍👩‍👧</span>
            <span>Trusted by <strong className="text-sun-pikin font-black">5,000+</strong> families</span>
          </div>
          <div className="h-1.5 w-1.5 bg-sky-pikin rounded-full hidden md:block" />
          <div className="flex items-center gap-2 font-bold text-sm sm:text-base">
            <span className="text-xl">📖</span>
            <span><strong className="text-sun-pikin font-black">200+</strong> curated books</span>
          </div>
          <div className="h-1.5 w-1.5 bg-sky-pikin rounded-full hidden md:block" />
          <div className="flex items-center gap-2 font-bold text-sm sm:text-base">
            <span className="text-xl">🎙️</span>
            <span>Real-time <strong className="text-sun-pikin font-black">AI pronunciation</strong> feedback</span>
          </div>
          <div className="h-1.5 w-1.5 bg-sky-pikin rounded-full hidden md:block" />
          <div className="flex items-center gap-2 font-bold text-sm sm:text-base">
            <span className="text-xl">🌍</span>
            <span>Ages <strong className="text-sun-pikin font-black">3–14</strong> supported</span>
          </div>
        </div>
      </div>





        </>
      )}

      {/* Parent login modal has been refactored to a dedicated full-screen view */}

      {/* ─── DEDICATED SIGNUP & LOGIN PAGES ─── */}
      {currentView === 'signup' ? (
        <section className="bg-gradient-to-br from-navy-pikin via-[#14446e] to-[#0f5f8f] text-white py-12 px-6 min-h-[85vh] flex items-center justify-center">
          <div className="max-w-4xl w-full">
            {/* Back button */}
            <button 
              onClick={() => {
                setCurrentView('landing');
                window.scrollTo({ top: 0 });
              }}
              className="inline-flex items-center gap-2 text-white/80 hover:text-white font-extrabold text-sm mb-6 hover:underline cursor-pointer focus:outline-none"
            >
              ← Back to Home
            </button>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
              <AnimatePresence mode="wait">
              {!formSubmitted ? (
                <motion.form 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSignupSubmit} 
                  className="space-y-6"
                >
                  
                  {/* Two column row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="font-bold text-sm text-[#b0d8f0]">Parent's First Name</label>
                      <input 
                        type="text" 
                        required 
                        value={parentFirstName}
                        onChange={(e) => setParentFirstName(e.target.value)}
                        placeholder="e.g. Amaka"
                        className="p-3.5 rounded-xl border-2 border-white/20 bg-white/10 placeholder:text-white/40 focus:border-sky-pikin focus:outline-none transition-all text-white text-[15px]"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="font-bold text-sm text-[#b0d8f0]">Parent's Last Name</label>
                      <input 
                        type="text" 
                        required 
                        value={parentLastName}
                        onChange={(e) => setParentLastName(e.target.value)}
                        placeholder="e.g. Okafor"
                        className="p-3.5 rounded-xl border-2 border-white/20 bg-white/10 placeholder:text-white/40 focus:border-sky-pikin focus:outline-none transition-all text-white text-[15px]"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm text-[#b0d8f0]">Email Address</label>
                    <input 
                      type="email" 
                      required 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="p-3.5 rounded-xl border-2 border-white/20 bg-white/10 placeholder:text-white/40 focus:border-sky-pikin focus:outline-none transition-all text-white text-[15px]"
                    />
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm text-[#b0d8f0]">Phone Number (WhatsApp preferred)</label>
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+234 800 000 0000"
                      className="p-3.5 rounded-xl border-2 border-white/20 bg-white/10 placeholder:text-white/40 focus:border-sky-pikin focus:outline-none transition-all text-white text-[15px]"
                    />
                  </div>

                  {/* Child's first name */}
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm text-[#b0d8f0]">Child's First Name</label>
                    <input 
                      type="text" 
                      required 
                      value={childFirstName}
                      onChange={(e) => setChildFirstName(e.target.value)}
                      placeholder="Your child's name"
                      className="p-3.5 rounded-xl border-2 border-white/20 bg-white/10 placeholder:text-white/40 focus:border-sky-pikin focus:outline-none transition-all text-white text-[15px]"
                    />
                  </div>

                  {/* Number of Children select */}
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm text-[#b0d8f0]">Number of Children</label>
                    <select 
                      value={numChildren}
                      onChange={(e) => setNumChildren(e.target.value)}
                      className="p-3.5 rounded-xl border-2 border-white/20 bg-white/10 text-white focus:border-sky-pikin focus:outline-none transition-all text-[15px]"
                    >
                      <option value="" className="bg-navy-pikin text-slate-300">Select…</option>
                      <option value="1" className="bg-navy-pikin text-white">1 child</option>
                      <option value="2" className="bg-navy-pikin text-white">2 children</option>
                      <option value="3" className="bg-navy-pikin text-white">3 children</option>
                      <option value="4" className="bg-navy-pikin text-white">4+ children</option>
                    </select>
                  </div>

                  {/* Age multi-select custom pills */}
                  <div className="flex flex-col gap-3">
                    <label className="font-bold text-sm text-[#b0d8f0]">Child's Age Range (select all that apply)</label>
                    <div className="flex flex-wrap gap-3">
                      {ageOptions.map((opt) => {
                        const isChecked = selectedAges.includes(opt.label);
                        return (
                          <button 
                            key={opt.id}
                            type="button"
                            onClick={() => toggleAgeRange(opt.label)}
                            className={`px-5 py-2.5 rounded-full border-2 text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                              isChecked 
                                ? "bg-sky-pikin border-sky-pikin text-white shadow-md shadow-sky-pikin/30" 
                                : "border-white/25 text-white/80 hover:border-sky-pikin hover:text-white"
                            }`}
                          >
                            {isChecked && <Check className="h-4 w-4 text-white" />}
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Reading level select */}
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm text-[#b0d8f0]">Reading Level of Your Child</label>
                    <select 
                      value={readingLevel}
                      onChange={(e) => setReadingLevel(e.target.value)}
                      className="p-3.5 rounded-xl border-2 border-white/20 bg-white/10 text-white focus:border-sky-pikin focus:outline-none transition-all text-[15px]"
                    >
                      <option value="" className="bg-navy-pikin text-slate-300">Select…</option>
                      <option value="Beginner" className="bg-navy-pikin text-white">Beginner – just starting out</option>
                      <option value="Developing" className="bg-navy-pikin text-white">Developing – recognises words</option>
                      <option value="Intermediate" className="bg-navy-pikin text-white">Intermediate – reads sentences</option>
                      <option value="Advanced" className="bg-navy-pikin text-white">Advanced – reads full stories</option>
                    </select>
                  </div>

                  {/* How heard select */}
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm text-[#b0d8f0]">How did you hear about us?</label>
                    <select 
                      value={referralSource}
                      onChange={(e) => setReferralSource(e.target.value)}
                      className="p-3.5 rounded-xl border-2 border-white/20 bg-white/10 text-white focus:border-sky-pikin focus:outline-none transition-all text-[15px]"
                    >
                      <option value="" className="bg-navy-pikin text-slate-300">Select…</option>
                      <option value="Social Media" className="bg-navy-pikin text-white">Social Media</option>
                      <option value="Friend" className="bg-navy-pikin text-white">Friend / Family</option>
                      <option value="School" className="bg-navy-pikin text-white">School / Teacher</option>
                      <option value="Search" className="bg-navy-pikin text-white">Google Search</option>
                      <option value="Other" className="bg-navy-pikin text-white">Other</option>
                    </select>
                  </div>

                  {/* Terms checkbox */}
                  <div className="flex items-start gap-3 mt-4">
                    <input 
                      type="checkbox" 
                      id="terms-check"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-1 h-5 w-5 rounded border-white/20 bg-white/10 accent-sky-pikin focus:outline-none cursor-pointer"
                    />
                    <label htmlFor="terms-check" className="text-xs text-[#b0d8f0] leading-relaxed cursor-pointer select-none">
                      I agree to the <a href="#" className="text-sky-pikin underline">Terms of Service</a> and <a href="#" className="text-sky-pikin underline">Privacy Policy</a>. I understand my child's data is safe and never shared.
                    </label>
                  </div>

                  {/* Error display */}
                  {errorMsg && (
                    <p className="text-rose-300 text-sm font-bold bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
                      ⚠️ {errorMsg}
                    </p>
                  )}

                  {/* Submit button */}
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-coral-pikin text-white py-4 px-6 rounded-full font-display text-lg tracking-wide hover:scale-102 active:scale-98 disabled:opacity-50 transition-all cursor-pointer shadow-lg shadow-coral-pikin/30 hover:shadow-xl hover:shadow-coral-pikin/40 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="h-5 w-5 animate-spin" />
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <span>🎉 Create Free Account</span>
                    )}
                  </button>

                  <div className="text-center text-xs text-[#b0d8f0]/70 flex items-center justify-center gap-1.5 pt-2">
                    <Lock className="h-4 w-4 text-sky-pikin" />
                    <span>Secured & powered by Smart Pikin AI — no spam, ever.</span>
                  </div>

                  <p className="text-center text-sm text-[#b0d8f0] mt-4">
                    Already have an account?{" "}
                    <button 
                      type="button"
                      onClick={() => {
                        setCurrentView('login');
                        window.scrollTo({ top: 0 });
                      }}
                      className="text-white font-extrabold hover:underline cursor-pointer bg-transparent border-none p-0"
                    >
                      Log in here
                    </button>
                  </p>
                </motion.form>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12 space-y-6"
                >
                  <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-4xl border border-emerald-500/30">
                    🎉
                  </div>
                  <h3 className="font-display text-3xl text-white">Welcome on board, {parentFirstName}!</h3>
                  <p className="text-[#b0d8f0] max-w-md mx-auto leading-relaxed">
                    Thank you for signing up to Smart Pikin! We've prepared a custom profile for <strong className="text-white font-black">{childFirstName}</strong> matching the <strong className="text-white font-black">{selectedAges.join(", ") || "3-5 yrs"}</strong> reading milestones.
                  </p>
                  
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/15 max-w-md mx-auto text-left space-y-3.5">
                    <h4 className="font-bold text-sky-pikin flex items-center gap-1.5 border-b border-white/10 pb-2">
                      <Sparkles className="h-4 w-4" /> Next Steps For You:
                    </h4>
                    <div className="flex gap-2.5 items-start text-sm text-[#b0d8f0]">
                      <span className="bg-sky-pikin/20 text-sky-pikin rounded-full w-5 h-5 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">1</span>
                      <span>Check your email (<strong>{email}</strong>) to activate your account credentials.</span>
                    </div>
                    <div className="flex gap-2.5 items-start text-sm text-[#b0d8f0]">
                      <span className="bg-sky-pikin/20 text-sky-pikin rounded-full w-5 h-5 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">2</span>
                      <span>Log in to access 200+ specialized visual interactive books.</span>
                    </div>
                    <div className="flex gap-2.5 items-start text-sm text-[#b0d8f0]">
                      <span className="bg-sky-pikin/20 text-sky-pikin rounded-full w-5 h-5 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">3</span>
                      <span>Test any custom school story book via the "Upload Your Book" feature.</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      setFormSubmitted(false);
                      setIsLoggedIn(true);
                      if (!childFirstName) {
                        setChildFirstName("Femi");
                      }
                      if (!parentFirstName) {
                        setParentFirstName("Amaka");
                      }
                      setCurrentView('dashboard');
                      window.scrollTo({ top: 0 });
                    }}
                    className="bg-sky-pikin text-white font-extrabold px-8 py-3.5 rounded-full hover:bg-sky-pikin/90 transition-all cursor-pointer shadow-md text-sm flex items-center gap-2 mx-auto"
                  >
                    Go to My Account Dashboard 🚀
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
      ) : currentView === 'login' ? (
        <section className="bg-gradient-to-br from-navy-pikin via-[#14446e] to-[#0f5f8f] text-white py-12 px-6 min-h-[85vh] flex items-center justify-center">
          <div className="max-w-md w-full">
            {/* Back button */}
            <button 
              onClick={() => {
                setCurrentView('landing');
                window.scrollTo({ top: 0 });
              }}
              className="inline-flex items-center gap-2 text-white/80 hover:text-white font-extrabold text-sm mb-6 hover:underline cursor-pointer focus:outline-none"
            >
              ← Back to Home
            </button>

            <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-2xl relative border-4 border-sky-pikin/30 text-navy-pikin font-sans">
              <div className="text-center mb-6">
                <span className="text-4xl mb-2 inline-block">🔐</span>
                <h3 className="font-display text-2xl text-navy-pikin">Welcome Back Parents!</h3>
                <p className="text-slate-500 text-sm mt-1">
                  Log in to track your child's weekly pronunciation stats, streaks, and custom library.
                </p>
              </div>

              {!loginSuccess ? (
                <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm text-navy-pikin/80 text-left">Email Address</label>
                    <input 
                      type="email" 
                      required 
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="parent@example.com"
                      className="p-3 rounded-xl border-2 border-slate-200 focus:border-sky-pikin focus:outline-none transition-all text-[15px] text-navy-pikin font-sans"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm text-navy-pikin/80 text-left">Password</label>
                    <input 
                      type="password" 
                      required 
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="p-3 rounded-xl border-2 border-slate-200 focus:border-sky-pikin focus:outline-none transition-all text-[15px] text-navy-pikin font-sans"
                    />
                  </div>

                  {loginError && (
                    <p className="text-rose-600 text-xs font-bold bg-rose-50 p-2.5 rounded-lg border border-rose-100 text-left">
                      ⚠️ {loginError}
                    </p>
                  )}

                  <button 
                    type="submit" 
                    disabled={isLoggingIn}
                    className="w-full bg-sky-pikin text-white py-3.5 px-6 rounded-full font-extrabold text-base hover:bg-sky-pikin/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-pikin/20 cursor-pointer"
                  >
                    {isLoggingIn ? (
                      <>
                        <RefreshCw className="h-5 w-5 animate-spin" />
                        <span>Logging In...</span>
                      </>
                    ) : (
                      <span>Member Login</span>
                    )}
                  </button>

                  <p className="text-center text-xs text-slate-400 mt-4">
                    Don't have an account yet?{" "}
                    <button 
                      type="button"
                      onClick={() => {
                        setCurrentView('signup');
                        window.scrollTo({ top: 0 });
                      }}
                      className="text-sky-pikin font-extrabold hover:underline cursor-pointer bg-transparent border-none p-0"
                    >
                      Sign up free
                    </button>
                  </p>
                </form>
              ) : (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl font-sans font-bold">
                    ✓
                  </div>
                  <h4 className="font-display text-xl text-navy-pikin">Successfully Logged In!</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Welcome to the parent lounge. You are now connected. Ready to start custom reading sessions with your children.
                  </p>
                  <button 
                    onClick={() => {
                      setLoginSuccess(false);
                      setLoginEmail("");
                      setLoginPassword("");
                      setIsLoggedIn(true);
                      if (!childFirstName) {
                        setChildFirstName("Femi");
                      }
                      if (!parentFirstName) {
                        setParentFirstName("Amaka");
                      }
                      setCurrentView('dashboard');
                      window.scrollTo({ top: 0 });
                    }}
                    className="bg-sky-pikin text-white px-8 py-3 rounded-full text-sm font-extrabold hover:bg-sky-pikin/90 transition-all cursor-pointer shadow-md"
                  >
                    Go to Dashboard 🚀
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      ) : null}

      {currentView === 'books' && (
        <section className="bg-gradient-to-br from-cyan-50 via-amber-50 to-emerald-50 py-12 px-6 min-h-[85vh]">
          <div className="max-w-7xl mx-auto">
            {/* Back to Home Button */}
            <button 
              onClick={() => {
                setCurrentView('landing');
                window.scrollTo({ top: 0 });
              }}
              className="inline-flex items-center gap-2 text-navy-pikin/80 hover:text-navy-pikin font-extrabold text-sm mb-8 hover:underline cursor-pointer focus:outline-none bg-white/60 hover:bg-white px-4 py-2 rounded-full shadow-sm transition-all border border-sky-pikin/10"
            >
              ← Back to Home
            </button>

            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-block bg-sky-pikin/20 text-navy-pikin text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider mb-3">
                📚 SMART PIKIN LIBRARY
              </span>
              <h2 className="font-display text-4xl sm:text-5xl text-navy-pikin mb-4">
                Our Interactive Book Library
              </h2>
              <p className="text-[#5a7090] text-lg leading-relaxed">
                Unlock 200+ syllabified books across all levels. Click any book below to start an interactive reading & pronunciation session!
              </p>
            </div>

            {/* Search & Filter Controls */}
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-xl shadow-navy-pikin/5 border border-sky-pikin/10 mb-10 max-w-4xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
              
              {/* Search Bar */}
              <div className="relative w-full md:w-72">
                <input 
                  type="text"
                  placeholder="Search books..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 hover:border-sky-pikin/30 focus:border-sky-pikin focus:outline-none rounded-2xl py-3 px-4 pl-10 text-sm text-navy-pikin font-sans transition-all"
                />
                <span className="absolute left-3.5 top-3.5 text-slate-400 text-base">🔍</span>
              </div>

              {/* Age Filters */}
              <div className="flex flex-wrap gap-2 justify-center w-full md:w-auto">
                {["All", "Ages 3–5", "Ages 4–6", "Ages 5–7", "Ages 6–8", "Ages 8–12", "Ages 9–12"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedAgeFilter(filter)}
                    className={`px-4 py-2 rounded-full text-xs font-black transition-all cursor-pointer ${
                      selectedAgeFilter === filter 
                        ? "bg-sky-pikin text-white shadow-md shadow-sky-pikin/20" 
                        : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid of Books */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {bookLibrary
                .filter((book) => {
                  const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase());
                  const matchesAge = selectedAgeFilter === "All" || book.ages === selectedAgeFilter;
                  return matchesSearch && matchesAge;
                })
                .map((book, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ scale: 1.05, y: -4 }}
                    onClick={() => {
                      setSelectedBook(book);
                      setIsPlayingAudio(false);
                      setShowPhonicsTips(false);
                    }}
                    className={`bg-gradient-to-br ${book.color} rounded-2xl p-6 text-center border-2 border-sky-pikin/20 shadow-lg hover:shadow-xl hover:border-sky-pikin/40 transition-all flex flex-col justify-between h-52 cursor-pointer relative group overflow-hidden`}
                  >
                    {/* Tiny hover badge */}
                    <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded-full text-[9px] font-black text-sky-pikin opacity-0 group-hover:opacity-100 transition-opacity">
                      Read Now 📖
                    </div>

                    <div className="text-6xl my-2 group-hover:scale-110 transition-transform duration-200">{book.emoji}</div>
                    <div>
                      <p className="text-sm font-black text-navy-pikin leading-snug line-clamp-2">{book.title}</p>
                      <span className="text-[11px] text-slate-500 font-bold block mt-1">{book.ages}</span>
                    </div>
                  </motion.div>
                ))
              }

              {/* Interactive Upload Book action card */}
              <motion.div 
                whileHover={{ scale: 1.05, y: -4 }}
                onClick={() => setUploadModalOpen(true)}
                className="bg-gradient-to-br from-indigo-100 to-purple-50 rounded-2xl p-6 text-center border-2 border-dashed border-purple-400 shadow-lg flex flex-col justify-between h-52 cursor-pointer group"
              >
                <div className="text-6xl my-2 group-hover:scale-115 transition-transform duration-200">📤</div>
                <div>
                  <p className="text-sm font-black text-purple-700 leading-snug">Upload Custom Book</p>
                  <span className="text-[11px] text-purple-500 font-extrabold block mt-1">Try AI Syllabification!</span>
                </div>
              </motion.div>
            </div>

            {/* Empty State */}
            {bookLibrary.filter((book) => {
              const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase());
              const matchesAge = selectedAgeFilter === "All" || book.ages === selectedAgeFilter;
              return matchesSearch && matchesAge;
            }).length === 0 && (
              <div className="bg-white rounded-3xl p-12 text-center max-w-md mx-auto border-2 border-dashed border-slate-200 mt-8">
                <span className="text-4xl block mb-3">🔍</span>
                <p className="font-black text-navy-pikin mb-1">No books matched your filter</p>
                <p className="text-sm text-slate-400">Try a different search query or use the uploader to import any custom book!</p>
              </div>
            )}
          </div>
        </section>
      )}

      {currentView === 'how' && (
        <section className="bg-gradient-to-br from-cyan-50 via-amber-50 to-emerald-50 py-12 px-6 min-h-[85vh]">
          <div className="max-w-7xl mx-auto">
            {/* Back to Home Button */}
            <button 
              onClick={() => {
                setCurrentView('landing');
                window.scrollTo({ top: 0 });
              }}
              className="inline-flex items-center gap-2 text-navy-pikin/80 hover:text-navy-pikin font-extrabold text-sm mb-8 hover:underline cursor-pointer focus:outline-none bg-white/60 hover:bg-white px-4 py-2 rounded-full shadow-sm transition-all border border-sky-pikin/10"
            >
              ← Back to Home
            </button>

            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="inline-block bg-sky-pikin/20 text-navy-pikin text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider mb-3">
                🚀 THE READING SYSTEM
              </span>
              <h2 className="font-display text-4xl sm:text-5xl text-navy-pikin mb-4">
                How Smart Pikin Works
              </h2>
              <p className="text-[#5a7090] text-lg leading-relaxed">
                We make reading practice simple, engaging, and highly personalized for your child in four simple steps.
              </p>
            </div>

            {/* Steps Bento-Style Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Step 1 */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white p-8 rounded-[2rem] border-2 border-sky-pikin/10 shadow-lg hover:shadow-xl hover:-translate-y-1.5 transition-all group relative overflow-hidden"
              >
                <div className="absolute top-4 right-4 bg-sun-pikin text-navy-pikin font-display text-sm w-8 h-8 rounded-full flex items-center justify-center font-black">
                  1
                </div>
                <div className="text-5xl mb-6 p-4 bg-soft-pikin/40 w-20 h-20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  👩‍💻
                </div>
                <h3 className="font-extrabold text-xl text-navy-pikin mb-3">Parent Signs Up</h3>
                <p className="text-sm text-[#5a7090] leading-relaxed">
                  Create your secure account in under a minute, set up your child's profile, and choose their current reading grade or age bracket.
                </p>
              </motion.div>

              {/* Step 2 */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-8 rounded-[2rem] border-2 border-sky-pikin/10 shadow-lg hover:shadow-xl hover:-translate-y-1.5 transition-all group relative overflow-hidden"
              >
                <div className="absolute top-4 right-4 bg-sun-pikin text-navy-pikin font-display text-sm w-8 h-8 rounded-full flex items-center justify-center font-black">
                  2
                </div>
                <div className="text-5xl mb-6 p-4 bg-amber-50 w-20 h-20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  📚
                </div>
                <h3 className="font-extrabold text-xl text-navy-pikin mb-3">Choose a Book</h3>
                <p className="text-sm text-[#5a7090] leading-relaxed">
                  Explore our massive library of African stories and textbook lessons, or easily upload school readers and images of any text.
                </p>
              </motion.div>

              {/* Step 3 */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white p-8 rounded-[2rem] border-2 border-sky-pikin/10 shadow-lg hover:shadow-xl hover:-translate-y-1.5 transition-all group relative overflow-hidden"
              >
                <div className="absolute top-4 right-4 bg-sun-pikin text-navy-pikin font-display text-sm w-8 h-8 rounded-full flex items-center justify-center font-black">
                  3
                </div>
                <div className="text-5xl mb-6 p-4 bg-rose-50 w-20 h-20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  🤖
                </div>
                <h3 className="font-extrabold text-xl text-navy-pikin mb-3">AI Reads Along</h3>
                <p className="text-sm text-[#5a7090] leading-relaxed">
                  Our advanced AI listens to your child speak, highlights syllables to assist reading, and corrects phonics errors gently and encouragingly.
                </p>
              </motion.div>

              {/* Step 4 */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white p-8 rounded-[2rem] border-2 border-sky-pikin/10 shadow-lg hover:shadow-xl hover:-translate-y-1.5 transition-all group relative overflow-hidden"
              >
                <div className="absolute top-4 right-4 bg-sun-pikin text-navy-pikin font-display text-sm w-8 h-8 rounded-full flex items-center justify-center font-black">
                  4
                </div>
                <div className="text-5xl mb-6 p-4 bg-emerald-50 w-20 h-20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  📊
                </div>
                <h3 className="font-extrabold text-xl text-navy-pikin mb-3">Track Progress</h3>
                <p className="text-sm text-[#5a7090] leading-relaxed">
                  Gain visibility into your child's weekly achievements with comprehensive metrics detailing word-count, accuracy scores, and speed.
                </p>
              </motion.div>
            </div>

            {/* Interactive call to action */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-16 text-center max-w-lg mx-auto bg-white/80 backdrop-blur-md rounded-[2.5rem] p-10 border-2 border-sky-pikin/10 shadow-xl"
            >
              <h3 className="font-display text-3xl text-navy-pikin mb-3">Ready to transform your child's reading?</h3>
              <p className="text-[#5a7090] text-sm mb-8 leading-relaxed">Join thousands of parents and teachers who rely on Smart Pikin to build early childhood fluency and local confidence.</p>
              <button 
                onClick={() => {
                  setCurrentView('signup');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full py-4 bg-coral-pikin hover:bg-coral-pikin/90 text-white font-extrabold rounded-full shadow-lg shadow-coral-pikin/25 hover:shadow-xl hover:scale-102 active:scale-98 transition-all cursor-pointer text-base"
              >
                Create a Free Account 🚀
              </button>
            </motion.div>
          </div>
        </section>
      )}

      {currentView === 'features' && (
        <section className="bg-gradient-to-br from-cyan-50 via-amber-50 to-[#ecf9ff] py-12 px-6 min-h-[85vh]">
          <div className="max-w-7xl mx-auto">
            {/* Back to Home Button */}
            <button 
              onClick={() => {
                setCurrentView('landing');
                window.scrollTo({ top: 0 });
              }}
              className="inline-flex items-center gap-2 text-navy-pikin/80 hover:text-navy-pikin font-extrabold text-sm mb-8 hover:underline cursor-pointer focus:outline-none bg-white/60 hover:bg-white px-4 py-2 rounded-full shadow-sm transition-all border border-sky-pikin/10"
            >
              ← Back to Home
            </button>

            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="inline-block bg-sky-pikin/20 text-navy-pikin text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider mb-3">
                ⭐ SMART PIKIN FEATURES
              </span>
              <h2 className="font-display text-4xl sm:text-5xl text-navy-pikin mb-4">
                Everything Your Child Needs to Thrive
              </h2>
              <p className="text-[#5a7090] text-lg leading-relaxed">
                We bundle state-of-the-art AI coaching tools with beautiful culture-rich stories, gamification, and insightful parental reports.
              </p>
            </div>

            {/* Features Rich Visual Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1: Pronunciation Coach */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white p-8 rounded-[2rem] border-2 border-sky-pikin/10 shadow-lg hover:shadow-xl hover:-translate-y-1.5 transition-all group overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="text-4xl mb-6 p-4 bg-sky-50 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    🎙️
                  </div>
                  <h3 className="font-extrabold text-xl text-navy-pikin mb-3">Pronunciation Coach</h3>
                  <p className="text-sm text-[#5a7090] leading-relaxed mb-6">
                    Our AI listens in real-time as your child reads, highlighting exact syllables to assist and gently coaching correct pronunciation.
                  </p>
                </div>
                {/* Interactive Speech coaching visual simulator */}
                <div className="bg-sky-50/50 rounded-2xl p-4 border border-sky-100 flex items-center justify-between">
                  <div className="flex gap-1">
                    <span className="w-1 h-6 bg-sky-pikin rounded-full animate-bounce delay-75"></span>
                    <span className="w-1 h-8 bg-sky-pikin rounded-full animate-bounce"></span>
                    <span className="w-1 h-4 bg-sky-pikin rounded-full animate-bounce delay-150"></span>
                    <span className="w-1 h-6 bg-sky-pikin rounded-full animate-bounce delay-100"></span>
                  </div>
                  <span className="text-xs font-black text-sky-700 font-mono">94% MATCH SCORE</span>
                </div>
              </motion.div>

              {/* Feature 2: Custom Book Uploader */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-8 rounded-[2rem] border-2 border-sky-pikin/10 shadow-lg hover:shadow-xl hover:-translate-y-1.5 transition-all group overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="text-4xl mb-6 p-4 bg-coral-pikin/10 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    📖
                  </div>
                  <h3 className="font-extrabold text-xl text-navy-pikin mb-3">Upload Your Own Book</h3>
                  <p className="text-sm text-[#5a7090] leading-relaxed mb-6">
                    Turn any physical book, school reader, or homework paper into a gamified digital reading course instantly by snapping a photo.
                  </p>
                </div>
                {/* Interactive drag action hint */}
                <button 
                  onClick={() => setUploadModalOpen(true)}
                  className="w-full text-xs font-black text-coral-pikin bg-coral-pikin/10 hover:bg-coral-pikin/25 py-2.5 rounded-xl transition-all cursor-pointer text-center border-none"
                >
                  Try AI Syllabification 📤
                </button>
              </motion.div>

              {/* Feature 3: Vetted Content */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white p-8 rounded-[2rem] border-2 border-sky-pikin/10 shadow-lg hover:shadow-xl hover:-translate-y-1.5 transition-all group overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="text-4xl mb-6 p-4 bg-emerald-50 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    🌟
                  </div>
                  <h3 className="font-extrabold text-xl text-navy-pikin mb-3">Age-Appropriate Content</h3>
                  <p className="text-sm text-[#5a7090] leading-relaxed mb-6">
                    Our library spans African folk tales, science books, and interactive textbook lessons dynamically adapted to your child's learning stage.
                  </p>
                </div>
                {/* Simulated category badges */}
                <div className="flex gap-2">
                  <span className="text-[10px] font-black bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full">Phonics</span>
                  <span className="text-[10px] font-black bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full">Folk Tales</span>
                  <span className="text-[10px] font-black bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full">Primary</span>
                </div>
              </motion.div>

              {/* Feature 4: Rewards & Motivation */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white p-8 rounded-[2rem] border-2 border-sky-pikin/10 shadow-lg hover:shadow-xl hover:-translate-y-1.5 transition-all group overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="text-4xl mb-6 p-4 bg-amber-50 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    🏆
                  </div>
                  <h3 className="font-extrabold text-xl text-navy-pikin mb-3">Rewards & Badges</h3>
                  <p className="text-sm text-[#5a7090] leading-relaxed mb-6">
                    Keep children intrinsically motivated! Every book finished awards sparkling stars, collectable badges, and daily streak progress.
                  </p>
                </div>
                {/* Simulated badge collection */}
                <div className="flex gap-2 items-center">
                  <span className="text-2xl animate-bounce">🥇</span>
                  <span className="text-2xl animate-bounce delay-75">📚</span>
                  <span className="text-2xl animate-bounce delay-150">🔥</span>
                  <span className="text-xs font-black text-amber-600 ml-auto bg-amber-50 px-2.5 py-1 rounded-full">4 Badges Earned</span>
                </div>
              </motion.div>

              {/* Feature 5: Parent Dashboard Alerts */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white p-8 rounded-[2rem] border-2 border-sky-pikin/10 shadow-lg hover:shadow-xl hover:-translate-y-1.5 transition-all group overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="text-4xl mb-6 p-4 bg-purple-50 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    🔔
                  </div>
                  <h3 className="font-extrabold text-xl text-navy-pikin mb-3">Instant Parent Alerts</h3>
                  <p className="text-sm text-[#5a7090] leading-relaxed mb-6">
                    Receive weekly feedback emails and instant messages celebrating reading milestones and recommending exact sight words to practice.
                  </p>
                </div>
                {/* Simulated SMS Alert UI */}
                <div className="bg-purple-50 rounded-xl p-3 border border-purple-100 flex items-center gap-2">
                  <span className="text-lg">💬</span>
                  <span className="text-[11px] font-bold text-purple-900 truncate">Smart Pikin: Femi read "The Clever Tortoise" successfully!</span>
                </div>
              </motion.div>

              {/* Feature 6: Safe Guard Rails */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white p-8 rounded-[2rem] border-2 border-sky-pikin/10 shadow-lg hover:shadow-xl hover:-translate-y-1.5 transition-all group overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="text-4xl mb-6 p-4 bg-rose-50 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    🛡️
                  </div>
                  <h3 className="font-extrabold text-xl text-navy-pikin mb-3">Safe & Child-Friendly</h3>
                  <p className="text-sm text-[#5a7090] leading-relaxed mb-6">
                    We comply fully with COPPA and global child safety guidelines. Absolutely zero ads, and strictly zero outside links or unvetted content.
                  </p>
                </div>
                {/* Safety seal indicator */}
                <div className="flex items-center gap-1.5 text-xs font-black text-rose-700">
                  <span>✅ 100% SECURE & PRIVATE</span>
                </div>
              </motion.div>
            </div>

            {/* Interactive Call to Action */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-16 text-center max-w-lg mx-auto bg-white/80 backdrop-blur-md rounded-[2.5rem] p-10 border-2 border-sky-pikin/10 shadow-xl"
            >
              <h3 className="font-display text-3xl text-navy-pikin mb-3">Equip your child today!</h3>
              <p className="text-[#5a7090] text-sm mb-8 leading-relaxed">It takes less than 2 minutes to get set up with real-time phonics coaching and cultural stories.</p>
              <button 
                onClick={() => {
                  setCurrentView('signup');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full py-4 bg-coral-pikin hover:bg-coral-pikin/90 text-white font-extrabold rounded-full shadow-lg shadow-coral-pikin/25 hover:shadow-xl hover:scale-102 active:scale-98 transition-all cursor-pointer text-base border-none"
              >
                Create a Free Account 🚀
              </button>
            </motion.div>
          </div>
        </section>
      )}

      {/* ─── USER ACCOUNT DASHBOARD VIEW ─── */}
      {currentView === 'dashboard' && (
        <section className="bg-gradient-to-br from-[#f0f9ff] via-[#fefaf0] to-[#f0fdf4] py-12 px-4 sm:px-6 min-h-[90vh]">
          <div className="max-w-7xl mx-auto space-y-10">
            
            {/* Dashboard Header Banner */}
            <motion.div 
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-navy-pikin via-[#1d5c90] to-sky-pikin text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6 border-4 border-sky-pikin/20"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none -mr-20 -mt-20" />
              
              <div className="space-y-3 text-center md:text-left relative z-10">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-extrabold tracking-wide text-white uppercase">
                  <span>🏝️ Smart Pikin Active Account</span>
                </div>
                <h2 className="font-display text-4xl sm:text-5xl text-white tracking-tight">
                  {childFirstName || "Femi"}'s Learning Island!
                </h2>
                <p className="text-white/80 text-sm sm:text-base max-w-xl">
                  Welcome back, <strong className="text-white font-black">{parentFirstName || "Amaka"}</strong>! Choose an interactive adventure below to build early fluency, pronunciation, and confidence.
                </p>
              </div>

              {/* Weekly Stats / Milestone badging */}
              <div className="flex flex-wrap justify-center gap-4 relative z-10 shrink-0">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-center min-w-[100px] hover:scale-105 transition-all">
                  <span className="text-2xl block">🔥</span>
                  <span className="text-xl font-extrabold block">5 Days</span>
                  <span className="text-[10px] text-white/70 font-bold uppercase tracking-wider">Active Streak</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-center min-w-[100px] hover:scale-105 transition-all">
                  <span className="text-2xl block">⭐</span>
                  <span className="text-xl font-extrabold block">380</span>
                  <span className="text-[10px] text-white/70 font-bold uppercase tracking-wider">Stars Earned</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-center min-w-[100px] hover:scale-105 transition-all">
                  <span className="text-2xl block">🏆</span>
                  <span className="text-xl font-extrabold block">Beginner</span>
                  <span className="text-[10px] text-white/70 font-bold uppercase tracking-wider">Milestone Level</span>
                </div>
              </div>
            </motion.div>

            {/* Interactive Feature Selectors */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <div className="text-left">
                <h3 className="font-display text-2xl text-navy-pikin tracking-tight flex items-center gap-2">
                  <span>Choose Your Adventure!</span>
                  <span className="animate-pulse">🏝️</span>
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm">
                  Click on an activity below to launch its interactive game or soundboard.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button 
                  onClick={() => setActiveDashboardFeature('spelling')}
                  className={`p-5 rounded-[2rem] border-4 transition-all text-left flex flex-col justify-between h-36 relative overflow-hidden cursor-pointer ${
                    activeDashboardFeature === 'spelling'
                      ? "bg-[#fffbeb] border-[#f59e0b] text-amber-950 shadow-lg shadow-amber-200/40 scale-102"
                      : "bg-white border-slate-100 hover:border-[#ffedd5] text-slate-700 hover:bg-[#fffdfa]"
                  }`}
                >
                  <div className="absolute -right-4 -bottom-4 text-6xl opacity-15">🐝</div>
                  <div className="text-3xl">🐝</div>
                  <div>
                    <h4 className="font-extrabold text-xs sm:text-sm tracking-tight text-navy-pikin">Spelling Bee</h4>
                    <p className="text-[10px] text-slate-500 font-bold mt-0.5">Learn sounds & spell</p>
                  </div>
                </button>

                <button 
                  onClick={() => setActiveDashboardFeature('abc123')}
                  className={`p-5 rounded-[2rem] border-4 transition-all text-left flex flex-col justify-between h-36 relative overflow-hidden cursor-pointer ${
                    activeDashboardFeature === 'abc123'
                      ? "bg-[#f0f9ff] border-[#0284c7] text-sky-950 shadow-lg shadow-sky-200/40 scale-102"
                      : "bg-white border-slate-100 hover:border-[#e0f2fe] text-slate-700 hover:bg-[#fafcfe]"
                  }`}
                >
                  <div className="absolute -right-4 -bottom-4 text-6xl opacity-15">🐣</div>
                  <div className="text-3xl">🐣</div>
                  <div>
                    <h4 className="font-extrabold text-xs sm:text-sm tracking-tight text-navy-pikin">Read ABC & 123</h4>
                    <p className="text-[10px] text-slate-500 font-bold mt-0.5">Interactive board</p>
                  </div>
                </button>

                <button 
                  onClick={() => setActiveDashboardFeature('upload')}
                  className={`p-5 rounded-[2rem] border-4 transition-all text-left flex flex-col justify-between h-36 relative overflow-hidden cursor-pointer ${
                    activeDashboardFeature === 'upload'
                      ? "bg-[#faf5ff] border-[#7c3aed] text-purple-950 shadow-lg shadow-purple-200/40 scale-102"
                      : "bg-white border-slate-100 hover:border-purple-100 text-slate-700 hover:bg-[#fdfaff]"
                  }`}
                >
                  <div className="absolute -right-4 -bottom-4 text-6xl opacity-15">📤</div>
                  <div className="text-3xl">📤</div>
                  <div>
                    <h4 className="font-extrabold text-xs sm:text-sm tracking-tight text-navy-pikin">Upload Book</h4>
                    <p className="text-[10px] text-slate-500 font-bold mt-0.5">Custom homework</p>
                  </div>
                </button>

                <button 
                  onClick={() => setActiveDashboardFeature('library')}
                  className={`p-5 rounded-[2rem] border-4 transition-all text-left flex flex-col justify-between h-36 relative overflow-hidden cursor-pointer ${
                    activeDashboardFeature === 'library'
                      ? "bg-[#ecfdf5] border-[#10b981] text-emerald-950 shadow-lg shadow-emerald-200/40 scale-102"
                      : "bg-white border-slate-100 hover:border-[#d1fae5] text-slate-700 hover:bg-[#fafffb]"
                  }`}
                >
                  <div className="absolute -right-4 -bottom-4 text-6xl opacity-15">📖</div>
                  <div className="text-3xl">📖</div>
                  <div>
                    <h4 className="font-extrabold text-xs sm:text-sm tracking-tight text-navy-pikin">Library Books</h4>
                    <p className="text-[10px] text-slate-500 font-bold mt-0.5">Choose a story</p>
                  </div>
                </button>
              </div>
            </motion.div>

            {/* Main Interactive Workspaces */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Active workspace according to selected feature */}
              <div className="lg:col-span-8 space-y-10">
                
                {/* FEATURE 1: Interactive Phonics Spelling Bee Game */}
                {activeDashboardFeature === 'spelling' && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-[2.5rem] p-6 sm:p-8 border-4 border-[#ffedd5] shadow-lg relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full blur-2xl pointer-events-none" />
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b-2 border-slate-50 pb-5 mb-6">
                      <div>
                        <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider mb-2">
                          <Gamepad2 className="h-3.5 w-3.5" /> SPELLING BEE ADVENTURE
                        </span>
                        <h3 className="font-display text-2xl text-navy-pikin">
                          Can you spell the word? 🐝
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-500">Stars:</span>
                        <span className="bg-amber-100 border border-amber-200 text-amber-700 font-extrabold px-3 py-1 rounded-full text-sm flex items-center gap-1">
                          ⭐ {spellingScore * 20} pts
                        </span>
                      </div>
                    </div>

                    {!spellingActive ? (
                      <div className="text-center py-8 space-y-5">
                        <div className="w-24 h-24 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto text-5xl border-2 border-amber-200 animate-bounce">
                          🐝
                        </div>
                        <div className="max-w-md mx-auto space-y-2">
                          <h4 className="font-extrabold text-xl text-navy-pikin">Smart Pikin Audio Spelling Bee</h4>
                          <p className="text-sm text-[#5a7090] leading-relaxed">
                            Listen to native phonetic pronunciations of African animals and tropical fruits, and spell them correctly to win stars!
                          </p>
                        </div>
                        <button 
                          onClick={() => {
                            setSpellingActive(true);
                            setSpellingWordIndex(0);
                            setSpellingInput("");
                            setSpellingFeedback("");
                            setSpellingScore(0);
                            setShowSpellingHint(false);
                            
                            // Speak first word clue out loud
                            const welcomeText = "Welcome to the Smart Pikin Spelling Bee! Spell the word you hear.";
                            if ('speechSynthesis' in window) {
                              window.speechSynthesis.cancel();
                              window.speechSynthesis.speak(new SpeechSynthesisUtterance(welcomeText));
                            }
                          }}
                          className="bg-amber-500 hover:bg-amber-600 text-white font-extrabold px-8 py-3.5 rounded-full shadow-lg shadow-amber-500/25 transition-all text-sm cursor-pointer border-none"
                        >
                          Start Spelling Bee Game! 🚀
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Game Active layout */}
                        {(() => {
                          const spellingWords = [
                            { word: "LION", clue: "The king of the jungle who roars loudly 🦁", hint: "L - I - O - N" },
                            { word: "BANANA", clue: "A sweet yellow fruit that monkeys love 🍌", hint: "B - A - N - A - N - A" },
                            { word: "TORTOISE", clue: "A slow animal with a hard shell, famous for winning a race turtle 🐢", hint: "T - O - R - T - O - I - S - E" },
                            { word: "ZEBRA", clue: "A wild horse-like animal with black and white stripes 🦓", hint: "Z - E - B - R - A" },
                            { word: "MANGO", clue: "A juicy, sweet tropical fruit 🥭", hint: "M - A - N - G - O" }
                          ];

                          const currentObj = spellingWords[spellingWordIndex];
                          if (!currentObj) {
                            // Game finished
                            return (
                              <div className="text-center py-6 space-y-5">
                                <div className="text-6xl">🏆</div>
                                <h4 className="font-display text-3xl text-navy-pikin">Super Speller Badge Achieved!</h4>
                                <p className="text-sm text-slate-500 max-w-md mx-auto">
                                  Fantastic work! You spelled <strong className="text-navy-pikin font-black">{spellingScore} of {spellingWords.length}</strong> words perfectly. You have earned <strong className="text-amber-600 font-extrabold">{spellingScore * 20} bonus stars</strong>!
                                </p>
                                
                                <div className="flex justify-center gap-3">
                                  <button 
                                    onClick={() => {
                                      setSpellingActive(false);
                                    }}
                                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-full text-xs font-bold transition-all border-none cursor-pointer"
                                  >
                                    Back to Island
                                  </button>
                                  <button 
                                    onClick={() => {
                                      setSpellingWordIndex(0);
                                      setSpellingInput("");
                                      setSpellingFeedback("");
                                      setSpellingScore(0);
                                      setShowSpellingHint(false);
                                    }}
                                    className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-full text-xs font-extrabold shadow-md transition-all border-none cursor-pointer"
                                  >
                                    Play Again 🔁
                                  </button>
                                </div>
                              </div>
                            );
                          }

                          const handleSpeakWord = () => {
                            if ('speechSynthesis' in window) {
                              window.speechSynthesis.cancel();
                              const utterance = new SpeechSynthesisUtterance(currentObj.word);
                              utterance.rate = 0.75; // Slower for clarity
                              utterance.pitch = 1.2; // Cheerful
                              window.speechSynthesis.speak(utterance);
                            } else {
                              alert(`Synthesized pronunciation for: "${currentObj.word}"`);
                            }
                          };

                          const handleCheckSpelling = (e?: FormEvent) => {
                            if (e) e.preventDefault();
                            const finalInput = spellingInput.trim().toUpperCase();
                            if (finalInput === currentObj.word) {
                              setSpellingFeedback("Correct! Wonderful job! 🎉 You earned 20 stars!");
                              setSpellingScore(prev => prev + 1);
                              if ('speechSynthesis' in window) {
                                window.speechSynthesis.cancel();
                                window.speechSynthesis.speak(new SpeechSynthesisUtterance("Correct! Outstanding job!"));
                              }
                            } else {
                              setSpellingFeedback(`Not quite! The correct spelling is "${currentObj.word}". Keep trying! 🌟`);
                              if ('speechSynthesis' in window) {
                                window.speechSynthesis.cancel();
                                window.speechSynthesis.speak(new SpeechSynthesisUtterance("Keep trying! You can do it!"));
                              }
                            }
                          };

                          const handleNextWord = () => {
                            setSpellingWordIndex(prev => prev + 1);
                            setSpellingInput("");
                            setSpellingFeedback("");
                            setShowSpellingHint(false);
                          };

                          return (
                            <div className="space-y-6">
                              
                              {/* Question bar */}
                              <div className="flex justify-between items-center bg-amber-50/60 p-3 rounded-2xl border border-amber-100">
                                <span className="text-xs font-extrabold text-amber-800">
                                  Question {spellingWordIndex + 1} of {spellingWords.length}
                                </span>
                                <span className="text-xs text-slate-500">
                                  Score: {spellingScore}/{spellingWords.length} Correct
                                </span>
                              </div>

                              {/* Audio Speaker play button */}
                              <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-3xl border-2 border-slate-100 text-center space-y-4">
                                <button 
                                  onClick={handleSpeakWord}
                                  className="w-16 h-16 bg-sky-pikin text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all group cursor-pointer focus:outline-none border-none"
                                  type="button"
                                  title="Listen to pronunciation"
                                >
                                  <Volume2 className="h-8 w-8 group-hover:animate-bounce" />
                                </button>
                                <div>
                                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">TAP TO HEAR SPELLING WORD</h4>
                                  <p className="text-sm text-slate-600 mt-1">Clue: {currentObj.clue}</p>
                                </div>
                              </div>

                              {/* Spelling input form */}
                              <form onSubmit={handleCheckSpelling} className="space-y-4">
                                <div className="flex flex-col gap-2">
                                  <label className="text-xs font-extrabold text-slate-500 text-left">Your Child's Answer:</label>
                                  <div className="flex gap-2">
                                    <input 
                                      type="text"
                                      required
                                      disabled={!!spellingFeedback}
                                      value={spellingInput}
                                      onChange={(e) => setSpellingInput(e.target.value.toUpperCase())}
                                      placeholder="TYPE OR TAP THE LETTERS BELOW"
                                      className="p-4 flex-1 rounded-2xl border-2 border-slate-200 text-center font-mono font-black text-2xl tracking-widest text-navy-pikin focus:border-amber-400 focus:outline-none bg-white uppercase transition-all"
                                    />
                                  </div>
                                </div>

                                {/* Virtual Child-Friendly Letter Pad */}
                                {!spellingFeedback && (
                                  <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Quick Tap Letter Board:</label>
                                    <div className="flex flex-wrap justify-center gap-1.5 p-2 bg-slate-50/50 rounded-2xl border border-slate-100">
                                      {["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"].map((letter) => (
                                        <button
                                          key={letter}
                                          type="button"
                                          onClick={() => setSpellingInput(prev => prev + letter)}
                                          className="w-8 h-8 sm:w-10 sm:h-10 bg-white hover:bg-amber-100 border border-slate-200 active:scale-90 font-black text-navy-pikin text-sm sm:text-base rounded-xl transition-all shadow-sm flex items-center justify-center cursor-pointer"
                                        >
                                          {letter}
                                        </button>
                                      ))}
                                      <button
                                        type="button"
                                        onClick={() => setSpellingInput(prev => prev.slice(0, -1))}
                                        className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 font-extrabold text-xs rounded-xl border border-rose-200 transition-all flex items-center justify-center cursor-pointer"
                                      >
                                        ⌫ Del
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setSpellingInput("")}
                                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold text-xs rounded-xl border border-slate-300 transition-all flex items-center justify-center cursor-pointer"
                                      >
                                        Clear
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {/* Game Feedback / Action Controls */}
                                <div className="pt-2 text-center">
                                  {spellingFeedback ? (
                                    <div className="space-y-4">
                                      <div className={`p-4 rounded-2xl border text-sm font-extrabold ${
                                        spellingFeedback.startsWith("Correct")
                                          ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                                          : "bg-amber-50 border-amber-200 text-amber-800"
                                      }`}>
                                        {spellingFeedback}
                                      </div>
                                      <button
                                        type="button"
                                        onClick={handleNextWord}
                                        className="bg-navy-pikin text-white hover:bg-navy-pikin/90 font-extrabold px-8 py-3 rounded-full shadow-md text-xs transition-all flex items-center gap-1.5 mx-auto cursor-pointer border-none"
                                      >
                                        <span>Next Question</span>
                                        <ArrowRight className="h-4 w-4" />
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="flex flex-wrap items-center justify-center gap-3">
                                      <button
                                        type="submit"
                                        className="bg-amber-500 hover:bg-amber-600 text-white font-extrabold px-8 py-3.5 rounded-full shadow-md text-xs transition-all cursor-pointer border-none"
                                      >
                                        Check My Spelling! ✓
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setShowSpellingHint(!showSpellingHint)}
                                        className="text-amber-700 hover:text-amber-900 text-xs font-bold underline bg-transparent border-none cursor-pointer"
                                      >
                                        {showSpellingHint ? "Hide Hint" : "Need a Hint?"}
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </form>

                              {/* Hint section */}
                              {showSpellingHint && !spellingFeedback && (
                                <motion.div 
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  className="bg-amber-50 p-4 rounded-2xl border border-amber-200/50 text-left text-xs text-amber-900 leading-relaxed font-sans"
                                >
                                  <strong>Phonics Clue:</strong> The word syllables sound out like <span className="font-mono font-black text-amber-700 uppercase tracking-widest">{currentObj.hint}</span>. Keep practicing!
                                </motion.div>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* FEATURE 2: Read ABC & 123 Soundboard */}
                {activeDashboardFeature === 'abc123' && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-[2.5rem] p-6 sm:p-8 border-4 border-[#e0f2fe] shadow-lg relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-sky-50 rounded-full blur-2xl pointer-events-none" />
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-slate-50 pb-5 mb-6">
                      <div>
                        <span className="inline-flex items-center gap-1.5 bg-sky-100 text-sky-800 text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider mb-2">
                          🐣 INTERACTIVE PHONICS soundboard
                        </span>
                        <h3 className="font-display text-2xl text-navy-pikin">
                          Read ABC & 123 out loud!
                        </h3>
                      </div>

                      {/* Tab selections */}
                      <div className="bg-slate-100 p-1.5 rounded-full flex gap-1 border border-slate-200">
                        <button 
                          onClick={() => {
                            setAbcTab('abc');
                            setActiveAbcLetter(null);
                          }}
                          className={`px-4 py-2 rounded-full text-xs font-extrabold cursor-pointer transition-all ${
                            abcTab === 'abc' ? "bg-sky-pikin text-white shadow" : "text-slate-600 hover:text-navy-pikin"
                          }`}
                        >
                          Read ABC 🐣
                        </button>
                        <button 
                          onClick={() => {
                            setAbcTab('123');
                            setActiveNumberValue(null);
                          }}
                          className={`px-4 py-2 rounded-full text-xs font-extrabold cursor-pointer transition-all ${
                            abcTab === '123' ? "bg-sky-pikin text-white shadow" : "text-slate-600 hover:text-navy-pikin"
                          }`}
                        >
                          Read 123 🔢
                        </button>
                      </div>
                    </div>

                    {abcTab === 'abc' ? (
                      <div className="space-y-6">
                        <p className="text-sm text-slate-500 text-left">
                          Tap any colorful letter button below to hear its phonics sound, pronunciation helper, and an illustrated real-world word!
                        </p>

                        {/* ABC Soundboard Grid */}
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                          {(() => {
                            const alphabets = [
                              { letter: "A", word: "Apple", emoji: "🍎", phonics: "ah-ah Apple" },
                              { letter: "B", word: "Butterfly", emoji: "🦋", phonics: "buh-buh Butterfly" },
                              { letter: "C", word: "Cat", emoji: "🐱", phonics: "cuh-cuh Cat" },
                              { letter: "D", word: "Dolphin", emoji: "🐬", phonics: "duh-duh Dolphin" },
                              { letter: "E", word: "Elephant", emoji: "🐘", phonics: "eh-eh Elephant" },
                              { letter: "F", word: "Flower", emoji: "🌸", phonics: "fuh-fuh Flower" },
                              { letter: "G", word: "Garden", emoji: "🏡", phonics: "guh-guh Garden" },
                              { letter: "H", word: "Hat", emoji: "👒", phonics: "huh-huh Hat" },
                              { letter: "I", word: "Igloo", emoji: "🧊", phonics: "ih-ih Igloo" },
                              { letter: "J", word: "Jellyfish", emoji: "🪼", phonics: "juh-juh Jellyfish" },
                              { letter: "K", word: "Kite", emoji: "🪁", phonics: "cuh-cuh Kite" },
                              { letter: "L", word: "Lion", emoji: "🦁", phonics: "uhl-uhl Lion" },
                              { letter: "M", word: "Mango", emoji: "🥭", phonics: "muh-muh Mango" },
                              { letter: "N", word: "Nest", emoji: "🪹", phonics: "nuh-nuh Nest" },
                              { letter: "O", word: "Orange", emoji: "🍊", phonics: "oh-oh Orange" },
                              { letter: "P", word: "Parrot", emoji: "🦜", phonics: "puh-puh Parrot" },
                              { letter: "Q", word: "Queen", emoji: "👑", phonics: "quh-quh Queen" },
                              { letter: "R", word: "Rocket", emoji: "🚀", phonics: "ruh-ruh Rocket" },
                              { letter: "S", word: "Star", emoji: "⭐", phonics: "suh-suh Star" },
                              { letter: "T", word: "Tortoise", emoji: "🐢", phonics: "tuh-tuh Tortoise" },
                              { letter: "U", word: "Umbrella", emoji: "☂️", phonics: "uh-uh Umbrella" },
                              { letter: "V", word: "Violin", emoji: "🎻", phonics: "vuh-vuh Violin" },
                              { letter: "W", word: "Watermelon", emoji: "🍉", phonics: "wuh-wuh Watermelon" },
                              { letter: "X", word: "Xylophone", emoji: "🎹", phonics: "zuh-zuh Xylophone" },
                              { letter: "Y", word: "Yacht", emoji: "⛵", phonics: "yuh-yuh Yacht" },
                              { letter: "Z", word: "Zebra", emoji: "🦓", phonics: "zuh-zuh Zebra" }
                            ];

                            return alphabets.map((item) => {
                              const isActive = activeAbcLetter === item.letter;
                              const handleLetterTap = () => {
                                setActiveAbcLetter(item.letter);
                                // Speak sound guide
                                const phrase = `${item.letter} is for ${item.word}! ${item.phonics}`;
                                if ('speechSynthesis' in window) {
                                  window.speechSynthesis.cancel();
                                  const utterance = new SpeechSynthesisUtterance(phrase);
                                  utterance.rate = 0.85;
                                  utterance.pitch = 1.15;
                                  window.speechSynthesis.speak(utterance);
                                }
                              };

                              return (
                                <button
                                  key={item.letter}
                                  onClick={handleLetterTap}
                                  className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center relative transition-all group cursor-pointer ${
                                    isActive 
                                      ? "bg-sky-500 border-sky-500 text-white scale-110 rotate-2 z-10 shadow-lg shadow-sky-500/35" 
                                      : "bg-white border-slate-100 hover:border-sky-pikin text-navy-pikin hover:scale-105 active:scale-95"
                                  }`}
                                  type="button"
                                >
                                  <span className="font-display text-2xl font-black">{item.letter}</span>
                                  <span className="text-xl my-1 group-hover:scale-125 transition-transform">{item.emoji}</span>
                                  <span className={`text-[9px] font-bold ${isActive ? "text-white" : "text-slate-400"}`}>
                                    {item.word}
                                  </span>
                                </button>
                              );
                            });
                          })()}
                        </div>

                        {/* Phonics speaker speech bubble overlay */}
                        {activeAbcLetter && (
                          <div className="bg-sky-50 p-4 rounded-2xl border border-sky-200 text-left flex items-center gap-3 animate-pulse">
                            <span className="text-2xl">🗣️</span>
                            <div>
                              <p className="text-xs font-black uppercase text-sky-700 tracking-wider">ACTIVE SPEECH PHONICS</p>
                              <p className="text-sm font-bold text-navy-pikin">
                                "{activeAbcLetter} is for {(() => {
                                  const alphabets = [
                                    { letter: "A", word: "Apple" }, { letter: "B", word: "Butterfly" },
                                    { letter: "C", word: "Cat" }, { letter: "D", word: "Dolphin" },
                                    { letter: "E", word: "Elephant" }, { letter: "F", word: "Flower" },
                                    { letter: "G", word: "Garden" }, { letter: "H", word: "Hat" },
                                    { letter: "I", word: "Igloo" }, { letter: "J", word: "Jellyfish" },
                                    { letter: "K", word: "Kite" }, { letter: "L", word: "Lion" },
                                    { letter: "M", word: "Mango" }, { letter: "N", word: "Nest" },
                                    { letter: "O", word: "Orange" }, { letter: "P", word: "Parrot" },
                                    { letter: "Q", word: "Queen" }, { letter: "R", word: "Rocket" },
                                    { letter: "S", word: "Star" }, { letter: "T", word: "Tortoise" },
                                    { letter: "U", word: "Umbrella" }, { letter: "V", word: "Violin" },
                                    { letter: "W", word: "Watermelon" }, { letter: "X", word: "Xylophone" },
                                    { letter: "Y", word: "Yacht" }, { letter: "Z", word: "Zebra" }
                                  ];
                                  return alphabets.find(a => a.letter === activeAbcLetter)?.word || "";
                                })()}!"
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <p className="text-sm text-slate-500 text-left">
                          Tap any illustrated number below to practice counting things out loud and understand cardinality with visual indicators!
                        </p>

                        {/* 123 Soundboard Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                          {(() => {
                            const numbers = [
                              { value: 1, text: "One", emoji: "🦁", plural: "Lion" },
                              { value: 2, text: "Two", emoji: "🎈", plural: "Balloons" },
                              { value: 3, text: "Three", emoji: "⭐", plural: "Stars" },
                              { value: 4, text: "Four", emoji: "🍭", plural: "Lollipops" },
                              { value: 5, text: "Five", emoji: "🍉", plural: "Watermelons" },
                              { value: 6, text: "Six", emoji: "🍎", plural: "Apples" },
                              { value: 7, text: "Seven", emoji: "🦋", plural: "Butterflies" },
                              { value: 8, text: "Eight", emoji: "⛵", plural: "Sailboats" },
                              { value: 9, text: "Nine", emoji: "🌸", plural: "Flowers" },
                              { value: 10, text: "Ten", emoji: "💎", plural: "Diamonds" }
                            ];

                            return numbers.map((item) => {
                              const isActive = activeNumberValue === item.value;
                              const handleNumberTap = () => {
                                setActiveNumberValue(item.value);
                                // Speak number and items
                                const phrase = `${item.value}! ${item.text} ${item.plural}!`;
                                if ('speechSynthesis' in window) {
                                  window.speechSynthesis.cancel();
                                  const utterance = new SpeechSynthesisUtterance(phrase);
                                  utterance.rate = 0.85;
                                  utterance.pitch = 1.15;
                                  window.speechSynthesis.speak(utterance);
                                }
                              };

                              return (
                                <button
                                  key={item.value}
                                  onClick={handleNumberTap}
                                  className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center relative transition-all group cursor-pointer ${
                                    isActive 
                                      ? "bg-sky-500 border-sky-500 text-white scale-110 z-10 shadow-lg shadow-sky-500/35" 
                                      : "bg-white border-slate-100 hover:border-sky-pikin text-navy-pikin hover:scale-105 active:scale-95"
                                  }`}
                                  type="button"
                                >
                                  <span className="font-display text-4xl font-black">{item.value}</span>
                                  <span className="text-xs font-bold my-1 uppercase tracking-wider">{item.text}</span>
                                  
                                  {/* Render the emoji sequence */}
                                  <div className="flex flex-wrap justify-center gap-0.5 mt-1.5 max-w-[120px]">
                                    {Array.from({ length: item.value }).map((_, i) => (
                                      <span key={i} className="text-sm shrink-0">{item.emoji}</span>
                                    ))}
                                  </div>
                                </button>
                              );
                            });
                          })()}
                        </div>

                        {/* Number speaker bubble overlay */}
                        {activeNumberValue && (
                          <div className="bg-sky-50 p-4 rounded-2xl border border-sky-200 text-left flex items-center gap-3 animate-pulse">
                            <span className="text-2xl">🔢</span>
                            <div>
                              <p className="text-xs font-black uppercase text-sky-700 tracking-wider">ACTIVE COUNTING</p>
                              <p className="text-sm font-bold text-navy-pikin">
                                "{activeNumberValue}! {(() => {
                                  const numbers = [
                                    { value: 1, text: "One", plural: "Lion" },
                                    { value: 2, text: "Two", plural: "Balloons" },
                                    { value: 3, text: "Three", plural: "Stars" },
                                    { value: 4, text: "Four", plural: "Lollipops" },
                                    { value: 5, text: "Five", plural: "Watermelons" },
                                    { value: 6, text: "Six", plural: "Apples" },
                                    { value: 7, text: "Seven", plural: "Butterflies" },
                                    { value: 8, text: "Eight", plural: "Sailboats" },
                                    { value: 9, text: "Nine", plural: "Flowers" },
                                    { value: 10, text: "Ten", plural: "Diamonds" }
                                  ];
                                  const match = numbers.find(n => n.value === activeNumberValue);
                                  return match ? `${match.text} ${match.plural}` : "";
                                })()}!"
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* FEATURE 3: Upload Custom Book shortcut panel */}
                {activeDashboardFeature === 'upload' && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-r from-purple-900 to-indigo-950 text-white p-6 sm:p-8 rounded-[2.5rem] border-4 border-purple-800 shadow-xl relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                    
                    <div className="grid md:grid-cols-12 gap-6 items-center relative z-10">
                      <div className="md:col-span-8 space-y-3 text-left">
                        <span className="inline-block bg-purple-500/30 border border-purple-400 text-purple-200 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
                          📤 PREMIUM PARENT MODULE
                        </span>
                        <h3 className="font-display text-2xl text-white">
                          Upload Your Own Book 📚
                        </h3>
                        <p className="text-purple-200 text-xs sm:text-sm leading-relaxed">
                          Have a specific textbook or classroom story you want your child to practice reading? Drop the PDF or Image here! Our AI instantly breaks down the story syllables, highlights phonetic accents, and builds speech exercises.
                        </p>
                      </div>

                      <div className="md:col-span-4 flex justify-center">
                        <button 
                          onClick={() => setUploadModalOpen(true)}
                          className="bg-purple-500 hover:bg-purple-600 hover:scale-105 active:scale-95 text-white font-extrabold px-6 py-3.5 rounded-full shadow-lg shadow-purple-500/35 transition-all text-sm cursor-pointer border-none flex items-center gap-2"
                          type="button"
                        >
                          <UploadCloud className="h-4.5 w-4.5 shrink-0" />
                          <span>Upload Your Book</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* FEATURE 4: Book Library Selection */}
                {activeDashboardFeature === 'library' && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-[2.5rem] p-6 sm:p-8 border-4 border-[#ecfdf5] shadow-lg text-left space-y-6"
                  >
                    <div className="border-b-2 border-slate-50 pb-4">
                      <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                        📖 CHOOSE A STORY BOOK
                      </span>
                      <h3 className="font-display text-xl text-navy-pikin">
                        Smart Pikin Library 📚
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Pick any core visual story card below to open the lesson reader and pronunciation coach!
                      </p>
                    </div>

                    {/* Starter books list */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { emoji: "🦁", title: "The Lion's Big Day", ages: "Ages 3–5", color: "from-orange-100 to-amber-50" },
                        { emoji: "🚀", title: "My First Space Trip", ages: "Ages 6–8", color: "from-blue-100 to-indigo-50" },
                        { emoji: "🐬", title: "Ocean Adventures", ages: "Ages 9–11", color: "from-cyan-100 to-teal-50" }
                      ].map((book, index) => (
                        <button 
                          key={index}
                          onClick={() => {
                            setSelectedBook(book);
                            window.scrollTo({ top: 0 });
                          }}
                          className={`w-full bg-gradient-to-br ${book.color} hover:scale-102 active:scale-98 border-2 border-slate-100 rounded-2xl p-4 flex items-center gap-3.5 text-left transition-all cursor-pointer`}
                          type="button"
                        >
                          <span className="text-4xl bg-white/70 p-2.5 rounded-xl border border-white shrink-0">{book.emoji}</span>
                          <div className="min-w-0 flex-1">
                            <span className="text-[9px] bg-navy-pikin/10 text-navy-pikin font-extrabold px-2 py-0.5 rounded-full uppercase">{book.ages}</span>
                            <h4 className="font-extrabold text-sm text-navy-pikin truncate mt-1.5">{book.title}</h4>
                            <span className="text-[10px] text-sky-pikin font-black flex items-center gap-1 mt-0.5">
                              Read book now →
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="pt-2">
                      <button 
                        onClick={() => {
                          setCurrentView('books');
                          window.scrollTo({ top: 0 });
                        }}
                        className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold rounded-full transition-all text-xs cursor-pointer text-center border-none shadow-md"
                        type="button"
                      >
                        Explore Full Library (200+) 📚
                      </button>
                    </div>
                  </motion.div>
                )}

              </div>

              {/* Right Column: Streaks, Milestone Badging & Supportive Parenting tips */}
              <div className="lg:col-span-4 space-y-10">
                
                {/* SIDEBOARD 1: Child Level Milestones */}
                <motion.div 
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-[2.5rem] p-6 sm:p-8 border-4 border-[#e0f2fe] shadow-lg text-left space-y-5"
                >
                  <span className="inline-flex items-center gap-1.5 bg-sky-100 text-sky-800 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                    🏆 MILESTONES & LEVEL
                  </span>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-500">Learning Progress:</span>
                      <span className="font-extrabold text-sky-600">Level 1 / 10</span>
                    </div>

                    {/* Simple Progress Bar */}
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200/50">
                      <div className="bg-sky-500 h-full rounded-full transition-all" style={{ width: "15%" }}></div>
                    </div>

                    <div className="text-xs text-slate-500 leading-relaxed font-sans bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                      <span className="font-extrabold text-navy-pikin block mb-1">🎯 Next Achievement:</span>
                      Spell 5 words correctly in Spelling Bee to unlock the <strong className="text-sky-600">Phonics Master Badge</strong>!
                    </div>
                  </div>
                </motion.div>

                {/* SIDEBOARD 2: Dynamic Parent Pronunciation & Milestone Coach Tips */}
                <motion.div 
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                  className="bg-gradient-to-br from-[#fffbeb] to-[#fef3c7] rounded-[2.5rem] p-6 border-4 border-amber-200/50 shadow-md text-left space-y-4"
                >
                  <div className="flex items-center gap-2 text-amber-800">
                    <Lightbulb className="h-5 w-5 shrink-0 text-amber-500" />
                    <h4 className="font-extrabold text-sm uppercase tracking-wide">Parent Coaching Tips</h4>
                  </div>
                  
                  <div className="space-y-3.5 text-xs text-amber-900 leading-relaxed font-sans">
                    <p>
                      💡 <strong className="font-black text-amber-950">Make spelling visual:</strong> For children aged 3-5, connect words directly with emojis (e.g. A for Apple 🍎). Tap the ABC buttons together!
                    </p>
                    <p>
                      💡 <strong className="font-black text-amber-950">Syllable clapping:</strong> Clap out word lengths for spelling bee words like <strong className="text-amber-950">M-A-N-G-O</strong> to build phonics rhythm!
                    </p>
                    <p>
                      💡 <strong className="font-black text-amber-950">Upload homework:</strong> Use the Custom Book Uploader to instantly make school worksheets reading-enabled in 5 seconds!
                    </p>
                  </div>

                  <div className="border-t border-amber-200/50 pt-3 flex items-center justify-between text-[11px] font-bold text-amber-700">
                    <span>Active Milestones: Beginner</span>
                    <span>Level 1 / 10</span>
                  </div>
                </motion.div>

              </div>

            </div>
          </div>
        </section>
      )}

      {/* ─── INTERACTIVE BOOK LESSON MODAL ─── */}
      <AnimatePresence>
        {selectedBook && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBook(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer"
            />

            {/* Modal Body */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2.5rem] p-8 max-w-2xl w-full shadow-2xl relative z-10 border-4 border-sky-pikin/30 overflow-hidden"
            >
              {/* Confetti or decorative particles inside card */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-pikin/5 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-pikin/5 rounded-full blur-2xl pointer-events-none" />

              <button 
                onClick={() => setSelectedBook(null)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer animate-none bg-transparent border-none"
              >
                <X className="h-6 w-6" />
              </button>

              <div className="flex items-center gap-4 mb-6 text-left">
                <span className="text-5xl bg-slate-50 p-3 rounded-2xl border-2 border-slate-100">{selectedBook.emoji}</span>
                <div>
                  <span className="text-[10px] bg-sky-pikin/15 text-sky-pikin font-black px-2.5 py-1 rounded-full uppercase tracking-wider">{selectedBook.ages}</span>
                  <h3 className="font-display text-2xl text-navy-pikin mt-1.5">{selectedBook.title}</h3>
                </div>
              </div>

              {/* Book Content Panel */}
              <div className="bg-gradient-to-br from-slate-50 to-sky-50/20 rounded-2xl p-6 border border-sky-pikin/10 mb-6 text-left relative">
                <div className="absolute top-4 right-4 flex gap-1.5">
                  <button 
                    onClick={() => {
                      setIsPlayingAudio(true);
                      // Let's simulate a reading audio guide with a state timer
                      setTimeout(() => setIsPlayingAudio(false), 3000);
                    }}
                    disabled={isPlayingAudio}
                    className="p-2.5 bg-white hover:bg-sky-pikin hover:text-white text-sky-pikin rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-1.5 text-xs font-black border border-sky-pikin/10"
                  >
                    <Volume2 className={`h-4 w-4 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
                    <span>{isPlayingAudio ? "Reading..." : "Listen Guide"}</span>
                  </button>
                </div>

                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-2">STORY EXERCISE</h4>
                <p className="text-lg text-navy-pikin font-medium leading-relaxed font-sans pr-24">
                  {bookLessons[selectedBook.title]?.paragraph || "Loading story text..."}
                </p>
              </div>

              {/* Syllables Breakdown Panel */}
              <div className="mb-6 text-left">
                <div className="flex items-center gap-1.5 mb-3">
                  <Sparkles className="h-4 w-4 text-sky-pikin" />
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">AI Phonics Breakdown</h4>
                </div>
                <div className="flex flex-wrap gap-3">
                  {bookLessons[selectedBook.title]?.syllables.map((item, idx) => (
                    <div key={idx} className="bg-white border-2 border-slate-100 hover:border-sky-pikin/30 rounded-xl px-4 py-3 flex flex-col shadow-sm">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase">WORD</span>
                      <span className="font-bold text-navy-pikin text-sm">{item.word}</span>
                      <span className="text-xs text-sky-pikin font-black mt-0.5 font-mono">{item.guide}</span>
                    </div>
                  )) || (
                    <p className="text-xs text-slate-400 italic">No phonics breakdown available.</p>
                  )}
                </div>
              </div>

              {/* Parents Phonics Tip Panel */}
              <div className="mb-6 text-left">
                <button 
                  onClick={() => setShowPhonicsTips(!showPhonicsTips)}
                  className="text-xs font-black text-sky-pikin hover:text-sky-700 flex items-center gap-1 cursor-pointer bg-transparent border-none p-0 focus:outline-none"
                >
                  💡 {showPhonicsTips ? "Hide Parents Coaching Tips" : "Show Parents Coaching Tips"}
                </button>
                <AnimatePresence>
                  {showPhonicsTips && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden mt-2 bg-amber-50 border border-amber-200/50 rounded-xl p-4 text-xs text-amber-900 leading-relaxed font-sans"
                    >
                      <strong>Parent Coaching tip:</strong> {bookLessons[selectedBook.title]?.phonicsTip || "Encourage your child to read aloud daily."}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Interactive Speech coaching simulation */}
              <div className="bg-[#fcf8f2] border-2 border-amber-200/40 rounded-2xl p-5 text-left flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🎙️</span>
                  <div>
                    <h5 className="font-black text-sm text-navy-pikin">Simulate Reading aloud</h5>
                    <p className="text-xs text-slate-500">Tap to simulate your child speaking into the microphone</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    alert("Awesome pronunciation! Your child read correctly with 94% clarity! Streak count updated.");
                  }}
                  className="bg-coral-pikin text-white px-5 py-2.5 rounded-full text-xs font-black hover:bg-coral-pikin/90 shadow-md shadow-coral-pikin/15 cursor-pointer focus:outline-none shrink-0"
                >
                  Try Pronunciation Coach
                </button>
              </div>

              <div className="mt-6 flex gap-3">
                <button 
                  onClick={() => setSelectedBook(null)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-full transition-all text-sm cursor-pointer border-none focus:outline-none"
                >
                  Close Lesson
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── GLOBAL INTERACTIVE UPLOAD MODAL ─── */}
      <AnimatePresence>
        {uploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setUploadModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer"
            />

            {/* Modal Body */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2rem] p-8 max-w-lg w-full shadow-2xl relative z-10 border-4 border-purple-200"
            >
              <button 
                onClick={() => setUploadModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer bg-transparent border-none"
              >
                <X className="h-6 w-6" />
              </button>

              <div className="text-center mb-6">
                <span className="text-4xl mb-2 inline-block">📚</span>
                <h3 className="font-display text-2xl text-navy-pikin">Smart Pikin Custom Book Uploader</h3>
                <p className="text-slate-500 text-sm mt-1">
                  Upload school readers, stories, or drawings to experience how our AI turns text into customized reading exercises instantly.
                </p>
              </div>

              {/* Upload drag-n-drop box */}
              {!uploadedFile ? (
                <div 
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-4 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                    isDragging ? "border-purple-500 bg-purple-50" : "border-slate-200 hover:border-purple-400 hover:bg-purple-50/20"
                  }`}
                  onClick={() => document.getElementById("file-upload-input-global")?.click()}
                >
                  <input 
                    type="file" 
                    id="file-upload-input-global" 
                    className="hidden" 
                    accept=".pdf,.doc,.docx,image/*"
                    onChange={handleFileSelect}
                  />
                  <UploadCloud className="h-12 w-12 text-purple-400 mx-auto mb-3 animate-bounce" />
                  <p className="font-black text-navy-pikin mb-1">Drag and drop file here, or click to browse</p>
                  <p className="text-xs text-slate-400">Supports PDFs, Images, and Word files up to 20MB</p>
                </div>
              ) : (
                <div className="bg-purple-50/60 rounded-2xl p-6 border border-purple-100 text-left">
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="h-8 w-8 text-purple-600 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-navy-pikin truncate text-sm">{uploadedFile.name}</p>
                      <p className="text-xs text-slate-400">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>

                  {/* Progress indicator */}
                  {uploadProgress < 100 ? (
                    <div>
                      <div className="flex justify-between text-xs font-black mb-1.5 text-purple-700">
                        <span>Uploading file...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-purple-600 h-full transition-all duration-150" style={{ width: `${uploadProgress}%` }} />
                      </div>
                    </div>
                  ) : isAnalyzing ? (
                    <div className="flex flex-col items-center py-4 text-center">
                      <RefreshCw className="h-8 w-8 text-purple-600 animate-spin mb-3" />
                      <p className="font-black text-purple-800 text-sm">Smart Pikin AI is reading and syllabifying...</p>
                      <p className="text-xs text-slate-500 mt-1">Generating instant reading prompts and word quizzes</p>
                    </div>
                  ) : (
                    <div className="text-left bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                      <div className="flex gap-2 text-emerald-800 font-extrabold text-sm mb-1">
                        <Check className="h-5 w-5 shrink-0 text-emerald-600" />
                        <span>AI Integration Complete!</span>
                      </div>
                      <p className="text-xs text-[#4a6080] leading-relaxed">
                        {analysisResult}
                      </p>
                      <button 
                        onClick={resetUploadState}
                        className="mt-4 text-xs font-extrabold text-purple-600 hover:text-purple-800 flex items-center gap-1 cursor-pointer bg-transparent border-none focus:outline-none"
                      >
                        <RefreshCw className="h-3 w-3" /> Upload another book
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-6 flex gap-3">
                <button 
                  onClick={() => setUploadModalOpen(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-full transition-all text-sm cursor-pointer border-none focus:outline-none"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {currentView === 'landing' && (
        <>
          {/* ─── TESTIMONIALS SECTION ─── */}
          <section className="bg-soft-pikin py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-center text-navy-pikin mb-4">
            What Parents Are Saying
          </h2>
          <p className="text-center text-[#5a7090] text-lg max-w-xl mx-auto mb-16 leading-relaxed">
            Real stories from real families across Nigeria and beyond
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testi 1 */}
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-navy-pikin/5 relative border border-sky-pikin/10">
              <span className="absolute top-6 left-6 text-slate-100 font-serif text-8xl leading-none pointer-events-none">“</span>
              <div className="flex gap-0.5 text-sun-pikin mb-4">
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
              </div>
              <p className="text-[#4a6080] leading-relaxed mb-6 text-[15px] relative z-10">
                My 6-year-old used to struggle with pronunciation. After just two weeks on Smart Pikin, her teacher called me to say how much she has improved!
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center text-2xl">
                  👩🏾
                </div>
                <div>
                  <strong className="block text-navy-pikin text-sm font-bold">Ngozi A.</strong>
                  <span className="text-xs text-slate-400 font-semibold">Mother of 2 · Lagos</span>
                </div>
              </div>
            </div>

            {/* Testi 2 */}
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-navy-pikin/5 relative border border-sky-pikin/10">
              <span className="absolute top-6 left-6 text-slate-100 font-serif text-8xl leading-none pointer-events-none">“</span>
              <div className="flex gap-0.5 text-sun-pikin mb-4">
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
              </div>
              <p className="text-[#4a6080] leading-relaxed mb-6 text-[15px] relative z-10">
                I uploaded my son's school reader and the AI helped him go through it perfectly. He now reads to me every evening and loves it!
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-2xl">
                  👨🏾
                </div>
                <div>
                  <strong className="block text-navy-pikin text-sm font-bold">Emeka O.</strong>
                  <span className="text-xs text-slate-400 font-semibold">Father · Port Harcourt</span>
                </div>
              </div>
            </div>

            {/* Testi 3 */}
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-navy-pikin/5 relative border border-sky-pikin/10">
              <span className="absolute top-6 left-6 text-slate-100 font-serif text-8xl leading-none pointer-events-none">“</span>
              <div className="flex gap-0.5 text-sun-pikin mb-4">
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
              </div>
              <p className="text-[#4a6080] leading-relaxed mb-6 text-[15px] relative z-10">
                The age-appropriate books are amazing. My twins (ages 4 and 9) both use it and they each get a completely different experience. Highly recommend!
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-2xl">
                  👩🏽
                </div>
                <div>
                  <strong className="block text-navy-pikin text-sm font-bold">Blessing U.</strong>
                  <span className="text-xs text-slate-400 font-semibold">Mother of twins · Abuja</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ SECTION ─── */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-center text-navy-pikin mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-center text-[#5a7090] text-lg max-w-xl mx-auto mb-16 leading-relaxed">
            Got questions? We have answers.
          </p>

          <div className="divide-y divide-slate-100">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="py-5">
                  <button 
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left font-black text-navy-pikin text-base sm:text-lg focus:outline-none py-2 group"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`h-5 w-5 text-sky-pikin transition-transform duration-300 shrink-0 ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className="text-sm text-[#5a7090] leading-relaxed pt-3 pb-2 pr-6">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>
        </>
      )}

      {/* ─── FOOTER SECTION ─── */}
      <footer className="bg-navy-pikin text-white/70 py-16 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          
          {/* Logo */}
          <div className="flex flex-col items-center gap-3">
            <img 
              src={logoImg} 
              alt="Smart Pikin" 
              className="h-16 w-16 object-cover rounded-full border-2 border-sky-pikin"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <span className="font-display text-3xl text-white tracking-tight">📚 Smart Pikin</span>
          </div>

          <p className="max-w-md mx-auto text-sm text-[#b0d8f0] leading-relaxed">
            Helping African children read with confidence, one story at a time. 🌍
          </p>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 font-bold text-[13px] text-[#7ab8d8]">
            <button 
              onClick={() => {
                setCurrentView('landing');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-white transition-colors cursor-pointer bg-transparent border-none"
            >
              Home
            </button>
            <button 
              onClick={() => {
                setCurrentView('how');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-white transition-colors cursor-pointer bg-transparent border-none"
            >
              How It Works
            </button>
            <button 
              onClick={() => {
                setCurrentView('features');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-white transition-colors cursor-pointer bg-transparent border-none"
            >
              Features
            </button>
            <button 
              onClick={() => {
                setCurrentView('books');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-white transition-colors cursor-pointer bg-transparent border-none"
            >
              Books
            </button>
            <button 
              onClick={() => {
                setCurrentView('signup');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-white transition-colors cursor-pointer bg-transparent border-none"
            >
              Sign Up
            </button>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-white transition-colors cursor-pointer bg-transparent border-none"
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-white transition-colors cursor-pointer bg-transparent border-none"
            >
              Terms of Service
            </button>
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t border-white/10 text-xs text-white/40">
            © 2026 Smart Pikin. All rights reserved. Made with ❤️ for African children.
          </div>

        </div>
      </footer>

    </div>
  );
}
