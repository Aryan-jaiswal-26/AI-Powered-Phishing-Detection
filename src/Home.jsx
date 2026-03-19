import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Settings, User, Shield, Link2Off, Activity, ArrowRight } from 'lucide-react';
import ThreatScanner3D from './components/ThreatScanner3D';

function Navbar({ onNavigate }) {
  return (
    <nav className="flex items-center justify-between py-6 px-12 border-b border-white/5">
      <div className="flex items-center gap-12">
        <div className="text-accent font-black text-xl tracking-wider">PHISH_SHIELD</div>
        
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
          <a onClick={(e) => { e.preventDefault(); onNavigate('home'); }} href="#" className="text-accent border-b border-accent pb-1">Dashboard</a>
          <a onClick={(e) => { e.preventDefault(); onNavigate('threat-intel'); }} href="#" className="hover:text-white transition-colors">Threat Intelligence</a>
          <a onClick={(e) => { e.preventDefault(); onNavigate('policy'); }} href="#" className="hover:text-white transition-colors">Policy</a>
          <a onClick={(e) => { e.preventDefault(); onNavigate('logs'); }} href="#" className="hover:text-white transition-colors">Logs</a>
        </div>
      </div>

      <div className="flex items-center gap-6 text-gray-400">
        <Bell className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
        <Settings className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
        <div className="w-8 h-8 rounded-full bg-surface border border-white/10 flex items-center justify-center cursor-pointer">
          <User className="w-4 h-4" />
        </div>
      </div>
    </nav>
  );
}

function Hero({ onNavigate }) {
  return (
    <section className="px-12 py-20 flex flex-col lg:flex-row items-center justify-between gap-16">
      <motion.div 
        className="flex-1 space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300 uppercase tracking-widest mb-4">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
          System Status: Active
        </div>

        <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-none text-white mb-6">
          AI-Powered <br/>
          <span className="text-accent">Phishing</span><br/>
          Detection
        </h1>

        <p className="text-gray-400 text-lg md:text-xl max-w-xl leading-relaxed mb-8">
          Analyze emails, links, and messages in real time with intelligent threat detection. Secure your digital frontier against the next generation of social engineering.
        </p>

        <div className="flex items-center gap-4 mb-20">
          <button onClick={() => onNavigate('workspace')} className="px-8 py-3 bg-accent text-[#080c13] rounded font-bold hover:bg-[#00cce6] transition-colors shadow-[0_0_20px_rgba(0,229,255,0.3)]">
            Start Analysis
          </button>
          <button className="px-8 py-3 bg-transparent border border-white/10 text-white rounded font-medium hover:bg-white/5 transition-colors">
            Learn More
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
          <div>
            <div className="text-accent font-bold text-xs tracking-widest uppercase mb-1">Enterprise-Grade</div>
            <div className="text-gray-500 text-[10px] uppercase tracking-widest">Military Encryption</div>
          </div>
          <div>
            <div className="text-accent font-bold text-xs tracking-widest uppercase mb-1">Real-Time Intelligence</div>
            <div className="text-gray-500 text-[10px] uppercase tracking-widest">Zero-Day Protection</div>
          </div>
          <div>
            <div className="text-accent font-bold text-xs tracking-widest uppercase mb-1">99.9% Accuracy</div>
            <div className="text-gray-500 text-[10px] uppercase tracking-widest">ML-Driven Validation</div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="flex-1 w-full max-w-lg"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <ThreatScanner3D />
      </motion.div>
    </section>
  );
}

function FeatureCards() {
  const cards = [
    {
      icon: <Shield className="w-6 h-6 text-accent" />,
      title: "Email Vault Integration",
      desc: "Direct hooks into major enterprise email providers for seamless, transparent analysis without slowing down your workflow.",
      link: "Configure Vault"
    },
    {
      icon: <Link2Off className="w-6 h-6 text-accent" />,
      title: "URL Sandbox",
      desc: "Instantly isolate and detonate suspicious links in a secure environment before they interact with users."
    },
    {
      icon: <Activity className="w-6 h-6 text-accent" />,
      title: "System Health",
      desc: "Continuous monitoring of your organizational perimeter, connected nodes, and detection health."
    }
  ];

  return (
    <section className="px-12 py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, i) => (
        <motion.div 
          key={i}
          className="bg-surface/50 border border-white/5 rounded-xl p-8 hover:bg-surface transition-colors group cursor-default"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
        >
          <div className="mb-6">{card.icon}</div>
          <h3 className="text-xl font-bold mb-3">{card.title}</h3>
          <p className="text-sm text-gray-400 leading-relaxed mb-6">{card.desc}</p>
          
          {card.link && (
            <a href="#" className="inline-flex items-center gap-2 text-accent text-sm font-bold uppercase tracking-widest group-hover:translate-x-1 transition-transform">
              {card.link}
              <ArrowRight className="w-4 h-4" />
            </a>
          )}
        </motion.div>
      ))}
    </section>
  );
}

function Footer({ onNavigate }) {
  return (
    <footer className="px-12 py-8 mt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 uppercase tracking-widest">
      <div className="mb-4 md:mb-0">
        <div className="text-accent font-black tracking-wider text-sm mb-1">PHISH_SHIELD</div>
        <div>&copy; 2024 PHISH_SHIELD TACTICAL EDITORIAL</div>
      </div>
      
      <div className="flex items-center gap-6">
        <a onClick={(e) => { e.preventDefault(); onNavigate('privacy'); }} href="#" className="hover:text-gray-300 transition-colors border-b border-transparent hover:border-gray-500 pb-1">Privacy Protocol</a>
        <a onClick={(e) => { e.preventDefault(); onNavigate('terms'); }} href="#" className="hover:text-gray-300 transition-colors border-b border-transparent hover:border-gray-500 pb-1">Terms of Engagement</a>
        <a onClick={(e) => { e.preventDefault(); onNavigate('trust'); }} href="#" className="hover:text-gray-300 transition-colors border-b border-transparent hover:border-gray-500 pb-1">Trust Center</a>
        <a onClick={(e) => { e.preventDefault(); onNavigate('status'); }} href="#" className="hover:text-gray-300 transition-colors border-b border-transparent hover:border-gray-500 pb-1">Status</a>
      </div>
    </footer>
  );
}

function App({ onNavigate }) {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden relative">
      {/* Absolute Header link intercept for Navigation */}
      <div className="fixed top-6 right-32 z-50">
         <button onClick={() => onNavigate('workspace')} className="px-4 py-2 border border-accent text-accent rounded text-sm hover:bg-accent hover:text-[#080c13] transition-colors">
            Detection Workspace
         </button>
      </div>
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 pointer-events-none z-[-1]" 
           style={{ 
             backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
             backgroundSize: '50px 50px' 
           }}>
      </div>

      <Navbar onNavigate={onNavigate} />
      
      <main className="flex-1">
        <Hero onNavigate={onNavigate} />
        <FeatureCards />
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}

export default App;