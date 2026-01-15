"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { codeToHtml } from "shiki";
import { toPng, toBlob } from "html-to-image";

const LANGUAGES = [
  { id: "typescript", name: "TypeScript", ext: "ts" },
  { id: "javascript", name: "JavaScript", ext: "js" },
  { id: "python", name: "Python", ext: "py" },
  { id: "html", name: "HTML", ext: "html" },
  { id: "css", name: "CSS", ext: "css" },
  { id: "java", name: "Java", ext: "java" },
  { id: "csharp", name: "C#", ext: "cs" },
  { id: "cpp", name: "C++", ext: "cpp" },
  { id: "go", name: "Go", ext: "go" },
  { id: "rust", name: "Rust", ext: "rs" },
  { id: "php", name: "PHP", ext: "php" },
  { id: "ruby", name: "Ruby", ext: "rb" },
  { id: "swift", name: "Swift", ext: "swift" },
  { id: "kotlin", name: "Kotlin", ext: "kt" },
  { id: "sql", name: "SQL", ext: "sql" },
  { id: "json", name: "JSON", ext: "json" },
  { id: "yaml", name: "YAML", ext: "yaml" },
  { id: "markdown", name: "Markdown", ext: "md" },
  { id: "xml", name: "XML", ext: "xml" },
  { id: "bash", name: "Bash", ext: "sh" },
];

export default function Home() {
  const [theme, setTheme] = useState("monokai"); // Default visual theme setting
  const [codeTheme, setCodeTheme] = useState("monokai"); // Shiki theme
  const [showBackground, setShowBackground] = useState(true);
  const [padding, setPadding] = useState(64);
  const [shadow, setShadow] = useState(40);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [showFilename, setShowFilename] = useState(true);
  const [language, setLanguage] = useState("typescript");
  const [code, setCode] = useState(`import { useState, useEffect } from 'react';

// Custom hook for handling user authentication state
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = supabase.auth.onAuthStateChange((_event, session) => {
       setUser(session?.user ?? null);
       setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
};`);

  const [highlightedCode, setHighlightedCode] = useState("");
  const editorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Background styling based on selection
  const [backgroundStyle, setBackgroundStyle] = useState(
    "bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500"
  );
  const [customBackground, setCustomBackground] = useState("");

  // Update highlighted code when code or theme changes
  useEffect(() => {
    const highlight = async () => {
      try {
        const html = await codeToHtml(code, {
          lang: language,
          theme: codeTheme,
        });
        setHighlightedCode(html);
      } catch (error) {
        console.error("Highlighting error:", error);
        // Fallback or loading state could go here, for now just show plain code
        setHighlightedCode(`<pre><code>${code}</code></pre>`);
      }
    };
    highlight();
  }, [code, language, codeTheme]);

  // Sync scroll between textarea and code display
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (editorRef.current) {
      // We might need to find the scroll element inside the shiki output, 
      // usually it's the 'pre' tag.
      const pre = editorRef.current.querySelector('pre');
      if (pre) {
        pre.scrollTop = e.currentTarget.scrollTop;
        pre.scrollLeft = e.currentTarget.scrollLeft;
      }
    }
  };

  const exportImage = useCallback(async () => {
    const node = document.getElementById("export-container");
    if (!node) return;

    try {
      // Temporarily hide the watermark/other controls if needed, or keep them.
      // The design has a watermark.
      const dataUrl = await toPng(node, { pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = 'devsnap-export.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Export error:", err);
    }
  }, []);

  // Theme mapping logic (Button UI Theme -> Shiki Theme)
  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    // Map basic UI themes to Shiki themes
    switch (newTheme) {
      case 'monokai': setCodeTheme('monokai'); break;
      case 'nord': setCodeTheme('nord'); break;
      case 'dracula': setCodeTheme('dracula'); break;
      case 'light': setCodeTheme('github-light'); break;
      default: setCodeTheme('monokai');
    }
  };


  return (
    <div className="min-h-screen flex flex-col font-sans antialiased overflow-hidden selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Header */}
      <header className="flex sticky bg-[#050505]/80 h-14 z-50 border-white/5 border-b pr-6 pl-6 top-0 backdrop-blur-md items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Spade" className="h-20 w-auto" />
        </div>

        <div className="flex items-center gap-4">

          <a
            href="https://github.com/clover-kit/Spade"
            target="_blank"
            rel="noopener noreferrer"
            suppressHydrationWarning
            className="bg-white text-black text-xs font-medium px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors flex items-center gap-1.5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              role="img"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5c.08-1.25-.27-2.48-1-3.5c.28-1.15.28-2.35 0-3.5c0 0-1 0-3 1.5c-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5c-.39.49-.68 1.05-.85 1.65S8.93 17.38 9 18v4"></path>
              <path d="M9 18c-4.51 2-5-2-7-2"></path>
            </svg>
            Star on GitHub
          </a>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar Controls */}
        <aside className="flex flex-col overflow-y-auto bg-[#0a0a0a] w-80 border-white/5 border-r">
          <div className="p-5 space-y-8">
            {/* Theme Selection */}
            <div className="space-y-3">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  role="img"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22a1 1 0 0 1 0-20a10 9 0 0 1 10 9a5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"></path>
                  <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle>
                  <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle>
                  <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle>
                  <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle>
                </svg>{" "}
                Theme
              </label>
              <div className="grid grid-cols-4 gap-2">
                <button
                  suppressHydrationWarning
                  onClick={() => handleThemeChange("monokai")}
                  className={`aspect-square rounded-lg bg-[#272822] border border-transparent hover:border-gray-600 transition-all ${theme === 'monokai' ? 'ring-2 ring-indigo-500 border-indigo-500' : ''}`}
                  title="Monokai"
                ></button>
                <button
                  suppressHydrationWarning
                  onClick={() => handleThemeChange("nord")}
                  className={`aspect-square rounded-lg bg-[#2e3440] border border-transparent hover:border-gray-600 transition-all ${theme === 'nord' ? 'ring-2 ring-indigo-500 border-indigo-500' : ''}`}
                  title="Nord"
                ></button>
                <button
                  suppressHydrationWarning
                  onClick={() => handleThemeChange("dracula")}
                  className={`aspect-square rounded-lg bg-[#282a36] border border-transparent hover:border-gray-600 transition-all ${theme === 'dracula' ? 'ring-2 ring-indigo-500 border-indigo-500' : ''}`}
                  title="Dracula"
                ></button>
                <button
                  suppressHydrationWarning
                  onClick={() => handleThemeChange("light")}
                  className={`aspect-square rounded-lg bg-[#fafafa] border border-transparent hover:border-gray-600 transition-all ${theme === 'light' ? 'ring-2 ring-indigo-500 border-indigo-500' : ''}`}
                  title="Light"
                ></button>
              </div>
            </div>

            {/* Language Selection */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Language</label>
              <select
                suppressHydrationWarning
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-[#18181b] text-gray-300 text-xs border border-white/10 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.id} value={lang.id}>{lang.name}</option>
                ))}
              </select>
            </div>


            {/* Window Settings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Window
                </label>
                <span className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded text-gray-400">
                  macOS
                </span>
              </div>

              {/* Background Toggle */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-300">
                  <span>Background</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      suppressHydrationWarning
                      type="checkbox"
                      checked={showBackground}
                      onChange={(e) => setShowBackground(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4 bg-gray-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                <div className="grid grid-cols-5 gap-2 pt-1">
                  <div
                    onClick={() => { setBackgroundStyle("bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500"); setCustomBackground(""); }}
                    className="h-6 rounded bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 cursor-pointer ring-1 ring-white"
                  ></div>
                  <div
                    onClick={() => { setBackgroundStyle("bg-gradient-to-br from-blue-400 to-indigo-600"); setCustomBackground(""); }}
                    className="cursor-pointer hover:opacity-100 bg-gradient-to-br from-blue-400 to-indigo-600 opacity-50 h-6 rounded"
                  ></div>
                  <div
                    onClick={() => { setBackgroundStyle("bg-gradient-to-br from-emerald-400 to-cyan-500"); setCustomBackground(""); }}
                    className="h-6 rounded bg-gradient-to-br from-emerald-400 to-cyan-500 cursor-pointer opacity-50 hover:opacity-100"
                  ></div>
                  <div
                    onClick={() => { setBackgroundStyle("bg-gradient-to-br from-slate-900 to-slate-700"); setCustomBackground(""); }}
                    className="h-6 rounded bg-gradient-to-br from-slate-900 to-slate-700 cursor-pointer opacity-50 hover:opacity-100"
                  ></div>
                  <div
                    onClick={() => { setBackgroundStyle("bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"); setCustomBackground(""); }}
                    className="h-6 rounded border border-gray-700 cursor-pointer flex items-center justify-center opacity-50 hover:opacity-100 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                  </div>
                </div>
                <div className="pt-2">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                    <span>Custom CSS</span>
                    {customBackground && <button onClick={() => setCustomBackground("")} className="text-[10px] text-indigo-400 hover:text-indigo-300">Clear</button>}
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. #121212 or linear-gradient(...)"
                    value={customBackground}
                    onChange={(e) => setCustomBackground(e.target.value)}
                    className="w-full bg-[#18181b] text-xs text-white p-2 rounded border border-white/5 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Padding Slider */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Padding</span>
                  <span>{padding}px</span>
                </div>
                <input
                  suppressHydrationWarning
                  type="range"
                  min="0"
                  max="128"
                  value={padding}
                  onChange={(e) => setPadding(Number(e.target.value))}
                  className="accent-indigo-500"
                />
              </div>

              {/* Blur Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Shadow</span>
                  <span>{shadow}</span>
                </div>
                <input
                  suppressHydrationWarning
                  type="range"
                  min="0"
                  max="100"
                  value={shadow}
                  onChange={(e) => setShadow(Number(e.target.value))}
                  className="accent-indigo-500"
                />
              </div>
            </div>

            {/* Editor Settings */}
            <div className="space-y-3 pt-2 border-t border-white/5">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                Editor
              </label>

              <div className="flex items-center justify-between text-xs text-gray-300">
                <span className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    role="img"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    className="text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 5h10m-10 7h10m-10 7h10M4 4h1v5M4 9h2m.5 11H3.4c0-1 2.6-1.925 2.6-3.5a1.5 1.5 0 0 0-2.6-1.02"></path>
                  </svg>
                  Line Numbers
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    suppressHydrationWarning
                    type="checkbox"
                    checked={showLineNumbers}
                    onChange={(e) => setShowLineNumbers(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4 bg-gray-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-300">
                <span className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    role="img"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    className="text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <g
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    >
                      <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path>
                      <path d="M14 2v5a1 1 0 0 0 1 1h5m-10 4.5L8 15l2 2.5m4-5l2 2.5l-2 2.5"></path>
                    </g>
                  </svg>
                  Filename
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    suppressHydrationWarning
                    type="checkbox"
                    checked={showFilename}
                    onChange={(e) => setShowFilename(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-indigo-600 bg-gray-800 w-8 h-4 rounded-full"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-auto p-5 border-t border-white/5 space-y-3 bg-[#0a0a0a]">
            <button
              suppressHydrationWarning
              onClick={exportImage}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/20"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="img"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <g
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                >
                  <path d="M12 15V3m9 12v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <path d="m7 10l5 5l5-5"></path>
                </g>
              </svg>
              Export PNG
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button
                suppressHydrationWarning
                onClick={() => navigator.clipboard.writeText(code)}
                className="bg-[#18181b] hover:bg-[#27272a] text-gray-300 text-xs font-medium py-2 rounded-lg transition-colors border border-white/5 flex items-center justify-center gap-1.5"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  role="img"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <g
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  >
                    <rect
                      width="14"
                      height="14"
                      x="8"
                      y="8"
                      rx="2"
                      ry="2"
                    ></rect>
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                  </g>
                </svg>
                Copy
              </button>
              <button
                suppressHydrationWarning
                onClick={async () => {
                  const node = document.getElementById("export-container");
                  if (node) {
                    try {
                      const blob = await toBlob(node, { pixelRatio: 2 });
                      if (blob) {
                        await navigator.clipboard.write([
                          new ClipboardItem({ 'image/png': blob })
                        ]);
                        alert("Image copied to clipboard! Paste it into the tweet.");
                      }
                    } catch (e) {
                      console.error("Failed to copy image", e);
                    }
                  }

                  const tweetText = `Check out this code snippet made with Spade!`;
                  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
                  window.open(url, '_blank');
                }}
                className="bg-[#00acee]/10 hover:bg-[#00acee]/20 text-[#00acee] text-xs font-medium py-2 rounded-lg transition-colors border border-[#00acee]/20 flex items-center justify-center gap-1.5"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  role="img"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6c2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4c-.9-4.2 4-6.6 7-3.8c1.1 0 3-1.2 3-1.2"
                  ></path>
                </svg>
                Tweet
              </button>
            </div>
          </div>
        </aside>

        {/* Preview Area */}
        <section className="flex-1 bg-[#050505] relative flex items-center justify-center p-8 overflow-hidden">
          {/* Grid Background */}
          <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none"></div>

          {/* Canvas Container */}
          <div
            id="export-container"
            className="relative group transition-all duration-500 ease-out transform scale-100"
          >
            {/* The Background Gradient Wrapper */}
            <div
              style={{
                padding: showBackground ? `${padding}px` : '0px',
                background: showBackground && customBackground ? customBackground : (showBackground ? undefined : 'transparent'),
              }}
              className={`overflow-hidden transition-all duration-300 ${!customBackground && showBackground ? backgroundStyle : ''} rounded-xl relative shadow-2xl`}
            >
              {/* Code Window */}
              <div
                style={{
                  boxShadow: `0 0 ${shadow}px rgba(0,0,0,0.5)`
                }}
                className={`min-w-[500px] max-w-2xl overflow-hidden flex flex-col ${theme === 'light' ? 'bg-white/95 border-black/10' : 'bg-[#121212]/95 border-white/10'} backdrop-blur-xl rounded-lg border`}
              >
                {/* Window Header */}
                <div className={`h-10 border-b flex items-center justify-between px-4 select-none ${theme === 'light' ? 'bg-black/5 border-black/5' : 'bg-white/5 border-white/5'}`}>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]"></div>
                  </div>
                  {showFilename && (
                    <div className={`text-xs font-medium font-sans flex items-center gap-1.5 opacity-60 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        role="img"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        className=""
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <g
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                        >
                          <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                          <path d="M14 2v4a2 2 0 0 0 2 2h4m-10 4a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1a1 1 0 0 1 1 1v1a1 1 0 0 0 1 1m4 0a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1a1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1"></path>
                        </g>
                      </svg>
                      {(() => {
                        const lang = LANGUAGES.find(l => l.id === language);
                        return `code.${lang ? lang.ext : 'txt'}`;
                      })()}
                    </div>
                  )}
                  <div className="w-10"></div> {/* Spacer for centering */}
                </div>

                {/* Code Content */}
                <div className="relative group min-h-[100px]">
                  {/* Line Numbers */}
                  {showLineNumbers && (
                    <div
                      className={`absolute top-0 left-0 bottom-0 w-12 flex flex-col items-end pt-5 pr-2 select-none pointer-events-none opacity-40 font-mono text-sm leading-[1.5] ${theme === 'light' ? 'text-black' : 'text-white'}`}
                      style={{
                        transform: `translateY(-${editorRef.current?.scrollTop || 0}px)`
                      }}
                    >
                      {Array.from({ length: code.split('\n').length }).map((_, i) => (
                        <div key={i}>{i + 1}</div>
                      ))}
                    </div>
                  )}

                  {/* Visual Layer (Shiki) */}
                  <div
                    ref={editorRef}
                    className={`text-sm font-mono overflow-auto max-h-[600px] pointer-events-none ${showLineNumbers ? 'pl-16' : 'pl-5'} pt-5 pr-5 pb-5`}
                    dangerouslySetInnerHTML={{ __html: highlightedCode }}
                    style={{
                      tabSize: 2,
                      lineHeight: '1.5',
                    }}
                  ></div>

                  {/* Editing Layer (Transparent Textarea) */}
                  <textarea
                    suppressHydrationWarning
                    ref={textareaRef}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    onScroll={handleScroll}
                    spellCheck={false}
                    className={`absolute inset-0 w-full h-full text-sm font-mono bg-transparent text-transparent caret-white resize-none border-none outline-none overflow-auto whitespace-pre z-10 ${showLineNumbers ? 'pl-16' : 'pl-5'} pt-5 pr-5 pb-5`}
                    style={{
                      color: 'transparent',
                      lineHeight: '1.5',
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Tab') {
                        e.preventDefault();
                        const start = e.currentTarget.selectionStart;
                        const end = e.currentTarget.selectionEnd;
                        const value = e.currentTarget.value;
                        setCode(value.substring(0, start) + '  ' + value.substring(end));
                        setTimeout(() => {
                          e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 2;
                        }, 0);
                      }
                    }}
                  />
                </div>
              </div>

              {/* Watermark (Optional: Can make it conditional or remove) */}

            </div>
          </div>

          {/* Floating Quick Actions */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-[#18181b] border border-white/10 p-1.5 rounded-full flex gap-1 shadow-2xl z-10">
            <button suppressHydrationWarning className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors relative group">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="img"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 14L4 9l5-5"></path>
                <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11"></path>
              </svg>
              <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 text-[10px] bg-black text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                Undo
              </span>
            </button>
            <button suppressHydrationWarning className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors relative group">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="img"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 14l5-5l-5-5"></path>
                <path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13"></path>
              </svg>
              <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 text-[10px] bg-black text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                Redo
              </span>
            </button>
            <div className="w-px bg-white/10 mx-1 my-1"></div>
            <button suppressHydrationWarning className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors relative group">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="img"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="14" x="2" y="3" rx="2"></rect>
                <path d="M8 21h8m-4-4v4"></path>
              </svg>
              <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 text-[10px] bg-black text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                Center
              </span>
            </button>
          </div>
        </section>
      </main>
    </div >
  );
}
