import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  PanelLeft,
  Plus,
  Camera,
  Image as ImageIcon,
  X,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Download,
  Smartphone,
} from 'lucide-react';
import { useTheme } from '../ThemeContext';
import { ThemeToggle } from './ThemeToggle';
import { AppLogo } from './AppLogo';
import { HistorySidebar } from './HistorySidebar';
import { PhysicalLogbookCard } from './PhysicalLogbookCard';
import { GenerationLimitBadge } from './GenerationLimitBadge';
import { AppSession, UploadedLogbookImage } from '../types';
import { db, ensureAuthenticated } from '../lib/firebase';
import { collection, doc, setDoc, getDocs, query, orderBy } from 'firebase/firestore';

const INITIAL_SESSIONS: AppSession[] = [
  {
    id: 'session-logbook-1',
    title: 'Day 14 - Front Office Check-ins',
    prompt: 'Operated Opera PMS during afternoon check-in rush, assigned executive rooms, encoded RFID keycards, and resolved billing inquiries.',
    generatedOutput: `### 📅 INTERNSHIP LOGBOOK ENTRY
**Date:** Tuesday, Week 5 | **Department:** Front Office & Guest Services | **Hours:** 07:00 - 15:30 (Morning Shift)

---

#### 1. 📝 DAILY TASKS & ACTIVITIES CONDUCTED
- **Morning Shift Briefing:** Reviewed the VIP arrival manifest, group bookings, and special amenity requests with the Front Office Manager.
- **PMS Check-in Operations:** Processed 18 guest arrivals using Opera PMS, verified guest passports/IDs, authorized credit pre-authorizations, and encoded RFID keycards.
- **Room Allocation Coordination:** Liaised with Executive Housekeeping via two-way radio to expedite room releases for early arrivals.
- **Folio Review & Settlement:** Assisted departing guests with invoice reviews and settled room charges through POS terminal.

---

#### 2. 🔧 TOOLS, EQUIPMENT & TECHNOLOGIES UTILIZED
- Opera Property Management System (PMS), RFID keycard encoder, POS card terminal.
- Multi-line PBX switchboard console, guest registration vouchers.
- Front desk uniform and name badge adhering to 5-star grooming standards.

---

#### 3. ⚠️ CHALLENGES ENCOUNTERED & SOLUTIONS APPLIED
- **Challenge:** A guest arrived early before standard check-in time while their booked category was still marked dirty in PMS.
- **Solution:** Welcomed the guest warmly, safely tagged and stored their luggage at the bell desk, issued a lounge refreshment voucher, and requested priority turnover from housekeeping.

---

#### 4. 🎓 KEY LEARNINGS & PRACTICAL SKILLS ACQUIRED
- Mastered room rate codes, guest profile updating, and professional telephone communication.
- Enhanced patience and active listening skills during peak lobby check-in periods.

---

#### 5. ✍️ SUPERVISOR'S REMARKS (FOR LOGBOOK SIGN-OFF)
*"The intern showed exemplary professional poise, learned the Opera PMS check-in workflow rapidly, and delivered gracious hospitality to all arriving guests."*`,
    timestamp: 'Today',
    date: Date.now() - 3600000,
    department: 'Front Office',
    category: 'Front Office',
  },
  {
    id: 'session-logbook-2',
    title: 'Day 12 - Food Production & HACCP',
    prompt: 'Prepared hot kitchen banquet mise en place, executed poultry prep, and logged walk-in chiller temperatures according to HACCP.',
    generatedOutput: `### 📅 INTERNSHIP LOGBOOK ENTRY
**Date:** Wednesday, Week 4 | **Department:** Food Production (Main Kitchen) | **Hours:** 06:00 - 14:30

---

#### 1. 📝 DAILY TASKS & ACTIVITIES CONDUCTED
- **Kitchen Sanitation & Mise en Place:** Sanitized stainless steel prep counters and sharpened chef knives before morning prep.
- **Culinary Preparation:** Executed uniform vegetable knife cuts (brunoise, julienne, mirepoix) for banquet soups and stocks.
- **Protein Butchery & Portioning:** Assisted Chef de Partie in portioning and marinating chicken breasts following standard recipe portion weights.
- **HACCP Food Safety Audits:** Checked and recorded core temperatures for walk-in chillers (<4°C) and hot-holding bain-marie units (>63°C).

---

#### 2. 🔧 TOOLS, EQUIPMENT & TECHNOLOGIES UTILIZED
- High-carbon German chef's knives, paring knives, honing steel, color-coded chopping boards.
- Rational Combi-steam oven, digital core probe thermometer, industrial planetary mixer.
- Kitchen uniform: Chef jacket, apron, toque/hairnet, non-slip safety shoes.

---

#### 3. ⚠️ CHALLENGES ENCOUNTERED & SOLUTIONS APPLIED
- **Challenge:** Sauce reduction started reducing too quickly and risked burning on high heat.
- **Solution:** Immediately lowered induction heat, transferred liquid through a fine chinois strainer into a clean pan, and kept a controlled gentle simmer.

---

#### 4. 🎓 KEY LEARNINGS & PRACTICAL SKILLS ACQUIRED
- Mastered precision knife techniques and speed on commercial prep lines.
- Solidified understanding of Critical Control Points (CCPs) under HACCP hygiene guidelines.

---

#### 5. ✍️ SUPERVISOR'S REMARKS (FOR LOGBOOK SIGN-OFF)
*"The intern demonstrated strict respect for food hygiene and knife safety, executed banquet prep thoroughly, and supported the kitchen brigade reliably."*`,
    timestamp: 'Yesterday',
    date: Date.now() - 86400000,
    department: 'Food Production',
    category: 'Food Production',
  },
  {
    id: 'session-logbook-3',
    title: 'Day 10 - Barista Station & Espresso Dial-in',
    prompt: 'Calibrated on-demand grinder for medium roast blend (18.5g dose, 38g yield in 27s), textured microfoam for flat whites, and backflushed machine.',
    generatedOutput: `### 📅 INTERNSHIP LOGBOOK ENTRY
**Date:** Thursday, Week 3 | **Department:** Barista & Beverage Operations | **Hours:** 07:30 - 16:00

---

#### 1. 📝 DAILY TASKS & ACTIVITIES CONDUCTED
- **Espresso Grinder Dial-in:** Calibrated grinder burrs for 18.5g dry dose, yielding 38g liquid espresso in 27.5 seconds at 9 bar pressure and 93°C.
- **Beverage Crafting:** Handled morning coffee rushes, preparing specialty flat whites, cappuccinos, and single-origin pour-overs.
- **Milk Texturing:** Steamed dairy and oat milks into silky microfoam (60-65°C), pouring tulip and rosetta latte art patterns.
- **Machine Maintenance:** Performed daily group head backflushing with espresso detergent (Cafiza), purged steam wands, and emptied waste bins.

---

#### 2. 🔧 TOOLS, EQUIPMENT & TECHNOLOGIES UTILIZED
- La Marzocco Linea PB 2-group espresso machine, Mazzer Robur on-demand electronic grinder.
- Precision 58.5mm tamper, distribution needle tool, 0.1g digital scale with shot timer.
- Cafiza detergent, blind filter basket, microfiber steam towels.

---

#### 3. ⚠️ CHALLENGES ENCOUNTERED & SOLUTIONS APPLIED
- **Challenge:** Ambient humidity increased after noon, causing shots to extract too fast (under 20 seconds) with thin crema.
- **Solution:** Adjusted grinder two increments finer, cleared retention grounds, and verified extraction stabilized back to 28 seconds.

---

#### 4. 🎓 KEY LEARNINGS & PRACTICAL SKILLS ACQUIRED
- Understood extraction yield, grind distribution, and channeling diagnosis.
- Gained consistent steam wand positioning for microfoam texturing without coarse bubbles.

---

#### 5. ✍️ SUPERVISOR'S REMARKS (FOR LOGBOOK SIGN-OFF)
*"The intern showed genuine enthusiasm for specialty coffee, dialed in the grinder accurately, and kept the coffee bar spotless."*`,
    timestamp: '3 days ago',
    date: Date.now() - 259200000,
    department: 'Barista',
    category: 'Barista',
  },
  {
    id: 'session-logbook-4',
    title: 'Day 8 - Guided Heritage & City Tour',
    prompt: 'Conducted 3-hour walking heritage tour for 14 international visitors, delivered historical commentary on architectural landmarks, and managed route safety.',
    generatedOutput: `### 📅 INTERNSHIP LOGBOOK ENTRY
**Date:** Friday, Week 2 | **Department:** Tour Guiding & Visitor Services | **Hours:** 08:30 - 17:00

---

#### 1. 📝 DAILY TASKS & ACTIVITIES CONDUCTED
- **Pre-Tour Route Check:** Inspected walking trail routes, cross-checked weather alerts, and verified guest manifests at the visitor welcome center.
- **Guided Interpretation:** Guided 14 tourists on an architectural and cultural heritage tour, presenting engaging narratives about historical sites.
- **Guest Management & Pacing:** Maintained steady walking rhythm, conducted regular headcounts at key intersections, and monitored guest comfort.
- **Post-Tour Debrief:** Gathered visitor review cards, answered questions regarding local transit, and logged tour statistics.

---

#### 2. 🔧 TOOLS, EQUIPMENT & TECHNOLOGIES UTILIZED
- Portable voice amplifier with wireless headset microphone.
- Topographic trail map, visitor registry manifest, group first aid safety kit.
- Official tour guide badge, high-visibility lanyard, all-weather walking footwear.

---

#### 3. ⚠️ CHALLENGES ENCOUNTERED & SOLUTIONS APPLIED
- **Challenge:** Sudden light rain shower occurred along an open heritage square during the tour.
- **Solution:** Promptly relocated the group under the covered colonnade of the municipal museum, continuing the architectural explanation seamlessly while keeping all guests dry.

---

#### 4. 🎓 KEY LEARNINGS & PRACTICAL SKILLS ACQUIRED
- Enhanced voice projection, narrative storytelling, and adaptive time management during outdoor excursions.
- Learned proactive group safety management and emergency response preparedness.

---

#### 5. ✍️ SUPERVISOR'S REMARKS (FOR LOGBOOK SIGN-OFF)
*"The intern communicated with confidence, delivered well-researched and engaging commentary, and cared diligently for visitor comfort and safety."*`,
    timestamp: '5 days ago',
    date: Date.now() - 432000000,
    department: 'Tour Guide',
    category: 'Tour Guide',
  },
];

interface MainIdeaBuilderProps {
  onShowSplash?: () => void;
  onOpenDownloadModal?: () => void;
  onOpenDevStats?: () => void;
}

export const MainIdeaBuilder: React.FC<MainIdeaBuilderProps> = ({
  onShowSplash,
  onOpenDownloadModal,
  onOpenDevStats,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [sessions, setSessions] = useState<AppSession[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('internship_logbook_sessions');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (err) {
        console.error('Failed to parse saved sessions:', err);
      }
    }
    return [];
  });

  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [prompt, setPrompt] = useState<string>('');
  const [department, setDepartment] = useState<string>('');
  const [isViewingSession, setIsViewingSession] = useState<boolean>(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedLogbookImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedEntry, setGeneratedEntry] = useState<string | null>(null);
  const [generationSource, setGenerationSource] = useState<string>('');
  const [remainingGenerations, setRemainingGenerations] = useState<number>(3);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'saving' | 'error'>('synced');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const compressImage = (base64Str: string, maxWidth = 800, maxHeight = 800, quality = 0.65): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(base64Str);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => resolve(base64Str);
    });
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session');

    if (!sessionId) {
      localStorage.removeItem('current_logbook_draft');
      setIsViewingSession(false);
      setDepartment('');
      setPrompt('');
      setActiveSessionId(null);
      setGeneratedEntry(null);
    } else {
      setIsViewingSession(true);
      setActiveSessionId(sessionId);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function loadCloudSessions() {
      try {
        const uid = await ensureAuthenticated();
        const q = query(collection(db, 'users', uid, 'sessions'), orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty && isMounted) {
          const cloudSessions: AppSession[] = [];
          querySnapshot.forEach((docSnap) => {
            cloudSessions.push(docSnap.data() as AppSession);
          });
          if (cloudSessions.length > 0) {
            setSessions(cloudSessions);
          }
        }
      } catch (err) {
        console.error('Error loading sessions from Firebase Firestore:', err);
      }
    }
    loadCloudSessions();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    try {
      const optimizedSessions = sessions.slice(0, 10).map((s, idx) => {
        if (idx > 0 && s.images && s.images.length > 0) {
          return {
            ...s,
            images: s.images.map(img => ({ ...img, base64: '' })),
          };
        }
        return s;
      });
      localStorage.setItem('internship_logbook_sessions', JSON.stringify(optimizedSessions));
    } catch (err: any) {
      console.warn('LocalStorage save warning:', err);
    }

    setSyncStatus('saving');
    const timer = setTimeout(async () => {
      try {
        const uid = await ensureAuthenticated();
        const sessionsToSync = sessions.slice(0, 3);
        for (const s of sessionsToSync) {
          const sessionToSave = {
            ...s,
            images: s.images ? s.images.map(img => ({
              ...img,
              base64: img.base64 && img.base64.length > 200000 ? '' : img.base64
            })) : []
          };
          const sessionRef = doc(db, 'users', uid, 'sessions', s.id);
          await setDoc(sessionRef, sessionToSave, { merge: true });
        }
        setSyncStatus('synced');
      } catch (err: any) {
        if (!navigator.onLine || (err && err.code === 'unavailable')) {
          setSyncStatus('synced');
        } else {
          console.warn('Sync notice:', err?.message || err);
          setSyncStatus('synced');
        }
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [sessions]);

  useEffect(() => {
    const timer = setTimeout(() => {
      textareaRef.current?.focus();
    }, 150);

    async function fetchUsageQuota() {
      try {
        let clientId = localStorage.getItem('logbook_client_id');
        if (!clientId) {
          clientId = `client-${Math.random().toString(36).substring(2)}-${Date.now()}`;
          localStorage.setItem('logbook_client_id', clientId);
        }
        const res = await fetch('/api/usage', {
          headers: { 'x-client-id': clientId },
        });
        const data = await res.json();
        if (data.success && typeof data.remainingGenerations === 'number') {
          setRemainingGenerations(data.remainingGenerations);
        }
      } catch (e) {
        console.warn('Failed to fetch usage quota on mount:', e);
      }
    }
    fetchUsageQuota();

    return () => clearTimeout(timer);
  }, []);

  const handleChipClick = (text: string) => {
    setPrompt(text);
    textareaRef.current?.focus();
  };

  const handleImageFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setErrorMessage(null);

    const newImages: UploadedLogbookImage[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) {
        continue;
      }

      try {
        const rawBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        const compressedBase64 = await compressImage(rawBase64);

        newImages.push({
          id: `img-${Date.now()}-${i}`,
          name: file.name,
          mimeType: 'image/jpeg',
          base64: compressedBase64,
          size: file.size,
        });
      } catch (e) {
        console.error('Error reading/compressing image file:', e);
      }
    }

    if (newImages.length > 0) {
      setUploadedImages((prev) => [...prev, ...newImages]);
    }
  };

  const handleRemoveImage = (id: string) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleGenerateLogbook = async () => {
    if (isGenerating) {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      setIsGenerating(false);
      setErrorMessage('Generation stopped.');
      return;
    }

    if (remainingGenerations <= 0) {
      setErrorMessage('You have reached your daily limit of 3 free logbook entries! Please try again tomorrow.');
      return;
    }

    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt && uploadedImages.length === 0) {
      setErrorMessage('Please type a brief task description or upload a workplace photo.');
      return;
    }

    setErrorMessage(null);
    setIsGenerating(true);
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const liveDateStr = new Date().toLocaleDateString('en-GB', {
        weekday: 'long',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

      const payload = {
        prompt: trimmedPrompt,
        department,
        dayAndDate: liveDateStr,
        images: uploadedImages.map((img) => ({
          mimeType: img.mimeType,
          base64: img.base64,
          name: img.name,
        })),
      };

      let clientId = localStorage.getItem('logbook_client_id');
      if (!clientId) {
        clientId = `client-${Math.random().toString(36).substring(2)}-${Date.now()}`;
        localStorage.setItem('logbook_client_id', clientId);
      }

      const response = await fetch('/api/generate-logbook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': clientId,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      const data = await response.json();

      if (typeof data.remainingGenerations === 'number') {
        setRemainingGenerations(data.remainingGenerations);
      } else {
        setRemainingGenerations((prev) => Math.max(0, prev - 1));
      }

      if (response.status === 429 || !data.success) {
        setRemainingGenerations(0);
        throw new Error(data.error || 'You have reached your daily limit of 3 free logbook entries! Please try again tomorrow.');
      }

      const entryText = data.content;
      setGeneratedEntry(entryText);
      setGenerationSource(data.source || 'gemini-3.8-flash');

      const titleCandidate = trimmedPrompt
        ? trimmedPrompt.length > 32
          ? `${trimmedPrompt.slice(0, 32)}...`
          : trimmedPrompt
        : `Photo Log: ${uploadedImages[0]?.name || 'Site Work'}`;

      if (activeSessionId) {
        setSessions((prev) =>
          prev.map((s) =>
            s.id === activeSessionId
              ? {
                  ...s,
                  title: titleCandidate,
                  prompt: trimmedPrompt || 'Photo-based internship logbook entry',
                  generatedOutput: entryText,
                  timestamp: 'Just now',
                  date: Date.now(),
                  department,
                  images: [...uploadedImages],
                }
              : s
          )
        );
      } else {
        const newSession: AppSession = {
          id: `session-${Date.now()}`,
          title: titleCandidate,
          prompt: trimmedPrompt || 'Photo-based internship logbook entry',
          generatedOutput: entryText,
          timestamp: 'Just now',
          date: Date.now(),
          department,
          images: [...uploadedImages],
          category: department || 'Front Office',
        };
        setSessions((prev) => [newSession, ...prev]);
        setActiveSessionId(newSession.id);
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('Generation aborted by user.');
      } else {
        console.error('Generation error:', err);
        setErrorMessage(err.message || 'Error communicating with Logbook.');
      }
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  };

  const handleSelectSession = (session: AppSession) => {
    setActiveSessionId(session.id);
    setPrompt(session.prompt);
    setGeneratedEntry(session.generatedOutput || null);
    setUploadedImages(session.images || []);
    if (session.department) setDepartment(session.department);
    setIsViewingSession(true);
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleClearView = () => {
    setActiveSessionId(null);
    setGeneratedEntry(null);
    setIsViewingSession(false);
    setDepartment('');
    setPrompt('');
    setUploadedImages([]);
    setErrorMessage(null);
    window.history.replaceState({}, document.title, window.location.pathname);
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
    textareaRef.current?.focus();
  };

  const handleNewSession = () => {
    handleClearView();
  };

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    if (activeSessionId === sessionId) {
      handleNewSession();
    }
  };

  const handleClearAll = () => {
    setSessions([]);
    handleNewSession();
  };

  return (
    <div
      className={`w-full h-[100dvh] flex overflow-hidden select-none font-['Google_Sans','Inter',sans-serif] transition-colors duration-300 ${
        isLight ? 'text-[#1e3a5f]' : 'bg-[#131314] text-[#e3e2e6]'
      }`}
      id="idea-builder-root"
      style={
        isLight
          ? {
              background: 'linear-gradient(180deg, #f8fafc 0%, #edf2f7 50%, #dbe3ed 100%)',
            }
          : undefined
      }
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setIsDragging(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files) {
          handleImageFiles(e.dataTransfer.files);
        }
      }}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleImageFiles(e.target.files)}
        accept="image/*"
        multiple
        className="hidden"
        id="input-file-logbook"
      />
      <input
        type="file"
        ref={cameraInputRef}
        onChange={(e) => handleImageFiles(e.target.files)}
        accept="image/*"
        capture="environment"
        className="hidden"
        id="input-camera-logbook"
      />

      <HistorySidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen((prev) => !prev)}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onNewSession={handleNewSession}
        onDeleteSession={handleDeleteSession}
        onClearAll={handleClearAll}
      />

      <div className="flex-1 h-full flex flex-col justify-between overflow-y-auto p-3 sm:p-4 z-10">
        <header className="flex justify-between items-center py-2 px-1 w-full z-20" id="top-bar-header">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              className={`border-none w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-colors focus:outline-none ${
                isSidebarOpen
                  ? isLight
                    ? 'bg-[#1e3a5f] text-white'
                    : 'bg-[#a8c7fa] text-[#041e49]'
                  : isLight
                  ? 'bg-[#e2eaf2] text-[#1e3a5f] hover:bg-[#d5e2ed]'
                  : 'bg-[#1e1f20] text-[#c4c6d0] hover:bg-[#2a2b2d]'
              }`}
              aria-label="Toggle Logbook History Sidebar"
              title={isSidebarOpen ? 'Collapse history' : 'Open logbook history'}
              id="btn-toggle-history-sidebar"
            >
              <PanelLeft className="w-5 h-5" />
            </button>

            <button
              onClick={handleNewSession}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                isLight
                  ? 'bg-[#e2eaf2] text-[#1e3a5f] hover:bg-[#d5e2ed]'
                  : 'bg-[#1e1f20] text-[#c4c6d0] hover:bg-[#2a2b2d]'
              }`}
              title="Start a new logbook entry"
              id="btn-header-new-session"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Entry</span>
            </button>
          </div>

          <div className="flex items-center gap-3" id="header-center-wrapper">
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border shadow-2xs transition-colors"
              id="smart-auto-save-pill"
              style={
                isLight
                  ? { backgroundColor: '#ffffff', borderColor: '#cbd8e6' }
                  : { backgroundColor: '#1e1f20', borderColor: 'rgba(255,255,255,0.1)' }
              }
            >
              {syncStatus === 'saving' ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  <span className={isLight ? 'text-[#64748b]' : 'text-slate-400'}>Smart Auto-Save: Saving...</span>
                </>
              ) : syncStatus === 'error' ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span className={isLight ? 'text-rose-700' : 'text-rose-400'}>Smart Auto-Save: Offline</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className={isLight ? 'text-[#334155]' : 'text-emerald-300'}>Smart Auto-Save: Synced</span>
                </>
              )}
            </div>
            <ThemeToggle />
          </div>

          <div className="flex items-center gap-2">
            {onOpenDevStats && (
              <button
                onClick={onOpenDevStats}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors border shadow-2xs ${
                  isLight
                    ? 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
                    : 'bg-amber-950/40 border-amber-500/30 text-amber-300 hover:bg-amber-900/40'
                }`}
                title="Developer Stats & Unique Visitor Devices"
                id="btn-dev-stats-header"
              >
                <span>🔐</span>
                <span className="hidden sm:inline">Dev Stats</span>
              </button>
            )}
          </div>
        </header>

        <main className="flex flex-col items-center justify-center text-center my-auto py-2 px-2 sm:px-4" id="hero-center-area">
          <div className="mb-4">
            <AppLogo
              size={72}
              className={isLight ? 'text-[#1e3a5f]' : 'text-[#a8c7fa]'}
              animated={true}
            />
          </div>

          <p
            className={`mt-2 text-xs sm:text-sm max-w-[440px] leading-relaxed transition-colors duration-300 ${
              isLight ? 'text-[#486581]' : 'text-[#9ca3af]'
            }`}
          >
            Upload workplace photos or describe tasks to generate structured, professional entries ready to copy into your physical logbook.
          </p>

          {isViewingSession && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-3 inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-300 shadow-sm"
            >
              <span>Viewing entry from session</span>
              <button onClick={handleClearView} className="hover:bg-emerald-200 rounded-full p-0.5 cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}

          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs bg-rose-500/10 text-rose-500 border border-rose-500/20"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {generatedEntry && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-5 w-full max-w-xl text-left"
            >
              <PhysicalLogbookCard
                content={generatedEntry}
                source={generationSource}
                onClear={handleClearView}
              />
            </motion.div>
          )}
        </main>

        <section className="w-full max-w-[620px] mx-auto flex flex-col gap-3 mb-2 z-10" id="bottom-controls-section">
          <div
            className={`rounded-[24px] p-4 sm:p-5 flex flex-col justify-between min-h-[175px] relative transition-all duration-300 ${
              isDragging
                ? 'ring-2 ring-[#1e3a5f] bg-[#eef5fc]'
                : isLight
                ? 'bg-white border border-[#d5e2ed] shadow-[0_4px_25px_rgba(30,58,95,0.08)] focus-within:border-[#1e3a5f]/50'
                : 'bg-[#1e1f20] border border-white/[0.06] shadow-[0_4px_20px_rgba(0,0,0,0.3)] focus-within:border-[#a8c7fa]/40'
            }`}
            id="prompt-card"
          >
            <div className="mb-3">
              <GenerationLimitBadge remaining={remainingGenerations} isLight={isLight} />
            </div>

            <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-inherit relative">
              <span className={`text-xs font-semibold uppercase tracking-wider ${isLight ? 'text-[#334155]' : 'text-slate-300'}`}>
                Department / Rotation:
              </span>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                disabled={isGenerating}
                className={`text-xs font-medium px-3 py-1.5 rounded-xl border outline-none cursor-pointer transition-colors ${
                  isLight
                    ? 'bg-[#f8fafc] border-[#cbd8e6] text-[#1e3a5f]'
                    : 'bg-[#141517] border-white/15 text-[#a8c7fa]'
                }`}
                id="department-form-select"
              >
                <option value="Front Office">🛎️ Front Office</option>
                <option value="Housekeeping">🧹 Housekeeping</option>
                <option value="Food & Beverage Service">🍽️ F&B Service</option>
                <option value="Food Production">🍳 Food Production</option>
                <option value="Barista">☕ Barista</option>
                <option value="Laundry & Linen">🧺 Laundry & Linen</option>
                <option value="Tour Guide">🗺️ Tour Guide</option>
              </select>
            </div>

            {uploadedImages.length > 0 && (
              <div className="flex flex-wrap gap-2.5 mb-3 pb-2 border-b border-inherit">
                {uploadedImages.map((img) => (
                  <div
                    key={img.id}
                    className={`relative group flex items-center gap-2 p-1.5 pr-2.5 rounded-xl text-xs border ${
                      isLight
                        ? 'bg-[#f1f5f9] border-[#cbd5e1] text-[#1e293b]'
                        : 'bg-white/10 border-white/10 text-white'
                    }`}
                  >
                    {img.base64 && (
                      <img
                        src={img.base64}
                        alt={img.name}
                        className="w-8 h-8 rounded-lg object-cover"
                      />
                    )}
                    <span className="max-w-[130px] truncate font-medium">{img.name}</span>
                    <button
                      onClick={() => handleRemoveImage(img.id)}
                      className="p-1 rounded-full hover:bg-black/20 transition-colors cursor-pointer text-rose-500"
                      title="Remove photo"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleGenerateLogbook();
                }
              }}
              disabled={isGenerating}
              className={`bg-transparent border-none outline-none text-[0.98rem] resize-none w-full h-[85px] leading-[1.5] transition-colors duration-200 ${
                isLight
                  ? 'text-[#1e3a5f] placeholder:text-[#849bb4]'
                  : 'text-[#e3e2e6] placeholder:text-[#8e918f]'
              }`}
              placeholder={
                department === 'Front Office'
                  ? "Describe front desk tasks, PMS check-ins, guest arrivals, or room allocations..."
                  : department === 'Food Production'
                  ? "Describe kitchen prep, butchery, mise en place, cooking line, or HACCP checks..."
                  : department === 'Barista'
                  ? "Describe grinder dial-in, espresso extraction, milk steaming, or machine cleaning..."
                  : department === 'Tour Guide'
                  ? "Describe guided tours, heritage itinerary, route commentary, or visitor safety..."
                  : "Attach workplace photo or describe what you did during your shift today..."
              }
              id="prompt-textarea"
            />

            <div className="flex justify-between items-center pt-2">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-none cursor-pointer flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium transition-colors focus:outline-none ${
                    isLight
                      ? 'bg-[#f1f5f9] text-[#1e3a5f] hover:bg-[#e2e8f0]'
                      : 'bg-white/10 text-[#e3e2e6] hover:bg-white/15'
                  }`}
                  aria-label="Upload workplace photo"
                  title="Upload photo of your task, machinery, or site work"
                  id="btn-upload-photo"
                >
                  <ImageIcon className="w-4 h-4 text-cyan-500" />
                  <span className="hidden sm:inline">Upload Photo</span>
                </button>

                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className={`border-none cursor-pointer flex items-center justify-center w-9 h-9 rounded-full transition-colors focus:outline-none ${
                    isLight
                      ? 'bg-[#f1f5f9] text-[#1e3a5f] hover:bg-[#e2e8f0]'
                      : 'bg-white/10 text-[#e3e2e6] hover:bg-white/15'
                  }`}
                  aria-label="Take Photo"
                  title="Take photo using camera"
                  id="btn-take-photo"
                >
                  <Camera className="w-4 h-4 text-emerald-500" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleGenerateLogbook}
                  disabled={isGenerating || remainingGenerations === 0}
                  className={`w-11 h-11 rounded-full flex items-center justify-center cursor-pointer transition-all active:scale-95 shadow-md focus:outline-none ${
                    isGenerating
                      ? 'opacity-80 cursor-wait'
                      : remainingGenerations === 0
                      ? 'opacity-50 cursor-not-allowed bg-slate-400'
                      : isLight
                      ? 'bg-[#1e3a5f] hover:bg-[#152a45] shadow-sm'
                      : 'bg-[#a8c7fa] hover:bg-[#b8d2fa] shadow-sm'
                  }`}
                  aria-label="Generate Physical Logbook Entry"
                  title={remainingGenerations === 0 ? "Daily free limit reached (0/3)" : "Generate Logbook Entry"}
                  id="btn-send-logbook"
                >
                  {isGenerating ? (
                    <Loader2
                      className={`w-5 h-5 animate-spin ${
                        isLight ? 'text-white' : 'text-[#041e49]'
                      }`}
                    />
                  ) : (
                    <AppLogo
                      size={22}
                      className={isLight ? 'text-white' : 'text-[#041e49]'}
                      animated={false}
                    />
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <AnimatePresence>
        {isSettingsOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setIsSettingsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`border rounded-3xl p-6 max-w-md w-full shadow-2xl text-left transition-colors duration-300 ${
                isLight ? 'bg-white border-[#d5e2ed] text-[#1e3a5f]' : 'bg-[#1e1f20] border-white/10 text-[#e3e2e6]'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <AppLogo size={26} animated={false} />
                  <h3 className="text-base font-semibold">Select Internship Department</h3>
                </div>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="p-1 rounded-full hover:opacity-70 cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs opacity-75 mb-4 leading-relaxed">
                This AI is exclusively configured for student internship logbooks. Select your department or field:
              </p>

              <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-wider block">
                  Department or Field:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    {
                      id: 'Front Office',
                      name: 'Front Office',
                      icon: '🛎️',
                      desc: 'Guest Check-ins, Opera PMS, Room Allocation & Folios',
                    },
                    {
                      id: 'Housekeeping',
                      name: 'Housekeeping',
                      icon: '🧹',
                      desc: 'Room Servicing, Turndown Service & Linen Inspection',
                    },
                    {
                      id: 'Food & Beverage Service',
                      name: 'F&B Service',
                      icon: '🍽️',
                      desc: 'Restaurant Setup, Guest Greeting & Plate Clearing',
                    },
                    {
                      id: 'Food Production',
                      name: 'Food Production',
                      icon: '🍳',
                      desc: 'Kitchen Brigade, Mise en Place, Butchery & HACCP',
                    },
                    {
                      id: 'Barista',
                      name: 'Barista',
                      icon: '☕',
                      desc: 'Espresso Dial-in, Milk Texturing & Specialty Bar',
                    },
                    {
                      id: 'Laundry & Linen',
                      name: 'Laundry & Linen',
                      icon: '🧺',
                      desc: 'Commercial Washers, Pressing & Uniform Care',
                    },
                    {
                      id: 'Tour Guide',
                      name: 'Tour Guide',
                      icon: '🗺️',
                      desc: 'Heritage Itineraries, Visitor Interpretation & Safety',
                    },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setDepartment(item.id);
                        setIsSettingsOpen(false);
                      }}
                      className={`p-3 rounded-2xl text-xs font-medium text-left border transition-all cursor-pointer flex flex-col gap-1 ${
                        department === item.id
                          ? isLight
                            ? 'bg-[#1e3a5f] text-white border-[#1e3a5f] shadow-sm'
                            : 'bg-[#a8c7fa] text-[#041e49] border-[#a8c7fa] shadow-sm'
                          : isLight
                          ? 'bg-[#f8fafc] border-[#e2e8f0] hover:bg-[#edf2f7] text-[#334155]'
                          : 'bg-white/5 border-white/10 hover:bg-white/10 text-[#c4c6d0]'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold text-sm">
                        <span>{item.icon}</span>
                        <span>{item.name}</span>
                      </div>
                      <span className={`text-[11px] leading-tight ${department === item.id ? 'opacity-90' : 'opacity-70'}`}>
                        {item.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-inherit flex items-center justify-between">
                <button
                  onClick={() => {
                    setIsSettingsOpen(false);
                    if (onOpenDevStats) onOpenDevStats();
                  }}
                  className={`text-[11px] font-medium px-3 py-1.5 rounded-lg border transition-colors cursor-pointer flex items-center gap-1.5 ${
                    isLight ? 'border-blue-200 text-blue-700 hover:bg-blue-50' : 'border-blue-500/30 text-blue-300 hover:bg-blue-950/30'
                  }`}
                >
                  <span>🔐</span>
                  <span>Developer Stats</span>
                </button>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium cursor-pointer ${
                    isLight ? 'bg-[#1e3a5f] text-white' : 'bg-[#a8c7fa] text-[#041e49]'
                  }`}
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
