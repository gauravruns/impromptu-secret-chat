import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  addDoc, 
  onSnapshot, 
  query, 
  updateDoc,
  increment
} from 'firebase/firestore';
import { 
  getAuth, 
  signInAnonymously, 
  signInWithCustomToken,
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  Users, 
  Plus, 
  MessageSquare, 
  Hash, 
  LogOut, 
  ChevronRight,
  Send, 
  ArrowLeft,
  Info,
  ShieldCheck,
  Copy,
  Check,
  Sparkles,
  RefreshCw,
  Flame,
  Eye,
  Heart,
  Smile,
  Lock
} from 'lucide-react';

// --- Safe Firebase Configuration ---
const firebaseConfig = typeof __firebase_config !== 'undefined' ? __firebase_config : {
  apiKey: "demo-key",
  authDomain: "impromptu-b1aa6.firebaseapp.com",
  projectId: "impromptu-b1aa6",
  storageBucket: "impromptu-b1aa6.firebasestorage.app",
  messagingSenderId: "304404810717",
  appId: "1:304404810717:web:5516f765310b2930f20434"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'impromptu-v1';

// --- Curated Secret Personas ---
const SECRET_PERSONAS = [
  { name: 'Midnight Falcon', emoji: '🦅' },
  { name: 'Velvet Cipher', emoji: '🗝️' },
  { name: 'Neon Ghost', emoji: '👻' },
  { name: 'Silent Echo', emoji: '🦉' },
  { name: 'Cosmic Drift', emoji: '🌌' },
  { name: 'Shadow Nomad', emoji: '🧭' },
  { name: 'Obsidian Fox', emoji: '🦊' },
  { name: 'Quiet Storm', emoji: '⚡' },
  { name: 'Silver Specter', emoji: '🎭' },
  { name: 'Solar Phoenix', emoji: '🔥' },
  { name: 'Astral Lynx', emoji: '🐾' },
  { name: 'Hidden Opal', emoji: '💎' }
];

const getRandomPersona = () => {
  return SECRET_PERSONAS[Math.floor(Math.random() * SECRET_PERSONAS.length)];
};

const generateRoomCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export default function App() {
  const [user, setUser] = useState(null);
  const [persona, setPersona] = useState(() => {
    const saved = localStorage.getItem('impromptu_persona');
    return saved ? JSON.parse(saved) : getRandomPersona();
  });
  const [view, setView] = useState('lobby'); // 'lobby' | 'room'
  const [currentRoom, setCurrentRoom] = useState(null);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  // Parse URL query parameter for ?room=XYZ
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    if (roomParam) {
      sessionStorage.setItem('pending_room_code', roomParam.toUpperCase());
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error('Anonymous auth init error:', err);
      }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (error) {
      const t = setTimeout(() => setError(null), 4000);
      return () => clearTimeout(t);
    }
  }, [error]);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const handleShufflePersona = () => {
    let next = getRandomPersona();
    while (next.name === persona.name && SECRET_PERSONAS.length > 1) {
      next = getRandomPersona();
    }
    setPersona(next);
    localStorage.setItem('impromptu_persona', JSON.stringify(next));
    setToast(`Shuffled identity: ${next.emoji} ${next.name}`);
  };

  const handleUpdateAlias = (newName) => {
    const updated = { ...persona, name: newName.trim() || persona.name };
    setPersona(updated);
    localStorage.setItem('impromptu_persona', JSON.stringify(updated));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090a0f] flex flex-col items-center justify-center text-slate-400 gap-4">
        <div className="w-10 h-10 border-2 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin" />
        <p className="text-xs tracking-widest uppercase font-mono text-zinc-500">Initializing Secure Sandbox...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Ambient background blur circles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <main className="relative z-10 w-full max-w-xl mx-auto flex-1 flex flex-col p-4 sm:p-6">
        {view === 'lobby' && (
          <LobbyView
            user={user}
            persona={persona}
            onShufflePersona={handleShufflePersona}
            onUpdateAlias={handleUpdateAlias}
            onJoinRoom={(roomData) => {
              setCurrentRoom(roomData);
              setView('room');
            }}
            onError={setError}
            setToast={setToast}
          />
        )}

        {view === 'room' && currentRoom && (
          <RoomView
            room={currentRoom}
            user={user}
            persona={persona}
            onLeave={() => {
              setCurrentRoom(null);
              setView('lobby');
            }}
            onError={setError}
            setToast={setToast}
          />
        )}

        {/* Floating notifications */}
        {error && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-rose-950/90 text-rose-200 border border-rose-800/80 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-md z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <Info size={18} className="text-rose-400 shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {toast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-zinc-900/90 text-zinc-100 border border-zinc-700/80 px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 backdrop-blur-md z-50 text-xs font-semibold tracking-wide animate-in fade-in slide-in-from-bottom-3 duration-200">
            <Check size={14} className="text-emerald-400" />
            <span>{toast}</span>
          </div>
        )}
      </main>
    </div>
  );
}

// --- LOBBY VIEW (Zero-Credential Entry) ---
function LobbyView({ user, persona, onShufflePersona, onUpdateAlias, onJoinRoom, onError, setToast }) {
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [customName, setCustomName] = useState(persona.name);

  // Auto-fill room code from URL parameter if present
  useEffect(() => {
    const pending = sessionStorage.getItem('pending_room_code');
    if (pending) {
      setRoomCodeInput(pending);
      sessionStorage.removeItem('pending_room_code');
    }
  }, []);

  const handleCreateRoom = async () => {
    if (!user) return onError('Connecting to network. Please try again.');
    setIsProcessing(true);
    const code = generateRoomCode();
    try {
      const roomData = {
        roomCode: code,
        creatorToken: user.uid,
        createdAt: Date.now(),
        expiresAt: Date.now() + 12 * 60 * 60 * 1000, // 12 hours
        memberCount: 1
      };
      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'rooms', code), roomData);
      onJoinRoom(roomData);
    } catch (err) {
      console.error(err);
      onError('Could not create room. Please check connection.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleJoinRoom = async (e) => {
    if (e) e.preventDefault();
    const code = roomCodeInput.trim().toUpperCase();
    if (!code) return onError('Please enter a 6-character room code.');
    if (!user) return onError('Connecting to network. Please try again.');

    setIsProcessing(true);
    try {
      const roomRef = doc(db, 'artifacts', appId, 'public', 'data', 'rooms', code);
      const snap = await getDoc(roomRef);
      if (snap.exists()) {
        onJoinRoom(snap.data());
      } else {
        onError('Room not found or expired.');
      }
    } catch (err) {
      console.error(err);
      onError('Unable to join room. Verify the code.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between py-6 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="space-y-3 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Zero Credentials • 100% Anonymous</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
          Impromptu
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
          Honest conversations, live secret polls, and confessions with friends. No signups, no passwords, zero identity trace.
        </p>
      </div>

      {/* Persona Card */}
      <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-3xl p-5 backdrop-blur-xl space-y-4 shadow-xl">
        <div className="flex items-center justify-between text-xs text-zinc-400 font-medium">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-400" />
            Your Burner Persona
          </span>
          <button
            onClick={onShufflePersona}
            className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 text-xs font-semibold transition-colors"
          >
            <RefreshCw size={12} /> Shuffle
          </button>
        </div>

        <div className="flex items-center gap-4 bg-zinc-950/50 p-4 rounded-2xl border border-zinc-800/60">
          <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-2xl shadow-inner shrink-0">
            {persona.emoji}
          </div>
          <div className="flex-1 min-w-0">
            {isCustomizing ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  maxLength={24}
                  className="w-full bg-zinc-800 text-white text-sm font-semibold px-2.5 py-1.5 rounded-lg border border-zinc-700 outline-none focus:border-emerald-500"
                  autoFocus
                />
                <button
                  onClick={() => {
                    onUpdateAlias(customName);
                    setIsCustomizing(false);
                  }}
                  className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded-lg"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white truncate">{persona.name}</h2>
                  <p className="text-[11px] text-zinc-500">Friends will only see this alias</p>
                </div>
                <button
                  onClick={() => setIsCustomizing(true)}
                  className="text-xs text-zinc-400 hover:text-white underline underline-offset-2 ml-2"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Cards (Host or Join) */}
      <div className="space-y-4">
        {/* Host Session */}
        <button
          onClick={handleCreateRoom}
          disabled={isProcessing}
          className="w-full bg-zinc-100 hover:bg-white text-zinc-950 font-bold p-5 rounded-2xl flex items-center justify-between transition-all active:scale-[0.99] disabled:opacity-50 shadow-lg"
        >
          <div className="text-left">
            <span className="block text-base font-bold">Host a Secret Session</span>
            <span className="text-xs text-zinc-600 font-normal">Create an instant room and share invite link</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center shrink-0">
            <Plus size={20} />
          </div>
        </button>

        {/* Join Session */}
        <form onSubmit={handleJoinRoom} className="relative">
          <input
            type="text"
            value={roomCodeInput}
            onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
            maxLength={6}
            placeholder="ENTER 6-DIGIT CODE"
            className="w-full bg-zinc-900/60 border border-zinc-800 focus:border-emerald-500/60 rounded-2xl p-4.5 text-center text-xl font-mono font-bold tracking-[0.25em] outline-none transition-all placeholder:text-zinc-600 placeholder:tracking-normal placeholder:font-sans placeholder:text-sm text-white"
          />
          <button
            type="submit"
            disabled={isProcessing || !roomCodeInput.trim()}
            className="absolute right-2 top-2 bottom-2 px-5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl flex items-center justify-center transition-all disabled:opacity-0 active:scale-95"
          >
            <ChevronRight size={20} />
          </button>
        </form>
      </div>

      {/* Privacy Guarantee footer */}
      <div className="pt-6 text-center text-xs text-zinc-600 space-y-1">
        <p className="flex items-center justify-center gap-1.5">
          <Lock size={12} /> Rooms automatically vaporize after 12 hours of inactivity
        </p>
      </div>
    </div>
  );
}

// --- ROOM VIEW (Secret Conversation Stream) ---
function RoomView({ room, user, persona, onLeave, onError, setToast }) {
  const [members, setMembers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'polls' | 'confessions'
  const [isAsking, setIsAsking] = useState(false);
  const [copied, setCopied] = useState(false);

  // Ensure member record exists in Firestore
  useEffect(() => {
    if (!user || !room) return;
    const registerMember = async () => {
      try {
        const memberRef = doc(
          db,
          'artifacts',
          appId,
          'public',
          'data',
          'room_members',
          `${room.roomCode}_${user.uid}`
        );
        await setDoc(
          memberRef,
          {
            userId: user.uid,
            roomCode: room.roomCode,
            alias: `${persona.emoji} ${persona.name}`,
            joinedAt: Date.now()
          },
          { merge: true }
        );
      } catch (err) {
        console.error('Member join registration error:', err);
      }
    };
    registerMember();
  }, [room.roomCode, user, persona]);

  // Real-time listener for questions
  useEffect(() => {
    if (!user || !room) return;
    const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'questions'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const filtered = snapshot.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .filter((item) => item.roomCode === room.roomCode)
          .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setQuestions(filtered);
      },
      (err) => console.error('Question stream error:', err)
    );
    return () => unsubscribe();
  }, [room.roomCode, user]);

  // Real-time listener for members
  useEffect(() => {
    if (!user || !room) return;
    const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'room_members'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const inRoom = snapshot.docs
          .map((d) => d.data())
          .filter((m) => m.roomCode === room.roomCode);
        setMembers(inRoom);
      },
      (err) => console.error('Member stream error:', err)
    );
    return () => unsubscribe();
  }, [room.roomCode, user]);

  const handleCopyInvite = () => {
    const url = `${window.location.origin}${window.location.pathname}?room=${room.roomCode}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setToast(`Invite link copied: ?room=${room.roomCode}`);
    setTimeout(() => setCopied(false), 2500);
  };

  const filteredQuestions = useMemo(() => {
    if (activeTab === 'polls') return questions.filter((q) => q.type === 'poll');
    if (activeTab === 'confessions') return questions.filter((q) => q.type === 'descriptive' || q.type === 'one_word');
    return questions;
  }, [questions, activeTab]);

  return (
    <div className="flex-1 flex flex-col pb-24 animate-in fade-in duration-300">
      {/* Sticky Room Bar */}
      <div className="sticky top-0 z-40 bg-[#090a0f]/90 backdrop-blur-xl pt-2 pb-3 border-b border-zinc-800/60 space-y-3">
        <div className="flex items-center justify-between">
          <button
            onClick={onLeave}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} /> Exit
          </button>

          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{members.length} {members.length === 1 ? 'member' : 'members'}</span>
            </div>
            <button
              onClick={handleCopyInvite}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-xs font-semibold text-emerald-400 transition-colors"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              <span>{copied ? 'Copied' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Room Title & Secret Alias */}
        <div className="flex items-center justify-between bg-zinc-900/50 p-3 rounded-2xl border border-zinc-800/50">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 font-bold block">
              Secret Room
            </span>
            <span className="text-xl font-extrabold font-mono text-white tracking-widest">
              {room.roomCode}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold block">
              You are
            </span>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 justify-end">
              <span>{persona.emoji}</span>
              <span>{persona.name}</span>
            </span>
          </div>
        </div>

        {/* Feed Filter Tabs */}
        <div className="flex p-1 bg-zinc-900/80 rounded-xl border border-zinc-800/80 text-xs font-semibold">
          {[
            { id: 'all', label: `All (${questions.length})` },
            { id: 'polls', label: 'Polls' },
            { id: 'confessions', label: 'Confessions' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-zinc-800 text-white shadow-sm font-bold'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Questions & Confessions Stream */}
      <div className="flex-1 py-4 space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="py-20 text-center space-y-3 text-zinc-600">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center text-zinc-500">
              <MessageSquare size={24} />
            </div>
            <h3 className="text-sm font-bold text-zinc-400">The room is quiet</h3>
            <p className="text-xs text-zinc-500 max-w-xs mx-auto">
              Drop a spicy confession or create a poll. No one will ever know who asked.
            </p>
          </div>
        ) : (
          filteredQuestions.map((q) => (
            <QuestionCard
              key={q.id}
              question={q}
              currentAlias={`${persona.emoji} ${persona.name}`}
              user={user}
            />
          ))
        )}
      </div>

      {/* Bottom Floating Composer Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#090a0f] via-[#090a0f]/95 to-transparent backdrop-blur-md z-40">
        <div className="max-w-xl mx-auto">
          {isAsking ? (
            <QuestionForm
              roomCode={room.roomCode}
              creatorAlias={`${persona.emoji} ${persona.name}`}
              user={user}
              onClose={() => setIsAsking(false)}
            />
          ) : (
            <button
              onClick={() => setIsAsking(true)}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold py-3.5 px-6 rounded-2xl shadow-xl shadow-emerald-500/10 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
            >
              <Sparkles size={18} />
              <span>Ask a Question or Confess</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// --- QUESTION & CONFESSION CARD ---
function QuestionCard({ question, currentAlias, user }) {
  const [answers, setAnswers] = useState([]);
  const [myAnswer, setMyAnswer] = useState(null);
  const [isResponding, setIsResponding] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [reactions, setReactions] = useState({ flame: 0, hush: 0, eye: 0, heart: 0 });

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'answers'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const filtered = snapshot.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .filter((a) => a.questionId === question.id);
        setAnswers(filtered);

        const mine = filtered.find((a) => a.userUid === user.uid || a.alias === currentAlias);
        if (mine) setMyAnswer(mine);
      },
      (err) => console.error('Answer stream error:', err)
    );
    return () => unsubscribe();
  }, [question.id, currentAlias, user]);

  const handleVote = async (option) => {
    if (myAnswer || !user) return;
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'answers'), {
        questionId: question.id,
        userUid: user.uid,
        alias: currentAlias,
        text: option,
        createdAt: Date.now()
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleTextSubmit = async (e) => {
    e.preventDefault();
    if (!responseText.trim() || myAnswer || !user) return;
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'answers'), {
        questionId: question.id,
        userUid: user.uid,
        alias: currentAlias,
        text: responseText.trim(),
        createdAt: Date.now()
      });
      setIsResponding(false)
      setResponseText('');
    } catch (err) {
      console.error(err);
    }
  };

  const toggleReaction = (key) => {
    setReactions((prev) => ({
      ...prev,
      [key]: prev[key] + 1
    }));
  };

  const isPoll = question.type === 'poll';
  const isConfession = question.type === 'descriptive' || question.type === 'one_word';

  return (
    <div className="bg-zinc-900/60 border border-zinc-800/70 rounded-3xl p-5 space-y-4 backdrop-blur-md shadow-sm transition-all hover:border-zinc-700/70">
      {/* Top Meta */}
      <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-sans font-semibold text-[10px] uppercase">
          {isPoll ? '📊 Live Poll' : isConfession ? '🤫 Secret Confession' : '💬 Q&A'}
        </span>
        <span>
          {new Date(question.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {/* Question / Prompt Text */}
      <h2 className="text-lg font-bold text-white leading-snug tracking-tight">
        {question.text}
      </h2>

      {/* Poll Options */}
      {isPoll && question.options && (
        <div className="space-y-2 pt-1">
          {question.options.map((opt) => {
            const totalVotes = answers.length;
            const optVotes = answers.filter((a) => a.text === opt).length;
            const pct = totalVotes > 0 ? Math.round((optVotes / totalVotes) * 100) : 0;
            const isSelected = myAnswer?.text === opt;

            return (
              <button
                key={opt}
                disabled={!!myAnswer}
                onClick={() => handleVote(opt)}
                className={`relative w-full text-left p-3.5 rounded-2xl overflow-hidden transition-all border ${
                  isSelected
                    ? 'border-emerald-500/50 bg-emerald-500/10 text-white'
                    : 'border-zinc-800/80 bg-zinc-950/40 hover:bg-zinc-800/50 text-zinc-300'
                }`}
              >
                {/* Fill bar */}
                <div
                  className="absolute inset-y-0 left-0 bg-emerald-500/15 transition-all duration-700"
                  style={{ width: myAnswer ? `${pct}%` : '0%' }}
                />
                <div className="relative flex items-center justify-between z-10 text-sm font-medium">
                  <span className="flex items-center gap-2 truncate">
                    {isSelected && <Check size={14} className="text-emerald-400 shrink-0" />}
                    <span className="truncate">{opt}</span>
                  </span>
                  {myAnswer && (
                    <span className="text-xs font-mono font-bold text-zinc-400 ml-2 shrink-0">
                      {pct}%
                    </span>
                  )}
                </div>
              </button>
            );
          })}
          <div className="text-right text-[11px] text-zinc-500 pt-1 font-mono">
            {answers.length} {answers.length === 1 ? 'vote' : 'votes'}
          </div>
        </div>
      )}

      {/* Confessional / Text Response Stream */}
      {isConfession && (
        <div className="space-y-3">
          {!myAnswer && !isResponding && (
            <button
              onClick={() => setIsResponding(true)}
              className="w-full bg-zinc-950/40 hover:bg-zinc-800/40 border border-zinc-800/80 p-3.5 rounded-2xl text-zinc-400 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <Send size={14} /> Submit Anonymous Reply
            </button>
          )}

          {isResponding && (
            <form onSubmit={handleTextSubmit} className="space-y-2 animate-in fade-in duration-200">
              <textarea
                autoFocus
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                maxLength={question.type === 'one_word' ? 40 : 800}
                placeholder={question.type === 'one_word' ? 'Keep it short (max 40 chars)...' : 'Write what you really think...'}
                className="w-full bg-zinc-950/70 border border-zinc-700/80 rounded-2xl p-3.5 text-sm text-white outline-none focus:border-emerald-500 min-h-[90px]"
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button
                  onClick={() => setIsResponding(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!responseText.trim()}
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl text-xs font-bold disabled:opacity-40"
                >
                  Post
                </button>
              </div>
            </form>
          )}

          {/* Answer Cards */}
          {answers.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-zinc-800/60">
              {answers.map((ans) => (
                <div key={ans.id} className="p-3.5 bg-zinc-950/40 border border-zinc-800/60 rounded-2xl text-sm space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                    <span className="font-semibold text-emerald-400/90 font-sans">{ans.alias}</span>
                    <span>{new Date(ans.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-zinc-200 text-sm leading-relaxed whitespace-pre-wrap">{ans.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Reactions Bar */}
      <div className="flex items-center gap-2 pt-2 border-t border-zinc-800/40 text-xs">
        <button
          onClick={() => toggleReaction('flame')}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-800/60 hover:bg-zinc-800 text-zinc-400 hover:text-orange-400 transition-colors"
        >
          <Flame size={12} />
          <span>{reactions.flame > 0 ? reactions.flame : 'Spicy'}</span>
        </button>
        <button
          onClick={() => toggleReaction('eye')}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-800/60 hover:bg-zinc-800 text-zinc-400 hover:text-cyan-400 transition-colors"
        >
          <Eye size={12} />
          <span>{reactions.eye > 0 ? reactions.eye : 'Secrets'}</span>
        </button>
        <button
          onClick={() => toggleReaction('heart')}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-800/60 hover:bg-zinc-800 text-zinc-400 hover:text-rose-400 transition-colors"
        >
          <Heart size={12} />
          <span>{reactions.heart > 0 ? reactions.heart : 'Love'}</span>
        </button>
      </div>
    </div>
  );
}

// --- MODAL / FORM TO CREATE QUESTION OR CONFESSION ---
function QuestionForm({ roomCode, creatorAlias, user, onClose }) {
  const [type, setType] = useState('poll'); // 'poll' | 'descriptive' | 'one_word'
  const [text, setText] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddOption = () => {
    if (options.length < 5) setOptions([...options, '']);
  };

  const handleUpdateOption = (idx, val) => {
    const updated = [...options];
    updated[idx] = val;
    setOptions(updated);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!text.trim() || !user || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const qData = {
        roomCode,
        creatorAlias,
        creatorUid: user.uid,
        text: text.trim(),
        type,
        createdAt: Date.now(),
        options: type === 'poll' ? options.map((o) => o.trim()).filter(Boolean) : null
      };
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'questions'), qData);
      onClose();
    } catch (err) {
      console.error(err);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-700/80 rounded-3xl p-5 shadow-2xl space-y-4 animate-in slide-in-from-bottom-8 duration-300">
      <div className="flex items-center justify-between text-sm">
        <h3 className="font-bold text-white flex items-center gap-1.5">
          <Sparkles size={16} className="text-emerald-400" />
          New Anonymous Prompt
        </h3>
        <button onClick={onClose} className="text-zinc-400 hover:text-white text-xs font-semibold">
          Cancel
        </button>
      </div>

      {/* Type Selector */}
      <div className="flex p-1 bg-zinc-950 rounded-xl border border-zinc-800 text-xs font-semibold">
        {[
          { id: 'poll', label: 'Poll' },
          { id: 'descriptive', label: 'Confession' },
          { id: 'one_word', label: 'Short Prompt' }
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setType(t.id)}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              type === t.id ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Prompt Text Input */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What do you want to ask or confess to the group?..."
        className="w-full bg-zinc-950/60 border border-zinc-800 rounded-2xl p-3.5 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-emerald-500 min-h-[80px]"
        autoFocus
      />

      {/* Poll Options */}
      {type === 'poll' && (
        <div className="space-y-2">
          {options.map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <Hash size={14} className="text-zinc-600 shrink-0" />
              <input
                type="text"
                value={opt}
                onChange={(e) => handleUpdateOption(i, e.target.value)}
                placeholder={`Option ${i + 1}`}
                className="flex-1 bg-zinc-950/60 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-600 outline-none focus:border-emerald-500"
              />
            </div>
          ))}
          {options.length < 5 && (
            <button
              type="button"
              onClick={handleAddOption}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 pt-1"
            >
              <Plus size={14} /> Add Option
            </button>
          )}
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={!text.trim() || isSubmitting}
        className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold py-3 rounded-xl transition-all disabled:opacity-40 active:scale-[0.99] text-sm"
      >
        {isSubmitting ? 'Posting...' : 'Post to Room'}
      </button>
    </div>
  );
}
