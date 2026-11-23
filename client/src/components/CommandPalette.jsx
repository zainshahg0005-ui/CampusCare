import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  FilePlus2,
  FolderOpen,
  LayoutDashboard,
  Users,
  LogOut,
  AlertTriangle,
  Clock,
  CheckCircle2,
  X,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CommandPalette = ({ isOpen, onClose }) => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Base navigation commands depending on role
  const navigationItems = isAdmin
    ? [
        { id: 'admin-dash', title: 'Executive Cockpit', subtitle: 'View real-time campus metrics & charts', icon: LayoutDashboard, path: '/admin/dashboard', category: 'Navigation' },
        { id: 'admin-complaints', title: 'Manage Complaints', subtitle: 'Triage, assign, and resolve campus tickets', icon: FolderOpen, path: '/admin/complaints', category: 'Navigation' },
        { id: 'admin-students', title: 'Student Directory', subtitle: 'View enrolled students and submission history', icon: Users, path: '/admin/students', category: 'Navigation' },
      ]
    : [
        { id: 'student-dash', title: 'Student Dashboard', subtitle: 'Overview of recent tickets & SLA progress', icon: LayoutDashboard, path: '/student/dashboard', category: 'Navigation' },
        { id: 'student-submit', title: 'Lodge New Complaint', subtitle: 'File facility issue with photo & priority', icon: FilePlus2, path: '/student/submit', category: 'Action' },
        { id: 'student-complaints', title: 'My Grievances', subtitle: 'Track status and review technician notes', icon: FolderOpen, path: '/student/complaints', category: 'Navigation' },
      ];

  const quickFilterItems = [
    { id: 'filter-urgent', title: 'View Urgent Priority Tickets', subtitle: 'High-severity complaints requiring immediate dispatch', icon: AlertTriangle, action: () => navigate(isAdmin ? '/admin/complaints?priority=Urgent' : '/student/complaints?priority=Urgent'), category: 'Quick Filter' },
    { id: 'filter-pending', title: 'View Pending Triage', subtitle: 'Tickets awaiting administrative assignment', icon: Clock, action: () => navigate(isAdmin ? '/admin/complaints?status=Pending' : '/student/complaints?status=Pending'), category: 'Quick Filter' },
    { id: 'filter-resolved', title: 'View Resolved History', subtitle: 'Successfully fixed campus facility logs', icon: CheckCircle2, action: () => navigate(isAdmin ? '/admin/complaints?status=Resolved' : '/student/complaints?status=Resolved'), category: 'Quick Filter' },
  ];

  const systemItems = [
    { id: 'sys-logout', title: 'Sign Out', subtitle: `Logged in as ${user?.name || 'User'}`, icon: LogOut, action: () => { logout(); navigate('/login'); }, category: 'Account' },
  ];

  const allItems = [...navigationItems, ...quickFilterItems, ...systemItems];

  const filteredItems = query.trim()
    ? allItems.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      )
    : allItems;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % (filteredItems.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = filteredItems[selectedIndex];
        if (selected) {
          executeItem(selected);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex]);

  const executeItem = (item) => {
    onClose();
    if (item.action) {
      item.action();
    } else if (item.path) {
      navigate(item.path);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="cmd-palette-backdrop" onClick={onClose}>
      <div className="cmd-palette-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Search Input Bar */}
        <div className="cmd-search-header">
          <Search size={20} color="#059669" />
          <input
            ref={inputRef}
            type="text"
            className="cmd-search-input"
            placeholder="Type a command, search pages, or filter tickets..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
          />
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#9ca3af' }}
            title="Close (Esc)"
          >
            <X size={18} />
          </button>
        </div>

        {/* Results List */}
        <div className="cmd-results-list">
          {filteredItems.length === 0 ? (
            <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#9ca3af', fontSize: '0.875rem' }}>
              No commands or tickets match "{query}".
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  className={`cmd-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => executeItem(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="cmd-item-left">
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: isSelected ? '#059669' : '#f3f4f6',
                        color: isSelected ? '#ffffff' : '#374151',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <Icon size={16} />
                    </div>
                    <div>
                      <div className="cmd-item-title">{item.title}</div>
                      <div style={{ fontSize: '0.75rem', color: isSelected ? '#065f46' : '#6b7280' }}>
                        {item.subtitle}
                      </div>
                    </div>
                  </div>
                  <span className="cmd-item-badge">{item.category}</span>
                </div>
              );
            })
          )}
        </div>

        {/* Footer with Keyboard Hints */}
        <div className="cmd-palette-footer">
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <span><kbd>↑</kbd> <kbd>↓</kbd> to navigate</span>
            <span><kbd>↵</kbd> to select</span>
            <span><kbd>esc</kbd> to close</span>
          </div>
          <span style={{ fontWeight: 600, color: '#059669' }}>CampusCare Command</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
