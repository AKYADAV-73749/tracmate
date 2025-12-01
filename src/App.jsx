import React, { useState, useEffect, useMemo, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged, 
  signInWithCustomToken,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  serverTimestamp,
  updateDoc,
  increment,
  setDoc,
  getDoc
} from 'firebase/firestore';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip, 
  Legend, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid
} from 'recharts';
import { 
  Plus, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  List,
  BrainCircuit,
  Sparkles,
  Loader2,
  Download,
  Landmark,
  RefreshCw,
  CreditCard,
  LayoutDashboard,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Camera,
  Moon,
  Sun,
  Repeat,
  Target,
  Mic,
  Calendar as CalendarIcon,
  Trophy,
  Users,
  Calculator,
  CheckCircle2,
  Flame,
  PartyPopper,
  LogOut,
  Lock,
  Mail,
  User,
  AlertCircle,
  ChevronLeft,
  HandCoins
} from 'lucide-react';

// --- Firebase Configuration & Initialization ---
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY, // ✅ Secure!
  authDomain: "trackmate-764d7.firebaseapp.com",
  projectId: "trackmate-764d7",
  storageBucket: "trackmate-764d7.firebasestorage.app",
  messagingSenderId: "180227840628",
  appId: "1:180227840628:web:7ad9d46cee1a6071534f21",
  measurementId: "G-0XGTLENH5Y"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'trackmate-default';

// --- Gemini API Configuration ---
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;  

const GEMINI_MODEL = "gemini-2.5-flash-preview-09-2025";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

// --- Modern Components ---

const Card = ({ children, className = "", darkMode = false }) => (
  <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'} rounded-3xl border shadow-sm transition-all duration-200 hover:shadow-md ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, variant = "primary", className = "", type="button", disabled=false }) => {
  const baseStyle = "px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100";
  
  const variants = {
    primary: "bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20",
    secondary: "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300",
    danger: "bg-red-50 hover:bg-red-100 text-red-600 border border-red-100",
    ghost: "hover:bg-slate-100 text-slate-600",
    magic: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg border-none animate-gradient-x",
    outline: "border-2 border-slate-200 text-slate-600 hover:border-slate-900 hover:text-slate-900",
    dark: "bg-slate-700 hover:bg-slate-600 text-white"
  };

  return (
    <button 
      type={type} 
      onClick={onClick} 
      className={`${baseStyle} ${variants[variant]} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

const AuthScreen = ({ onLogin, onGuest }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/invalid-credential') setError('Invalid email or password.');
      else if (err.code === 'auth/email-already-in-use') setError('Email already in use.');
      else if (err.code === 'auth/weak-password') setError('Password too weak.');
      else setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-indigo-200">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Trackmate</h1>
          <p className="text-slate-500 mt-2">Master your money, simply.</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
          <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
            <button onClick={() => setIsLogin(true)} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>Log In</button>
            <button onClick={() => setIsLogin(false)} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>Sign Up</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500" placeholder="name@example.com"/>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500" placeholder="••••••••"/>
              </div>
            </div>
            {error && <div className="p-3 bg-rose-50 text-rose-600 text-sm font-medium rounded-xl flex items-center gap-2"><AlertCircle className="w-4 h-4" /> {error}</div>}
            <Button type="submit" className="w-full py-3.5 rounded-xl" disabled={loading}>{loading ? <Loader2 className="w-5 h-5 animate-spin" /> : isLogin ? 'Sign In' : 'Create Account'}</Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <button onClick={onGuest} className="text-indigo-600 hover:text-indigo-700 font-bold text-sm flex items-center justify-center gap-1 mx-auto">Enter as Guest <ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

const GoalCard = ({ goal, onDelete, onUpdate, darkMode }) => {
    const [addAmount, setAddAmount] = useState('');
    const [showCelebration, setShowCelebration] = useState(false);
    const percent = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
    const isCompleted = percent >= 100;

    useEffect(() => {
        if (isCompleted) {
            setShowCelebration(true);
            const timer = setTimeout(() => setShowCelebration(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [isCompleted]);

    const handleAddFunds = () => {
        const val = parseFloat(addAmount);
        if (val > 0) {
            onUpdate(goal, val);
            setAddAmount('');
        }
    };

    return (
        <Card className={`p-6 relative overflow-hidden transition-all duration-500 ${isCompleted ? 'border-yellow-400 ring-2 ring-yellow-400/30 transform scale-[1.02]' : ''}`} darkMode={darkMode}>
            {showCelebration && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[2px] animate-in fade-in duration-700" onClick={() => setShowCelebration(false)}>
                    <div className="animate-bounce mb-2">
                        <PartyPopper className="w-12 h-12 text-yellow-400" />
                    </div>
                    <h3 className="text-2xl font-extrabold text-white tracking-tight animate-pulse">Goal Reached!</h3>
                    <p className="text-white/80 text-sm font-medium">You saved ₹{goal.targetAmount.toLocaleString()}</p>
                    <p className="text-white/50 text-xs mt-4">(Tap to dismiss)</p>
                </div>
            )}

            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`p-3 rounded-2xl transition-colors duration-300 ${isCompleted ? 'bg-yellow-100 text-yellow-600' : darkMode ? 'bg-indigo-900/30 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                    <Trophy className="w-6 h-6" />
                </div>
                <button onClick={() => onDelete(goal.id, 'goals')} className="text-slate-400 hover:text-rose-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
            </div>
            
            <h3 className={`font-bold text-lg relative z-10 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{goal.title}</h3>
            
            <div className="flex justify-between text-sm mt-1 mb-3 relative z-10">
                <span className={`${isCompleted ? 'text-emerald-500 font-bold' : 'text-slate-500'}`}>₹{goal.currentAmount.toLocaleString()} saved</span>
                <span className="text-slate-400">Target: ₹{goal.targetAmount.toLocaleString()}</span>
            </div>
            
            <div className={`w-full h-3 ${darkMode ? 'bg-slate-700' : 'bg-slate-100'} rounded-full overflow-hidden mb-4 relative z-10`}>
                <div className={`h-full transition-all duration-1000 ease-out ${isCompleted ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-indigo-500'}`} style={{width: `${percent}%`}}></div>
            </div>

            <div className="flex gap-2 mt-2 relative z-10">
                <input 
                    type="number" 
                    placeholder="Amount" 
                    value={addAmount}
                    onChange={(e) => setAddAmount(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg text-sm border outline-none transition-all duration-200 focus:scale-105 focus:ring-2 focus:ring-indigo-500/50 ${darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                />
                <button 
                    onClick={handleAddFunds}
                    disabled={!addAmount}
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white px-4 rounded-lg text-sm font-bold transition-all active:scale-95"
                >
                    Add
                </button>
            </div>
        </Card>
    );
};

const StatCard = ({ title, amount, icon: Icon, type, trend, darkMode }) => {
  const styleMap = {
    income: { color: 'text-emerald-600', bg: darkMode ? 'bg-emerald-900/30' : 'bg-emerald-100/50', trend: 'text-emerald-600' },
    expense: { color: 'text-rose-600', bg: darkMode ? 'bg-rose-900/30' : 'bg-rose-100/50', trend: 'text-rose-600' },
    balance: { color: darkMode ? 'text-white' : 'text-slate-900', bg: darkMode ? 'bg-slate-700' : 'bg-slate-100', trend: 'text-indigo-600' }
  };
  
  const s = styleMap[type] || styleMap.balance;

  return (
    <Card className="p-6 flex flex-col justify-between h-full relative overflow-hidden group" darkMode={darkMode}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${s.bg}`}>
          <Icon className={`w-6 h-6 ${s.color}`} />
        </div>
        {/* Displaying calculated trend if available, otherwise null */}
        {trend !== undefined && trend !== null && (
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'} flex items-center gap-1`}>
            {trend >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div>
        <p className={`${darkMode ? 'text-slate-400' : 'text-slate-500'} text-sm font-medium mb-1`}>{title}</p>
        <h3 className={`text-3xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          ₹{amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </h3>
      </div>
      <div className={`absolute -bottom-8 -right-8 w-32 h-32 rounded-full ${s.bg} opacity-50 blur-2xl group-hover:scale-150 transition-transform duration-500`}></div>
    </Card>
  );
};

const SpendingHeatmap = ({ transactions, darkMode }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  
  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const daysInMonth = getDaysInMonth(year, month);
  const monthName = selectedDate.toLocaleString('default', { month: 'long' });
  
  const spendingMap = {};
  transactions.forEach(t => {
    if (t.type === 'expense') {
      const tDate = new Date(t.date);
      // Filter to only show data for the currently selected month/year
      if (tDate.getMonth() === month && tDate.getFullYear() === year) {
         const d = tDate.getDate();
         spendingMap[d] = (spendingMap[d] || 0) + parseFloat(t.amount);
      }
    }
  });

  const maxSpend = Math.max(...Object.values(spendingMap), 100);

  const days = [];
  // Add empty slots for days before start of month (simple offset logic can be added here if needed)
  for (let i = 1; i <= daysInMonth; i++) {
    const spend = spendingMap[i] || 0;
    let color = darkMode ? 'bg-slate-800' : 'bg-slate-100'; 
    if (spend > 0) {
      const intensity = spend / maxSpend;
      if (intensity < 0.2) color = 'bg-rose-100';
      else if (intensity < 0.5) color = 'bg-rose-300';
      else if (intensity < 0.8) color = 'bg-rose-500';
      else color = 'bg-rose-700';
    }
    days.push({ day: i, color, spend });
  }

  const handlePrevMonth = () => {
      setSelectedDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
      setSelectedDate(new Date(year, month + 1, 1));
  };

  return (
    <Card className="p-6" darkMode={darkMode}>
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
                <CalendarIcon className={`w-5 h-5 ${darkMode ? 'text-white' : 'text-slate-900'}`} />
                <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Spending Calendar</h3>
            </div>
            {/* Month Navigation Controls */}
            <div className="flex items-center gap-2">
                <button onClick={handlePrevMonth} className={`p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 ${darkMode?'text-white':'text-slate-900'}`}><ChevronLeft className="w-4 h-4"/></button>
                <span className={`text-sm font-bold min-w-[80px] text-center ${darkMode?'text-white':'text-slate-900'}`}>{monthName} {year}</span>
                <button onClick={handleNextMonth} className={`p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 ${darkMode?'text-white':'text-slate-900'}`}><ChevronRight className="w-4 h-4"/></button>
            </div>
        </div>
        <div className="grid grid-cols-7 gap-2">
            {['S','M','T','W','T','F','S'].map((d,i) => (
                <div key={i} className="text-xs text-center font-bold text-slate-400">{d}</div>
            ))}
            {days.map((d, i) => (
                <div key={i} className={`aspect-square rounded-lg ${d.color} flex items-center justify-center text-xs font-medium ${d.spend > 0 ? 'text-rose-900' : 'text-slate-400'} relative group cursor-default`}>
                    {d.day}
                    {d.spend > 0 && (
                        <div className="absolute bottom-full mb-1 hidden group-hover:block bg-slate-900 text-white text-[10px] p-1 rounded whitespace-nowrap z-10">
                            ₹{d.spend.toLocaleString()}
                        </div>
                    )}
                </div>
            ))}
        </div>
    </Card>
  );
};

const EMICalculator = ({ darkMode }) => {
    const [principal, setPrincipal] = useState('500000');
    const [rate, setRate] = useState('9.5');
    const [years, setYears] = useState(5);

    const p = parseFloat(principal) || 0;
    const r = parseFloat(rate) || 0;
    const n = parseFloat(years) || 0;

    let emi = 0;
    let totalAmount = 0;
    let totalInterest = 0;

    if (p > 0 && r > 0 && n > 0) {
        const monthlyRate = r / (12 * 100);
        const months = n * 12;
        emi = (p * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
        totalAmount = emi * months;
        totalInterest = totalAmount - p;
    }

    return (
        <Card className="p-6" darkMode={darkMode}>
            <div className="flex items-center gap-2 mb-6">
                <Calculator className={`w-6 h-6 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Loan EMI Calculator</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase">Loan Amount</label>
                        <input 
                            type="number" 
                            value={principal} 
                            onChange={e => setPrincipal(e.target.value)} 
                            className={`w-full p-3 rounded-xl mt-1 border outline-none focus:scale-[1.02] transition-all duration-200 focus:ring-2 focus:ring-indigo-500/30 ${darkMode ? 'bg-slate-700 text-white border-slate-600' : 'bg-slate-100 text-slate-900 border-slate-200'} font-bold`} 
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase">Interest Rate (%)</label>
                        <input 
                            type="number" 
                            step="0.1" 
                            value={rate} 
                            onChange={e => setRate(e.target.value)} 
                            className={`w-full p-3 rounded-xl mt-1 border outline-none focus:scale-[1.02] transition-all duration-200 focus:ring-2 focus:ring-indigo-500/30 ${darkMode ? 'bg-slate-700 text-white border-slate-600' : 'bg-slate-100 text-slate-900 border-slate-200'} font-bold`} 
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase">Tenure (Years)</label>
                        <input 
                            type="range" 
                            min="1" 
                            max="30" 
                            value={years} 
                            onChange={e => setYears(Number(e.target.value))} 
                            className="w-full mt-2 accent-indigo-500" 
                        />
                        <div className={`text-right text-sm font-bold ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{years} Years</div>
                    </div>
                </div>
                <div className={`${darkMode ? 'bg-indigo-900/20 border-indigo-500/30' : 'bg-indigo-50 border-indigo-100'} border rounded-2xl p-6 flex flex-col justify-center`}>
                    <div className="text-center mb-4">
                        <p className="text-indigo-400 text-sm font-bold uppercase">Monthly EMI</p>
                        <h2 className="text-4xl font-extrabold text-indigo-500">
                            ₹{emi ? Math.round(emi).toLocaleString() : 0}
                        </h2>
                    </div>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-slate-400">Principal Amount</span>
                            <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>₹{p.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Total Interest</span>
                            <span className="font-bold text-rose-500">₹{Math.round(totalInterest).toLocaleString()}</span>
                        </div>
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between">
                            <span className="text-slate-400">Total Payable</span>
                            <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>₹{Math.round(totalAmount).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#10b981', '#06b6d4'];

// --- Helper Functions ---
const callGemini = async (payload) => {
  try {
    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error(`Gemini API Error: ${response.statusText}`);
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch (error) {
    console.error("Gemini API Call Failed:", error);
    return null;
  }
};

// --- Main Application Component ---

export default function Trackmate() {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [debts, setDebts] = useState([]);
  const [categories, setCategories] = useState(['Food', 'Transport', 'Housing', 'Utilities', 'Entertainment', 'Health', 'Shopping', 'Other']);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  // Feature States
  const [aiAdvisorLoading, setAiAdvisorLoading] = useState(false);
  const [aiAdvice, setAiAdvice] = useState(null);
  const [magicInputVisible, setMagicInputVisible] = useState(false);
  const [magicInputText, setMagicInputText] = useState("");
  const [magicLoading, setMagicLoading] = useState(false);
  const [receiptLoading, setReceiptLoading] = useState(false);
  const [bankConnected, setBankConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [monthlyBudget, setMonthlyBudget] = useState(20000);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: 'Food',
    description: '',
    date: new Date().toISOString().split('T')[0],
    isRecurring: false,
    isSplit: false,
    splitWith: '',
    splitAmount: ''
  });

  const [goalFormData, setGoalFormData] = useState({
      title: '',
      targetAmount: '',
      currentAmount: '0'
  });

  const [formSubmitting, setFormSubmitting] = useState(false);

  // --- Authentication ---
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        }
      } catch (error) {
        console.error("Auth failed", error);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (u) => {
        setUser(u);
        setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // --- Data Persistence for Budget ---
  useEffect(() => {
      const savedBudget = localStorage.getItem('trackmate_budget');
      if (savedBudget) setMonthlyBudget(parseInt(savedBudget));
  }, []);

  useEffect(() => {
      localStorage.setItem('trackmate_budget', monthlyBudget.toString());
  }, [monthlyBudget]);

  // --- Data Fetching ---
  useEffect(() => {
    if (!user) return;
    
    // Fetch Transactions
    const txCollection = collection(db, 'artifacts', appId, 'users', user.uid, 'transactions');
    const unsubTx = onSnapshot(txCollection, (snapshot) => {
        const txs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        txs.sort((a, b) => new Date(b.date) - new Date(a.date));
        setTransactions(txs);
        setLoading(false);
      });

    // Fetch Goals
    const goalCollection = collection(db, 'artifacts', appId, 'users', user.uid, 'goals');
    const unsubGoals = onSnapshot(goalCollection, (snapshot) => {
        setGoals(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Fetch Debts
    const debtCollection = collection(db, 'artifacts', appId, 'users', user.uid, 'debts');
    const unsubDebts = onSnapshot(debtCollection, (snapshot) => {
        setDebts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Fetch Custom Categories
    const categoryDoc = doc(db, 'artifacts', appId, 'users', user.uid, 'settings', 'categories');
    getDoc(categoryDoc).then(docSnap => {
        if (docSnap.exists()) {
            setCategories(docSnap.data().list);
        }
    });

    return () => { unsubTx(); unsubGoals(); unsubDebts(); };
  }, [user]);

  // --- Logic Handlers ---
  const handleLogout = () => {
      signOut(auth);
  };

  const handleGuestLogin = async () => {
      setLoading(true);
      try {
          await signInAnonymously(auth);
      } catch(e) {
          console.error(e);
      }
  };

  const handleAiAdvisor = async () => {
    if (transactions.length === 0) { setAiAdvice("Add some transactions first!"); return; }
    setAiAdvisorLoading(true);
    const summary = transactions.slice(0, 20).map(t => `${t.date}: ${t.type} ₹${t.amount} (${t.category})`).join("\n");
    const prompt = `Financial Advisor Persona. Analyze:\n${summary}\nGive 3 short, punchy, encouraging bullet points.`;
    const result = await callGemini({ contents: [{ parts: [{ text: prompt }] }] });
    setAiAdvice(result || "Try again later.");
    setAiAdvisorLoading(false);
  };

  const handleMagicFill = async (textOverride) => {
    const textToProcess = textOverride || magicInputText;
    if (!textToProcess.trim()) return;
    setMagicLoading(true);
    const prompt = `Extract JSON from: "${textToProcess}". Keys: amount(num), type(income/expense), category, description, date(YYYY-MM-DD). Default date: ${new Date().toISOString().split('T')[0]}.`;
    try {
      const res = await callGemini({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json" } });
      if (res) {
        const data = JSON.parse(res);
        setFormData({ ...formData, amount: data.amount||'', type: data.type||'expense', category: data.category||'Other', description: data.description||'', date: data.date||new Date().toISOString().split('T')[0] });
        setMagicInputVisible(false);
        setMagicInputText("");
      }
    } catch (e) { console.error(e); } finally { setMagicLoading(false); }
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert("Your browser does not support voice input.");
        return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN'; 
    recognition.start();
    setIsListening(true);

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setMagicInputText(transcript);
        setMagicInputVisible(true);
        handleMagicFill(transcript);
        setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
  };

  const handleReceiptScan = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setReceiptLoading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = reader.result.split(',')[1];
      const mimeType = file.type;
      
      const payload = {
        contents: [{
          parts: [
            { text: "Analyze this receipt image. Extract JSON with keys: amount(number), date(YYYY-MM-DD), description(merchant name), category(infer one). Default date to today if missing." },
            { inlineData: { mimeType: mimeType, data: base64Data } }
          ]
        }],
        generationConfig: { responseMimeType: "application/json" }
      };

      try {
        const res = await callGemini(payload);
        if (res) {
          const data = JSON.parse(res);
          setFormData({
            ...formData,
            amount: data.amount || '',
            description: data.description || 'Receipt Scan',
            date: data.date || new Date().toISOString().split('T')[0],
            category: data.category || 'Other',
            type: 'expense'
          });
          setMagicInputVisible(true);
          setTimeout(() => setMagicInputVisible(false), 2000);
        }
      } catch (error) {
        console.error("Receipt Scan Failed", error);
        alert("Failed to scan receipt. Please try again.");
      } finally {
        setReceiptLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleExportCSV = () => {
    if (transactions.length === 0) return;
    const headers = ["Date", "Description", "Category", "Type", "Amount", "Recurring"];
    const rows = transactions.map(t => [
      t.date,
      `"${t.description}"`,
      t.category,
      t.type,
      t.amount,
      t.isRecurring ? "Yes" : "No"
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "trackmate_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Smart Category Learning
  const handleDescriptionChange = (e) => {
      const val = e.target.value;
      setFormData({...formData, description: val});
      if (val.length > 2) {
          const match = transactions.find(t => t.description.toLowerCase().includes(val.toLowerCase()));
          if (match) {
              setFormData(prev => ({...prev, category: match.category, description: val}));
          }
      }
  };

  const handleAddNewCategory = async () => {
      if (!newCategoryName.trim() || !user) return;
      const updated = [...categories, newCategoryName.trim()];
      setCategories(updated);
      setFormData({...formData, category: newCategoryName.trim()});
      setAddingCategory(false);
      setNewCategoryName('');
      // Persist to Firebase
      try {
          await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'settings', 'categories'), { list: updated });
      } catch(e) { console.error(e); }
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    if (!user || !formData.amount || !formData.description) return;
    setFormSubmitting(true);
    try {
      // Add Transaction
      await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'transactions'), { ...formData, amount: parseFloat(formData.amount), createdAt: serverTimestamp() });
      
      // Handle Split Debt Logic
      if (formData.isSplit && formData.splitWith && formData.splitAmount) {
          await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'debts'), {
              person: formData.splitWith,
              amount: parseFloat(formData.splitAmount),
              description: `Split: ${formData.description}`,
              date: formData.date,
              status: 'pending',
              createdAt: serverTimestamp()
          });
      }

      setShowAddModal(false);
      setFormData({ type: 'expense', amount: '', category: 'Food', description: '', date: new Date().toISOString().split('T')[0], isRecurring: false, isSplit: false, splitWith: '', splitAmount: '' });
      setAiAdvice(null);
    } catch (e) { console.error(e); } finally { setFormSubmitting(false); }
  };

  const handleAddGoal = async (e) => {
      e.preventDefault();
      if (!user) return;
      try {
          await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'goals'), {
              ...goalFormData,
              targetAmount: parseFloat(goalFormData.targetAmount),
              currentAmount: parseFloat(goalFormData.currentAmount),
              createdAt: serverTimestamp()
          });
          setShowGoalModal(false);
          setGoalFormData({ title: '', targetAmount: '', currentAmount: '0' });
      } catch(e) { console.error(e); }
  };

  const handleUpdateGoal = async (goal, amount) => {
      if (!user) return;
      try {
          const goalRef = doc(db, 'artifacts', appId, 'users', user.uid, 'goals', goal.id);
          await updateDoc(goalRef, {
              currentAmount: increment(amount)
          });
      } catch(e) { console.error(e); }
  };

  const handleSettleDebt = async (debt) => {
      if (!user) return;
      try {
          await deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'debts', debt.id));
          // Add settle amount as income (reimbursement)
          await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'transactions'), {
              type: 'income',
              amount: debt.amount,
              category: 'Other',
              description: `Settled by ${debt.person}`,
              date: new Date().toISOString().split('T')[0],
              createdAt: serverTimestamp()
          });
      } catch(e) { console.error(e); }
  };

  const handleDelete = async (id, collectionName = 'transactions') => {
    if (!user) return;
    try { await deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, collectionName, id)); } catch (e) { console.error(e); }
  };

  // --- Stats & Gamification ---
  const stats = useMemo(() => {
    let income = 0, expense = 0;
    const catTotals = {}, monthlyData = {};
    const now = new Date();
    const currentMonthStr = now.toISOString().slice(0, 7); // YYYY-MM
    
    // Previous month for calculation
    const prevDate = new Date();
    prevDate.setMonth(prevDate.getMonth() - 1);
    const prevMonthStr = prevDate.toISOString().slice(0, 7);

    let currentMonthExpense = 0;
    let currentMonthIncome = 0;
    let prevMonthExpense = 0;
    let prevMonthIncome = 0;

    const recurringList = [];
    
    const dailySpend = {};
    const dailyBudget = monthlyBudget / 30;
    let streak = 0;

    transactions.forEach(t => {
      const val = parseFloat(t.amount);
      const month = new Date(t.date).toLocaleString('default', { month: 'short' });
      const tMonth = t.date.slice(0, 7);
      
      if (t.isRecurring) recurringList.push(t);

      if (t.type === 'income') {
          income += val;
          if (tMonth === currentMonthStr) currentMonthIncome += val;
          if (tMonth === prevMonthStr) prevMonthIncome += val;
      } else { 
        expense += val; 
        catTotals[t.category] = (catTotals[t.category] || 0) + val;
        if (tMonth === currentMonthStr) {
            currentMonthExpense += val;
            const day = t.date;
            dailySpend[day] = (dailySpend[day] || 0) + val;
        }
        if (tMonth === prevMonthStr) prevMonthExpense += val;
      }

      if (!monthlyData[month]) monthlyData[month] = { name: month, income: 0, expense: 0, time: new Date(t.date).getTime() };
      monthlyData[month][t.type] += val;
    });

    // Count streak
    const today = new Date();
    for (let i = 1; i < 30; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        
        const spent = dailySpend[dateStr] || 0;
        if (spent <= dailyBudget) {
            streak++;
        } else {
            break;
        }
    }

    // Trend Calculation
    const calcTrend = (curr, prev) => {
        if (prev === 0) return curr > 0 ? 100 : 0;
        return Math.round(((curr - prev) / prev) * 100);
    };

    const incomeTrend = calcTrend(currentMonthIncome, prevMonthIncome);
    const expenseTrend = calcTrend(currentMonthExpense, prevMonthExpense);

    return {
      income, expense, balance: income - expense,
      categoryData: Object.keys(catTotals).map(c => ({ name: c, value: catTotals[c] })).sort((a,b) => b.value - a.value),
      barData: Object.values(monthlyData).sort((a, b) => a.time - b.time),
      currentMonthExpense,
      recurringList,
      streak,
      incomeTrend,
      expenseTrend
    };
  }, [transactions, monthlyBudget]);

  const budgetProgress = Math.min((stats.currentMonthExpense / monthlyBudget) * 100, 100);
  const budgetColor = budgetProgress > 90 ? 'bg-rose-500' : budgetProgress > 70 ? 'bg-yellow-500' : 'bg-emerald-500';

  if (loading) return <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}><Loader2 className={`w-10 h-10 animate-spin ${darkMode ? 'text-white' : 'text-slate-900'}`} /></div>;

  if (!user) {
      return <AuthScreen onGuest={handleGuestLogin} />;
  }

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-slate-950 text-white' : 'bg-[#F8FAFC] text-slate-800'} font-sans overflow-hidden transition-colors duration-300`}>
      
      {/* --- SIDEBAR NAVIGATION --- */}
      <aside className={`
        fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 md:relative md:border-t-0 md:flex md:w-72 md:flex-col md:bg-slate-900 md:text-white md:p-6 md:m-4 md:rounded-3xl md:shadow-2xl
        ${darkMode ? 'bg-slate-900 border-slate-800 md:bg-slate-900' : ''}
      `}>
        
        {/* Desktop Logo */}
        <div className="hidden md:flex items-center gap-3 mb-10 px-2">
          <div className="bg-indigo-500 p-2 rounded-xl">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Trackmate</h1>
        </div>

        {/* Navigation Items */}
        <nav className="flex justify-around items-center h-16 md:h-auto md:flex-col md:justify-start md:space-y-2 md:items-stretch overflow-y-auto">
          <button onClick={() => setActiveTab('dashboard')} className={`p-2 flex flex-col md:flex-row items-center gap-1 md:gap-3 md:px-4 md:py-3.5 rounded-2xl transition-all ${activeTab === 'dashboard' ? 'text-indigo-600 md:bg-indigo-600 md:text-white md:shadow-lg' : 'text-slate-400 hover:text-slate-600 md:hover:bg-slate-800 md:hover:text-white'}`}>
            <LayoutDashboard className="w-6 h-6 md:w-5 md:h-5" />
            <span className="text-[10px] md:text-base font-medium">Overview</span>
          </button>
          <button onClick={() => setActiveTab('goals')} className={`p-2 flex flex-col md:flex-row items-center gap-1 md:gap-3 md:px-4 md:py-3.5 rounded-2xl transition-all ${activeTab === 'goals' ? 'text-indigo-600 md:bg-indigo-600 md:text-white md:shadow-lg' : 'text-slate-400 hover:text-slate-600 md:hover:bg-slate-800 md:hover:text-white'}`}>
            <Target className="w-6 h-6 md:w-5 md:h-5" />
            <span className="text-[10px] md:text-base font-medium">Goals</span>
          </button>
          
          {/* Mobile Add Button (Centered) */}
          <div className="md:hidden -mt-8">
             <button onClick={() => setShowAddModal(true)} className="bg-slate-900 text-white p-4 rounded-full shadow-xl shadow-slate-900/40">
                <Plus className="w-6 h-6" />
             </button>
          </div>

          <button onClick={() => setActiveTab('transactions')} className={`p-2 flex flex-col md:flex-row items-center gap-1 md:gap-3 md:px-4 md:py-3.5 rounded-2xl transition-all ${activeTab === 'transactions' ? 'text-indigo-600 md:bg-indigo-600 md:text-white md:shadow-lg' : 'text-slate-400 hover:text-slate-600 md:hover:bg-slate-800 md:hover:text-white'}`}>
            <List className="w-6 h-6 md:w-5 md:h-5" />
            <span className="text-[10px] md:text-base font-medium">History</span>
          </button>
          <button onClick={() => setActiveTab('subscriptions')} className={`hidden md:flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all ${activeTab === 'subscriptions' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <Repeat className="w-5 h-5" />
            <span className="font-medium">Subscriptions</span>
          </button>
          <button onClick={() => setActiveTab('debts')} className={`hidden md:flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all ${activeTab === 'debts' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <Users className="w-5 h-5" />
            <span className="font-medium">Debts</span>
          </button>
          <button onClick={() => setActiveTab('tools')} className={`hidden md:flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all ${activeTab === 'tools' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <Calculator className="w-5 h-5" />
            <span className="font-medium">Tools</span>
          </button>
        </nav>

        {/* Desktop Utilities */}
        <div className="hidden md:block space-y-2 mt-4">
            <button onClick={handleExportCSV} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all">
                <Download className="w-4 h-4" /> Export CSV
            </button>
            <button onClick={() => setDarkMode(!darkMode)} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all">
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />} {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-rose-400 hover:text-white hover:bg-rose-900/50 rounded-xl transition-all">
                <LogOut className="w-4 h-4" /> Sign Out
            </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 overflow-y-auto relative pb-24 md:pb-8">
        <div className="max-w-6xl mx-auto p-6 md:p-8">
          
          {/* Top Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div>
              <h2 className={`text-3xl md:text-4xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'} tracking-tight`}>
                {activeTab === 'dashboard' ? 'Financial Overview' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h2>
              <p className={`${darkMode ? 'text-slate-400' : 'text-slate-500'} mt-1 text-lg font-medium`}>Welcome back, here is your summary.</p>
            </div>
            
            {/* Gamification Streak Badge - REMOVED as requested */}
            
            {/* Desktop Add Button */}
            <div className="hidden md:block">
               {activeTab === 'goals' ? (
                   <Button onClick={() => setShowGoalModal(true)} className="shadow-lg px-6">
                     <Plus className="w-5 h-5" /> New Goal
                   </Button>
               ) : (
                   <Button onClick={() => setShowAddModal(true)} className="shadow-lg px-6">
                     <Plus className="w-5 h-5" /> Add Transaction
                   </Button>
               )}
            </div>
          </div>

          {/* Dashboard Content */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Balance" amount={stats.balance} icon={Wallet} type="balance" darkMode={darkMode} />
                <StatCard title="Total Income" amount={stats.income} icon={TrendingUp} type="income" trend={stats.incomeTrend} darkMode={darkMode} />
                <StatCard title="Total Expenses" amount={stats.expense} icon={TrendingDown} type="expense" trend={stats.expenseTrend} darkMode={darkMode} />
              </div>

               {/* Budget & Heatmap Row */}
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="p-6" darkMode={darkMode}>
                        <div className="flex justify-between items-end mb-2">
                            <div>
                                <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Monthly Budget</h3>
                                <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Target: ₹{monthlyBudget.toLocaleString()}</p>
                            </div>
                            {isEditingBudget ? (
                                <div className="flex gap-2">
                                    <input type="number" className="w-24 p-1 rounded border text-black" value={monthlyBudget} onChange={(e) => setMonthlyBudget(parseInt(e.target.value))} />
                                    <button onClick={() => setIsEditingBudget(false)} className="text-xs font-bold text-emerald-600">Save</button>
                                </div>
                            ) : (
                                <button onClick={() => setIsEditingBudget(true)} className="text-xs font-bold text-indigo-500 hover:text-indigo-600">Edit Goal</button>
                            )}
                        </div>
                        <div className={`w-full h-4 ${darkMode ? 'bg-slate-700' : 'bg-slate-100'} rounded-full overflow-hidden`}>
                            <div className={`h-full ${budgetColor} transition-all duration-500`} style={{ width: `${budgetProgress}%` }}></div>
                        </div>
                        <div className="flex justify-between mt-2 text-xs font-medium text-slate-400">
                            <span>Spent: ₹{stats.currentMonthExpense.toLocaleString()}</span>
                            <span>{budgetProgress.toFixed(0)}% Used</span>
                        </div>
                    </Card>

                    <SpendingHeatmap transactions={transactions} darkMode={darkMode} />
               </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column (Charts) */}
                <div className="lg:col-span-2 space-y-8">
                  <Card className="p-6 md:p-8" darkMode={darkMode}>
                    <div className="flex items-center justify-between mb-8">
                       <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Activity</h3>
                    </div>
                    <div className="h-[300px] w-full [&_.recharts-surface]:outline-none">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.barData} barGap={8}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? "#334155" : "#f1f5f9"} />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                          <RechartsTooltip 
                            cursor={{fill: darkMode ? 'rgba(30, 41, 59, 0.5)' : 'rgba(248, 250, 252, 0.8)'}} 
                            contentStyle={{
                                backgroundColor: darkMode ? '#1e293b' : '#fff', 
                                borderRadius: '12px', 
                                border:'none', 
                                boxShadow:'0 4px 20px rgba(0,0,0,0.1)', 
                                color: darkMode ? '#fff' : '#000'
                            }} 
                          />
                          <Bar dataKey="income" fill="#10b981" radius={[6,6,6,6]} barSize={12} />
                          <Bar dataKey="expense" fill="#f43f5e" radius={[6,6,6,6]} barSize={12} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                </div>

                {/* Right Column (AI & Bank) */}
                <div className="space-y-8">
                  <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 text-white shadow-xl shadow-indigo-900/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-10"><BrainCircuit className="w-32 h-32" /></div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-5 h-5 text-yellow-300" />
                        <h3 className="font-bold text-lg">AI Insights</h3>
                      </div>
                      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 mb-4 min-h-[120px] border border-white/10">
                        {aiAdvice ? <p className="text-sm leading-relaxed font-medium text-indigo-50 whitespace-pre-line">{aiAdvice}</p> : 
                        <p className="text-sm text-indigo-200 opacity-80">Tap below to analyze your spending patterns.</p>}
                      </div>
                      <Button variant="secondary" onClick={handleAiAdvisor} disabled={aiAdvisorLoading} className="w-full bg-white text-indigo-600 hover:bg-indigo-50 border-none shadow-lg">
                          {aiAdvisorLoading ? <Loader2 className="w-4 h-4 animate-spin"/> : "Generate Analysis"}
                      </Button>
                    </div>
                  </div>

                  <Card className="p-6" darkMode={darkMode}>
                    <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'} mb-4`}>Expenses</h3>
                    <div className="h-[200px] [&_.recharts-surface]:outline-none">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={stats.categoryData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                            {stats.categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                            ))}
                          </Pie>
                          <RechartsTooltip contentStyle={{backgroundColor: darkMode ? '#1e293b' : '#fff', border:'none', borderRadius:'8px', color: darkMode?'#fff':'#000'}}/>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                       {stats.categoryData.slice(0,4).map((c, i) => (
                         <div key={i} className="flex items-center gap-2 text-xs font-medium text-slate-500">
                            <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[i % COLORS.length]}}></div>
                            {c.name}
                         </div>
                       ))}
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {/* Other Tabs Content Rendering... */}
          {activeTab === 'transactions' && (
            <Card className="overflow-hidden" darkMode={darkMode}>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className={`${darkMode ? 'bg-slate-700/50 text-slate-400' : 'bg-slate-50 text-slate-500'} text-xs uppercase font-bold tracking-wider`}>
                    <tr>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Description</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4 text-right">Amount</th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${darkMode ? 'divide-slate-700' : 'divide-slate-50'}`}>
                    {transactions.map(t => (
                      <tr key={t.id} className={`${darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-50/80'}`}>
                        <td className="px-6 py-4 text-sm text-slate-500 font-medium">{t.date}</td>
                        <td className={`px-6 py-4 text-sm font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{t.description}</td>
                        <td className="px-6 py-4"><span className={`${darkMode ? 'bg-slate-700 text-slate-300 border-slate-600' : 'bg-slate-100 text-slate-600 border-slate-200'} px-3 py-1 rounded-full text-xs font-bold border`}>{t.category}</span></td>
                        <td className={`px-6 py-4 text-right font-bold text-sm ${t.type==='income'?'text-emerald-500': darkMode ? 'text-white' : 'text-slate-900'}`}>
                          {t.type==='income'?'+':'-'}₹{parseFloat(t.amount).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-right">
                           <button onClick={() => handleDelete(t.id)} className="text-slate-300 hover:text-rose-600 transition-colors"><Trash2 className="w-4 h-4"/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {activeTab === 'goals' && (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {goals.map(g => <GoalCard key={g.id} goal={g} onDelete={handleDelete} onUpdate={handleUpdateGoal} darkMode={darkMode} />)}
                 <button onClick={() => setShowGoalModal(true)} className={`border-2 border-dashed ${darkMode ? 'border-slate-700 hover:border-slate-500' : 'border-slate-200 hover:border-slate-300'} rounded-3xl p-6 flex flex-col items-center justify-center text-slate-400 transition-all min-h-[250px]`}>
                     <Plus className="w-8 h-8 mb-2" />
                     <span className="font-bold">Create New Goal</span>
                 </button>
             </div>
          )}

          {activeTab === 'debts' && (
              <div className="grid grid-cols-1 gap-6">
                  <Card className="p-6" darkMode={darkMode}>
                      <div className="flex items-center gap-2 mb-4">
                          <Users className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-slate-900'}`} />
                          <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Owed to You</h3>
                      </div>
                      {debts.length === 0 ? (
                          <div className="text-center py-10 text-slate-400">No pending debts. Add a split transaction to see it here.</div>
                      ) : (
                          <div className="grid gap-4">
                              {debts.map(d => (
                                  <div key={d.id} className={`flex justify-between items-center p-4 rounded-xl border ${darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-100 bg-slate-50'}`}>
                                      <div>
                                          <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{d.person}</h4>
                                          <p className="text-sm text-slate-500">{d.description}</p>
                                          <p className="text-xs text-slate-400">{d.date}</p>
                                      </div>
                                      <div className="flex items-center gap-4">
                                          <span className="text-lg font-bold text-emerald-500">₹{d.amount}</span>
                                          <button onClick={() => handleSettleDebt(d)} className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors">
                                              <CheckCircle2 className="w-5 h-5" />
                                          </button>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      )}
                  </Card>
              </div>
          )}

          {activeTab === 'subscriptions' && (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.recurringList.length === 0 ? (
                    <div className="col-span-full text-center py-20 text-slate-400">No recurring subscriptions found. Add a transaction and check "Recurring Payment".</div>
                ) : (
                    stats.recurringList.map(t => (
                        <Card key={t.id} className="p-6 relative overflow-hidden" darkMode={darkMode}>
                            <div className="absolute top-0 right-0 p-4 opacity-5"><Repeat className="w-24 h-24" /></div>
                            <div className="relative z-10 flex justify-between items-start">
                                <div>
                                    <div className={`p-3 rounded-2xl w-fit mb-4 ${darkMode ? 'bg-indigo-900/30 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                                        <Repeat className="w-6 h-6" />
                                    </div>
                                    <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-900'}`}>{t.description}</h3>
                                    <p className="text-slate-500 text-sm">{t.category}</p>
                                </div>
                                <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>₹{t.amount}</h3>
                            </div>
                            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center text-sm">
                                <span className="text-slate-400">Next due: {t.date}</span>
                                <button onClick={() => handleDelete(t.id)} className="text-rose-500 hover:text-rose-600 text-xs font-bold uppercase">Cancel</button>
                            </div>
                        </Card>
                    ))
                )}
             </div>
          )}

          {activeTab === 'tools' && <EMICalculator darkMode={darkMode} />}

        </div>
      </main>

      {/* --- ADD TRANSACTION MODAL --- */}
      {showAddModal && (
        <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-md p-6 animate-in slide-in-from-bottom-10 md:zoom-in-95 duration-300" darkMode={darkMode}>
             <div className="flex justify-between items-center mb-6">
               <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>New Transaction</h3>
               <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-900">✕</button>
             </div>
             
             <div className="space-y-5">
               {/* Magic Input & Scanner */}
               <div className="grid grid-cols-2 gap-2">
                 <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleReceiptScan} />
                 <button onClick={() => fileInputRef.current?.click()} disabled={receiptLoading} className={`w-full py-3 ${darkMode ? 'bg-slate-700 border-slate-600 text-slate-300' : 'bg-white border-slate-200 text-slate-600'} border rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:shadow-md transition-all hover:scale-[1.02]`}>
                    {receiptLoading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Camera className="w-4 h-4" />} Scan Receipt
                 </button>

                 {!magicInputVisible ? (
                    <div className="flex gap-2">
                        <button onClick={() => setMagicInputVisible(true)} className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:shadow-md transition-all hover:scale-[1.02]">
                            <Sparkles className="w-4 h-4" /> AI Auto-fill
                        </button>
                        <button onClick={handleVoiceInput} className={`px-4 py-3 ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 text-slate-600'} rounded-xl transition-all hover:scale-[1.02]`}>
                             <Mic className="w-5 h-5" />
                        </button>
                    </div>
                ) : (
                    <button onClick={() => setMagicInputVisible(false)} className={`w-full py-3 ${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-500'} rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-all`}>
                        Cancel AI
                    </button>
                )}
               </div>

               {magicInputVisible && (
                 <div className={`p-2 rounded-xl border animate-in fade-in ${darkMode ? 'bg-slate-800 border-slate-600' : 'bg-indigo-50 border-indigo-100'}`}>
                    <textarea 
                      className={`w-full bg-transparent border-none focus:ring-0 text-sm p-2 ${darkMode ? 'text-white placeholder:text-slate-500' : 'text-indigo-900 placeholder:text-indigo-300'}`}
                      rows="2" placeholder="e.g. Spent ₹20 on Uber" 
                      value={magicInputText} onChange={e => setMagicInputText(e.target.value)} autoFocus 
                    />
                    <div className="flex justify-end gap-2">
                       <button onClick={() => handleMagicFill()} disabled={magicLoading} className="bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:scale-105 transition-all">
                         {magicLoading ? 'Thinking...' : 'Fill'}
                       </button>
                    </div>
                 </div>
               )}

               <form onSubmit={handleAddTransaction} className="space-y-4">
                  <div className={`${darkMode ? 'bg-slate-700' : 'bg-slate-100'} p-1 rounded-xl grid grid-cols-2 gap-1`}>
                     {['income', 'expense'].map(t => (
                       <button key={t} type="button" onClick={() => setFormData({...formData, type: t})} className={`py-2 text-sm font-bold rounded-lg capitalize transition-all ${formData.type === t ? (darkMode ? 'bg-slate-600 text-white shadow-sm' : 'bg-white text-slate-900 shadow-sm') : 'text-slate-500'}`}>{t}</button>
                     ))}
                  </div>
                  
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Amount</label>
                    <div className="relative mt-1">
                       <span className="absolute left-3 top-3 text-slate-400 text-lg font-bold">₹</span>
                       <input type="number" step="0.01" required className={`w-full pl-10 py-3 ${darkMode ? 'bg-slate-700 text-white focus:ring-indigo-500' : 'bg-slate-50 text-slate-900 focus:ring-indigo-500'} rounded-xl border-none outline-none focus:ring-2 font-bold text-lg transition-all duration-200 focus:scale-[1.02]`} placeholder="0.00" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                    </div>
                  </div>

                  <input type="text" required className={`w-full px-4 py-3 ${darkMode ? 'bg-slate-700 text-white' : 'bg-slate-50 text-slate-900'} rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-500 font-semibold transition-all duration-200 focus:scale-[1.02]`} placeholder="Description (e.g. Netflix)" value={formData.description} onChange={handleDescriptionChange} />
                  
                  <div className="grid grid-cols-2 gap-4">
                     {addingCategory ? (
                         <div className="flex gap-2">
                             <input type="text" placeholder="New Category" autoFocus className={`w-full px-2 py-3 ${darkMode ? 'bg-slate-700 text-white' : 'bg-slate-50 text-slate-900'} rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 focus:scale-[1.02]`} value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} />
                             <button type="button" onClick={handleAddNewCategory} className="bg-emerald-500 text-white px-3 rounded-xl hover:scale-105 transition-all">Add</button>
                         </div>
                     ) : (
                        <select className={`w-full px-4 py-3 ${darkMode ? 'bg-slate-700 text-white' : 'bg-slate-50 text-slate-900'} rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-500 font-semibold transition-all duration-200 focus:scale-[1.02]`} value={formData.category} onChange={e => {
                            if (e.target.value === 'NEW') setAddingCategory(true);
                            else setFormData({...formData, category: e.target.value});
                        }}>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            <option value="NEW">+ New Category</option>
                        </select>
                     )}
                     <input type="date" required className={`w-full px-4 py-3 ${darkMode ? 'bg-slate-700 text-white' : 'bg-slate-50 text-slate-900'} rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-500 font-semibold transition-all duration-200 focus:scale-[1.02]`} value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                  </div>

                  {/* Split Toggle */}
                  {formData.type === 'expense' && (
                      <div className={`p-3 rounded-xl ${darkMode ? 'bg-slate-700' : 'bg-slate-50'}`}>
                          <div className="flex items-center gap-2 mb-2">
                              <input type="checkbox" id="split" checked={formData.isSplit} onChange={e => setFormData({...formData, isSplit: e.target.checked})} className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 transition-transform active:scale-90" />
                              <label htmlFor="split" className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Split this bill?</label>
                          </div>
                          {formData.isSplit && (
                              <div className="grid grid-cols-2 gap-2 mt-2 animate-in fade-in">
                                  <input type="text" placeholder="With whom?" className={`px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all focus:scale-[1.02] ${darkMode ? 'bg-slate-600 text-white' : 'bg-white'}`} value={formData.splitWith} onChange={e => setFormData({...formData, splitWith: e.target.value})} />
                                  <input type="number" placeholder="Amount owed" className={`px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all focus:scale-[1.02] ${darkMode ? 'bg-slate-600 text-white' : 'bg-white'}`} value={formData.splitAmount} onChange={e => setFormData({...formData, splitAmount: e.target.value})} />
                              </div>
                          )}
                      </div>
                  )}

                  <div className="flex items-center gap-2">
                     <input type="checkbox" id="recurring" checked={formData.isRecurring} onChange={e => setFormData({...formData, isRecurring: e.target.checked})} className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 transition-transform active:scale-90" />
                     <label htmlFor="recurring" className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Recurring Payment</label>
                  </div>

                  <Button type="submit" className={`w-full ${darkMode ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-slate-900 hover:bg-slate-800'} text-white py-3.5 rounded-xl mt-2 hover:scale-[1.02] active:scale-95 transition-all`} disabled={formSubmitting}>Save Transaction</Button>
               </form>
            </div>
          </Card>
        </div>
      )}

      {/* --- ADD GOAL MODAL --- */}
      {showGoalModal && (
          <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <Card className="w-full max-w-md p-6 animate-in slide-in-from-bottom-10 md:zoom-in-95 duration-300" darkMode={darkMode}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>New Savings Goal</h3>
                    <button onClick={() => setShowGoalModal(false)} className="text-slate-400 hover:text-slate-900">✕</button>
                </div>
                <form onSubmit={handleAddGoal} className="space-y-4">
                    <input type="text" required placeholder="Goal Name (e.g. New Laptop)" className={`w-full px-4 py-3 ${darkMode ? 'bg-slate-700 text-white' : 'bg-slate-50 text-slate-900'} rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-500 font-semibold transition-all duration-200 focus:scale-[1.02]`} value={goalFormData.title} onChange={e => setGoalFormData({...goalFormData, title: e.target.value})} />
                    <input type="number" required placeholder="Target Amount" className={`w-full px-4 py-3 ${darkMode ? 'bg-slate-700 text-white' : 'bg-slate-50 text-slate-900'} rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-500 font-semibold transition-all duration-200 focus:scale-[1.02]`} value={goalFormData.targetAmount} onChange={e => setGoalFormData({...goalFormData, targetAmount: e.target.value})} />
                    <input type="number" placeholder="Already Saved (Optional)" className={`w-full px-4 py-3 ${darkMode ? 'bg-slate-700 text-white' : 'bg-slate-50 text-slate-900'} rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-500 font-semibold transition-all duration-200 focus:scale-[1.02]`} value={goalFormData.currentAmount} onChange={e => setGoalFormData({...goalFormData, currentAmount: e.target.value})} />
                    <Button type="submit" className={`w-full ${darkMode ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-slate-900 hover:bg-slate-800'} text-white py-3.5 rounded-xl mt-2 hover:scale-[1.02] active:scale-95 transition-all`}>Create Goal</Button>
                </form>
            </Card>
          </div>
      )}

    </div>
  );
}