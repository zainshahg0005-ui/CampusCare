import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageCircle,
  X,
  Send,
  Headphones,
  Sparkles,
  Bot,
  User,
  ShieldCheck,
  ChevronRight,
  HelpCircle,
  RefreshCw,
  Phone,
  ArrowRight,
  Check,
  Lock,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const DEFAULT_FAQS = [
  {
    id: 1,
    question: 'How do I submit a campus facility complaint?',
    answer:
      'To lodge an issue:\n1. Log in with your verified student account.\n2. Click "Submit Complaint" from your dashboard.\n3. Choose your facility category (Classroom, Wi-Fi, Electricity, Washroom, etc.), describe the problem, and attach clear photo evidence.\n4. Click "Submit Grievance" — our maintenance dispatch teams will be alerted immediately.',
    category: 'Grievances',
  },
  {
    id: 2,
    question: 'How long does grievance resolution take?',
    answer:
      '• Emergency Issues (power outages, water leakages, lab hazards): Dispatched within 2 to 4 hours.\n• General Maintenance (classroom desks, Wi-Fi router resets, lighting): Inspected and resolved within 24 to 48 hours.',
    category: 'Turnaround',
  },
  {
    id: 3,
    question: 'How do I reset or change my password?',
    answer:
      'To reset your password:\n1. Visit /forgot-password or click "Forgot Password" on the sign-in screen.\n2. Enter your registered email or phone number to receive a 6-digit OTP.\n3. Enter the OTP and your new 8+ character strong password (must have uppercase, lowercase, number, and symbol).\nIf you are already logged in, you can update your password directly in "My Profile".',
    category: 'Security',
  },
  {
    id: 4,
    question: 'Campus Emergency Helplines & Numbers',
    answer:
      'For immediate safety or urgent facility hazards:\n• Campus Operations Control Desk: +1 (555) 019-CARE\n• Electrical Substation Dispatch: Ext. 104\n• Campus Security Hotline: Ext. 101\n• Plumbing & Sanitation Desk: Ext. 108',
    category: 'Emergency',
  },
  {
    id: 5,
    question: 'How do I update my profile picture (DP) and details?',
    answer:
      'Go to "My Profile" in your student workspace (/student/profile). You can upload a high-resolution profile picture (DP), update your contact number, faculty department, and campus residence/bio.',
    category: 'Profile',
  },
  {
    id: 6,
    question: 'How do I track my submitted complaints?',
    answer:
      'Navigate to "My Complaints" (/student/complaints). You will see real-time color badges (Pending, In Progress, Resolved) and the official remarks written by campus technicians upon resolution.',
    category: 'Status',
  },
];

const SupportChatWidget = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'faqs'
  const [selectedFaq, setSelectedFaq] = useState(null);

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Session ID strictly bound to the authenticated student/admin account
  const sessionId = user?._id ? `user_${user._id}` : 'guest_unauthenticated';

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch messages from backend (only when authenticated)
  const fetchMessages = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.get('/support/messages', { params: { sessionId } });
      if (res.data?.success && Array.isArray(res.data.messages)) {
        setMessages(res.data.messages);
      }
    } catch (err) {
      console.error('Failed to poll support messages:', err);
    }
  }, [sessionId, isAuthenticated]);

  // Initial load
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      setLoadingHistory(true);
      fetchMessages().finally(() => setLoadingHistory(false));
    }
  }, [isOpen, isAuthenticated, fetchMessages]);

  // Polling for live real-time replies every 3.5 seconds when widget is open and user is signed in
  useEffect(() => {
    if (!isOpen || !isAuthenticated) return;
    const interval = setInterval(() => {
      fetchMessages();
    }, 3500);
    return () => clearInterval(interval);
  }, [isOpen, isAuthenticated, fetchMessages]);

  // Auto-scroll when messages update
  useEffect(() => {
    if (isOpen && activeTab === 'chat' && isAuthenticated) {
      scrollToBottom();
    }
  }, [messages, isOpen, activeTab, isAuthenticated]);

  const handleSendMessage = async (customText = null) => {
    if (!isAuthenticated) return;
    const textToSend = customText || inputText;
    if (!textToSend.trim() || sending) return;

    const senderName = user?.name || 'Campus Student';
    const senderEmail = user?.email || '';
    const senderRole = isAdmin ? 'admin' : 'student';

    // Optimistic user message
    const tempId = 'temp_' + Date.now();
    const optimisticMsg = {
      _id: tempId,
      sessionId,
      senderName,
      senderEmail,
      senderRole,
      message: textToSend.trim(),
      isAdminReply: false,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setInputText('');
    setSending(true);

    try {
      const res = await api.post('/support/message', {
        sessionId,
        message: textToSend.trim(),
      });

      if (res.data?.success) {
        // Refresh with real DB messages
        fetchMessages();
      }
    } catch (err) {
      console.error('Failed to send support message:', err);
    } finally {
      setSending(false);
    }
  };

  const handleQuickQuestionClick = (faq) => {
    setSelectedFaq(faq);
    setActiveTab('faqs');
  };

  const handleAskQuestionInChat = (faq) => {
    setActiveTab('chat');
    handleSendMessage(`Question: ${faq.question}`);
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. FLOATING ACTION BUTTON (Bottom-Right) */}
      {/* ========================================================================= */}
      <div className="support-chat-fab-wrap">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open CampusCare Help and Services"
          className="support-chat-fab-btn"
        >
          {isOpen ? (
            <X size={20} color="#ffffff" />
          ) : (
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Headphones size={20} color="#ffffff" />
              <span
                style={{
                  position: 'absolute',
                  top: -2,
                  right: -2,
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#22c55e',
                  border: '1.5px solid #09090b',
                }}
              />
            </div>
          )}
          <span className="support-chat-fab-text">
            {isOpen ? 'Close Services' : 'Help & Services'}
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 2. CHAT & FAQ WINDOW CONTAINER */}
      {/* ========================================================================= */}
      {isOpen && (
        <div className="support-chat-window">
          {/* Mobile drag handle indicator */}
          <div style={{
            width: 36,
            height: 4,
            borderRadius: 999,
            background: 'rgba(255,255,255,0.25)',
            margin: '8px auto 0',
            display: 'none',
          }} className="mobile-drag-handle" />
          {/* Header */}
          <div
            style={{
              padding: '1rem 1.25rem',
              background: '#09090b',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #27272a',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: '#18181b',
                  border: '1px solid #27272a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Headphones size={18} color="#22c55e" />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, letterSpacing: '0.2px' }}>
                  CampusCare Help & Services
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#a1a1aa' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                  <span>Admins & Smart Assistant Online</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#a1a1aa',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label="Close chat window"
            >
              <X size={18} />
            </button>
          </div>

          {/* Ask for Sign In if not authenticated */}
          {!isAuthenticated ? (
            <div
              style={{
                flex: 1,
                padding: '2.5rem 1.75rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                backgroundColor: '#ffffff',
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: '#f4f4f5',
                  border: '1px solid #e4e4e7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <Lock size={28} color="#09090b" />
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#09090b', margin: '0 0 0.5rem' }}>
                Sign In Required
              </h3>

              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, margin: '0 0 1.75rem', maxWidth: 320 }}>
                Real-time Help & Services and direct chat with campus administrators are strictly reserved for registered members. Please sign in to your student account to access live chat.
              </p>

              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="btn btn-primary full-width"
                  style={{ textDecoration: 'none', justifyContent: 'center', padding: '0.75rem' }}
                >
                  Sign In to Student Portal
                </Link>

                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="btn btn-outline full-width"
                  style={{ textDecoration: 'none', justifyContent: 'center', padding: '0.75rem' }}
                >
                  Register New Student Account
                </Link>
              </div>

              <div style={{ marginTop: '1.75rem', fontSize: '0.725rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Clock size={12} />
                <span>Chat data is automatically deleted after 24 hours to save space</span>
              </div>
            </div>
          ) : (
            <>
              {/* Subheader Navigation Tabs */}
              <div
                style={{
                  display: 'flex',
                  borderBottom: '1px solid #e4e4e7',
                  background: '#fafafa',
                }}
              >
                <button
                  type="button"
                  onClick={() => setActiveTab('chat')}
                  style={{
                    flex: 1,
                    padding: '0.65rem 0.5rem',
                    border: 'none',
                    borderBottom: activeTab === 'chat' ? '2px solid #09090b' : '2px solid transparent',
                    background: activeTab === 'chat' ? '#ffffff' : 'transparent',
                    fontWeight: activeTab === 'chat' ? 700 : 500,
                    color: activeTab === 'chat' ? '#09090b' : '#71717a',
                    fontSize: '0.825rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <MessageCircle size={15} />
                  <span>Live Admin Chat</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('faqs')}
                  style={{
                    flex: 1,
                    padding: '0.65rem 0.5rem',
                    border: 'none',
                    borderBottom: activeTab === 'faqs' ? '2px solid #09090b' : '2px solid transparent',
                    background: activeTab === 'faqs' ? '#ffffff' : 'transparent',
                    fontWeight: activeTab === 'faqs' ? 700 : 500,
                    color: activeTab === 'faqs' ? '#09090b' : '#71717a',
                    fontSize: '0.825rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Sparkles size={15} color="#eab308" />
                  <span>Instant Answers</span>
                </button>
              </div>

          {/* ========================================================================= */}
          {/* TAB 1: LIVE ADMIN & ASSISTANT CHAT */}
          {/* ========================================================================= */}
          {activeTab === 'chat' && (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
              {/* Messages Stream */}
              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                  backgroundColor: '#f8fafc',
                }}
              >
                {/* 24-Hour Space Saving Auto-Delete Notice */}
                <div
                  style={{
                    background: '#f1f5f9',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '0.45rem 0.75rem',
                    fontSize: '0.725rem',
                    color: '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                  }}
                >
                  <Clock size={13} color="#64748b" style={{ flexShrink: 0 }} />
                  <span>
                    <strong>24-Hour Space Optimization:</strong> All chat data automatically purges after 24 hours.
                  </span>
                </div>

                {/* Initial Welcome Card */}
                <div
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '0.85rem 1rem',
                    fontSize: '0.825rem',
                    color: '#334155',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 700, color: '#09090b', marginBottom: '0.35rem' }}>
                    <Bot size={16} color="#09090b" />
                    <span>Welcome to CampusCare Support!</span>
                  </div>
                  <p style={{ margin: 0, lineHeight: 1.5 }}>
                    Connect directly with verified campus administrators. If administrators are temporarily engaged, our automated knowledge engine will provide immediate solutions.
                  </p>

                  <div style={{ marginTop: '0.65rem', display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {DEFAULT_FAQS.slice(0, 3).map((faq) => (
                      <button
                        key={faq.id}
                        onClick={() => handleAskQuestionInChat(faq)}
                        style={{
                          background: '#f1f5f9',
                          border: '1px solid #cbd5e1',
                          borderRadius: '9999px',
                          padding: '0.25rem 0.65rem',
                          fontSize: '0.725rem',
                          color: '#0f172a',
                          cursor: 'pointer',
                          fontWeight: 600,
                          textAlign: 'left',
                        }}
                      >
                        ⚡ {faq.question}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message Bubbles */}
                {messages.map((msg, index) => {
                  const isUser = !msg.isAdminReply && msg.senderRole !== 'bot';
                  const isBot = msg.senderRole === 'bot';
                  const isAdmin = msg.isAdminReply && !isBot;

                  return (
                    <div
                      key={msg._id || index}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: isUser ? 'flex-end' : 'flex-start',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '0.7rem',
                          color: '#64748b',
                          marginBottom: '2px',
                          padding: '0 4px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}
                      >
                        {isAdmin && <ShieldCheck size={12} color="#09090b" />}
                        {isBot && <Bot size={12} color="#16a34a" />}
                        <span>{msg.senderName}</span>
                        <span>•</span>
                        <span>
                          {msg.createdAt
                            ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : 'Just now'}
                        </span>
                      </div>

                      <div
                        style={{
                          maxWidth: '85%',
                          padding: '0.75rem 0.95rem',
                          borderRadius: '12px',
                          borderTopRightRadius: isUser ? '2px' : '12px',
                          borderTopLeftRadius: isUser ? '12px' : '2px',
                          backgroundColor: isUser ? '#09090b' : isBot ? '#f0fdf4' : '#ffffff',
                          color: isUser ? '#ffffff' : '#0f172a',
                          border: isUser ? 'none' : isBot ? '1px solid #bbf7d0' : '1px solid #e2e8f0',
                          fontSize: '0.85rem',
                          lineHeight: 1.5,
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                        }}
                      >
                        {msg.message}
                      </div>
                    </div>
                  );
                })}

                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Box */}
              <div
                style={{
                  padding: '0.75rem',
                  borderTop: '1px solid #e4e4e7',
                  backgroundColor: '#ffffff',
                }}
              >
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
                >
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type your message to university administrators..."
                    disabled={sending}
                    style={{
                      flex: 1,
                      padding: '0.65rem 0.85rem',
                      fontSize: '0.85rem',
                      borderRadius: '8px',
                      border: '1px solid #d4d4d8',
                      outline: 'none',
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim() || sending}
                    style={{
                      background: '#09090b',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '0.65rem 0.85rem',
                      cursor: !inputText.trim() || sending ? 'not-allowed' : 'pointer',
                      opacity: !inputText.trim() || sending ? 0.6 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Send size={16} />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: PRE-RESPONDED INSTANT ANSWERS (FAQS) */}
          {/* ========================================================================= */}
          {activeTab === 'faqs' && (
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '1rem',
                backgroundColor: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
              }}
            >
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '0.75rem 1rem',
                  fontSize: '0.8rem',
                  color: '#475569',
                }}
              >
                <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '0.2rem' }}>
                  ⚡ Automated Knowledge Base
                </div>
                Click any common question below for immediate answers when administrators are busy.
              </div>

              {DEFAULT_FAQS.map((faq) => {
                const isExpanded = selectedFaq?.id === faq.id;
                return (
                  <div
                    key={faq.id}
                    style={{
                      border: isExpanded ? '1px solid #09090b' : '1px solid #e4e4e7',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      transition: 'all 0.2s ease',
                      backgroundColor: isExpanded ? '#fafafa' : '#ffffff',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedFaq(isExpanded ? null : faq)}
                      style={{
                        width: '100%',
                        padding: '0.85rem 1rem',
                        background: 'transparent',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.5rem',
                      }}
                    >
                      <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#09090b' }}>
                        {faq.question}
                      </span>
                      <ChevronRight
                        size={16}
                        color="#71717a"
                        style={{
                          transform: isExpanded ? 'rotate(90deg)' : 'none',
                          transition: 'transform 0.2s ease',
                          flexShrink: 0,
                        }}
                      />
                    </button>

                    {isExpanded && (
                      <div
                        style={{
                          padding: '0 1rem 0.85rem',
                          fontSize: '0.825rem',
                          lineHeight: 1.6,
                          color: '#334155',
                          whiteSpace: 'pre-wrap',
                          borderTop: '1px solid #f4f4f5',
                          paddingTop: '0.75rem',
                        }}
                      >
                        {faq.answer}

                        <div style={{ marginTop: '0.75rem' }}>
                          <button
                            type="button"
                            onClick={() => handleAskQuestionInChat(faq)}
                            style={{
                              background: '#09090b',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '0.4rem 0.75rem',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                            }}
                          >
                            <span>Still need help? Ask Admin</span>
                            <ArrowRight size={13} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  )}
</>
  );
};

export default SupportChatWidget;
