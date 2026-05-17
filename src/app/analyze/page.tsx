'use client';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useAIAnalysis } from '@/hooks/useAIAnalysis';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import AgentThinking from '@/components/animations/AgentThinking';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Upload, FileText, Type, X, AlertCircle, Sparkles, ChevronDown } from 'lucide-react';
import { CONTRACT_TYPES, USER_PERSPECTIVES, PREFERRED_LANGUAGES, DEMO_CONTRACT_TEXT, MAX_FILE_SIZE_MB } from '@/lib/constants';
import { extractPDFText } from '@/lib/document/pdfExtractor';
import { extractDOCXText } from '@/lib/document/docxExtractor';
import { cleanText } from '@/lib/document/textCleaner';
import type { ContractType, UserPerspective } from '@/types/contract';

type Tab = 'upload' | 'paste';

const agentSteps = [
  { step: '1', label: 'Clause Extraction',      color: '#818CF8' },
  { step: '2', label: 'Risk Classification',     color: '#FB923C' },
  { step: '3', label: 'Adversarial Reasoning',   color: '#F87171' },
  { step: '4', label: 'Plain Language Explain',  color: '#60A5FA' },
  { step: '5', label: 'Negotiation Planning',    color: '#34D399' },
  { step: '6', label: 'Report Generation',       color: '#A78BFA' },
];

const selectStyle: React.CSSProperties = {
  width: '100%', background: 'rgba(255,255,255,0.05)', border: '1.5px solid var(--border-default)',
  borderRadius: 10, color: 'var(--text-primary)', padding: '0.7rem 2.25rem 0.7rem 0.85rem',
  fontSize: '0.875rem', fontFamily: "'Outfit', sans-serif", outline: 'none',
  appearance: 'none', WebkitAppearance: 'none',
};

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <select value={value} onChange={e => onChange(e.target.value)} style={selectStyle}>
          {options.map(o => <option key={o} value={o} style={{ background: '#0E0E1A' }}>{o}</option>)}
        </select>
        <ChevronDown size={14} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
      </div>
    </div>
  );
}

function AnalyzeContent() {
  const { user } = useAuth();
  const router = useRouter();
  const { analyzing, currentStep, currentMessage, run } = useAIAnalysis();

  const [tab, setTab] = useState<Tab>('paste');
  const [pastedText, setPastedText] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [fileName, setFileName] = useState('');
  const [contractType, setContractType] = useState<ContractType>('Employment');
  const [perspective, setPerspective] = useState<UserPerspective>('Employee');
  const [preferredLanguage, setPreferredLanguage] = useState('Hinglish');
  const [extracting, setExtracting] = useState(false);
  const [extractError, setExtractError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const activeText = tab === 'paste' ? pastedText : extractedText;

  const handleFile = useCallback(async (file: File) => {
    setExtractError('');
    setExtractedText('');
    setFileName(file.name);

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setExtractError(`File too large. Max ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    setExtracting(true);
    try {
      let text = '';
      if (file.type === 'application/pdf') {
        text = await extractPDFText(file);
      } else if (file.name.endsWith('.docx')) {
        text = await extractDOCXText(file);
      } else {
        text = await file.text();
      }
      setExtractedText(cleanText(text));
      toast.success('Text extracted successfully!');
    } catch {
      setExtractError('Could not extract text. Please paste the text manually.');
      setTab('paste');
      toast.error('Extraction failed — switch to paste mode');
    } finally {
      setExtracting(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleAnalyze = async () => {
    if (!user) return;
    const text = activeText.trim();
    if (!text || text.length < 50) {
      toast.error('Please provide at least 50 characters of contract text');
      return;
    }
    const id = await run({ uid: user.uid, contractText: text, contractType, perspective, preferredLanguage, fileName });
    if (id) {
      toast.success('Analysis complete!');
      router.push(`/report/${id}`);
    }
  };

  return (
    <div style={{ minHeight: '100vh', paddingTop: '5.5rem', paddingBottom: '4rem', position: 'relative', zIndex: 10 }}>
      <div className="container">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: "'Rozha One', serif", fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', marginBottom: '0.4rem' }}>
            Analyze a <span className="gradient-text">Contract</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Upload or paste your contract — NyaySaathi’s 6 AI agents will read every clause, score every risk, and tell you what to do.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem', alignItems: 'start' }}>

          {/* ── Left: Input Area ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Tab switcher */}
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '0.25rem', width: 'fit-content', gap: '0.25rem' }}>
              {[
                { id: 'paste' as Tab, label: 'Paste Text', icon: Type },
                { id: 'upload' as Tab, label: 'Upload File', icon: Upload },
              ].map(t => {
                const Icon = t.icon;
                const active = tab === t.id;
                return (
                  <button key={t.id} onClick={() => setTab(t.id)} style={{
                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                    padding: '0.45rem 1rem', borderRadius: 9, fontSize: '0.85rem',
                    fontWeight: 600, fontFamily: "'Outfit', sans-serif", cursor: 'pointer',
                    border: 'none', transition: 'all 0.2s ease',
                    background: active ? 'rgba(99,102,241,0.18)' : 'transparent',
                    color: active ? '#818CF8' : 'var(--text-muted)',
                  }}>
                    <Icon size={14} /> {t.label}
                  </button>
                );
              })}
            </div>

            {/* Upload zone */}
            {tab === 'upload' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                style={{
                  position: 'relative', border: `2px dashed ${isDragOver ? 'var(--saffron)' : 'var(--border-default)'}`,
                  borderRadius: 16, padding: '3rem 2rem', textAlign: 'center',
                  background: isDragOver ? 'rgba(249,115,22,0.04)' : 'rgba(255,255,255,0.02)',
                  transition: 'all 0.2s ease',
                }}>
                <input type="file" accept=".pdf,.docx,.txt" onChange={handleFileInput}
                  style={{ position: 'absolute', inset: 0, opacity: 0, width: '100%', cursor: 'pointer' }} />
                <Upload size={36} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem' }} />
                <p style={{ fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  PDF, DOCX ya TXT yahan drop karo
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ya click karke browse karo — max {MAX_FILE_SIZE_MB}MB</p>
                {extracting && <p style={{ color: '#818CF8', fontSize: '0.82rem', marginTop: '0.75rem' }}>⚡ Extracting text...</p>}
                {fileName && !extracting && <p style={{ color: '#34D399', fontSize: '0.82rem', marginTop: '0.75rem' }}>✓ {fileName}</p>}
                {extractError && <p style={{ color: '#F87171', fontSize: '0.82rem', marginTop: '0.75rem' }}>{extractError}</p>}
                {extractedText && (
                  <div style={{ marginTop: '1rem', textAlign: 'left', padding: '0.75rem', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', maxHeight: 120, overflowY: 'auto' }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                      {extractedText.slice(0, 400)}...
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Paste textarea */}
            {tab === 'paste' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ position: 'relative' }}>
                  <textarea
                    value={pastedText}
                    onChange={e => setPastedText(e.target.value)}
                    placeholder="Paste your contract text here...&#10;&#10;Tip: Click 'Load demo contract' below to try an example employment agreement."
                    rows={14}
                    style={{
                      width: '100%', background: 'rgba(255,255,255,0.04)', border: '1.5px solid var(--border-default)',
                      borderRadius: 14, color: 'var(--text-primary)', padding: '1rem',
                      fontSize: '0.875rem', fontFamily: 'monospace', outline: 'none', resize: 'vertical',
                      lineHeight: 1.75, transition: 'border-color 0.2s ease',
                    }}
                    onFocus={e => (e.target.style.borderColor = 'var(--indigo)')}
                    onBlur={e => (e.target.style.borderColor = 'var(--border-default)')}
                  />
                  {pastedText && (
                    <button onClick={() => setPastedText('')} style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4, borderRadius: 6, display: 'flex', alignItems: 'center' }}>
                      <X size={14} />
                    </button>
                  )}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{pastedText.length.toLocaleString()} characters</span>
                  <button onClick={() => setPastedText(DEMO_CONTRACT_TEXT)} style={{ fontSize: '0.78rem', color: 'var(--indigo-light)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Outfit', sans-serif" }}>
                    Load demo contract →
                  </button>
                </div>
              </motion.div>
            )}

            {/* Agent animation or Analyze button */}
            <AnimatePresence mode="wait">
              {analyzing ? (
                <AgentThinking key="thinking" currentStep={currentStep} currentMessage={currentMessage} />
              ) : (
                <motion.div key="btn" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <button onClick={handleAnalyze} disabled={!activeText.trim() || activeText.length < 50}
                    className="btn-primary"
                    style={{ width: '100%', padding: '1rem', fontSize: '1rem', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', opacity: (!activeText.trim() || activeText.length < 50) ? 0.4 : 1, cursor: (!activeText.trim() || activeText.length < 50) ? 'not-allowed' : 'pointer' }}>
                    <Sparkles size={18} /> Analyze with AI
                    <span style={{ fontSize: '0.75rem', opacity: 0.7, marginLeft: '0.25rem' }}>· 6-agent pipeline</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {!activeText && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}>
                <AlertCircle size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Click &quot;Load demo contract&quot; above to instantly try an employment contract example.
                </p>
              </div>
            )}
          </div>

          {/* ── Right: Settings ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <FileText size={15} color="#818CF8" />
                <h3 style={{ fontSize: '0.9rem' }}>Analysis Settings</h3>
              </div>
              <SelectField label="Contract Type" value={contractType} onChange={v => setContractType(v as ContractType)} options={CONTRACT_TYPES} />
              <SelectField label="Your Perspective" value={perspective} onChange={v => setPerspective(v as UserPerspective)} options={USER_PERSPECTIVES} />
              <SelectField label="Explanation Style" value={preferredLanguage} onChange={setPreferredLanguage} options={PREFERRED_LANGUAGES} />
            </div>

            {/* What happens */}
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                What happens next
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                {agentSteps.map(item => (
                  <div key={item.step} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 800, flexShrink: 0, background: `${item.color}18`, color: item.color, border: `1px solid ${item.color}35` }}>
                      {item.step}
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .analyze-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

export default function AnalyzePage() {
  return <ProtectedRoute><AnalyzeContent /></ProtectedRoute>;
}
