
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useInView } from 'framer-motion';
import { MarketChart, PriceComparison, RevenueGoal } from './components/Charts';
import { SLIDES } from './slidesData';
import { gemini } from './services/geminiService';

// --- Icons & Assets ---
const VigiBandLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3" />
    <path d="M25 50 Q50 20 75 50 T25 50" fill="currentColor" />
    <path d="M35 50 L45 50 L50 40 L55 60 L60 50 L65 50" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// --- Sub-Components ---

const SectionHeader: React.FC<{ title: string; subtitle?: string; accent?: string }> = ({ title, subtitle, accent = "brand-accent" }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    className="mb-12"
  >
    <h2 className="text-4xl md:text-6xl font-black font-jakarta tracking-tighter mb-4">
      {title.split(' ').map((word, i) => (
        <span key={i} className={i === title.split(' ').length - 1 ? `text-${accent}` : ""}>{word} </span>
      ))}
    </h2>
    {subtitle && <p className="text-xl text-white/40 font-medium">{subtitle}</p>}
  </motion.div>
);

const DetectionDemo = () => {
  const [stage, setStage] = useState(0); // 0: Normal, 1: Shake, 2: Alert, 3: Notify, 4: Resolve
  
  useEffect(() => {
    const interval = setInterval(() => {
      setStage((prev) => (prev + 1) % 5);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[400px] w-full flex items-center justify-center perspective">
      <AnimatePresence mode="wait">
        <motion.div 
          key={stage}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="relative"
        >
          {/* 3D-ish Wristband Simulation */}
          <div className={`w-64 h-24 bg-zinc-800 rounded-full border-4 border-white/10 flex items-center justify-center relative shadow-2xl transition-all duration-500 ${stage === 1 ? 'animate-shake border-red-500 shadow-red-500/20' : ''}`}>
            <div className={`w-12 h-6 rounded border border-white/20 flex items-center justify-center ${stage === 2 ? 'bg-red-500 animate-pulse' : 'bg-zinc-900'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${stage >= 1 ? 'bg-red-500' : 'bg-green-500 animate-ping'}`}></div>
            </div>
            
            {/* Haptic Waves */}
            {stage === 2 && (
              <motion.div 
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="absolute inset-0 rounded-full border-4 border-red-500"
              />
            )}
          </div>

          {/* Status Label */}
          <div className="absolute -bottom-16 left-0 right-0 text-center">
             <p className={`text-xs font-black uppercase tracking-[0.4em] ${stage === 1 || stage === 2 ? 'text-red-500' : 'text-white/40'}`}>
               {stage === 0 && "Status: Normal"}
               {stage === 1 && "SHAKE DETECTED"}
               {stage === 2 && "VIBRATION ALERT"}
               {stage === 3 && "CAREGIVER NOTIFIED"}
               {stage === 4 && "SAFE / CANCELLED"}
             </p>
          </div>
          
          {/* Floating Notification */}
          {stage === 3 && (
            <motion.div 
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="absolute -top-32 -right-16 w-48 bg-white text-brand-bg p-3 rounded-2xl shadow-2xl"
            >
              <div className="flex items-center space-x-2 mb-1">
                <i className="fas fa-bell text-red-500 text-xs"></i>
                <span className="text-[10px] font-black uppercase">Emergency</span>
              </div>
              <p className="text-xs font-bold">Seizure Alert: Dad</p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// --- Main App ---

const App: React.FC = () => {
  const [pitchMode, setPitchMode] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    let interval: any;
    if (isTimerRunning) {
      interval = setInterval(() => setTimer((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const fetchFeedback = async () => {
    setIsAnalyzing(true);
    const currentSlide = SLIDES[activeSlide];
    const result = await gemini.getPitchFeedback(currentSlide.title, currentSlide.script);
    setFeedback(result);
    setIsAnalyzing(false);
  };

  // Observer to track current slide based on scroll
  const sectionRefs = SLIDES.map(() => useRef<HTMLElement>(null));
  
  useEffect(() => {
    const observers = sectionRefs.map((ref, index) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSlide(index);
          }
        },
        { threshold: 0.5 }
      );
      if (ref.current) observer.observe(ref.current);
      return observer;
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <div className="bg-brand-bg text-brand-text min-h-screen selection:bg-brand-accent selection:text-brand-bg">
      {/* Scroll Progress Bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-brand-accent z-[150] origin-left" style={{ scaleX }} />

      {/* Navigation */}
      <nav className="fixed top-0 w-full h-20 flex items-center justify-between px-8 z-[120] bg-brand-bg/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
          <VigiBandLogo className="w-10 h-10 text-brand-accent group-hover:scale-110 transition-transform" />
          <span className="font-jakarta font-black text-2xl tracking-tighter uppercase italic">VigiBand</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => {
              setPitchMode(!pitchMode);
              if (!pitchMode) {
                setIsTimerRunning(true);
                setTimer(0);
              } else {
                setIsTimerRunning(false);
              }
            }}
            className={`px-6 py-2 rounded-xl font-black text-[10px] tracking-widest transition-all glow-button ${pitchMode ? 'bg-brand-accent text-brand-bg' : 'border border-brand-accent text-brand-accent hover:bg-brand-accent/5'}`}
          >
            {pitchMode ? 'EXIT PITCH' : 'START PITCH'}
          </button>
        </div>
      </nav>

      <main className={`transition-all duration-500 ${pitchMode ? 'pr-0 md:pr-96' : ''}`}>
        
        {/* HERO SECTION */}
        <section ref={sectionRefs[0]} id="hero" className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden px-8">
           <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-accent/10 blur-[150px] rounded-full animate-pulse-slow"></div>
           
           <motion.div 
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             className="text-center z-10 max-w-4xl"
           >
              <span className="inline-block px-4 py-1.5 rounded-full border border-brand-accent/20 bg-brand-accent/5 text-brand-accent text-[10px] font-black uppercase tracking-[0.4em] mb-10">
                Founders Pitch Bangalore 2026
              </span>
              <h1 className="text-7xl md:text-9xl font-black font-jakarta tracking-tighter leading-none text-glow mb-10">
                VIGIBAND<span className="text-brand-accent">.</span>
              </h1>
              <p className="text-xl md:text-3xl font-light text-white/50 leading-relaxed mb-16">
                India's first affordable <span className="text-brand-accent font-medium">Seizure & Fall detection</span> wearable for everyone.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                 {[
                   { label: 'PRICE', val: '₹3,999', sub: 'vs ₹40k Watch' },
                   { label: 'TIMELINE', val: '4 WEEKS', sub: 'To Prototype' },
                   { label: 'GOAL', val: '10,000', sub: 'Lives Saved' },
                 ].map((stat, i) => (
                   <div key={i} className="glass-panel p-8 rounded-[2rem] border-b-4 border-brand-accent">
                      <p className="text-2xl font-black text-brand-accent italic mb-1">{stat.val}</p>
                      <p className="text-[10px] uppercase font-bold text-white/30 tracking-widest">{stat.label}</p>
                      <p className="text-[8px] mt-2 text-white/20 font-bold">{stat.sub}</p>
                   </div>
                 ))}
              </div>

              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-white/20"
              >
                <i className="fas fa-chevron-down text-2xl"></i>
              </motion.div>
           </motion.div>
        </section>

        {/* WHY / STORY */}
        <section ref={sectionRefs[1]} className="min-h-screen py-32 px-8 flex flex-col items-center justify-center">
           <div className="max-w-4xl w-full">
              <SectionHeader title="Why We Build." subtitle="A gap between cost and life." />
              <div className="grid md:grid-cols-2 gap-12">
                 <div className="p-8 glass-panel rounded-3xl border-l-4 border-brand-accent">
                    <h4 className="text-5xl font-black mb-4">₹1,200</h4>
                    <p className="text-sm text-white/40 uppercase font-black tracking-widest">Manufacturing Cost</p>
                 </div>
                 <div className="p-8 glass-panel rounded-3xl border-l-4 border-red-500">
                    <h4 className="text-5xl font-black mb-4">₹40,000</h4>
                    <p className="text-sm text-white/40 uppercase font-black tracking-widest">Market Price</p>
                 </div>
              </div>
              <p className="mt-12 text-2xl font-light text-white/60 leading-relaxed">
                "Epilepsy affects 50M+ people. 75% can't afford existing devices. We are here to close that gap."
              </p>
           </div>
        </section>

        {/* THE PROBLEM */}
        <section ref={sectionRefs[2]} className="min-h-screen py-32 px-8 flex flex-col items-center justify-center bg-black/20">
           <div className="max-w-6xl w-full grid md:grid-cols-2 gap-20 items-center">
              <div>
                 <SectionHeader title="The Reality." accent="red-500" />
                 <div className="space-y-6">
                    {[
                      { icon: 'fa-skull', title: '1 in 1,000', desc: 'Patients die every year from SUDEP.' },
                      { icon: 'fa-clock', title: 'Every 11s', desc: 'An elderly person falls. Time is critical.' },
                      { icon: 'fa-ghost', title: 'The Silent Killer', desc: '70% of fatal seizures happen while ALONE.' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center space-x-6 p-6 glass-panel rounded-3xl group border-l-4 border-red-500/30">
                         <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 text-2xl group-hover:scale-110 transition-transform">
                           <i className={`fas ${item.icon}`}></i>
                         </div>
                         <div>
                            <h4 className="text-2xl font-black tracking-tight">{item.title}</h4>
                            <p className="text-sm text-white/40">{item.desc}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
              <div className="glass-panel p-10 rounded-[3rem] shadow-2xl relative">
                 <PriceComparison />
                 <p className="mt-8 text-center text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Market Pricing Inequity</p>
              </div>
           </div>
        </section>

        {/* THE SOLUTION / DEMO */}
        <section ref={sectionRefs[3]} className="min-h-screen py-32 px-8 flex flex-col items-center justify-center relative">
           <div className="max-w-4xl w-full text-center">
              <SectionHeader title="VigiBand Protects." subtitle="Intelligent Detection. Instant Alerts." />
              <div className="glass-panel p-12 rounded-[4rem] border-4 border-brand-accent/20 shadow-[0_0_100px_rgba(56,189,248,0.1)] mb-16">
                 <DetectionDemo />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {['ESP32-C3', 'MPU6050', 'EDGE AI', 'HAPTIC'].map((tech, i) => (
                   <div key={i} className="py-4 px-6 bg-white/5 rounded-2xl border border-white/5 text-[10px] font-black uppercase tracking-widest text-brand-accent">
                     {tech}
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* MARKET & BUSINESS */}
        <section ref={sectionRefs[5]} className="min-h-screen py-32 px-8 flex flex-col items-center justify-center">
           <div className="max-w-6xl w-full grid md:grid-cols-2 gap-20 items-center">
              <div className="glass-panel p-10 rounded-[3rem]">
                 <MarketChart />
                 <div className="mt-10 grid grid-cols-2 gap-8 text-center">
                   <div>
                     <p className="text-3xl font-black italic text-brand-accent">17.5%</p>
                     <p className="text-[10px] uppercase font-bold text-white/30 tracking-widest">Annual Growth</p>
                   </div>
                   <div>
                     <p className="text-3xl font-black italic text-white">₹2B+</p>
                     <p className="text-[10px] uppercase font-bold text-white/30 tracking-widest">Market Opportunity</p>
                   </div>
                 </div>
              </div>
              <div>
                 <SectionHeader title="The Opportunity." />
                 <p className="text-2xl font-light text-white/50 leading-relaxed mb-8">
                   We aren't just selling a device; we are selling <span className="text-white font-bold">peace of mind</span>. 
                 </p>
                 <div className="p-8 bg-brand-accent/10 border border-brand-accent/20 rounded-3xl">
                    <p className="text-4xl font-black italic mb-2">60% Margin</p>
                    <p className="text-sm text-white/40 font-bold uppercase tracking-widest">Sustainable Healthcare Impact</p>
                 </div>
              </div>
           </div>
        </section>

        {/* ROADMAP */}
        <section ref={sectionRefs[8]} className="min-h-screen py-32 px-8 flex flex-col items-center justify-center">
           <SectionHeader title="The Roadmap." subtitle="From Concept to 10,000 Units." />
           <div className="max-w-6xl w-full relative mt-12">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/5 hidden md:block -translate-y-1/2"></div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                 {[
                   { q: 'Q1', t: 'Prototype', d: 'Final BOM & PCB design.', icon: 'fa-microchip' },
                   { q: 'Q2', t: 'Clinical Pilot', d: 'Validation with 50 patients.', icon: 'fa-vials' },
                   { q: 'Q3', t: 'Launch', d: 'Amazon & Flipkart release.', icon: 'fa-rocket' },
                   { q: 'Q4', t: 'Scale', d: '10,000 Lives Protected.', icon: 'fa-chart-line' },
                 ].map((item, i) => (
                   <div key={i} className="relative z-10 glass-panel p-8 rounded-3xl text-center group hover:border-brand-accent transition-colors">
                      <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center text-xl text-brand-accent mb-6 mx-auto group-hover:scale-110 transition-transform">
                        <i className={`fas ${item.icon}`}></i>
                      </div>
                      <p className="text-xs font-black text-brand-accent mb-2">{item.q}</p>
                      <h4 className="font-bold mb-2">{item.t}</h4>
                      <p className="text-[10px] text-white/30">{item.d}</p>
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* THE ASK */}
        <section ref={sectionRefs[9]} className="min-h-screen py-32 px-8 flex flex-col items-center justify-center relative overflow-hidden">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-brand-accent/5 blur-[120px] rounded-full"></div>
           <motion.div 
             initial={{ scale: 0.9, opacity: 0 }}
             whileInView={{ scale: 1, opacity: 1 }}
             className="max-w-4xl w-full glass-panel p-20 rounded-[4rem] text-center border-4 border-brand-accent/30 shadow-2xl relative"
           >
              <h2 className="text-6xl md:text-9xl font-black font-jakarta tracking-tighter mb-10 italic">₹20 Lakhs.</h2>
              <p className="text-2xl font-light text-white/60 mb-16 max-w-2xl mx-auto">
                Seed capital to turn <span className="text-white font-bold">technical vision</span> into <span className="text-brand-accent font-bold">human impact</span>.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                 {[
                   { l: 'Prototype', v: '3L' },
                   { l: 'Clinical', v: '4L' },
                   { l: 'Regulatory', v: '5L' },
                   { l: 'Production', v: '8L' },
                 ].map((a, i) => (
                   <div key={i} className="p-6 bg-white/5 rounded-3xl border border-white/5">
                      <p className="text-2xl font-black italic">{a.v}</p>
                      <p className="text-[10px] uppercase font-bold text-white/30 tracking-widest">{a.l}</p>
                   </div>
                 ))}
              </div>

              <button className="px-12 py-5 bg-brand-accent text-brand-bg font-black rounded-2xl text-lg glow-button">
                 JOIN THE MISSION
              </button>
           </motion.div>
        </section>

        {/* FOOTER */}
        <footer className="py-24 border-t border-white/5 bg-black/40 px-8">
           <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
              <div className="flex items-center space-x-4">
                 <VigiBandLogo className="w-16 h-16 text-brand-accent" />
                 <div className="text-left">
                    <h3 className="text-3xl font-black tracking-tighter uppercase italic">VigiBand<span className="text-brand-accent">.</span></h3>
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Built with ❤️ in Bengaluru</p>
                 </div>
              </div>
              <div className="text-center md:text-right">
                <p className="text-lg font-medium">founder@vigiband.com</p>
                <p className="text-sm text-white/30">Founders Pitch 2026</p>
              </div>
           </div>
        </footer>
      </main>

      {/* PITCH CONSOLE SIDEBAR */}
      <AnimatePresence>
        {pitchMode && (
          <motion.aside 
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            className="fixed right-0 top-0 bottom-0 w-96 bg-brand-deep/95 backdrop-blur-2xl border-l border-white/5 z-[200] flex flex-col shadow-2xl"
          >
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-black/20">
              <div>
                <p className="text-[10px] font-black text-brand-accent uppercase tracking-[0.3em] mb-1">Pitch Timer</p>
                <p className="text-4xl font-mono font-black">{formatTime(timer)}</p>
              </div>
              <button 
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform active:scale-90 ${isTimerRunning ? 'bg-red-500' : 'bg-green-500'}`}
              >
                <i className={`fas ${isTimerRunning ? 'fa-pause' : 'fa-play'}`}></i>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              <section>
                <h4 className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-4">Speaker Notes (Slide {activeSlide + 1})</h4>
                <div className="p-6 bg-white/5 border border-white/5 rounded-3xl text-sm italic text-white/80 leading-relaxed font-medium">
                  "{SLIDES[activeSlide].script}"
                </div>
              </section>

              <section className="pt-8 border-t border-white/5">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-[10px] font-black text-white/30 uppercase tracking-widest">AI Performance Coach</h4>
                  <button 
                    onClick={fetchFeedback} 
                    disabled={isAnalyzing}
                    className="text-[10px] text-brand-accent font-bold uppercase hover:underline"
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Get Tips'}
                  </button>
                </div>
                
                {feedback ? (
                  <div className="p-5 bg-brand-accent/5 border border-brand-accent/10 rounded-2xl space-y-3 text-xs text-white/70">
                    {feedback.split('\n').map((line, i) => line.trim() && <p key={i}>• {line}</p>)}
                  </div>
                ) : (
                  <div className="p-8 border border-dashed border-white/10 rounded-3xl text-center">
                    <i className="fas fa-wand-sparkles text-2xl text-white/10 mb-3"></i>
                    <p className="text-[10px] text-white/30 font-bold uppercase leading-relaxed">Ready to practice? Click "Get Tips" for real-time coaching.</p>
                  </div>
                )}
              </section>
            </div>
            
            <div className="p-8 bg-black/40 text-center">
               <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Investor Demo Perspective</p>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <style>{`
        .perspective { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
      `}</style>
    </div>
  );
};

export default App;
