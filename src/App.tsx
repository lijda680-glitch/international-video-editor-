import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Video, Bot, Settings, CheckCircle, AlertCircle, Info } from "lucide-react";

export default function App() {
  const [status, setStatus] = useState<{ status: string; botActive: boolean } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => {
        setStatus(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-6"
          >
            <Bot size={16} />
            <span>AI Video Editor Bot</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
          >
            International AI Video Editor
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-400 max-w-2xl mx-auto"
          >
            ቪድዮዎችን በኢንተርናሺናል ደረጃ በጥራት የሚያቀነባብር እና የሚያሳምር የቴሌግራም ቦት።
            <br />
            <span className="text-sm opacity-60 italic">Professional video enhancement with AI-driven presets and global standards.</span>
          </motion.p>
        </header>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          {[
            { icon: "✨", title: "Auto-Enhance", desc: "Smart sharpening" },
            { icon: "🎬", title: "Cinematic", desc: "Movie-like look" },
            { icon: "🌈", title: "Vibrant", desc: "Rich colors" },
            { icon: "🎞️", title: "Classic B&W", desc: "Timeless style" }
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 text-center"
            >
              <div className="text-2xl mb-2">{f.icon}</div>
              <div className="font-medium text-sm">{f.title}</div>
              <div className="text-xs text-slate-500">{f.desc}</div>
            </motion.div>
          ))}
        </div>

        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 mb-12 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold flex items-center gap-3">
              <Settings className="text-indigo-400" />
              የቦቱ ሁኔታ (Bot Status)
            </h2>
            {loading ? (
              <div className="animate-pulse h-8 w-24 bg-slate-800 rounded-full" />
            ) : status?.botActive ? (
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
                <CheckCircle size={14} />
                ተነስቷል (Active)
              </div>
            ) : (
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-medium">
                <AlertCircle size={14} />
                አልተነሳም (Inactive)
              </div>
            )}
          </div>

          {!status?.botActive && (
            <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-2xl p-6 mb-8">
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2 text-indigo-300">
                <Info size={18} />
                እንዴት ማስጀመር ይቻላል? (How to Start)
              </h3>
              <ol className="space-y-4 text-slate-300">
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm font-bold">1</span>
                  <span>ወደ ቴሌግራም በመሄድ <a href="https://t.me/BotFather" target="_blank" className="text-indigo-400 hover:underline">@BotFather</a> ጋር አዲስ ቦት ይፍጠሩ።</span>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm font-bold">2</span>
                  <span>የሚሰጥዎትን <strong>API Token</strong> ኮፒ ያድርጉ።</span>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm font-bold">3</span>
                  <span>በዚህ አፕሊኬሽን <strong>Settings {">"} Secrets</strong> ውስጥ <code>TELEGRAM_BOT_TOKEN</code> በሚል ስም ያስገቡት።</span>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm font-bold">4</span>
                  <span>አፕሊኬሽኑን ሪስታርት ያድርጉት።</span>
                </li>
              </ol>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-slate-800/30 border border-slate-800">
              <Video className="text-indigo-400 mb-4" size={32} />
              <h3 className="text-lg font-medium mb-2">ምርጥ ጥራት (High Quality)</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                ቦቱ ቪድዮዎችን በምርጥ ጥራት (High Bitrate) እና በ FFmpeg ፊልተሮች (Sharpening, Denoising) ያቀነባብራል።
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-800/30 border border-slate-800">
              <Bot className="text-indigo-400 mb-4" size={32} />
              <h3 className="text-lg font-medium mb-2">ቀላል አጠቃቀም (Easy to Use)</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                ቪድዮውን ለቦቱ መላክ ብቻ በቂ ነው፤ ቦቱ ሰርቶ ይመልስልዎታል።
              </p>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <footer className="text-center text-slate-500 text-sm">
          <p>© 2026 AI Video Editor Bot - Built for Telegram</p>
        </footer>
      </div>
    </div>
  );
}
