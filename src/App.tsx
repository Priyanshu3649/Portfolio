import React, { useState, useEffect, useRef } from 'react';
import { 
  Github, 
  Linkedin, 
  Mail, 
  ExternalLink, 
  Code2, 
  Terminal, 
  Cpu, 
  Database, 
  Cloud, 
  Layers, 
  Trophy, 
  Briefcase, 
  GraduationCap, 
  MapPin, 
  ChevronRight, 
  Menu, 
  X, 
  Phone,
  Server,
  Activity,
  BookOpen,
  MessageSquare,
  Command,
  Settings,
  ArrowRight,
  CheckCircle2,
  Zap,
  Play,
  Image as ImageIcon,
  Award,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { GoogleGenAI } from "@google/genai";

// --- Types ---
interface SkillBadgeProps {
  name: string;
  key?: string;
}

function SkillBadge({ name }: SkillBadgeProps) {
  return (
    <motion.span 
      className="px-3 py-1.5 bg-gradient-to-r from-zinc-800/50 to-zinc-900/50 border border-zinc-700/50 rounded-full text-xs font-mono text-zinc-300 hover:border-emerald-500/50 hover:text-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20 hover:scale-105 transition-all cursor-default backdrop-blur-sm"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      {name}
    </motion.span>
  );
}

interface SectionHeaderProps {
  title: string;
  icon: React.ElementType;
}

function SectionHeader({ title, icon: Icon }: SectionHeaderProps) {
  return (
    <motion.div 
      className="flex items-center gap-4 mb-12"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-14 h-14 bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 rounded-2xl flex items-center justify-center text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/10 group hover:scale-110 transition-transform duration-300">
        <Icon size={28} className="group-hover:rotate-6 transition-transform duration-300" />
      </div>
      <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-300 tracking-tight">{title}</h2>
      <div className="h-px bg-gradient-to-r from-zinc-800 to-transparent flex-grow ml-4"></div>
    </motion.div>
  );
}

// --- Main App ---
export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isResumeMode, setIsResumeMode] = useState(false);
  const [isDevMode, setIsDevMode] = useState(false);
  const [devInput, setDevInput] = useState('');
  const [devLogs, setDevLogs] = useState<string[]>(['System initialized...', 'Type "help" for commands.']);
  
  // AI Assistant State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: "Hi! I'm Priyanshu's AI assistant. Ask me anything about his projects, skills, or experience!" }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Certificates State
  const [selectedCertificate, setSelectedCertificate] = useState<typeof certificatesData[0] | null>(null);
  const [certificateFilter, setCertificateFilter] = useState('All');

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'experience', label: 'Experience' },
    { id: 'skills', label: 'Stack' },
    { id: 'featured', label: 'Featured' },
    { id: 'projects', label: 'Projects' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'certificates', label: 'Certificates' },
    { id: 'playground', label: 'Playground' },
    { id: 'blog', label: 'Blog' },
    { id: 'education', label: 'Education' },
    { id: 'contact', label: 'Contact' },
  ];

  // --- Form Logic ---
  const [formState, setFormState] = useState({ 
    name: '', 
    email: '', 
    company: '',
    role: '',
    linkedin: '',
    projectType: [] as string[],
    description: '',
    timeline: '',
    budget: '',
    tech: [] as string[],
    communication: ''
  });
  const [formErrors, setFormErrors] = useState({ name: '', email: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validateField = (name: string, value: any) => {
    let error = '';
    if (name === 'name' && value.length < 2) error = 'Name must be at least 2 characters';
    if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Please enter a valid email address';
    if (name === 'description' && value.length < 10) error = 'Description must be at least 10 characters';
    setFormErrors(prev => ({ ...prev, [name]: error }));
    return error === '';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      const field = name as 'projectType' | 'tech';
      setFormState(prev => ({
        ...prev,
        [field]: checked 
          ? [...prev[field], value] 
          : prev[field].filter(t => t !== value)
      }));
    } else {
      setFormState(prev => ({ ...prev, [name]: value }));
      if (['name', 'email', 'description'].includes(name)) {
        validateField(name, value);
      }
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isNameValid = validateField('name', formState.name);
    const isEmailValid = validateField('email', formState.email);
    const isDescValid = validateField('description', formState.description);

    if (!isNameValid || !isEmailValid || !isDescValid) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
    setFormState({ 
      name: '', 
      email: '', 
      company: '',
      role: '',
      linkedin: '',
      projectType: [],
      description: '',
      timeline: '',
      budget: '',
      tech: [],
      communication: ''
    });
    setTimeout(() => setSubmitted(false), 5000);
  };

  // --- AI Assistant Logic ---
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMsg,
        config: {
          systemInstruction: `You are Priyanshu Pandey's AI Portfolio Assistant. 
          Priyanshu is a B.Tech CSE student (2024-2028) at VIPS, GGSIPU with a CGPA of 8.78.
          He is a Java Backend Specialist.
          Key Projects:
          1. YatraSathi ERP: Freelance project, ₹3L contract, 50K+ monthly bookings, Java, Spring Boot, MySQL, AWS. Repo: https://github.com/Priyanshu3649/YatraSathi2
          2. Truth AI: Hackathon project, AI-powered misinformation shield. Multi-modal detection (text, image, video), Blockchain-backed Global Truth Graph. React, Node.js, Gemini API, Neo4j. Repo: https://github.com/Priyanshu3649/Truth_AI
          3. IEEE VIPS Website: College IEEE branch website. React, Vercel. Live: https://ieee-vips-sbat.vercel.app/ Repo: https://github.com/Priyanshu3649/IEEE_VIPS
          4. CityLife Nexus: Smart navigation app. Repo: https://github.com/Priyanshu3649/CityLife-Nexus
          5. KisaanConnect: Agriculture-focused app. Repo: https://github.com/Priyanshu3649/KissanConnect1
          6. AntiMalware App: Security application. Repo: https://github.com/Priyanshu3649/Antimalware_App
          7. Smart Contact Manager: Java-based contact management. Repo: https://github.com/Priyanshu3649/contact-manager2/tree/main
          8. Games: Tic Tac Toe, Snake Game.
          
          Experience:
          - Freelance Backend Developer at YatraSathi ERP.
          - Java Developer Intern at Pratinik Infotech.
          
          Skills: Java (Spring Boot Security, JPA/Hibernate, JUnit/Mockito), Node.js, MySQL, AWS, Docker, React.
          Achievements: TATA Crucible Zonal Winner (2025), PromptWars 2nd Place (Google), Hack LLM Top 8 (NSUT), Speedathon 3rd Place (DTU).
          
          Answer questions concisely and professionally. If asked about something not in his profile, politely say you don't have that information but can talk about his backend expertise.
          He is also a finalist in Hack Genesis, Swasth-a-thon, and has participated in 20+ other hackathons.`
        }
      });
      setChatMessages(prev => [...prev, { role: 'ai', text: response.text || "I'm sorry, I couldn't process that." }]);
    } catch (error) {
      console.error(error);
      setChatMessages(prev => [...prev, { role: 'ai', text: "Error connecting to my brain. Please try again later!" }]);
    } finally {
      setIsTyping(false);
    }
  };

  // --- Dev Mode Logic ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'g' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setIsDevMode(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleDevCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = devInput.trim().toLowerCase();
    setDevInput('');
    setDevLogs(prev => [...prev, `> ${cmd}`]);

    if (cmd === 'help') {
      setDevLogs(prev => [...prev, 'Available commands: help, clear, show projects, show skills, exit']);
    } else if (cmd === 'clear') {
      setDevLogs(['Terminal cleared.']);
    } else if (cmd === 'show projects') {
      setDevLogs(prev => [...prev, '1. YatraSathi ERP (Active)', '2. Truth AI (Hackathon Winner)', '3. IEEE VIPS Website', '4. CityLife Nexus', '5. KisaanConnect', '6. AntiMalware App']);
    } else if (cmd === 'show skills') {
      setDevLogs(prev => [...prev, 'Java, Spring Boot, MySQL, AWS, Docker, React']);
    } else if (cmd === 'exit') {
      setIsDevMode(false);
    } else {
      setDevLogs(prev => [...prev, `Command not found: ${cmd}`]);
    }
  };

  // --- Data ---
  const telemetryData = [
    { name: 'Jan', bookings: 42000, users: 85 },
    { name: 'Feb', bookings: 48000, users: 92 },
    { name: 'Mar', bookings: 52000, users: 105 },
    { name: 'Apr', bookings: 50000, users: 100 },
  ];

  const blogPosts = [
    {
      title: "How I Built a Travel ERP Handling 50K Monthly Bookings",
      excerpt: "Deep dive into the architecture of YatraSathi, focusing on scalability and multi-user concurrency.",
      date: "Mar 10, 2026",
      readTime: "8 min read"
    },
    {
      title: "Optimizing MySQL Queries for Large Datasets",
      excerpt: "Practical tips on indexing and pagination that improved our API response times by 40%.",
      date: "Feb 25, 2026",
      readTime: "5 min read"
    },
    {
      title: "OAuth vs JWT Authentication Explained",
      excerpt: "A comparison of security protocols used in modern backend systems.",
      date: "Feb 12, 2026",
      readTime: "6 min read"
    },
    {
      title: "Microservices vs Monolith: A Student's Perspective",
      excerpt: "Why I chose a monolithic architecture for YatraSathi and when I would consider microservices.",
      date: "Jan 28, 2026",
      readTime: "7 min read"
    },
    {
      title: "The Future of AI in Combating Misinformation",
      excerpt: "Exploring the role of multi-modal AI and blockchain in building trust online.",
      date: "Jan 15, 2026",
      readTime: "9 min read"
    }
  ];

  const certificatesData = [
    { name: "Agentic AI Day Certificate", file: "Agentic AI Day Certificate.png", category: "AI/ML" },
    { name: "Bharat XR Certificate", file: "Bharat XR Certificate.png", category: "XR/VR" },
    { name: "Buildathon Certificate", file: "Buildathon Certificate.png", category: "Hackathon" },
    { name: "Code Golf Certificate", file: "Code Golf Certificate.png", category: "Coding" },
    { name: "CodeSlayer Certificate", file: "CodeSlayer Certificate.png", category: "Competitive Programming" },
    { name: "CodeX 2.0 Certificate", file: "CodeX 2.0 Certifdicate.jpg", category: "Coding" },
    { name: "DarkCode Rising Certificate", file: "DarkCode Rising Certificate.png", category: "Hackathon" },
    { name: "Empathy Encryption Hackathon Certificate", file: "Empathy Encrytion Hackathon Certificate.png", category: "Hackathon" },
    { name: "Execute 5.0 Certificate", file: "Execute 5.0 certificate.png", category: "Hackathon" },
    { name: "Fintechstico v6.0 Certificate", file: "Fintechstico v6.0 Certificate.png", category: "Fintech" },
    { name: "Gen AI Exchange Certificate", file: "Gen AI Exchange Certificate.png", category: "AI/ML" },
    { name: "Hack Genesis Certificate", file: "Hack genesis Certificate.png", category: "Hackathon" },
    { name: "Hack-a-Pirate Certificate", file: "Hack-a-Pirate Certificate.png", category: "Hackathon" },
    { name: "Hack4Delhi Certificate", file: "Hack4Delhi Certificate.png", category: "Hackathon" },
    { name: "HackLLM Certificate", file: "HackLLM Certificate.png", category: "AI/ML" },
    { name: "HackShastra Certificate", file: "HackShastra Certificate.png", category: "Hackathon" },
    { name: "HackVriksh 2025 Certificate", file: "HackVriksh 2025 Certificate.png", category: "Hackathon" },
    { name: "HackWithSanchaar Certificate", file: "HackWithSanchaar Certificate.png", category: "Hackathon" },
    { name: "Hackwithmait Certificate", file: "Hackwithmait Certificate.png", category: "Hackathon" },
    { name: "IndustrySolve Ideathon and Product-a-thon", file: "IndustrySolve Ideathon and Product-a-thon.png", category: "Product" },
    { name: "Internship Completion Certificate", file: "Internship completion certificate.png", category: "Internship" },
    { name: "Internship Offer Letter", file: "Internship offer letter.png", category: "Internship" },
    { name: "Phantom Agents Certificate", file: "Phantom Agents Cerificate.png", category: "AI/ML" },
    { name: "Robowars Certificate", file: "Robowars Certifiate.png", category: "Robotics" },
    { name: "SnowHack IPEC Certificate", file: "SnowHack IPEC Certificate.png", category: "Hackathon" },
    { name: "Speedathon Certificate", file: "Speedathon Certificate.png", category: "Hackathon" },
    { name: "Tata Crucible Campus Quiz 2025 Certificate", file: "Tata Crucible Campus Quiz 2025 Certificate.jpg", category: "Quiz" },
    { name: "TechClasher Certificate", file: "TechClasher Certificate.png", category: "Coding" },
    { name: "The Mind Flayer Certificate", file: "The Mind Flayer Certificate.png", category: "Hackathon" }
  ];

  const projectsData = [
    {
      title: "IEEE VIPS Website",
      desc: "Official website for the IEEE branch of VIPS, GGSIPU.",
      problem: "The previous website was static and difficult to update, leading to outdated event information.",
      approach: "Built a dynamic React application with a custom CMS-like structure for easy content updates.",
      challenges: "Ensuring high performance while handling multiple high-resolution event images.",
      solutions: "Implemented lazy loading and image optimization techniques to maintain fast load times.",
      impact: "Increased student engagement by 40% and streamlined event registration processes.",
      tech: ["React", "Tailwind", "Vercel"],
      repo: "https://github.com/Priyanshu3649/IEEE_VIPS",
      live: "https://ieee-vips-sbat.vercel.app/",
      category: "Web"
    },
    {
      title: "CityLife Nexus",
      desc: "Smart navigation and city life management application.",
      problem: "Urban commuters lacked a unified platform for real-time traffic and local facility discovery.",
      approach: "Developed a cross-platform mobile app integrating multiple mapping and location APIs.",
      challenges: "Synchronizing real-time traffic data with local facility information without high latency.",
      solutions: "Used Node.js for a non-blocking backend and implemented efficient caching for static data.",
      impact: "Reduced average navigation time for test users by 15% through smarter routing.",
      tech: ["React Native", "Node.js", "Maps API"],
      repo: "https://github.com/Priyanshu3649/CityLife-Nexus",
      category: "Mobile"
    },
    {
      title: "KisaanConnect",
      desc: "A platform connecting farmers with markets and providing insights.",
      problem: "Farmers struggled with price transparency and direct access to wholesale buyers.",
      approach: "Built a Java-based backend to handle complex market data and user interactions.",
      challenges: "Designing a database schema that could handle frequent price updates across thousands of markets.",
      solutions: "Implemented a normalized MySQL schema with optimized indexing for rapid price lookups.",
      impact: "Empowered 500+ farmers with real-time price data, reducing middleman dependency.",
      tech: ["Java", "Spring Boot", "MySQL"],
      repo: "https://github.com/Priyanshu3649/KissanConnect1",
      category: "Backend"
    },
    {
      title: "AntiMalware App",
      desc: "Security tool for detecting and preventing malicious software.",
      problem: "Existing lightweight security tools often missed zero-day threats on local systems.",
      approach: "Developed a signature-based detection engine combined with heuristic analysis.",
      challenges: "Monitoring file system changes in real-time without significant CPU overhead.",
      solutions: "Utilized Java's WatchService API and optimized the scanning algorithm for low resource usage.",
      impact: "Detected 98% of common malware samples in testing with less than 5% CPU impact.",
      tech: ["Java", "Swing", "Security APIs"],
      repo: "https://github.com/Priyanshu3649/Antimalware_App",
      category: "Security"
    },
    {
      title: "Smart Contact Manager",
      desc: "Full-stack application for managing professional contacts.",
      problem: "Users needed a secure way to manage contacts across devices with role-based access.",
      approach: "Implemented a robust Spring Boot backend with JWT authentication and a responsive UI.",
      challenges: "Securing sensitive contact data while maintaining ease of access for authorized users.",
      solutions: "Integrated Spring Security with custom filters for granular access control.",
      impact: "Successfully managed 10,000+ contacts for beta users with zero security breaches.",
      tech: ["Java", "Spring Boot", "Thymeleaf", "MySQL"],
      repo: "https://github.com/Priyanshu3649/contact-manager2/tree/main",
      category: "Full Stack"
    },
    {
      title: "Truth AI",
      desc: "Autonomous AI for Misinformation Immunity.",
      problem: "The rapid spread of deepfakes and misinformation required a multi-modal detection system.",
      approach: "Combined Gemini's vision capabilities with blockchain for immutable truth tracking.",
      challenges: "Processing large video files for deepfake detection in near real-time.",
      solutions: "Implemented a distributed processing pipeline using Node.js and Neo4j for relationship mapping.",
      impact: "Achieved 92% accuracy in detecting manipulated media across 1,000+ test samples.",
      tech: ["React", "Node.js", "Gemini API", "Neo4j", "Blockchain"],
      repo: "https://github.com/Priyanshu3649/Truth_AI",
      category: "AI/ML"
    }
  ];

  const [archNode, setArchNode] = useState<string | null>(null);
  const [truthArchNode, setTruthArchNode] = useState<string | null>(null);
  const [selectedApi, setSelectedApi] = useState<any>(null);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [githubStats, setGithubStats] = useState<any>(null);

  useEffect(() => {
    const fetchGithubStats = async () => {
      try {
        const userRes = await fetch('https://api.github.com/users/Priyanshu3649');
        const userData = await userRes.json();
        const reposRes = await fetch('https://api.github.com/users/Priyanshu3649/repos?per_page=100');
        const reposData = await reposRes.json();
        const languages = new Set();
        reposData.forEach((repo: any) => {
          if (repo.language) languages.add(repo.language);
        });
        setGithubStats({
          public_repos: userData.public_repos,
          followers: userData.followers,
          languages: Array.from(languages),
          total_stars: reposData.reduce((acc: number, repo: any) => acc + repo.stargazers_count, 0)
        });
      } catch (error) {
        console.error("Error fetching GitHub stats:", error);
      }
    };
    fetchGithubStats();
  }, []);

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  useEffect(() => {
    // Only use scroll listener in Resume Mode or if we want to keep it for some reason
    // But for the new "modular" view, we'll disable auto-update of activeSection
  }, []);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-300 selection:bg-emerald-500/30 selection:text-emerald-200 overflow-x-hidden">
      {/* Animated Background Grid Pattern */}
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', backgroundSize: '50px 50px' }}>
      </div>
      
      {/* Ambient Glow Effects */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none animate-float"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none animate-float" style={{ animationDelay: '1.5s' }}></div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-zinc-800/50 shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center text-black font-bold font-mono text-lg shadow-lg shadow-emerald-500/30 hover:scale-110 transition-transform cursor-pointer">
              P
            </div>
            <span className="font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-300 tracking-tighter hidden sm:block">PRIYANSHU.DEV</span>
          </motion.div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.slice(0, 6).map((item, index) => (
              <motion.button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-xs font-mono uppercase tracking-widest px-3 py-2 rounded-lg transition-all ${
                  activeSection === item.id 
                    ? 'text-emerald-400 bg-emerald-500/10' 
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                }`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
              </motion.button>
            ))}
            <div className="relative group">
              <button className="text-xs font-mono uppercase tracking-widest px-3 py-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-all flex items-center gap-1">
                More
                <ChevronRight size={14} className="rotate-90" />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                <div className="py-2">
                  {navItems.slice(6).map(item => (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className="w-full text-left px-4 py-2 text-xs font-mono text-zinc-400 hover:text-emerald-400 hover:bg-zinc-800/50 transition-all"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <motion.button 
              onClick={() => setIsResumeMode(!isResumeMode)}
              className={`ml-4 px-4 py-2 border text-xs font-mono font-bold rounded-lg transition-all touch-target ${
                isResumeMode 
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 border-emerald-500 text-black shadow-lg shadow-emerald-500/30' 
                  : 'border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:bg-zinc-800/50'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isResumeMode ? 'PORTFOLIO MODE' : 'RESUME MODE'}
            </motion.button>
          </div>

          {/* Mobile Menu Toggle */}
          <motion.button 
            className="md:hidden text-zinc-400 p-2 touch-target" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileTap={{ scale: 0.9 }}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </nav>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-[#09090b]/98 backdrop-blur-xl md:hidden pt-20 px-6"
          >
            <div className="flex flex-col gap-3">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-left px-4 py-4 rounded-xl border transition-all touch-target ${
                    activeSection === item.id
                      ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
                      : 'border-zinc-800/50 text-zinc-300 hover:bg-zinc-800/30 hover:border-zinc-700'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-base font-mono font-bold uppercase tracking-wider">{item.label}</span>
                </motion.button>
              ))}
              <motion.button 
                onClick={() => setIsResumeMode(!isResumeMode)}
                className={`mt-4 px-4 py-4 border text-center font-mono font-bold rounded-xl transition-all touch-target ${
                  isResumeMode 
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 border-emerald-500 text-black' 
                    : 'border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:bg-zinc-800/50'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navItems.length * 0.05 }}
                whileTap={{ scale: 0.98 }}
              >
                {isResumeMode ? 'SWITCH TO PORTFOLIO MODE' : 'SWITCH TO RESUME MODE'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        
        {isResumeMode ? (
          /* --- Interactive Resume Mode --- */
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-3xl mx-auto"
          >
            <div className="mb-12 border-b border-zinc-800 pb-8">
              <h1 className="text-4xl font-bold text-zinc-100 mb-2">Priyanshu Pandey</h1>
              <p className="text-emerald-500 font-mono">Java Backend Specialist | B.Tech CSE Student</p>
            </div>

            <div className="space-y-12">
              <section>
                <h2 className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-12">Interactive Timeline</h2>
                <div className="relative border-l-2 border-zinc-800 ml-4 space-y-12 pb-12">
                  {[
                    { year: '2026', title: 'Java Developer Intern', org: 'Pratinik Infotech', desc: 'Leading the development of secure attendance modules using Spring Boot.', icon: Briefcase },
                    { year: '2025', title: 'Freelance Backend Lead', org: 'YatraSathi ERP', desc: 'Architected a high-concurrency ERP system handling 50K+ monthly transactions.', icon: Terminal },
                    { year: '2024', title: 'B.Tech CSE Student', org: 'VIPS, GGSIPU', desc: 'Focusing on advanced algorithms and system design. Maintaining 8.78 CGPA.', icon: GraduationCap },
                    { year: '2021', title: 'ATL Marathon Global Top 75', org: 'NITI Aayog', desc: 'Recognized for innovative smart city solutions on a global stage.', icon: Trophy }
                  ].map((item, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.2 }}
                      className="relative pl-12 group"
                    >
                      <div className="absolute -left-[11px] top-0 w-5 h-5 bg-[#09090b] border-2 border-zinc-800 rounded-full group-hover:border-emerald-500 transition-all flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-zinc-800 rounded-full group-hover:bg-emerald-500 transition-all"></div>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
                        <span className="text-xs font-mono font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">{item.year}</span>
                        <h3 className="text-xl font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors">{item.title}</h3>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-zinc-500 mb-4">
                        <item.icon size={14} />
                        <span>{item.org}</span>
                      </div>
                      <p className="text-sm text-zinc-400 leading-relaxed max-w-xl p-4 bg-zinc-900/30 border border-zinc-800 rounded-xl group-hover:border-zinc-700 transition-all">
                        {item.desc}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </section>

              <section>
                <div className="space-y-16">
                  {/* Core Competencies */}
                  <div>
                    <h2 className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-6">Core Competencies</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-zinc-100 font-bold mb-4 flex items-center gap-2">
                          <Terminal size={16} className="text-emerald-500" /> Backend Engineering
                        </h3>
                        <ul className="space-y-2 text-sm text-zinc-400">
                          <li>• Java & Spring Boot</li>
                          <li>• RESTful API Design</li>
                          <li>• OAuth Authentication</li>
                          <li>• JDBC & Database Connectivity</li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-zinc-100 font-bold mb-4 flex items-center gap-2">
                          <Cpu size={16} className="text-emerald-500" /> Advanced Java Stack
                        </h3>
                        <ul className="space-y-2 text-sm text-zinc-400">
                          <li>• Spring Security</li>
                          <li>• JPA / Hibernate</li>
                          <li>• REST API Design Patterns</li>
                          <li>• Unit Testing (JUnit, Mockito)</li>
                          <li>• Database Optimization</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Technical Skills Deep-Dive */}
                  <div className="mt-12 p-8 bg-zinc-900/50 border border-zinc-800 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-all"></div>
                    <h3 className="text-xs font-mono text-emerald-500 uppercase tracking-widest mb-8 flex items-center gap-2">
                      <Zap size={14} /> Technical Skills Deep-Dive
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                      {[
                        { 
                          label: 'Java Ecosystem', 
                          skills: ['Spring Boot Security', 'JPA/Hibernate', 'JUnit/Mockito', 'Maven/Gradle'] 
                        },
                        { 
                          label: 'API Engineering', 
                          skills: ['RESTful Design Patterns', 'GraphQL', 'Swagger/OpenAPI', 'WebSockets'] 
                        },
                        { 
                          label: 'Data Architecture', 
                          skills: ['MySQL Optimization', 'Redis Caching', 'Neo4j Graph DB', 'MongoDB'] 
                        },
                        { 
                          label: 'Cloud & DevOps', 
                          skills: ['Docker/Containerization', 'AWS (EC2, S3)', 'GitHub Actions', 'CI/CD Pipelines'] 
                        }
                      ].map(group => (
                        <div key={group.label} className="space-y-4">
                          <h4 className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">{group.label}</h4>
                          <ul className="space-y-2">
                            {group.skills.map(s => (
                              <li key={s} className="text-xs text-zinc-400 flex items-center gap-2 group/item">
                                <div className="w-1 h-1 bg-emerald-500/50 rounded-full group-hover/item:bg-emerald-500 transition-colors"></div>
                                {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Achievements Section */}
                  <div className="mt-16">
                    <h2 className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-6">Achievements & Hackathons</h2>
                    <div className="space-y-4">
                      {[
                        { title: 'TATA Crucible Campus Quiz 2025', result: 'Zonal Winner', context: 'Won the zonal round and reached the cluster finals (Top 8).' },
                        { title: 'PromptWars by Google', result: 'Rank 2', context: 'Secured 2nd place in a high-stakes prompt engineering competition.' },
                        { title: 'Hack LLM by NSUT', result: 'Top 8', context: 'Awarded $100 cash prize for innovative LLM application.' },
                        { title: 'Industry-Solve Ideathon (IIIT Delhi)', result: 'Rank 4', context: 'Recognized for product-a-thon excellence.' },
                        { title: 'Speedathon by DTU', result: '3rd Position', context: 'Podium finish in a competitive coding marathon.' },
                        { title: 'Hack Genesis (Christ University)', result: 'Finalist', context: 'Top finalist in a national level hackathon.' },
                        { title: 'Swasth-a-thon', result: 'Finalist', context: 'Finalist in a health-tech innovation challenge.' }
                      ].map((ach, idx) => (
                        <div key={idx} className="p-4 bg-zinc-900/30 border border-zinc-800 rounded-lg group hover:border-emerald-500/30 transition-all">
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="text-zinc-100 font-bold text-sm">{ach.title}</h3>
                            <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-500 text-[9px] font-mono uppercase">{ach.result}</span>
                          </div>
                          <p className="text-[11px] text-zinc-500 leading-relaxed">{ach.context}</p>
                        </div>
                      ))}
                      <div className="pt-4">
                        <p className="text-[10px] font-mono text-zinc-600 uppercase">Other Participations: Code Cubicle 5.0, D3CODE 2025, HackWithSanchaar, Code Golf, Zero Day Apocalypse, Robowars, and 20+ more.</p>
                      </div>
                    </div>
                  </div>

                  {/* Education */}
                  <div className="mt-16">
                    <h2 className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-6">Education</h2>
                    <div className="p-6 bg-zinc-900/30 border border-zinc-800 rounded-xl">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-zinc-100 font-bold">B.Tech in Computer Science</h3>
                        <span className="text-emerald-500 font-mono text-sm">2024 — 2028</span>
                      </div>
                      <p className="text-sm text-zinc-400 mb-4">Vivekananda Institute of Professional Studies (VIPS), GGSIPU</p>
                      <div className="flex items-center gap-4">
                        <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-500 text-[10px] font-mono uppercase">CGPA: 8.78</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-12">
                  <button onClick={() => handleNavClick('home')} className="text-xs font-mono text-zinc-500 hover:text-emerald-500 flex items-center gap-2">
                    <ArrowRight size={14} className="rotate-180" /> BACK TO DASHBOARD
                  </button>
                </div>
              </section>
            </div>
          </motion.div>
        ) : (
          /* --- Standard Portfolio Mode --- */
          <div className="max-w-6xl mx-auto px-4 pt-32 pb-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeSection === 'home' && (
                  <>
                    {/* Hero Section */}
                    <section className="mb-20">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-mono mb-6">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        AVAILABLE FOR INTERNSHIPS & FREELANCE
                      </div>
                      
                      <h1 className="text-5xl md:text-7xl font-bold text-zinc-100 mb-6 tracking-tight leading-none">
                        Building <span className="text-emerald-500 italic font-serif">scalable</span> backend systems.
                      </h1>
                      
                      <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-10 leading-relaxed">
                        I'm <span className="text-zinc-100 font-semibold">Priyanshu Pandey</span>, a B.Tech CSE student specializing in 
                        Java backend development. I architect secure, high-performance systems that process 
                        tens of thousands of transactions.
                      </p>

                      <div className="flex flex-wrap gap-4">
                        <a href="https://github.com/Priyanshu3649" target="_blank" rel="noopener noreferrer" 
                           className="flex items-center gap-2 px-6 py-3 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-all group">
                          <Github size={20} className="group-hover:text-emerald-500" />
                          <span className="font-mono text-sm">GITHUB</span>
                        </a>
                        <a href="https://linkedin.com/in/priyanshu-pandey-0882a21b2" target="_blank" rel="noopener noreferrer"
                           className="flex items-center gap-2 px-6 py-3 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-all group">
                          <Linkedin size={20} className="group-hover:text-emerald-500" />
                          <span className="font-mono text-sm">LINKEDIN</span>
                        </a>
                      </div>
                    </section>

                    {/* Dashboard Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[
                        { id: 'experience', label: 'Experience', icon: Briefcase, desc: 'Professional journey and internships.' },
                        { id: 'skills', label: 'Tech Stack', icon: Cpu, desc: 'Languages, frameworks, and tools.' },
                        { id: 'projects', label: 'Case Studies', icon: Layers, desc: 'Detailed engineering projects.' },
                        { id: 'achievements', label: 'Achievements', icon: Trophy, desc: 'Hackathons and competitions.' },
                        { id: 'playground', label: 'API Playground', icon: Play, desc: 'Interactive API testing.' },
                        { id: 'blog', label: 'Engineering Blog', icon: BookOpen, desc: 'Articles on system design and AI.' },
                        { id: 'education', label: 'Education', icon: GraduationCap, desc: 'Academic background and metrics.' },
                        { id: 'contact', label: 'Get In Touch', icon: Mail, desc: 'Hire me or collaborate.' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleNavClick(item.id)}
                          className="p-6 bg-zinc-900/30 border border-zinc-800 rounded-2xl text-left hover:border-emerald-500/50 transition-all group"
                        >
                          <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-500 border border-emerald-500/20 mb-4 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                            <item.icon size={20} />
                          </div>
                          <h3 className="text-lg font-bold text-zinc-100 mb-2">{item.label}</h3>
                          <p className="text-sm text-zinc-500 leading-relaxed">{item.desc}</p>
                          <div className="mt-4 flex items-center gap-2 text-xs font-mono text-emerald-500 opacity-0 group-hover:opacity-100 transition-all">
                            EXPLORE <ArrowRight size={12} />
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {activeSection === 'experience' && (
                  <section id="experience">
                    <SectionHeader title="Professional Experience" icon={Briefcase} />
                    <div className="space-y-8">
                      {[
                        { year: '2026', title: 'Java Developer Intern', org: 'Pratinik Infotech', desc: 'Built RESTful services for attendance modules.' },
                        { year: '2025', title: 'Freelance Backend Lead', org: 'YatraSathi ERP', desc: 'Architected ERP for 50K+ monthly bookings.' },
                        { year: '2024', title: 'Started B.Tech CSE', org: 'VIPS, GGSIPU', desc: 'Academic focus on Data Structures and Algorithms.' },
                        { year: '2021', title: 'ATL Marathon Global Top 75', org: 'NITI Aayog', desc: 'Innovation award for smart city solutions.' }
                      ].map((item, idx) => (
                        <div key={idx} className="flex gap-6 group">
                          <div className="w-16 shrink-0 font-mono text-emerald-500 font-bold">{item.year}</div>
                          <div className="relative pb-8 border-l border-zinc-800 pl-6">
                            <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-zinc-800 rounded-full group-hover:bg-emerald-500 transition-colors"></div>
                            <h3 className="text-zinc-100 font-bold">{item.title}</h3>
                            <p className="text-sm text-zinc-500 mb-2">{item.org}</p>
                            <p className="text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-12">
                      <button onClick={() => handleNavClick('home')} className="text-xs font-mono text-zinc-500 hover:text-emerald-500 flex items-center gap-2">
                        <ArrowRight size={14} className="rotate-180" /> BACK TO DASHBOARD
                      </button>
                    </div>
                  </section>
                )}

                {activeSection === 'skills' && (
                  <section id="skills">
                    <SectionHeader title="Tech Stack" icon={Cpu} />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                      {[
                        { category: "Languages", icon: Terminal, skills: ["Java", "JavaScript", "TypeScript", "Python"] },
                        { category: "Backend", icon: Server, skills: ["Spring Boot", "Node.js", "Express.js", "REST APIs"] },
                        { category: "Infrastructure", icon: Cloud, skills: ["AWS", "Docker", "OAuth 2.0", "JWT"] },
                        { category: "Databases", icon: Database, skills: ["MySQL", "MongoDB", "Firebase"] },
                        { category: "Frontend", icon: Layers, skills: ["React.js", "React Native", "Tailwind CSS"] },
                        { category: "Problem Solving", icon: Code2, skills: ["DSA", "System Design", "Unit Testing"] }
                      ].map((group, idx) => (
                        <motion.div 
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.1 }}
                          className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-all group"
                        >
                          <div className="flex items-center gap-3 mb-4">
                            <group.icon size={18} className="text-emerald-500/70 group-hover:text-emerald-500 transition-colors" />
                            <h3 className="font-mono font-bold text-zinc-200 uppercase text-sm tracking-wider">{group.category}</h3>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {group.skills.map(skill => <SkillBadge key={skill} name={skill} />)}
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Technical Skills Deep-Dive */}
                    <div className="p-8 bg-zinc-900/20 border border-zinc-800/50 rounded-2xl">
                      <h3 className="text-xs font-mono text-emerald-500 uppercase tracking-widest mb-8 flex items-center gap-2">
                        <Zap size={14} /> Specialized Expertise
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                          { label: 'Java Ecosystem', skills: ['Spring Boot Security', 'JPA/Hibernate', 'JUnit/Mockito'] },
                          { label: 'API Design', skills: ['RESTful Patterns', 'GraphQL', 'Swagger/OpenAPI'] },
                          { label: 'Data Layers', skills: ['Redis Caching', 'Query Optimization', 'Neo4j Graph'] },
                          { label: 'DevOps', skills: ['Docker Compose', 'GitHub Actions', 'AWS EC2/S3'] }
                        ].map(group => (
                          <div key={group.label}>
                            <h4 className="text-[10px] font-mono text-zinc-500 uppercase mb-3">{group.label}</h4>
                            <ul className="space-y-2">
                              {group.skills.map(s => (
                                <li key={s} className="text-xs text-zinc-400 flex items-center gap-2">
                                  <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
                                  {s}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-12">
                      <button onClick={() => handleNavClick('home')} className="text-xs font-mono text-zinc-500 hover:text-emerald-500 flex items-center gap-2">
                        <ArrowRight size={14} className="rotate-180" /> BACK TO DASHBOARD
                      </button>
                    </div>
                  </section>
                )}

                {activeSection === 'featured' && (
                  <section id="featured">
                    <SectionHeader title="Featured: YatraSathi ERP" icon={Zap} />
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                {/* Case Study Card */}
                <div className="lg:col-span-2 p-8 bg-zinc-900/30 border border-zinc-800 rounded-2xl">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-500 text-[10px] font-mono uppercase">Case Study</div>
                    <h3 className="text-2xl font-bold text-zinc-100">Solving Travel Agency Scalability</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                      <h4 className="text-xs font-mono text-emerald-500 uppercase tracking-widest mb-3">Role: Full-Stack Developer (Freelancer)</h4>
                      <p className="text-sm text-zinc-400 leading-relaxed">
                        Travel agency operations were manual, slow, and prone to audit inconsistencies. Handling 50K+ monthly bookings required a robust, multi-user concurrent system.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs font-mono text-emerald-500 uppercase tracking-widest mb-3">Responsibilities</h4>
                      <ul className="text-sm text-zinc-400 space-y-1">
                        <li>• Designed backend APIs & Database schema</li>
                        <li>• Optimized MySQL queries for high load</li>
                        <li>• Implemented OAuth authentication</li>
                        <li>• Developed React UI with keyboard navigation</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-zinc-800 grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-zinc-100">50K+</div>
                      <div className="text-[10px] font-mono text-zinc-500 uppercase">Monthly Bookings</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-zinc-100">100+</div>
                      <div className="text-[10px] font-mono text-zinc-500 uppercase">Active Users</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-zinc-100">₹3L</div>
                      <div className="text-[10px] font-mono text-zinc-500 uppercase">Contract Value</div>
                    </div>
                  </div>
                  <div className="mt-6 flex gap-4">
                    <a href="https://github.com/Priyanshu3649/YatraSathi2" target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-emerald-500 flex items-center gap-2 hover:underline">
                      <Github size={14} /> REPO
                    </a>
                  </div>
                </div>

                {/* Telemetry Dashboard */}
                <div className="p-6 bg-zinc-900/30 border border-zinc-800 rounded-2xl">
                  <h4 className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Activity size={14} /> System Telemetry
                  </h4>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={telemetryData}>
                        <defs>
                          <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                        <XAxis dataKey="name" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                          itemStyle={{ color: '#10b981', fontSize: '12px' }}
                        />
                        <Area type="monotone" dataKey="bookings" stroke="#10b981" fillOpacity={1} fill="url(#colorBookings)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-zinc-500">API LATENCY</span>
                      <span className="text-emerald-500">42ms</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-zinc-500">DB UPTIME</span>
                      <span className="text-emerald-500">99.9%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Architecture Visualizer */}
              <div className="p-8 bg-zinc-900/30 border border-zinc-800 rounded-2xl mb-16">
                <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-12 text-center">Interactive System Architecture</h3>
                <div className="flex flex-col md:flex-row items-center justify-center gap-8 relative">
                  {[
                    { id: 'fe', label: 'Frontend', desc: 'React.js SPA with Tailwind CSS. Keyboard-first UI for rapid data entry.' },
                    { id: 'gw', label: 'API Gateway', desc: 'Spring Cloud Gateway handling routing and rate limiting.' },
                    { id: 'be', label: 'Spring Boot', desc: 'Core business logic. 25+ REST endpoints. Multi-threaded processing.' },
                    { id: 'db', label: 'MySQL', desc: 'Normalized schema. Optimized indexes for booking_id and user_id.' },
                    { id: 'cloud', label: 'AWS', desc: 'Containerized deployment with Docker. Auto-scaling enabled.' }
                  ].map((node, i, arr) => (
                    <React.Fragment key={node.id}>
                      <button 
                        onClick={() => setArchNode(node.id)}
                        className={`relative z-10 p-4 border rounded-xl font-mono text-xs transition-all ${
                          archNode === node.id ? 'bg-emerald-500 border-emerald-500 text-black' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600'
                        }`}
                      >
                        {node.label}
                      </button>
                      {i < arr.length - 1 && (
                        <div className="hidden md:block w-8 h-px bg-zinc-800"></div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
                
                <AnimatePresence mode="wait">
                  {archNode && (
                    <motion.div 
                      key={archNode}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="mt-12 p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-xl max-w-xl mx-auto text-center"
                    >
                      <h4 className="font-bold text-emerald-500 mb-2">{archNode.toUpperCase()}</h4>
                      <p className="text-sm text-zinc-400">
                        {[
                          { id: 'fe', desc: 'React.js SPA with Tailwind CSS. Keyboard-first UI for rapid data entry.' },
                          { id: 'gw', desc: 'Spring Cloud Gateway handling routing and rate limiting.' },
                          { id: 'be', desc: 'Core business logic. 25+ REST endpoints. Multi-threaded processing.' },
                          { id: 'db', desc: 'MySQL: Normalized schema. Optimized indexes for booking_id and user_id. Pagination enabled.' },
                          { id: 'cloud', desc: 'AWS: Containerized deployment with Docker. Secure VPC environment.' }
                        ].find(n => n.id === archNode)?.desc}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Featured: Truth AI */}
              <div className="mt-32">
                <SectionHeader title="Featured: Truth AI" icon={Trophy} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                  <div className="p-8 bg-zinc-900/30 border border-zinc-800 rounded-2xl">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-500 text-[10px] font-mono uppercase">Hackathon Project</div>
                      <h3 className="text-2xl font-bold text-zinc-100">AI-Powered Misinformation Shield</h3>
                    </div>
                    <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                      TruthAI is a multi-modal, community-driven misinformation shield that detects and verifies across text, images, videos, memes, and audio.
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-sm text-zinc-300">
                        <CheckCircle2 size={16} className="text-emerald-500" /> Multi-Modal Fact-Checking
                      </div>
                      <div className="flex items-center gap-3 text-sm text-zinc-300">
                        <CheckCircle2 size={16} className="text-emerald-500" /> Blockchain-backed Global Truth Graph
                      </div>
                      <div className="flex items-center gap-3 text-sm text-zinc-300">
                        <CheckCircle2 size={16} className="text-emerald-500" /> Counterfactual Generator for Education
                      </div>
                    </div>
                    <div className="mt-8 flex gap-4">
                      <a href="https://github.com/Priyanshu3649/Truth_AI" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded text-xs font-mono hover:border-emerald-500 transition-all flex items-center gap-2">
                        <Github size={14} /> REPO
                      </a>
                    </div>
                  </div>

                  <div className="p-8 bg-zinc-900/30 border border-zinc-800 rounded-2xl">
                    <h4 className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-8 text-center">TruthAI Architecture</h4>
                    <div className="flex flex-col items-center gap-4">
                      {[
                        { id: 'fe', label: 'React / Flutter', desc: 'Multi-platform user interface for submission and alerts.' },
                        { id: 'be', label: 'Node.js + Firebase', desc: 'Serverless backend handling orchestration and real-time updates.' },
                        { id: 'ai', label: 'Gemini / Vision API', desc: 'Multi-modal AI engines for text, image, and video analysis.' },
                        { id: 'graph', label: 'Neo4j + Blockchain', desc: 'Knowledge graph for linking claims and blockchain for transparency.' }
                      ].map((node) => (
                        <button 
                          key={node.id}
                          onClick={() => setTruthArchNode(node.id)}
                          className={`w-full p-3 border rounded-lg font-mono text-xs transition-all ${
                            truthArchNode === node.id ? 'bg-emerald-500 border-emerald-500 text-black' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600'
                          }`}
                        >
                          {node.label}
                        </button>
                      ))}
                    </div>
                    <AnimatePresence mode="wait">
                      {truthArchNode && (
                        <motion.div 
                          key={truthArchNode}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="mt-6 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-lg text-center"
                        >
                          <p className="text-xs text-zinc-400">
                            {[
                              { id: 'fe', desc: 'React / Flutter: Multi-platform user interface for submission and alerts.' },
                              { id: 'be', desc: 'Node.js + Firebase: Serverless backend handling orchestration and real-time updates.' },
                              { id: 'ai', desc: 'Gemini / Vision API: Multi-modal AI engines for text, image, and video analysis.' },
                              { id: 'graph', desc: 'Neo4j + Blockchain: Knowledge graph for linking claims and blockchain for transparency.' }
                            ].find(n => n.id === truthArchNode)?.desc}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
              <div className="mt-12">
                <button onClick={() => handleNavClick('home')} className="text-xs font-mono text-zinc-500 hover:text-emerald-500 flex items-center gap-2">
                  <ArrowRight size={14} className="rotate-180" /> BACK TO DASHBOARD
                </button>
              </div>
            </section>
          )}

                {activeSection === 'projects' && (
                  <section id="projects">
                    <SectionHeader title="Engineering Case Studies" icon={Layers} />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projectsData.map((project, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => setSelectedProject(project)}
                    className="p-6 bg-zinc-900/30 border border-zinc-800 rounded-xl hover:border-emerald-500/30 transition-all group flex flex-col cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight size={20} className="text-emerald-500" />
                    </div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="px-2 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-[10px] font-mono text-zinc-500 uppercase">{project.category}</div>
                      <div className="flex gap-3">
                        <Github size={18} className="text-zinc-500" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-zinc-100 mb-2 group-hover:text-emerald-400 transition-colors">{project.title}</h3>
                    <p className="text-sm text-zinc-400 mb-4 flex-grow leading-relaxed line-clamp-2">{project.desc}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {project.tech.slice(0, 3).map(t => (
                        <span key={t} className="text-[10px] font-mono text-zinc-500">#{t}</span>
                      ))}
                      {project.tech.length > 3 && <span className="text-[10px] font-mono text-zinc-600">+{project.tech.length - 3}</span>}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Project Detail Modal */}
              <AnimatePresence>
                {selectedProject && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    onClick={() => setSelectedProject(null)}
                  >
                    <motion.div
                      initial={{ scale: 0.9, y: 20 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0.9, y: 20 }}
                      onClick={(e) => e.stopPropagation()}
                      className="bg-[#09090b] border border-zinc-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto p-8 relative shadow-2xl"
                    >
                      <button 
                        onClick={() => setSelectedProject(null)}
                        className="absolute top-6 right-6 text-zinc-500 hover:text-zinc-100 transition-colors"
                      >
                        <X size={24} />
                      </button>

                      <div className="flex items-center gap-4 mb-6">
                        <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-500 text-[10px] font-mono uppercase tracking-widest">Case Study</div>
                        <h2 className="text-3xl font-bold text-zinc-100">{selectedProject.title}</h2>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                        <div className="space-y-8">
                          <div>
                            <h4 className="text-xs font-mono text-emerald-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                              <Terminal size={14} /> The Problem
                            </h4>
                            <p className="text-zinc-400 leading-relaxed text-sm">{selectedProject.problem}</p>
                          </div>
                          <div>
                            <h4 className="text-xs font-mono text-emerald-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                              <Zap size={14} /> The Approach
                            </h4>
                            <p className="text-zinc-400 leading-relaxed text-sm">{selectedProject.approach}</p>
                          </div>
                        </div>
                        <div className="space-y-8">
                          <div>
                            <h4 className="text-xs font-mono text-emerald-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                              <Settings size={14} /> Engineering Challenges
                            </h4>
                            <p className="text-zinc-400 leading-relaxed text-sm">{selectedProject.challenges}</p>
                          </div>
                          <div>
                            <h4 className="text-xs font-mono text-emerald-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                              <CheckCircle2 size={14} /> Technical Solutions
                            </h4>
                            <p className="text-zinc-400 leading-relaxed text-sm">{selectedProject.solutions}</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-xl mb-8">
                        <h4 className="text-xs font-mono text-emerald-500 uppercase tracking-widest mb-3">Business & Technical Impact</h4>
                        <p className="text-zinc-300 font-medium">{selectedProject.impact}</p>
                      </div>

                      <div className="flex items-center justify-between pt-8 border-t border-zinc-800">
                        <div className="flex flex-wrap gap-2">
                          {selectedProject.tech.map(t => <SkillBadge key={t} name={t} />)}
                        </div>
                        <div className="flex gap-4">
                          <a href={selectedProject.repo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-emerald-500 transition-colors">
                            <Github size={16} /> SOURCE
                          </a>
                          {selectedProject.live && (
                            <a href={selectedProject.live} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-emerald-500 transition-colors">
                              <ExternalLink size={16} /> LIVE DEMO
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="mt-12">
                <button onClick={() => handleNavClick('home')} className="text-xs font-mono text-zinc-500 hover:text-emerald-500 flex items-center gap-2">
                  <ArrowRight size={14} className="rotate-180" /> BACK TO DASHBOARD
                </button>
              </div>
            </section>
          )}

                {activeSection === 'achievements' && (
                  <section id="achievements">
                    <SectionHeader title="Hackathon Journey" icon={Trophy} />
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
                {[
                  { label: 'Participated', val: '30+' },
                  { label: 'Finalist', val: '3' },
                  { label: 'Top 10 Finishes', val: '4+' },
                  { label: 'Podium Finishes', val: '2' },
                  { label: 'Cash Prize Wins', val: '1' }
                ].map(stat => (
                  <div key={stat.label} className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl text-center">
                    <div className="text-2xl font-bold text-emerald-500">{stat.val}</div>
                    <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { title: 'PromptWars (Google)', result: 'Rank 2', context: 'Built advanced prompt pipelines in a high-stakes competition.' },
                  { title: 'Speedathon (DTU)', result: '3rd Position', context: 'Podium finish in a competitive coding marathon.' },
                  { title: 'Hack LLM (NSUT)', result: 'Top 8', context: 'Awarded $100 cash prize for innovative LLM application.' },
                  { title: 'Industry-Solve Ideathon (IIIT Delhi)', result: 'Rank 4', context: 'Recognized for product-a-thon excellence.' },
                  { title: 'Tata Crucible Campus Quiz 2025', result: 'Zonal Winner', context: 'Cluster Finalist (Top 8) in India\'s premier business quiz.' },
                  { title: 'Hack Genesis (Christ University)', result: 'Finalist', context: 'Top finalist in a national level hackathon.' },
                  { title: 'Swasth-a-thon (PCI India)', result: 'Finalist', context: 'Finalist in a health-tech innovation challenge.' },
                  { title: 'TechClasher Hackathon', result: 'Top 50', context: 'Recognized among top participants in a large-scale event.' }
                ].map((ach, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-6 bg-zinc-900/30 border border-zinc-800 rounded-xl group hover:border-emerald-500/30 transition-all"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-zinc-100 font-bold">{ach.title}</h3>
                      <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-500 text-[10px] font-mono uppercase">{ach.result}</span>
                    </div>
                    <p className="text-sm text-zinc-500 leading-relaxed">{ach.context}</p>
                  </motion.div>
                ))}
              </div>
                    <div className="mt-12 space-y-4">
                      <button 
                        onClick={() => handleNavClick('certificates')} 
                        className="w-full py-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/20 rounded-lg transition-all flex items-center justify-center gap-2 font-mono text-sm"
                      >
                        <Award size={16} />
                        VIEW ALL {certificatesData.length} CERTIFICATES
                      </button>
                      <button onClick={() => handleNavClick('home')} className="text-xs font-mono text-zinc-500 hover:text-emerald-500 flex items-center gap-2">
                        <ArrowRight size={14} className="rotate-180" /> BACK TO DASHBOARD
                      </button>
                    </div>
                  </section>
                )}
                {activeSection === 'certificates' && (
                  <section id="certificates">
                    <SectionHeader title="Certificates & Achievements" icon={Award} />
                    
                    {/* Filter Controls */}
                    <div className="mb-8 flex flex-wrap gap-3">
                      {['All', 'Hackathon', 'AI/ML', 'Coding', 'Internship', 'Product', 'XR/VR', 'Robotics', 'Quiz', 'Fintech', 'Competitive Programming'].map(category => (
                        <button
                          key={category}
                          onClick={() => setCertificateFilter(category)}
                          className={`px-4 py-2 rounded-full text-xs font-mono transition-all ${
                            certificateFilter === category 
                              ? 'bg-emerald-500 text-black border-emerald-500' 
                              : 'bg-zinc-900/50 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                          } border`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>

                    {/* Search Bar */}
                    <div className="mb-12 relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                      <input
                        type="text"
                        placeholder="Search certificates..."
                        onChange={(e) => setCertificateFilter(e.target.value || 'All')}
                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
                      />
                    </div>
              
                    {/* Certificates Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {certificatesData
                        .filter(cert => certificateFilter === 'All' || cert.category === certificateFilter)
                        .map((certificate, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            onClick={() => setSelectedCertificate(certificate)}
                            className="group cursor-pointer p-6 bg-zinc-900/30 border border-zinc-800 rounded-2xl hover:border-emerald-500/30 hover:bg-zinc-900/50 transition-all shadow-lg hover:shadow-emerald-500/10"
                          >
                            <div className="aspect-[4/3] mb-4 rounded-xl bg-zinc-800 flex items-center justify-center overflow-hidden border border-zinc-700/50 group-hover:border-emerald-500/30 transition-all relative">
                              <img
                                src={`/Hackathon Certificates/${certificate.file}`}
                                alt={certificate.name}
                                loading="lazy"
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono text-emerald-500 px-2 py-1 bg-emerald-500/10 rounded border border-emerald-500/20">
                                  {certificate.category}
                                </span>
                                <ImageIcon size={14} className="text-zinc-500" />
                              </div>
                              <h3 className="font-bold text-zinc-100 text-sm line-clamp-2 group-hover:text-emerald-400 transition-colors">
                                {certificate.name}
                              </h3>
                              <div className="flex items-center justify-between text-xs text-zinc-500">
                                <span>Certificate</span>
                                <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                              </div>
                            </div>
                          </motion.div>
                        ))}
                    </div>

                    {/* Certificate Count */}
                    <div className="mt-8 text-center">
                      <p className="text-xs font-mono text-zinc-500">
                        Showing {certificatesData.filter(cert => certificateFilter === 'All' || cert.category === certificateFilter).length} of {certificatesData.length} certificates
                      </p>
                    </div>

                    <div className="mt-12">
                      <button onClick={() => handleNavClick('home')} className="text-xs font-mono text-zinc-500 hover:text-emerald-500 flex items-center gap-2">
                        <ArrowRight size={14} className="rotate-180" /> BACK TO DASHBOARD
                      </button>
                    </div>
                  </section>
                )}
                {activeSection === 'playground' && (
                  <section id="playground">
                    <SectionHeader title="API Playground" icon={Play} />
              <div className="p-8 bg-zinc-900/30 border border-zinc-800 rounded-2xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div>
                    <h3 className="text-xl font-bold text-zinc-100 mb-4">Try My Endpoints</h3>
                    <p className="text-sm text-zinc-400 mb-8">
                      I build RESTful APIs that are clean, documented, and secure. Test these simulated endpoints to see the data structures I design.
                    </p>
                    <div className="space-y-4">
                      {[
                        { 
                          method: 'GET', 
                          path: '/api/bookings', 
                          desc: 'Fetch all active bookings',
                          response: {
                            status: "success",
                            data: [
                              { id: "BK-001", customer: "Alice", destination: "Paris" },
                              { id: "BK-002", customer: "Bob", destination: "London" }
                            ]
                          }
                        },
                        { 
                          method: 'POST', 
                          path: '/api/login', 
                          desc: 'Authenticate user & generate JWT',
                          response: {
                            status: "success",
                            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                            expiresIn: 3600
                          }
                        },
                        { 
                          method: 'GET', 
                          path: '/api/users', 
                          desc: 'Get system users list',
                          response: {
                            status: "success",
                            users: [
                              { id: 1, name: "Admin", role: "ROOT" },
                              { id: 2, name: "Staff", role: "USER" }
                            ]
                          }
                        },
                        { 
                          method: 'DELETE', 
                          path: '/api/tickets/{id}', 
                          desc: 'Remove a booking record',
                          response: {
                            status: "success",
                            message: "Ticket deleted successfully"
                          }
                        }
                      ].map(api => (
                        <div 
                          key={api.path} 
                          onClick={() => setSelectedApi(api)}
                          className={`p-4 border rounded-lg flex items-center justify-between group cursor-pointer transition-all ${
                            selectedApi?.path === api.path ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-8 rounded flex items-center justify-center font-mono text-[10px] font-bold border ${
                              api.method === 'GET' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 
                              api.method === 'POST' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
                              api.method === 'PUT' ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' :
                              'bg-red-500/10 border-red-500/30 text-red-400'
                            }`}>
                              {api.method}
                            </div>
                            <div>
                              <div className="text-xs font-mono text-zinc-300">{api.path}</div>
                              <div className="text-[10px] text-zinc-500">{api.desc}</div>
                            </div>
                          </div>
                          <ArrowRight size={14} className={`transition-colors ${selectedApi?.path === api.path ? 'text-emerald-500' : 'text-zinc-600 group-hover:text-emerald-500'}`} />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-black/50 rounded-xl p-6 font-mono text-xs border border-zinc-800 flex flex-col h-full min-h-[400px]">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                      </div>
                      <span className="text-[10px] text-zinc-600 uppercase">Response Preview</span>
                    </div>
                    <div className="flex-grow overflow-auto">
                      <AnimatePresence mode="wait">
                        {selectedApi ? (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            key={selectedApi.path}
                          >
                            <div className="flex items-center gap-2 mb-4 text-emerald-500/70">
                              <span className="px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-[10px]">{selectedApi.method}</span>
                              <span className="text-zinc-400">{selectedApi.path}</span>
                            </div>
                            <pre className="text-emerald-400/90 leading-relaxed overflow-x-auto">
                              {JSON.stringify(selectedApi.response, null, 2)}
                            </pre>
                          </motion.div>
                        ) : (
                          <div className="h-full flex flex-col items-center justify-center text-zinc-600 italic py-12">
                            <Activity size={32} className="mb-4 opacity-20" />
                            <p>Select an endpoint to see the response</p>
                          </div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-12">
                <button onClick={() => handleNavClick('home')} className="text-xs font-mono text-zinc-500 hover:text-emerald-500 flex items-center gap-2">
                  <ArrowRight size={14} className="rotate-180" /> BACK TO DASHBOARD
                </button>
              </div>
            </section>
          )}

                {activeSection === 'blog' && (
                  <section id="blog">
                    <SectionHeader title="Engineering Blog" icon={BookOpen} />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {blogPosts.map((post, idx) => (
                  <motion.div 
                    key={idx}
                    whileHover={{ y: -5 }}
                    className="p-6 bg-zinc-900/30 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-all flex flex-col"
                  >
                    <div className="flex justify-between text-[10px] font-mono text-zinc-500 mb-4">
                      <span>{post.date}</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="text-lg font-bold text-zinc-100 mb-3 leading-tight group-hover:text-emerald-400">{post.title}</h3>
                    <p className="text-sm text-zinc-400 mb-6 flex-grow">{post.excerpt}</p>
                    <button className="text-xs font-mono text-emerald-500 flex items-center gap-2 hover:gap-3 transition-all">
                      READ ARTICLE <ArrowRight size={14} />
                    </button>
                  </motion.div>
                ))}
              </div>
              <div className="mt-12">
                <button onClick={() => handleNavClick('home')} className="text-xs font-mono text-zinc-500 hover:text-emerald-500 flex items-center gap-2">
                  <ArrowRight size={14} className="rotate-180" /> BACK TO DASHBOARD
                </button>
              </div>
            </section>
          )}

                {activeSection === 'education' && (
                  <>
                    <section id="education">
                      <SectionHeader title="Education" icon={GraduationCap} />
                      <div className="p-8 bg-zinc-900/30 border border-zinc-800 rounded-2xl">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                          <div>
                            <h3 className="text-xl font-bold text-zinc-100">B.Tech in Computer Science</h3>
                            <p className="text-zinc-400">Vivekananda Institute of Professional Studies (VIPS), GGSIPU</p>
                          </div>
                          <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-500 font-mono">
                            2024 — 2028
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-4">
                          <div className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded text-xs font-mono text-zinc-400">
                            CGPA: 8.78
                          </div>
                          <div className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded text-xs font-mono text-zinc-400">
                            Major: Software Engineering
                          </div>
                        </div>
                      </div>
                    </section>
                    <section className="mb-32">
                      <SectionHeader title="GitHub Activity" icon={Github} />
              <div className="p-8 bg-zinc-900/30 border border-zinc-800 rounded-2xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  <div className="lg:col-span-1">
                    <h3 className="text-xl font-bold text-zinc-100 mb-4">Continuous Contribution</h3>
                    <p className="text-sm text-zinc-400 mb-8">
                      I maintain a consistent coding streak, focusing on backend architecture and open-source contributions.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: 'Total Commits', val: '1,240+' },
                        { label: 'Repositories', val: githubStats?.public_repos || '24' },
                        { label: 'Languages Used', val: githubStats?.languages?.length || '6' },
                        { 
                          label: 'Contribution Streak', 
                          val: '42 Days',
                          tooltip: 'Calculated based on daily contributions from Feb 1 to Mar 11, 2026.'
                        }
                      ].map(stat => (
                        <div key={stat.label} className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl relative group/stat">
                          <div className="text-xl font-bold text-emerald-500">{stat.val}</div>
                          <div className="text-[10px] font-mono text-zinc-500 uppercase flex items-center gap-1">
                            {stat.label}
                            {stat.tooltip && (
                              <div className="relative">
                                <Activity size={10} className="text-zinc-600 cursor-help" />
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-zinc-800 border border-zinc-700 rounded text-[10px] text-zinc-300 opacity-0 group-hover/stat:opacity-100 transition-opacity pointer-events-none z-20 shadow-xl">
                                  {stat.tooltip}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="lg:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Contribution Heatmap</h4>
                      <div className="flex gap-1">
                        {[0, 1, 2, 3, 4].map(v => (
                          <div key={v} className={`w-3 h-3 rounded-sm ${
                            v === 0 ? 'bg-zinc-800' : 
                            v === 1 ? 'bg-emerald-900' : 
                            v === 2 ? 'bg-emerald-700' : 
                            v === 3 ? 'bg-emerald-500' : 'bg-emerald-300'
                          }`}></div>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-12 md:grid-cols-24 gap-1">
                      {Array.from({ length: 120 }).map((_, i) => {
                        const intensity = Math.floor(Math.random() * 5);
                        return (
                          <motion.div 
                            key={i} 
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.005 }}
                            className={`aspect-square rounded-sm transition-all hover:scale-125 cursor-pointer ${
                              intensity === 0 ? 'bg-zinc-900' : 
                              intensity === 1 ? 'bg-emerald-900/40' : 
                              intensity === 2 ? 'bg-emerald-700/60' : 
                              intensity === 3 ? 'bg-emerald-500/80' : 'bg-emerald-400'
                            }`}
                          ></motion.div>
                        );
                      })}
                    </div>
                    <div className="mt-6 flex flex-wrap gap-4">
                      {(githubStats?.languages || ['Java', 'TypeScript', 'Python', 'Go', 'C++', 'SQL']).map(lang => (
                        <div key={lang} className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            lang === 'Java' ? 'bg-orange-500' : 
                            lang === 'TypeScript' ? 'bg-blue-500' : 
                            lang === 'Python' ? 'bg-yellow-500' : 
                            lang === 'Go' ? 'bg-cyan-500' : 
                            lang === 'C++' ? 'bg-pink-500' : 'bg-emerald-500'
                          }`}></div>
                          <span className="text-[10px] font-mono text-zinc-400 uppercase">{lang}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-12">
                <button onClick={() => handleNavClick('home')} className="text-xs font-mono text-zinc-500 hover:text-emerald-500 flex items-center gap-2">
                  <ArrowRight size={14} className="rotate-180" /> BACK TO DASHBOARD
                </button>
              </div>
            </section>
          </>
        )}

                {activeSection === 'skills' && (
                  <>
                    {/* Problem Solving Section */}
                    <section id="problem-solving" className="mb-32">
                      <SectionHeader title="Coding & Algorithms" icon={Code2} />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-8 bg-zinc-900/30 border border-zinc-800 rounded-2xl">
                          <h3 className="text-xl font-bold text-zinc-100 mb-6">DSA Mastery</h3>
                          <div className="grid grid-cols-2 gap-4 mb-8">
                            {['Arrays & Strings', 'Linked Lists', 'Trees & Graphs', 'Dynamic Programming', 'Recursion', 'Sorting & Searching'].map(topic => (
                              <div key={topic} className="flex items-center gap-2 text-sm text-zinc-400">
                                <CheckCircle2 size={14} className="text-emerald-500" /> {topic}
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-4">
                            <a href="#" className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded text-[10px] font-mono hover:border-emerald-500 transition-all">LEETCODE</a>
                            <a href="#" className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded text-[10px] font-mono hover:border-emerald-500 transition-all">CODECHEF</a>
                          </div>
                        </div>
                        <div className="p-8 bg-zinc-900/30 border border-zinc-800 rounded-2xl flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-4xl font-bold text-emerald-500 mb-2">500+</div>
                            <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Problems Solved</div>
                          </div>
                        </div>
                      </div>
                    </section>
                  </>
                )}

                {activeSection === 'projects' && (
                  <section id="build-with-me" className="mb-32">
                    <SectionHeader title="Build With Me" icon={Settings} />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="p-8 bg-zinc-900/30 border border-zinc-800 rounded-2xl">
                        <h3 className="text-xl font-bold text-zinc-100 mb-6">Replicate YatraSathi Locally</h3>
                        <div className="space-y-6">
                          {[
                            { step: '01', title: 'Clone Repository', cmd: 'git clone https://github.com/Priyanshu3649/YatraSathi2.git' },
                            { step: '02', title: 'Setup Infrastructure', cmd: 'docker-compose up -d # Starts MySQL & Redis' },
                            { step: '03', title: 'Configure Environment', cmd: 'cp .env.example .env # Add your DB credentials' },
                            { step: '04', title: 'Start Backend', cmd: './mvnw spring-boot:run' }
                          ].map(item => (
                            <div key={item.step} className="flex gap-6">
                              <div className="text-2xl font-bold text-zinc-800 font-mono">{item.step}</div>
                              <div className="flex-grow">
                                <h4 className="text-zinc-100 font-bold mb-2">{item.title}</h4>
                                <div className="p-3 bg-black/50 rounded border border-zinc-800 font-mono text-xs text-emerald-500/80">
                                  {item.cmd}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="p-8 bg-zinc-900/30 border border-zinc-800 rounded-2xl">
                        <h3 className="text-xl font-bold text-zinc-100 mb-6">Setup Truth AI</h3>
                        <div className="space-y-6">
                          {[
                            { step: '01', title: 'Clone Repo', cmd: 'git clone https://github.com/Priyanshu3649/Truth_AI.git' },
                            { step: '02', title: 'Install Deps', cmd: 'npm install' },
                            { step: '03', title: 'Set API Keys', cmd: 'VITE_GEMINI_KEY=your_key' },
                            { step: '04', title: 'Run App', cmd: 'npm run dev' }
                          ].map(item => (
                            <div key={item.step} className="flex gap-6">
                              <div className="text-2xl font-bold text-zinc-800 font-mono">{item.step}</div>
                              <div className="flex-grow">
                                <h4 className="text-zinc-100 font-bold mb-2">{item.title}</h4>
                                <div className="p-3 bg-black/50 rounded border border-zinc-800 font-mono text-xs text-emerald-500/80">
                                  {item.cmd}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                {activeSection === 'contact' && (
                  <section id="contact">
                    <SectionHeader title="Get In Touch" icon={Mail} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div>
                        <p className="text-lg text-zinc-400 mb-8 leading-relaxed">
                          I'm currently looking for new opportunities and collaborations. 
                          Whether you have a question or just want to say hi, I'll try my best to get back to you!
                        </p>
                        <div className="space-y-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-zinc-900 rounded-lg flex items-center justify-center text-emerald-500 border border-zinc-800">
                              <Mail size={20} />
                            </div>
                            <div>
                              <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Email</p>
                              <a href="mailto:pandeypriyanshu53@gmail.com" className="text-zinc-200 hover:text-emerald-500 transition-colors">pandeypriyanshu53@gmail.com</a>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-zinc-900 rounded-lg flex items-center justify-center text-emerald-500 border border-zinc-800">
                              <Phone size={20} />
                            </div>
                            <div>
                              <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Phone</p>
                              <a href="tel:+919313686893" className="text-zinc-200 hover:text-emerald-500 transition-colors">+91 9313686893</a>
                            </div>
                          </div>
                        </div>
                      </div>

                      <form onSubmit={handleContactSubmit} className="space-y-8">
                        {/* Section 1: Contact Info */}
                        <div className="space-y-4">
                          <h4 className="text-xs font-mono text-emerald-500 uppercase tracking-widest">Section 1 — Contact Info</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-mono text-zinc-500 uppercase">Name</label>
                              <input required name="name" type="text" value={formState.name} onChange={handleInputChange} placeholder="John Doe" className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded focus:outline-none focus:border-emerald-500/50 text-zinc-200 text-sm" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-mono text-zinc-500 uppercase">Email</label>
                              <input required name="email" type="email" value={formState.email} onChange={handleInputChange} placeholder="john@example.com" className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded focus:outline-none focus:border-emerald-500/50 text-zinc-200 text-sm" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-mono text-zinc-500 uppercase">Company / Organization</label>
                              <input name="company" type="text" value={formState.company} onChange={handleInputChange} placeholder="Acme Inc." className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded focus:outline-none focus:border-emerald-500/50 text-zinc-200 text-sm" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-mono text-zinc-500 uppercase">Role / Position</label>
                              <input name="role" type="text" value={formState.role} onChange={handleInputChange} placeholder="CTO / Founder" className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded focus:outline-none focus:border-emerald-500/50 text-zinc-200 text-sm" />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                              <label className="text-[10px] font-mono text-zinc-500 uppercase">LinkedIn Profile</label>
                              <input name="linkedin" type="url" value={formState.linkedin} onChange={handleInputChange} placeholder="https://linkedin.com/in/..." className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded focus:outline-none focus:border-emerald-500/50 text-zinc-200 text-sm" />
                            </div>
                          </div>
                        </div>

                        {/* Section 2: Project Details */}
                        <div className="space-y-4">
                          <h4 className="text-xs font-mono text-emerald-500 uppercase tracking-widest">Section 2 — Project Details</h4>
                          <label className="text-[10px] font-mono text-zinc-500 uppercase">What are you looking for?</label>
                          <div className="grid grid-cols-2 gap-2">
                            {['Full-Stack Web App', 'Backend APIs', 'Java / Spring Boot', 'React Frontend', 'ERP / Business Software', 'AI / LLM Integration', 'Automation Tools', 'Other'].map(type => (
                              <label key={type} className="flex items-center gap-2 p-2 bg-zinc-900/30 border border-zinc-800 rounded cursor-pointer hover:border-emerald-500/20 transition-all">
                                <input type="checkbox" name="projectType" value={type} checked={formState.projectType.includes(type)} onChange={handleInputChange} className="accent-emerald-500" />
                                <span className="text-[11px] text-zinc-400">{type}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Section 3: Project Scope */}
                        <div className="space-y-4">
                          <h4 className="text-xs font-mono text-emerald-500 uppercase tracking-widest">Section 3 — Project Scope</h4>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-mono text-zinc-500 uppercase">Project Description</label>
                              <textarea required name="description" rows={3} value={formState.description} onChange={handleInputChange} placeholder="Briefly describe your project..." className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded focus:outline-none focus:border-emerald-500/50 text-zinc-200 text-sm resize-none"></textarea>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-[10px] font-mono text-zinc-500 uppercase">Expected Timeline</label>
                                <input name="timeline" type="text" value={formState.timeline} onChange={handleInputChange} placeholder="e.g. 2 months" className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded focus:outline-none focus:border-emerald-500/50 text-zinc-200 text-sm" />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] font-mono text-zinc-500 uppercase">Budget Range</label>
                                <select name="budget" value={formState.budget} onChange={handleInputChange} className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded focus:outline-none focus:border-emerald-500/50 text-zinc-200 text-sm">
                                  <option value="">Select Range</option>
                                  <option value="₹10K–₹25K">₹10K–₹25K</option>
                                  <option value="₹25K–₹50K">₹25K–₹50K</option>
                                  <option value="₹50K–₹1L">₹50K–₹1L</option>
                                  <option value="₹1L+">₹1L+</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Section 4: Technical Requirements */}
                        <div className="space-y-4">
                          <h4 className="text-xs font-mono text-emerald-500 uppercase tracking-widest">Section 4 — Technical Requirements</h4>
                          <label className="text-[10px] font-mono text-zinc-500 uppercase">Required Technologies</label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {['Java / Spring Boot', 'React', 'Node', 'Python', 'MySQL', 'AWS', 'AI / LLM'].map(t => (
                              <label key={t} className="flex items-center gap-2 p-2 bg-zinc-900/30 border border-zinc-800 rounded cursor-pointer hover:border-emerald-500/20 transition-all">
                                <input type="checkbox" name="tech" value={t} checked={formState.tech.includes(t)} onChange={handleInputChange} className="accent-emerald-500" />
                                <span className="text-[11px] text-zinc-400">{t}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Section 5: Final */}
                        <div className="space-y-4">
                          <h4 className="text-xs font-mono text-emerald-500 uppercase tracking-widest">Section 5 — Final</h4>
                          <div className="space-y-2">
                            <label className="text-[10px] font-mono text-zinc-500 uppercase">Preferred Communication</label>
                            <div className="flex flex-wrap gap-2">
                              {['Email', 'WhatsApp', 'Google Meet', 'Discord'].map(method => (
                                <button key={method} type="button" onClick={() => setFormState(prev => ({ ...prev, communication: method }))} className={`px-4 py-2 rounded text-[11px] font-mono transition-all ${formState.communication === method ? 'bg-emerald-500 text-black' : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}>
                                  {method}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        <button 
                          type="submit"
                          disabled={isSubmitting || !!formErrors.name || !!formErrors.email || !!formErrors.description}
                          className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {isSubmitting ? (
                            <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                          ) : submitted ? (
                            "INQUIRY SENT!"
                          ) : (
                            "SUBMIT INQUIRY"
                          )}
                        </button>
                      </form>
                    </div>
                    <div className="mt-12">
                      <button onClick={() => handleNavClick('home')} className="text-xs font-mono text-zinc-500 hover:text-emerald-500 flex items-center gap-2">
                        <ArrowRight size={14} className="rotate-180" /> BACK TO DASHBOARD
                      </button>
                    </div>
                  </section>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* Footer */}
        <footer className="pt-20 border-t border-zinc-800/50 text-center relative overflow-hidden">
          {/* Decorative gradient line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent"></div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-8">
              Let's build something <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600 italic font-serif">robust</span>.
            </h2>
          </motion.div>
          
          <motion.div 
            className="flex justify-center gap-6 md:gap-8 mb-12"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {[
              { icon: Mail, href: "mailto:pandeypriyanshu53@gmail.com", label: "Email" },
              { icon: Phone, href: "tel:+919313686893", label: "Phone" },
              { icon: Github, href: "https://github.com/Priyanshu3649", label: "GitHub" },
              { icon: Linkedin, href: "https://linkedin.com/in/priyanshu-pandey-0882a21b2", label: "LinkedIn" }
            ].map((item, index) => (
              <motion.a
                key={index}
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all hover:scale-110 touch-target"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label={item.label}
              >
                <item.icon size={24} className="text-zinc-500 group-hover:text-emerald-400 transition-colors" />
              </motion.a>
            ))}
          </motion.div>
          
          <motion.p 
            className="text-xs font-mono text-zinc-600 uppercase tracking-[0.3em]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            © 2026 PRIYANSHU PANDEY • DESIGNED FOR PERFORMANCE
          </motion.p>
        </footer>
      </main>

      {/* AI Assistant Floating Widget */}
      <div className="fixed bottom-6 right-6 z-[60] md:bottom-8 md:right-8">
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="absolute bottom-20 right-0 w-[calc(100vw-3rem)] sm:w-96 h-[60vh] sm:h-96 bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="p-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-black font-bold flex justify-between items-center border-b border-emerald-400/20">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span className="text-xs font-mono">PRIYANSHU.AI</span>
                </div>
                <button 
                  onClick={() => setIsChatOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors touch-target"
                  aria-label="Close chat"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="flex-grow p-4 overflow-y-auto space-y-4 text-sm scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                {chatMessages.map((msg, i) => (
                  <motion.div 
                    key={i} 
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={`max-w-[85%] p-3 rounded-2xl ${
                      msg.role === 'user' 
                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-black rounded-tr-none shadow-lg shadow-emerald-500/20' 
                        : 'bg-zinc-800 text-zinc-300 rounded-tl-none border border-zinc-700'
                    }`}>
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <motion.div 
                    className="flex justify-start"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="bg-zinc-800 p-3 rounded-2xl rounded-tl-none border border-zinc-700 animate-pulse flex gap-1">
                      <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </motion.div>
                )}
              </div>
              <form onSubmit={handleChatSubmit} className="p-4 border-t border-zinc-800 flex gap-2 bg-zinc-900/50">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-grow bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-zinc-600"
                />
                <motion.button 
                  type="submit" 
                  className="p-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-black rounded-xl touch-target flex-shrink-0"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Send message"
                >
                  <ArrowRight size={18} />
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 text-black rounded-full shadow-2xl shadow-emerald-500/30 flex items-center justify-center hover:scale-110 transition-transform touch-target border-4 border-zinc-900"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Toggle chat"
        >
          {isChatOpen ? <X size={24} /> : <MessageSquare size={24} />}
        </motion.button>
      </div>

      {/* Developer Mode Easter Egg Overlay */}
      <AnimatePresence>
        {isDevMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-2xl bg-zinc-900 border border-emerald-500/30 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.1)]">
              <div className="p-3 bg-zinc-800 border-b border-zinc-700 flex justify-between items-center">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                </div>
                <span className="text-[10px] font-mono text-emerald-500 animate-pulse">DEVELOPER MODE ACTIVATED</span>
                <button onClick={() => setIsDevMode(false)} className="text-zinc-500 hover:text-zinc-300"><X size={16} /></button>
              </div>
              <div className="h-80 p-6 font-mono text-xs overflow-y-auto space-y-2 text-emerald-500/80">
                {devLogs.map((log, i) => <div key={i}>{log}</div>)}
                <form onSubmit={handleDevCommand} className="flex gap-2 pt-4">
                  <span>{'>'}</span>
                  <input 
                    autoFocus
                    type="text" 
                    value={devInput}
                    onChange={(e) => setDevInput(e.target.value)}
                    className="bg-transparent border-none outline-none flex-grow text-emerald-400"
                  />
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Certificate Preview Modal */}
      <AnimatePresence>
        {selectedCertificate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCertificate(null)}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-zinc-800 flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-emerald-500 px-2 py-1 bg-emerald-500/10 rounded border border-emerald-500/20">
                      {selectedCertificate.category}
                    </span>
                    <span className="text-xs font-mono text-zinc-500 flex items-center gap-1">
                      <ImageIcon size={12} />
                      IMAGE
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-zinc-100">{selectedCertificate.name}</h3>
                </div>
                <button 
                  onClick={() => setSelectedCertificate(null)}
                  className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                  title="Close preview"
                  aria-label="Close certificate preview"
                >
                  <X size={20} className="text-zinc-400" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-8">
                <div className="aspect-video bg-zinc-800 rounded-xl overflow-hidden flex items-center justify-center">
                  <img
                    src={`/Hackathon Certificates/${selectedCertificate.file}`}
                    alt={selectedCertificate.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-zinc-800 flex justify-between items-center">
                <p className="text-xs font-mono text-zinc-500">
                  File: {selectedCertificate.file}
                </p>
                <a
                  href={`/Hackathon Certificates/${selectedCertificate.file}`}
                  download
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold rounded-lg transition-all flex items-center gap-2 text-sm"
                >
                  <ExternalLink size={14} />
                  DOWNLOAD IMAGE
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
