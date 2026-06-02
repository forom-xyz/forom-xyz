import React, { useState, useEffect } from 'react';
import { pb } from '../lib/pocketbase';

// 1. Define TypeScript interface for your collection records
interface MemoRecord {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
  title: string;
  content: string;
  author: string;
  category: string;
  xp: number;
}

export const PocketBaseExample: React.FC = () => {
  // State for data fetching
  const [memos, setMemos] = useState<MemoRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State for inputs
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  // State for Authentication
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(pb.authStore.model);

  // Listen to Auth state changes
  useEffect(() => {
    const unsubscribe = pb.authStore.onChange((_token, model) => {
      setUser(model);
    });
    return () => unsubscribe();
  }, []);

  // Fetch Memos & Subscribe to Realtime Updates
  useEffect(() => {
    const fetchMemos = async () => {
      try {
        setLoading(true);
        // Fetch full list of records sorted by creation date
        const records = await pb.collection('memos').getFullList<MemoRecord>({
          sort: '-created',
        });
        setMemos(records);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching records:', err);
        setError(err.message || 'Failed to fetch records');
      } finally {
        setLoading(false);
      }
    };

    fetchMemos();

    // 2. Real-time Subscription (PocketBase's superpower for local-first/realtime apps!)
    pb.collection('memos').subscribe<MemoRecord>('*', (e) => {
      const { action, record } = e;

      if (action === 'create') {
        setMemos((prev) => [record, ...prev]);
      } else if (action === 'update') {
        setMemos((prev) => prev.map((m) => (m.id === record.id ? record : m)));
      } else if (action === 'delete') {
        setMemos((prev) => prev.filter((m) => m.id !== record.id));
      }
    });

    // Cleanup subscription on component unmount
    return () => {
      pb.collection('memos').unsubscribe('*');
    };
  }, []);

  // Handle Create Record
  const handleCreateMemo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const data = {
        title: newTitle,
        content: newContent,
        author: user ? user.email : 'Anonymous Associate',
        category: 'Foundations',
        xp: 10,
      };

      // Create new record (this triggers the real-time subscription update automatically)
      await pb.collection('memos').create(data);
      setNewTitle('');
      setNewContent('');
    } catch (err: any) {
      alert('Error creating record: ' + err.message);
    }
  };

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Authenticate a user via their email and password
      const authData = await pb.collection('users').authWithPassword(email, password);
      console.log('Successfully authenticated:', authData);
      setEmail('');
      setPassword('');
    } catch (err: any) {
      alert('Authentication failed: ' + err.message);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    pb.authStore.clear(); // Logs out user and clears token/session
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-slate-900 text-white rounded-xl shadow-2xl space-y-8 font-sans">
      <header className="border-b border-slate-700 pb-4">
        <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
          FOROM &times; PocketBase Portal
        </h2>
        <p className="text-slate-400 mt-1">Proof-of-concept database integration with real-time sync.</p>
      </header>

      {/* Auth Status & Login Form */}
      <section className="bg-slate-800 p-6 rounded-lg border border-slate-700">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span>🔐</span> Authentication Service
        </h3>

        {user ? (
          <div className="space-y-3">
            <div className="p-3 bg-emerald-950/50 border border-emerald-500/30 rounded text-emerald-300">
              Logged in as <strong className="font-semibold">{user.email || user.username}</strong> (ID: {user.id})
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-medium rounded transition duration-150"
            >
              Sign Out / Clear Auth Store
            </button>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Email / Username</label>
              <input
                type="text"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white focus:outline-none focus:border-amber-400"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white focus:outline-none focus:border-amber-400"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold rounded transition duration-150"
            >
              Authenticate User
            </button>
          </form>
        )}
      </section>

      {/* Record Creation Form */}
      <section className="bg-slate-800 p-6 rounded-lg border border-slate-700">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span>📝</span> Create a New Memo
        </h3>
        <form onSubmit={handleCreateMemo} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Title</label>
            <input
              type="text"
              placeholder="Memo Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white focus:outline-none focus:border-amber-400"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Content</label>
            <textarea
              placeholder="Write your memo content here..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full h-24 px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white focus:outline-none focus:border-amber-400 resize-y"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-extrabold rounded transition duration-150"
          >
            Deploy Memo to Network
          </button>
        </form>
      </section>

      {/* Records View List */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>📊</span> Collective Memos Registry
          </div>
          <span className="text-xs bg-amber-500/20 text-amber-400 px-2.5 py-1 rounded-full border border-amber-500/30">
            Realtime Active
          </span>
        </h3>

        {loading ? (
          <div className="text-center py-6 text-slate-500">Loading memos from PocketBase...</div>
        ) : error ? (
          <div className="p-4 bg-rose-950/50 border border-rose-500/30 rounded text-rose-300">
            Error: {error}
          </div>
        ) : memos.length === 0 ? (
          <div className="text-center py-8 bg-slate-800/50 border border-dashed border-slate-700 rounded text-slate-500">
            No memos stored yet. Be the first to deploy one!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {memos.map((memo) => (
              <div
                key={memo.id}
                className="p-4 bg-slate-800 border border-slate-700 rounded-lg shadow hover:border-slate-500 transition duration-150 space-y-2"
              >
                <div className="flex items-start justify-between">
                  <h4 className="font-bold text-lg text-amber-300">{memo.title}</h4>
                  <span className="text-xs bg-slate-700 px-2 py-0.5 rounded text-slate-300">{memo.category}</span>
                </div>
                <p className="text-sm text-slate-300 line-clamp-3">{memo.content || '(Empty content)'}</p>
                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-700/50">
                  <span>By: <span className="text-slate-300 font-semibold">{memo.author}</span></span>
                  <span>+{memo.xp} XP</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
