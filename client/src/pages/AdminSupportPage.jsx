import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  MessageSquare,
  Search,
  Send,
  User,
  ShieldCheck,
  Bot,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertCircle,
  Inbox,
  Sparkles,
  Phone,
  Mail,
  Zap,
} from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import EmptyState from '../components/EmptyState';
import useDocumentTitle from '../hooks/useDocumentTitle';
import api from '../services/api';

const QUICK_REPLIES = [
  'We have dispatched a technician team to inspect and repair this facility.',
  'Could you please specify your exact room number, laboratory, or hostel block?',
  'Your issue has been escalated to campus facility engineering for immediate priority.',
  'Maintenance inspection is underway. We will notify you once completed.',
  'The repair has been completed and verified. Thank you for notifying us!',
];

const AdminSupportPage = () => {
  useDocumentTitle('Live Support Desk');
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState('');

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch all threads
  const fetchThreads = useCallback(async () => {
    try {
      const res = await api.get('/support/admin/threads');
      if (res.data?.success && Array.isArray(res.data.threads)) {
        setThreads(res.data.threads);
        // Auto select first thread if none selected
        if (!selectedSessionId && res.data.threads.length > 0) {
          setSelectedSessionId(res.data.threads[0]._id);
        }
      }
    } catch (err) {
      console.error('Failed to load support threads:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedSessionId]);

  // Fetch messages for active thread
  const fetchActiveMessages = useCallback(async (sessionId) => {
    if (!sessionId) return;
    try {
      const res = await api.get('/support/messages', { params: { sessionId } });
      if (res.data?.success && Array.isArray(res.data.messages)) {
        setMessages(res.data.messages);
      }
    } catch (err) {
      console.error('Failed to load thread messages:', err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  // When active thread changes
  useEffect(() => {
    if (selectedSessionId) {
      setLoadingMessages(true);
      fetchActiveMessages(selectedSessionId).finally(() => setLoadingMessages(false));
      // Mark as read
      api.put(`/support/admin/read/${selectedSessionId}`).catch(() => {});
    }
  }, [selectedSessionId, fetchActiveMessages]);

  // Real-time polling every 3.5s
  useEffect(() => {
    const interval = setInterval(() => {
      fetchThreads();
      if (selectedSessionId) {
        fetchActiveMessages(selectedSessionId);
      }
    }, 3500);
    return () => clearInterval(interval);
  }, [fetchThreads, fetchActiveMessages, selectedSessionId]);

  // Scroll on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendReply = async (customText = null) => {
    const textToSend = customText || replyText;
    if (!textToSend.trim() || !selectedSessionId || sending) return;

    setSending(true);
    try {
      const res = await api.post('/support/admin/reply', {
        sessionId: selectedSessionId,
        message: textToSend.trim(),
      });

      if (res.data?.success) {
        setReplyText('');
        fetchActiveMessages(selectedSessionId);
        fetchThreads();
      }
    } catch (err) {
      console.error('Failed to send admin reply:', err);
    } finally {
      setSending(false);
    }
  };

  const selectedThread = threads.find((t) => t._id === selectedSessionId);

  const filteredThreads = threads.filter((t) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      t.lastSenderName?.toLowerCase().includes(q) ||
      t.senderEmail?.toLowerCase().includes(q) ||
      t.lastMessage?.toLowerCase().includes(q)
    );
  });

  const totalUnread = threads.reduce((acc, t) => acc + (t.unreadCount || 0), 0);

  return (
    <DashboardLayout
      title="Live Support Desk 💬"
      subtitle="Real-time communication with campus students and facility inquiries"
    >
      <div className="admin-support-container">
        {/* ========================================================================= */}
        {/* LEFT PANE: CONVERSATION LIST */}
        {/* ========================================================================= */}
        <div className="admin-support-sidebar">
          {/* Header & Search */}
          <div style={{ padding: '1rem', borderBottom: '1px solid #e4e4e7' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: '#09090b' }}>
                  Conversations
                </h3>
                {totalUnread > 0 && (
                  <span
                    style={{
                      background: '#ef4444',
                      color: '#ffffff',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '2px 7px',
                      borderRadius: '9999px',
                    }}
                  >
                    {totalUnread} new
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => fetchThreads()}
                className="btn btn-outline btn-sm"
                title="Refresh threads"
                style={{ padding: '4px 8px' }}
              >
                <RefreshCw size={14} />
              </button>
            </div>

            <div className="search-box" style={{ width: '100%' }}>
              <Search size={15} className="search-icon" />
              <input
                type="text"
                className="form-control search-input"
                placeholder="Search inquiries..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ fontSize: '0.8rem', padding: '0.45rem 0.5rem 0.45rem 2.2rem' }}
              />
            </div>
          </div>

          {/* Thread List */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {loading ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#71717a', fontSize: '0.85rem' }}>
                Loading conversation threads...
              </div>
            ) : filteredThreads.length === 0 ? (
              <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: '#71717a' }}>
                <Inbox size={32} color="#a1a1aa" style={{ margin: '0 auto 0.5rem', display: 'block' }} />
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#09090b' }}>No Inquiries Yet</div>
                <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
                  Inquiries submitted via the Home Page Support Widget will appear here.
                </div>
              </div>
            ) : (
              filteredThreads.map((thread) => {
                const isSelected = selectedSessionId === thread._id;
                const hasUnread = thread.unreadCount > 0;
                return (
                  <div
                    key={thread._id}
                    onClick={() => setSelectedSessionId(thread._id)}
                    style={{
                      padding: '0.85rem 1rem',
                      borderBottom: '1px solid #f4f4f5',
                      cursor: 'pointer',
                      backgroundColor: isSelected ? '#f4f4f5' : hasUnread ? '#fefce8' : '#ffffff',
                      borderLeft: isSelected ? '3px solid #09090b' : hasUnread ? '3px solid #ca8a04' : '3px solid transparent',
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: hasUnread ? 800 : 700, fontSize: '0.85rem', color: '#09090b' }}>
                        {thread.lastSenderName || 'Campus Student'}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: '#71717a' }}>
                        {thread.lastMessageDate
                          ? new Date(thread.lastMessageDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : ''}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem' }}>
                      <span
                        style={{
                          fontSize: '0.65rem',
                          padding: '1px 5px',
                          borderRadius: '4px',
                          background: thread.lastSenderRole === 'student' ? '#e0f2fe' : '#f1f5f9',
                          color: thread.lastSenderRole === 'student' ? '#0369a1' : '#475569',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                        }}
                      >
                        {thread.lastSenderRole || 'Guest'}
                      </span>
                      {thread.senderEmail && (
                        <span style={{ fontSize: '0.725rem', color: '#71717a', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                          {thread.senderEmail}
                        </span>
                      )}
                    </div>

                    <div
                      style={{
                        fontSize: '0.785rem',
                        color: hasUnread ? '#09090b' : '#64748b',
                        fontWeight: hasUnread ? 600 : 400,
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {thread.lastMessage}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT PANE: ACTIVE CHAT STREAM & REPLY */}
        {/* ========================================================================= */}
        <div className="admin-support-chat">
          {selectedThread ? (
            <>
              {/* Thread Header */}
              <div
                style={{
                  padding: '1rem 1.25rem',
                  borderBottom: '1px solid #e4e4e7',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#09090b' }}>
                      {selectedThread.lastSenderName}
                    </h4>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        padding: '2px 7px',
                        borderRadius: '9999px',
                        background: '#09090b',
                        color: '#ffffff',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                      }}
                    >
                      {selectedThread.lastSenderRole || 'Student'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.785rem', color: '#71717a', marginTop: '2px' }}>
                    {selectedThread.senderEmail ? `Email: ${selectedThread.senderEmail} • ` : ''}
                    Session ID: <code style={{ fontSize: '0.725rem' }}>{selectedSessionId}</code>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                  <span>Live Channel Active</span>
                </div>
              </div>

              {/* Message Stream */}
              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  backgroundColor: '#f8fafc',
                }}
              >
                {loadingMessages ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: '#71717a' }}>
                    Loading conversation history...
                  </div>
                ) : (
                  messages.map((msg, idx) => {
                    const isAdmin = msg.isAdminReply && msg.senderRole !== 'bot';
                    const isBot = msg.senderRole === 'bot';
                    const isStudent = !msg.isAdminReply && !isBot;

                    return (
                      <div
                        key={msg._id || idx}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: isAdmin ? 'flex-end' : 'flex-start',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '0.7rem',
                            color: '#64748b',
                            marginBottom: '3px',
                            padding: '0 4px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                          }}
                        >
                          {isAdmin && <ShieldCheck size={13} color="#09090b" />}
                          {isBot && <Bot size={13} color="#16a34a" />}
                          {isStudent && <User size={13} color="#3b82f6" />}
                          <span style={{ fontWeight: 600 }}>{msg.senderName}</span>
                          <span>•</span>
                          <span>
                            {msg.createdAt
                              ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                              : 'Just now'}
                          </span>
                        </div>

                        <div
                          style={{
                            maxWidth: '75%',
                            padding: '0.85rem 1.15rem',
                            borderRadius: '12px',
                            borderTopRightRadius: isAdmin ? '2px' : '12px',
                            borderTopLeftRadius: isAdmin ? '12px' : '2px',
                            backgroundColor: isAdmin ? '#09090b' : isBot ? '#f0fdf4' : '#ffffff',
                            color: isAdmin ? '#ffffff' : '#0f172a',
                            border: isAdmin ? 'none' : isBot ? '1px solid #bbf7d0' : '1px solid #e2e8f0',
                            fontSize: '0.875rem',
                            lineHeight: 1.5,
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                          }}
                        >
                          {msg.message}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Canned Replies Bar */}
              <div
                style={{
                  padding: '0.5rem 1rem',
                  borderTop: '1px solid #e4e4e7',
                  backgroundColor: '#fafafa',
                  overflowX: 'auto',
                  display: 'flex',
                  gap: '0.35rem',
                  whiteSpace: 'nowrap',
                }}
              >
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#71717a', alignSelf: 'center', marginRight: '4px' }}>
                  Quick Response:
                </span>
                {QUICK_REPLIES.map((reply, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSendReply(reply)}
                    disabled={sending}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #d4d4d8',
                      borderRadius: '9999px',
                      padding: '0.25rem 0.65rem',
                      fontSize: '0.725rem',
                      color: '#09090b',
                      cursor: 'pointer',
                      fontWeight: 500,
                    }}
                  >
                    ⚡ {reply.slice(0, 32)}...
                  </button>
                ))}
              </div>

              {/* Admin Reply Input Box */}
              <div
                style={{
                  padding: '1rem',
                  borderTop: '1px solid #e4e4e7',
                  backgroundColor: '#ffffff',
                }}
              >
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendReply();
                  }}
                  style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}
                >
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type official administrative reply to this student..."
                    disabled={sending}
                    style={{
                      flex: 1,
                      padding: '0.75rem 1rem',
                      fontSize: '0.9rem',
                      borderRadius: '8px',
                      border: '1px solid #d4d4d8',
                      outline: 'none',
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!replyText.trim() || sending}
                    className="btn btn-primary"
                    style={{ padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}
                  >
                    <Send size={16} />
                    <span>Send Reply</span>
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <EmptyState
                icon={MessageSquare}
                title="Select a Conversation"
                description="Choose an inquiry thread from the left panel to begin two-way real-time communication."
              />
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminSupportPage;
