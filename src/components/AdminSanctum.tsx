import React, { useState, useEffect } from 'react';
import { Project, TimelineEvent } from '../types';
import { 
  KeyRound, 
  Lock, 
  Inbox, 
  Briefcase, 
  Compass, 
  Milestone, 
  CheckCircle, 
  Trash2, 
  Plus, 
  Save, 
  LogOut, 
  AlertCircle,
  Eye,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminSanctumProps {
  onRefreshData: () => void;
  projects: Project[];
  skills: any[]; // Categories
  chronicle: TimelineEvent[];
}

interface Inquiry {
  id: number;
  name: string;
  email: string;
  subject: string;
  body: string;
  timestamp: string;
  status: 'unread' | 'read' | 'archived';
}

export default function AdminSanctum({ onRefreshData, projects, skills, chronicle }: AdminSanctumProps) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('abhishek_admin_token'));
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Tab navigation
  const [activeTab, setActiveTab] = useState<'inquiries' | 'projects' | 'skills' | 'chronicle' | 'security'>('inquiries');

  // Inquiries State
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [isLoadingInquiries, setIsLoadingInquiries] = useState(false);

  // Password reset state
  const [newPassword, setNewPassword] = useState('');
  const [securitySuccess, setSecuritySuccess] = useState('');
  const [securityError, setSecurityError] = useState('');

  // Project Editing states
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [projId, setProjId] = useState('');
  const [projTitle, setProjTitle] = useState('');
  const [projCategory, setProjCategory] = useState<'Full-Stack' | 'Backend' | 'Frontend' | 'Database'>('Full-Stack');
  const [projPeriod, setProjPeriod] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projLongDesc, setProjLongDesc] = useState('');
  const [projTech, setProjTech] = useState(''); // comma separated
  const [projFeatures, setProjFeatures] = useState(''); // newline separated
  const [projSchema, setProjSchema] = useState('');
  const [projStats, setProjStats] = useState(''); // JSON string of label/value

  // Skill Editing states
  const [editingSkill, setEditingSkill] = useState<any | null>(null);
  const [skillCategory, setSkillCategory] = useState('Backend Architecture');
  const [skillName, setSkillName] = useState('');
  const [skillLevel, setSkillLevel] = useState(85);
  const [skillDetail, setSkillDetail] = useState('');

  // Chronicle Editing states
  const [editingChronicle, setEditingChronicle] = useState<any | null>(null);
  const [chronYear, setChronYear] = useState('');
  const [chronTitle, setChronTitle] = useState('');
  const [chronOrg, setChronOrg] = useState('');
  const [chronDesc, setChronDesc] = useState('');
  const [chronType, setChronType] = useState<'experience' | 'landmark'>('experience');

  // Fetch inquiries if authenticated
  useEffect(() => {
    if (token) {
      fetchInquiries();
    }
  }, [token]);

  const fetchInquiries = async () => {
    setIsLoadingInquiries(true);
    try {
      const res = await fetch('/api/admin/inquiries', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setInquiries(data);
      } else {
        // Token might have expired or be invalid
        handleLogout();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingInquiries(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsLoggingIn(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('abhishek_admin_token', data.token);
        setToken(data.token);
        setPassword('');
      } else {
        setAuthError(data.error || 'Access denied by local authority.');
      }
    } catch (err) {
      setAuthError('Connection to ledger authorities failed.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('abhishek_admin_token');
    setToken(null);
    setSelectedInquiry(null);
  };

  const handleUpdateInquiryStatus = async (id: number, status: 'read' | 'archived') => {
    try {
      const res = await fetch('/api/admin/inquiries/status', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status } : inq));
        if (selectedInquiry && selectedInquiry.id === id) {
          setSelectedInquiry(prev => prev ? { ...prev, status } : null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteInquiry = async (id: number) => {
    if (!window.confirm("Do you wish to strike this entry from your logs?")) return;
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setInquiries(prev => prev.filter(inq => inq.id !== id));
        if (selectedInquiry && selectedInquiry.id === id) {
          setSelectedInquiry(null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Project SAVE
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projId || !projTitle || !projCategory) return;

    let parsedStats = [];
    try {
      parsedStats = projStats ? JSON.parse(projStats) : [];
    } catch (e) {
      alert("Invalid JSON format for Stats ledger. Use format: [{\"label\":\"Speed\",\"value\":\"1ms\"}]");
      return;
    }

    const payload = {
      id: projId,
      title: projTitle,
      category: projCategory,
      period: projPeriod || 'Present',
      description: projDesc,
      longDescription: projLongDesc,
      techStack: projTech.split(',').map(s => s.trim()).filter(Boolean),
      keyFeatures: projFeatures.split('\n').map(s => s.trim()).filter(Boolean),
      schemaLayout: projSchema,
      stats: parsedStats,
      sortOrder: 0
    };

    try {
      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        onRefreshData();
        setEditingProject(null);
        clearProjectForm();
        alert("Project logged successfully in database.");
      } else {
        const d = await res.json();
        alert("Error saving: " + d.error);
      }
    } catch (err) {
      alert("Network server error.");
    }
  };

  // Populate project edit form
  const populateProjectForm = (p: Project) => {
    setEditingProject(p);
    setProjId(p.id);
    setProjTitle(p.title);
    setProjCategory(p.category);
    setProjPeriod(p.period);
    setProjDesc(p.description);
    setProjLongDesc(p.longDescription);
    setProjTech(p.techStack.join(', '));
    setProjFeatures(p.keyFeatures.join('\n'));
    setProjSchema(p.schemaLayout || '');
    setProjStats(JSON.stringify(p.stats || []));
  };

  const clearProjectForm = () => {
    setEditingProject(null);
    setProjId('');
    setProjTitle('');
    setProjCategory('Full-Stack');
    setProjPeriod('');
    setProjDesc('');
    setProjLongDesc('');
    setProjTech('');
    setProjFeatures('');
    setProjSchema('');
    setProjStats('[]');
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm(`Strike out project "${id}"?`)) return;
    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        onRefreshData();
        alert("Project struck out.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Skill SAVE
  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName) return;

    const payload = {
      id: editingSkill?.id || null,
      category: skillCategory,
      name: skillName,
      level: skillLevel,
      detail: skillDetail
    };

    try {
      const res = await fetch('/api/admin/skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        onRefreshData();
        clearSkillForm();
        alert("Skill configuration saved.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const populateSkillForm = (sk: any, cat: string) => {
    setEditingSkill(sk);
    setSkillCategory(cat);
    setSkillName(sk.name);
    setSkillLevel(sk.level);
    setSkillDetail(sk.detail);
  };

  const clearSkillForm = () => {
    setEditingSkill(null);
    setSkillName('');
    setSkillLevel(80);
    setSkillDetail('');
  };

  const handleDeleteSkill = async (id: number) => {
    if (!window.confirm("Strike out this instrument calibration?")) return;
    try {
      const res = await fetch(`/api/admin/skills/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Chronicle SAVE
  const handleSaveChronicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chronYear || !chronTitle || !chronOrg) return;

    const payload = {
      id: editingChronicle?.id || null,
      year: chronYear,
      title: chronTitle,
      organization: chronOrg,
      description: chronDesc,
      type: chronType
    };

    try {
      const res = await fetch('/api/admin/chronicle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        onRefreshData();
        clearChronicleForm();
        alert("Chronicle entry filed.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const populateChronicleForm = (c: any) => {
    setEditingChronicle(c);
    setChronYear(c.year);
    setChronTitle(c.title);
    setChronOrg(c.organization);
    setChronDesc(c.description);
    setChronType(c.type);
  };

  const clearChronicleForm = () => {
    setEditingChronicle(null);
    setChronYear('');
    setChronTitle('');
    setChronOrg('');
    setChronDesc('');
    setChronType('experience');
  };

  const handleDeleteChronicle = async (id: number) => {
    if (!window.confirm("Delete this chronicle record?")) return;
    try {
      const res = await fetch(`/api/admin/chronicle/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Password Reset
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityError('');
    setSecuritySuccess('');

    if (newPassword.length < 4) {
      setSecurityError("Passphrase must contain at least four characters.");
      return;
    }

    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ newPassword })
      });

      if (res.ok) {
        setSecuritySuccess("Passphrase updated successfully.");
        setNewPassword('');
      } else {
        const d = await res.json();
        setSecurityError(d.error || "Update denied.");
      }
    } catch (err) {
      setSecurityError("Server connection error.");
    }
  };

  // Auxiliary: simple custom loader wrapper
  const isLoggingInIn = (val: boolean) => setIsLoggingIn(val);

  // ==================== 1. UNAUTHENTICATED LOGIN VIEW ====================
  if (!token) {
    return (
      <div className="border border-ink/30 rounded bg-paper-dark/30 p-6 md:p-8 shadow-inner flex flex-col items-center justify-center max-w-md mx-auto my-12 relative" id="admin-login">
        {/* Vintage Frame Accent */}
        <div className="absolute inset-2 border border-dashed border-ink/20 pointer-events-none rounded"></div>

        <div className="w-12 h-12 rounded-full border border-ink flex items-center justify-center mb-4 bg-paper shadow-sm">
          <Lock className="w-5 h-5 text-vintage-red" />
        </div>

        <h3 className="font-serif-display text-2xl font-bold uppercase tracking-tight text-ink text-center mb-1">
          Master's Ledger Sanctum
        </h3>
        <p className="font-serif-body text-xs italic text-ink-muted text-center mb-6">
          Authorized personnel only. Unlock with cryptographic ledger passphrase.
        </p>

        <form onSubmit={handleLogin} className="w-full space-y-4 relative z-10">
          <div>
            <label className="block text-[10px] font-sans font-bold uppercase tracking-wider text-ink-muted mb-1.5">
              Secret Passphrase:
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-paper border border-ink/15 rounded-sm p-2.5 pl-9 text-sm text-ink focus:outline-none focus:border-vintage-gold font-sans"
              />
              <KeyRound className="w-4 h-4 text-ink-muted absolute left-3 top-3" />
            </div>
          </div>

          {authError && (
            <div className="p-2 border border-vintage-red/20 bg-vintage-red/5 rounded-sm flex items-start gap-2 text-xs text-vintage-red font-serif-body">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full py-2 bg-ink hover:bg-vintage-teal text-paper font-serif-display font-semibold uppercase tracking-wider text-xs rounded transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            {isLoggingIn ? "Validating key..." : "Validate Passphrase"}
          </button>
        </form>

        <span className="text-[9px] font-mono opacity-50 mt-6 select-none uppercase tracking-widest">
          Auth Ledger: SQLite Protected
        </span>
      </div>
    );
  }

  // ==================== 2. AUTHENTICATED WORKSPACE VIEW ====================
  return (
    <div className="w-full border border-ink rounded bg-paper shadow-md overflow-hidden relative" id="admin-workspace">
      {/* Editorial Header bar */}
      <div className="bg-paper-dark border-b-2 border-ink p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="font-sans text-[9px] text-vintage-red uppercase tracking-widest font-extrabold flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" />
            Authenticated Clerk Session
          </span>
          <h3 className="font-serif-display text-2xl font-bold uppercase tracking-tight text-ink mt-0.5">
            The Master's Ledger Desk
          </h3>
        </div>

        <button
          onClick={handleLogout}
          className="px-3.5 py-1.5 border border-vintage-red text-vintage-red hover:bg-vintage-red hover:text-paper font-sans text-[10px] uppercase font-bold tracking-wider rounded transition-all flex items-center gap-1 cursor-pointer"
        >
          <LogOut className="w-3 h-3" />
          Seal & Terminate Desk
        </button>
      </div>

      {/* Mini Workspace Subnavigation */}
      <div className="flex border-b border-ink/20 overflow-x-auto bg-paper-dark/30 font-sans text-[10px] font-bold uppercase tracking-wider text-ink-muted">
        <button
          onClick={() => setActiveTab('inquiries')}
          className={`px-4 py-3 border-r border-ink/10 flex items-center gap-1.5 cursor-pointer shrink-0 ${activeTab === 'inquiries' ? 'bg-paper text-ink font-extrabold border-b border-b-paper -mb-[1px]' : 'hover:bg-paper-dark/65'}`}
        >
          <Inbox className="w-3.5 h-3.5" />
          Correspondence Inbox ({inquiries.length})
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`px-4 py-3 border-r border-ink/10 flex items-center gap-1.5 cursor-pointer shrink-0 ${activeTab === 'projects' ? 'bg-paper text-ink font-extrabold border-b border-b-paper -mb-[1px]' : 'hover:bg-paper-dark/65'}`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          Log projects
        </button>
        <button
          onClick={() => setActiveTab('skills')}
          className={`px-4 py-3 border-r border-ink/10 flex items-center gap-1.5 cursor-pointer shrink-0 ${activeTab === 'skills' ? 'bg-paper text-ink font-extrabold border-b border-b-paper -mb-[1px]' : 'hover:bg-paper-dark/65'}`}
        >
          <Compass className="w-3.5 h-3.5" />
          Calibrate Gauges
        </button>
        <button
          onClick={() => setActiveTab('chronicle')}
          className={`px-4 py-3 border-r border-ink/10 flex items-center gap-1.5 cursor-pointer shrink-0 ${activeTab === 'chronicle' ? 'bg-paper text-ink font-extrabold border-b border-b-paper -mb-[1px]' : 'hover:bg-paper-dark/65'}`}
        >
          <Milestone className="w-3.5 h-3.5" />
          Chronicle events
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-3 flex items-center gap-1.5 cursor-pointer shrink-0 ${activeTab === 'security' ? 'bg-paper text-ink font-extrabold border-b border-b-paper -mb-[1px]' : 'hover:bg-paper-dark/65'}`}
        >
          <Lock className="w-3.5 h-3.5" />
          Desk Passkey
        </button>
      </div>

      <div className="p-4 md:p-6 min-h-[400px]">
        {/* ==================== TAB CONTENT: INQUIRIES ==================== */}
        {activeTab === 'inquiries' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Inbox List (5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex justify-between items-center px-1">
                <span className="font-sans text-[10px] uppercase tracking-wider text-ink-muted">Inbound Post Letters</span>
                <button 
                  onClick={fetchInquiries} 
                  className="p-1 hover:bg-paper-dark rounded text-vintage-teal cursor-pointer"
                  title="Reload Registry"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                {inquiries.map((inq) => {
                  const isUnread = inq.status === 'unread';
                  const isSelected = selectedInquiry?.id === inq.id;
                  return (
                    <div
                      key={inq.id}
                      onClick={() => {
                        setSelectedInquiry(inq);
                        if (isUnread) handleUpdateInquiryStatus(inq.id, 'read');
                      }}
                      className={`p-3 border rounded-sm cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-paper border-vintage-gold shadow-md' 
                          : isUnread 
                            ? 'bg-white border-vintage-red/30 border-l-4 border-l-vintage-red' 
                            : 'bg-paper/40 hover:bg-paper border-ink/10'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-serif-display text-sm font-bold text-ink truncate max-w-[150px]">
                          {inq.name}
                        </span>
                        <span className="font-mono text-[9px] text-ink-muted shrink-0">
                          {inq.timestamp}
                        </span>
                      </div>
                      <div className="font-serif-body text-xs text-ink-muted font-medium mb-1 truncate">
                        {inq.subject}
                      </div>
                      <p className="font-serif-body text-xs text-ink-muted/80 truncate">
                        {inq.body}
                      </p>
                    </div>
                  );
                })}

                {inquiries.length === 0 && (
                  <div className="py-12 text-center text-ink-muted italic font-serif-body text-sm border border-dashed border-ink/15 rounded-sm bg-white/40">
                    Your letter carrier has registered zero post in this session.
                  </div>
                )}
              </div>
            </div>

            {/* Detailed Reader Card (7 cols) */}
            <div className="lg:col-span-7">
              {selectedInquiry ? (
                <div className="border-2 border-dashed border-vintage-gold/50 rounded bg-paper p-5 relative min-h-[300px] flex flex-col justify-between shadow-sm">
                  <div>
                    {/* Wax Seal status */}
                    <div className="absolute top-4 right-4 text-[10px] font-sans font-bold uppercase tracking-widest text-vintage-red rotate-6 border border-vintage-red/30 px-2 py-0.5 rounded bg-vintage-red/5">
                      {selectedInquiry.status === 'unread' ? 'UNREAD POST' : 'ARCHIVED POST'}
                    </div>

                    <div className="border-b border-ink/15 pb-2.5 mb-4">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-vintage-gold">Formal Registry Inbound Letter</span>
                      <h4 className="font-serif-display text-xl font-bold text-ink leading-tight mt-1">
                        Subject: {selectedInquiry.subject}
                      </h4>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-serif-body border-b border-ink/10 pb-3 mb-4 text-ink-muted">
                      <div>
                        <strong>Honorable Sender:</strong> {selectedInquiry.name}
                      </div>
                      <div>
                        <strong>Electronic Post:</strong> <span className="underline text-vintage-teal">{selectedInquiry.email}</span>
                      </div>
                      <div className="col-span-2 mt-1">
                        <strong>Dispatched Time:</strong> {selectedInquiry.timestamp}
                      </div>
                    </div>

                    <p className="font-serif-body text-sm text-ink leading-relaxed whitespace-pre-wrap italic bg-paper-dark/25 p-4 border border-ink/5 rounded-sm">
                      "{selectedInquiry.body}"
                    </p>
                  </div>

                  <div className="flex gap-2 justify-end border-t border-ink/10 pt-4 mt-6">
                    <button
                      onClick={() => handleDeleteInquiry(selectedInquiry.id)}
                      className="px-3 py-1.5 bg-paper hover:bg-vintage-red/10 border border-vintage-red/30 text-vintage-red font-sans text-[10px] uppercase font-bold tracking-wider rounded cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3 inline mr-1" />
                      Strike Out Post
                    </button>
                    {selectedInquiry.status !== 'archived' && (
                      <button
                        onClick={() => handleUpdateInquiryStatus(selectedInquiry.id, 'archived')}
                        className="px-3 py-1.5 bg-vintage-teal hover:bg-vintage-teal/90 text-paper font-sans text-[10px] uppercase font-bold tracking-wider rounded cursor-pointer"
                      >
                        File as Archived
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-ink/15 bg-paper-dark/10 rounded h-full min-h-[300px] flex flex-col items-center justify-center p-8 text-center">
                  <Eye className="w-10 h-10 text-ink-muted/50 mb-3" />
                  <h4 className="font-serif-display text-base font-bold text-ink">Correspondence Seal Unbroken</h4>
                  <p className="font-serif-body text-xs text-ink-muted max-w-sm leading-relaxed mt-1">
                    Select any inbound letter from the left shelf to inspect credentials and read the custom text body.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== TAB CONTENT: PROJECTS ==================== */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="font-serif-display text-lg font-bold text-ink uppercase">
                {editingProject ? "Project Clerk Modification Desk" : "Ledger Projects Index"}
              </h4>
              {!editingProject ? (
                <button
                  onClick={() => {
                    clearProjectForm();
                    setEditingProject({ new: true });
                  }}
                  className="px-3 py-1.5 bg-vintage-teal text-paper font-sans text-[10px] uppercase font-bold tracking-wider rounded flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  New Project Entry
                </button>
              ) : (
                <button
                  onClick={clearProjectForm}
                  className="px-3 py-1.5 border border-ink/25 font-sans text-[10px] uppercase font-bold tracking-wider rounded cursor-pointer"
                >
                  Return to Ledger
                </button>
              )}
            </div>

            {editingProject ? (
              <form onSubmit={handleSaveProject} className="bg-paper-dark/30 p-4 border border-ink/15 rounded-sm space-y-4 font-serif-body text-sm text-ink">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-4">
                    <label className="block text-[10px] font-sans font-bold uppercase text-ink-muted mb-1">Project Code Name (UUID/Slug):</label>
                    <input
                      type="text"
                      required
                      value={projId}
                      onChange={(e) => setProjId(e.target.value)}
                      disabled={!editingProject.new}
                      placeholder="e.g. lara-ledger"
                      className="w-full bg-paper border border-ink/15 rounded-sm p-1.5 text-xs focus:outline-none focus:border-vintage-gold"
                    />
                  </div>

                  <div className="md:col-span-8">
                    <label className="block text-[10px] font-sans font-bold uppercase text-ink-muted mb-1">Full Project Title:</label>
                    <input
                      type="text"
                      required
                      value={projTitle}
                      onChange={(e) => setProjTitle(e.target.value)}
                      placeholder="e.g. LaraLedger: Double-Entry Financial System"
                      className="w-full bg-paper border border-ink/15 rounded-sm p-1.5 text-xs focus:outline-none focus:border-vintage-gold"
                    />
                  </div>

                  <div className="md:col-span-4">
                    <label className="block text-[10px] font-sans font-bold uppercase text-ink-muted mb-1">Engineering Category:</label>
                    <select
                      value={projCategory}
                      onChange={(e) => setProjCategory(e.target.value as any)}
                      className="w-full bg-paper border border-ink/15 rounded-sm p-1.5 text-xs focus:outline-none focus:border-vintage-gold"
                    >
                      <option value="Full-Stack">Full-Stack</option>
                      <option value="Backend">Backend</option>
                      <option value="Frontend">Frontend</option>
                      <option value="Database">Database</option>
                    </select>
                  </div>

                  <div className="md:col-span-4">
                    <label className="block text-[10px] font-sans font-bold uppercase text-ink-muted mb-1">Compilation Period:</label>
                    <input
                      type="text"
                      value={projPeriod}
                      onChange={(e) => setProjPeriod(e.target.value)}
                      placeholder="e.g. Autumn 2025"
                      className="w-full bg-paper border border-ink/15 rounded-sm p-1.5 text-xs focus:outline-none focus:border-vintage-gold"
                    />
                  </div>

                  <div className="md:col-span-12">
                    <label className="block text-[10px] font-sans font-bold uppercase text-ink-muted mb-1">Short Description:</label>
                    <input
                      type="text"
                      required
                      value={projDesc}
                      onChange={(e) => setProjDesc(e.target.value)}
                      placeholder="A short single-sentence summary..."
                      className="w-full bg-paper border border-ink/15 rounded-sm p-1.5 text-xs focus:outline-none focus:border-vintage-gold"
                    />
                  </div>

                  <div className="md:col-span-12">
                    <label className="block text-[10px] font-sans font-bold uppercase text-ink-muted mb-1">Detailed Log Narrative (Dropcap Essay):</label>
                    <textarea
                      required
                      rows={4}
                      value={projLongDesc}
                      onChange={(e) => setProjLongDesc(e.target.value)}
                      placeholder="Fully write about the background query lockings, transactional scopes, etc..."
                      className="w-full bg-paper border border-ink/15 rounded-sm p-1.5 text-xs focus:outline-none focus:border-vintage-gold resize-none"
                    />
                  </div>

                  <div className="md:col-span-6">
                    <label className="block text-[10px] font-sans font-bold uppercase text-ink-muted mb-1">Assembled Technologies (Comma Separated):</label>
                    <input
                      type="text"
                      value={projTech}
                      onChange={(e) => setProjTech(e.target.value)}
                      placeholder="Laravel, PHP 8.3, React 19, PostgreSQL"
                      className="w-full bg-paper border border-ink/15 rounded-sm p-1.5 text-xs focus:outline-none focus:border-vintage-gold"
                    />
                  </div>

                  <div className="md:col-span-6">
                    <label className="block text-[10px] font-sans font-bold uppercase text-ink-muted mb-1">Performance Stats JSON (label/value array):</label>
                    <input
                      type="text"
                      value={projStats}
                      onChange={(e) => setProjStats(e.target.value)}
                      placeholder='[{"label":"Query Speed","value":"1.2ms avg"}]'
                      className="w-full bg-paper border border-ink/15 rounded-sm p-1.5 text-xs font-mono focus:outline-none focus:border-vintage-gold"
                    />
                  </div>

                  <div className="md:col-span-12">
                    <label className="block text-[10px] font-sans font-bold uppercase text-ink-muted mb-1">Technical Specs list (Newline Separated):</label>
                    <textarea
                      rows={3}
                      value={projFeatures}
                      onChange={(e) => setProjFeatures(e.target.value)}
                      placeholder="Mathematical assurance of balanced books.&#10;Custom observers creating audit logs.&#10;Instant background updates."
                      className="w-full bg-paper border border-ink/15 rounded-sm p-1.5 text-xs focus:outline-none focus:border-vintage-gold resize-none"
                    />
                  </div>

                  <div className="md:col-span-12">
                    <label className="block text-[10px] font-sans font-bold uppercase text-ink-muted mb-1">ASCII Relational Schema layout (Optional):</label>
                    <textarea
                      rows={3}
                      value={projSchema}
                      onChange={(e) => setProjSchema(e.target.value)}
                      placeholder="[ledger] -> [account] -> [posting]"
                      className="w-full bg-paper border border-ink/15 rounded-sm p-1.5 text-xs font-mono focus:outline-none focus:border-vintage-gold resize-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-ink/10">
                  <button
                    type="button"
                    onClick={clearProjectForm}
                    className="px-4 py-1.5 border border-ink/20 hover:bg-paper rounded text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-vintage-red text-paper rounded text-xs font-serif-display font-semibold uppercase tracking-wider flex items-center gap-1"
                  >
                    <Save className="w-3.5 h-3.5" />
                    File Project into DB
                  </button>
                </div>
              </form>
            ) : (
              <div className="border border-ink/15 rounded-sm overflow-hidden bg-white">
                <table className="w-full font-serif-body text-xs border-collapse">
                  <thead>
                    <tr className="bg-paper-dark/50 border-b border-ink/25 text-left font-sans text-[9px] uppercase font-bold tracking-wider text-ink-muted">
                      <th className="p-3">ID / Code</th>
                      <th className="p-3">Title</th>
                      <th className="p-3">Category</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((proj) => (
                      <tr key={proj.id} className="border-b border-ink/10 hover:bg-paper-dark/10">
                        <td className="p-3 font-mono font-semibold">{proj.id}</td>
                        <td className="p-3 font-serif-display font-bold text-sm text-ink">{proj.title}</td>
                        <td className="p-3 text-ink-muted">{proj.category}</td>
                        <td className="p-3 text-right space-x-1.5 shrink-0">
                          <button
                            onClick={() => populateProjectForm(proj)}
                            className="text-vintage-teal hover:underline font-sans text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProject(proj.id)}
                            className="text-vintage-red hover:underline font-sans text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB CONTENT: SKILLS (GAUGES) ==================== */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            <h4 className="font-serif-display text-lg font-bold text-ink uppercase">
              Configure Instrument Calibrations
            </h4>

            {/* Editing / Inserting form */}
            <form onSubmit={handleSaveSkill} className="bg-paper-dark/30 p-4 border border-ink/15 rounded-sm grid grid-cols-1 md:grid-cols-12 gap-3.5 font-serif-body text-sm text-ink">
              <div className="md:col-span-4">
                <label className="block text-[10px] font-sans font-bold uppercase text-ink-muted mb-1">Cabinet Category:</label>
                <select
                  value={skillCategory}
                  onChange={(e) => setSkillCategory(e.target.value)}
                  className="w-full bg-paper border border-ink/15 rounded-sm p-1.5 text-xs focus:outline-none focus:border-vintage-gold"
                >
                  <option value="Backend Architecture">Backend Architecture</option>
                  <option value="Frontend Craftsmanship">Frontend Craftsmanship</option>
                </select>
              </div>

              <div className="md:col-span-5">
                <label className="block text-[10px] font-sans font-bold uppercase text-ink-muted mb-1">Instrument Name:</label>
                <input
                  type="text"
                  required
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  placeholder="e.g. Laravel Framework"
                  className="w-full bg-paper border border-ink/15 rounded-sm p-1.5 text-xs focus:outline-none focus:border-vintage-gold"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-[10px] font-sans font-bold uppercase text-ink-muted mb-1">Level (0 - 100):</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(parseInt(e.target.value) || 80)}
                  className="w-full bg-paper border border-ink/15 rounded-sm p-1.5 text-xs focus:outline-none focus:border-vintage-gold"
                />
              </div>

              <div className="md:col-span-12">
                <label className="block text-[10px] font-sans font-bold uppercase text-ink-muted mb-1">Instrument Application detail (e.g., ORM, Design Patterns...):</label>
                <input
                  type="text"
                  required
                  value={skillDetail}
                  onChange={(e) => setSkillDetail(e.target.value)}
                  placeholder="Custom details describing usage..."
                  className="w-full bg-paper border border-ink/15 rounded-sm p-1.5 text-xs focus:outline-none focus:border-vintage-gold"
                />
              </div>

              <div className="md:col-span-12 flex justify-end gap-1.5 pt-1.5 border-t border-ink/10">
                {editingSkill && (
                  <button
                    type="button"
                    onClick={clearSkillForm}
                    className="px-3 py-1 border border-ink/25 text-xs rounded-sm hover:bg-paper"
                  >
                    Clear Select
                  </button>
                )}
                <button
                  type="submit"
                  className="px-4 py-1 bg-vintage-teal text-paper font-serif-display font-semibold uppercase text-xs tracking-wider rounded-sm"
                >
                  {editingSkill ? "Modify Skill Entry" : "Add Instrument Calibration"}
                </button>
              </div>
            </form>

            {/* List shelf */}
            <div className="space-y-4">
              {skills.map((catObj) => (
                <div key={catObj.title} className="border border-ink/15 rounded-sm p-3 bg-white">
                  <h5 className="font-serif-display font-bold text-sm text-vintage-teal uppercase border-b border-ink/10 pb-1 mb-2">
                    {catObj.title}
                  </h5>
                  <div className="divide-y divide-ink/5">
                    {catObj.skills.map((sk: any) => (
                      <div key={sk.id} className="py-2 flex justify-between items-center text-xs">
                        <div>
                          <strong>{sk.name}</strong> <span className="text-vintage-gold font-mono">({sk.level}%)</span>
                          <p className="text-[11px] text-ink-muted italic leading-none mt-0.5">{sk.detail}</p>
                        </div>
                        <div className="space-x-1.5 shrink-0">
                          <button
                            onClick={() => populateSkillForm(sk, catObj.title)}
                            className="text-vintage-teal hover:underline font-sans text-[10px] font-bold"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteSkill(sk.id)}
                            className="text-vintage-red hover:underline font-sans text-[10px] font-bold"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB CONTENT: CHRONICLE (TIMELINE) ==================== */}
        {activeTab === 'chronicle' && (
          <div className="space-y-6">
            <h4 className="font-serif-display text-lg font-bold text-ink uppercase">
              The Historical Chronicle Registry
            </h4>

            {/* Editing / Inserting form */}
            <form onSubmit={handleSaveChronicle} className="bg-paper-dark/30 p-4 border border-ink/15 rounded-sm grid grid-cols-1 md:grid-cols-12 gap-3.5 font-serif-body text-sm text-ink">
              <div className="md:col-span-4">
                <label className="block text-[10px] font-sans font-bold uppercase text-ink-muted mb-1">Chronological Period:</label>
                <input
                  type="text"
                  required
                  value={chronYear}
                  onChange={(e) => setChronYear(e.target.value)}
                  placeholder="e.g. 2024 — Present"
                  className="w-full bg-paper border border-ink/15 rounded-sm p-1.5 text-xs focus:outline-none focus:border-vintage-gold"
                />
              </div>

              <div className="md:col-span-8">
                <label className="block text-[10px] font-sans font-bold uppercase text-ink-muted mb-1">Full Station Title:</label>
                <input
                  type="text"
                  required
                  value={chronTitle}
                  onChange={(e) => setChronTitle(e.target.value)}
                  placeholder="e.g. Senior Full-Stack Developer"
                  className="w-full bg-paper border border-ink/15 rounded-sm p-1.5 text-xs focus:outline-none focus:border-vintage-gold"
                />
              </div>

              <div className="md:col-span-6">
                <label className="block text-[10px] font-sans font-bold uppercase text-ink-muted mb-1">Organization / House:</label>
                <input
                  type="text"
                  required
                  value={chronOrg}
                  onChange={(e) => setChronOrg(e.target.value)}
                  placeholder="e.g. Sapphire Solutions"
                  className="w-full bg-paper border border-ink/15 rounded-sm p-1.5 text-xs focus:outline-none focus:border-vintage-gold"
                />
              </div>

              <div className="md:col-span-6">
                <label className="block text-[10px] font-sans font-bold uppercase text-ink-muted mb-1">Entry Type:</label>
                <select
                  value={chronType}
                  onChange={(e) => setChronType(e.target.value as any)}
                  className="w-full bg-paper border border-ink/15 rounded-sm p-1.5 text-xs focus:outline-none focus:border-vintage-gold"
                >
                  <option value="experience">Professional Experience</option>
                  <option value="landmark">Academic Landmark</option>
                </select>
              </div>

              <div className="md:col-span-12">
                <label className="block text-[10px] font-sans font-bold uppercase text-ink-muted mb-1">Chronicle Narrative Text:</label>
                <textarea
                  required
                  rows={3}
                  value={chronDesc}
                  onChange={(e) => setChronDesc(e.target.value)}
                  placeholder="Summarize key outputs, reduals, or theses honors..."
                  className="w-full bg-paper border border-ink/15 rounded-sm p-1.5 text-xs focus:outline-none focus:border-vintage-gold resize-none"
                />
              </div>

              <div className="md:col-span-12 flex justify-end gap-1.5 pt-1.5 border-t border-ink/10">
                {editingChronicle && (
                  <button
                    type="button"
                    onClick={clearChronicleForm}
                    className="px-3 py-1 border border-ink/25 text-xs rounded hover:bg-paper"
                  >
                    Clear Select
                  </button>
                )}
                <button
                  type="submit"
                  className="px-4 py-1 bg-vintage-teal text-paper font-serif-display font-semibold uppercase text-xs tracking-wider rounded-sm"
                >
                  {editingChronicle ? "Modify Chronicle Entry" : "File Chronicle Entry"}
                </button>
              </div>
            </form>

            {/* List */}
            <div className="border border-ink/15 rounded-sm overflow-hidden bg-white">
              <div className="divide-y divide-ink/10">
                {chronicle.map((itemObj: any) => (
                  <div key={itemObj.id} className="p-3.5 hover:bg-paper-dark/5 flex justify-between items-start gap-4">
                    <div className="text-xs">
                      <div className="flex gap-2 items-center mb-1">
                        <span className="font-mono font-bold text-vintage-gold uppercase tracking-wider">{itemObj.year}</span>
                        <span className="text-ink-muted italic font-serif-display">{itemObj.organization}</span>
                        <span className="text-[8px] font-sans font-extrabold uppercase bg-ink/5 border border-ink/10 px-1 rounded-sm">
                          {itemObj.type}
                        </span>
                      </div>
                      <h5 className="font-serif-display font-bold text-sm text-ink mb-1">{itemObj.title}</h5>
                      <p className="text-ink-muted leading-relaxed max-w-2xl">{itemObj.description}</p>
                    </div>
                    <div className="space-x-1.5 shrink-0">
                      <button
                        onClick={() => populateChronicleForm(itemObj)}
                        className="text-vintage-teal hover:underline font-sans text-[10px] font-bold uppercase tracking-wider"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteChronicle(itemObj.id)}
                        className="text-vintage-red hover:underline font-sans text-[10px] font-bold uppercase tracking-wider"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB CONTENT: SECURITY ==================== */}
        {activeTab === 'security' && (
          <div className="max-w-md mx-auto space-y-6 py-6 relative">
            <div className="border border-vintage-gold/30 rounded p-5 bg-paper-dark/25">
              <h4 className="font-serif-display text-lg font-bold text-ink uppercase mb-2 flex items-center gap-1">
                <KeyRound className="w-4 h-4 text-vintage-gold" />
                Security Cryptographic Passphrase
              </h4>
              <p className="font-serif-body text-xs text-ink-muted leading-relaxed mb-4">
                Update the master verification passphrase used to unlock this workstation ledger in future browser sessions.
              </p>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-sans font-bold uppercase tracking-wider text-ink-muted mb-1">
                    New Ledger Passphrase:
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new master passphrase"
                    className="w-full bg-paper border border-ink/15 rounded-sm p-2 text-xs focus:outline-none focus:border-vintage-gold font-sans"
                  />
                </div>

                {securityError && (
                  <div className="p-2 border border-vintage-red/20 bg-vintage-red/5 rounded-sm text-xs text-vintage-red font-serif-body">
                    {securityError}
                  </div>
                )}

                {securitySuccess && (
                  <div className="p-2 border border-vintage-teal/20 bg-vintage-teal/5 rounded-sm text-xs text-vintage-teal font-serif-body">
                    {securitySuccess}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-1.5 bg-vintage-red hover:bg-vintage-red/90 text-paper font-serif-display font-semibold uppercase text-xs tracking-wider rounded-sm transition-all"
                >
                  Seal New Passphrase
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
