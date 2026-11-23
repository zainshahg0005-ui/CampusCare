import React, { useState } from 'react';
import { CheckCheck, Bell, Zap, Wifi, Droplet } from 'lucide-react';

const initialNotifications = [
  {
    id: 1,
    title: 'Technician Dispatched',
    desc: 'Block C Electrical team has been assigned to ticket #CC-104.',
    time: '12m ago',
    unread: true,
    icon: Zap,
  },
  {
    id: 2,
    title: 'Resolution Confirmed',
    desc: 'Hostel 3 Water Pump pressure restored to 4.2 bar.',
    time: '45m ago',
    unread: true,
    icon: Droplet,
  },
  {
    id: 3,
    title: 'Network Maintenance Notice',
    desc: 'Scheduled 15-min firmware update on Science Quad APs at 11:00 PM.',
    time: '2h ago',
    unread: false,
    icon: Wifi,
  },
];

const NotificationPopover = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState(initialNotifications);

  if (!isOpen) return null;

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  return (
    <div className="notification-popover" onClick={(e) => e.stopPropagation()}>
      <div className="notification-popover-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Bell size={16} color="#059669" />
          <span>Campus Alerts & Logs</span>
        </div>
        <button
          onClick={handleMarkAllRead}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#059669',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 3,
          }}
        >
          <CheckCheck size={14} />
          <span>Mark all read</span>
        </button>
      </div>

      <div className="notification-list">
        {notifications.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className={`notification-item ${item.unread ? 'unread' : ''}`}>
              <div className="notification-icon-box">
                <Icon size={16} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                  <strong style={{ fontSize: '0.825rem', color: '#111827' }}>{item.title}</strong>
                  <span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>{item.time}</span>
                </div>
                <p style={{ fontSize: '0.775rem', color: '#4b5563', margin: 0, lineHeight: 1.4 }}>
                  {item.desc}
                </p>
              </div>
              {item.unread && (
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#059669', marginTop: 6 }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationPopover;
