import React, { useState, useEffect, useRef } from 'react';
import { userApi } from '../../services/api';
import type { Notification } from '../../types';

export const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const res = await userApi.getNotifications();
      if (res.success) {
        setNotifications(res.data);
        setUnreadCount(res.data.filter((n: Notification) => !n.isRead).length);
      }
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll every 30s
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await userApi.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read', error);
    }
  };

  return (
    <div className="notification-wrapper" ref={dropdownRef}>
      <button 
        className="notification-btn" 
        onClick={() => setIsOpen(!isOpen)}
        title="Notifications"
      >
        <span className="bell-icon">🔔</span>
        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h4>Notifications</h4>
            {unreadCount > 0 && <span>{unreadCount} new</span>}
          </div>
          
          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="notification-empty">You have no notifications</div>
            ) : (
              notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                  onClick={() => {
                    if (!notification.isRead) handleMarkRead(notification.id);
                  }}
                >
                  <div className="notification-item-title">{notification.title}</div>
                  <div className="notification-item-message">{notification.message}</div>
                  <div className="notification-item-time">
                    {new Date(notification.createdAt).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <style>{`
        .notification-wrapper { position: relative; }
        .notification-btn {
          background: transparent; border: none; font-size: 1.2rem; cursor: pointer;
          position: relative; padding: 4px; color: var(--color-text);
        }
        .notification-badge {
          position: absolute; top: 0; right: 0;
          background: #e74c3c; color: white;
          font-size: 0.65rem; font-weight: bold;
          min-width: 16px; height: 16px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          padding: 0 4px;
        }
        .notification-dropdown {
          position: absolute; top: calc(100% + 12px); right: -10px;
          width: 320px; background: var(--color-surface);
          border: 1px solid var(--color-border); border-radius: var(--radius-md);
          box-shadow: 0 10px 25px rgba(0,0,0,0.5); z-index: var(--z-dropdown);
          overflow: hidden;
        }
        .notification-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 12px 16px; border-bottom: 1px solid var(--color-border);
          background: rgba(0,0,0,0.2);
        }
        .notification-header h4 { margin: 0; font-size: 0.95rem; color: var(--color-ivory); }
        .notification-header span { font-size: 0.75rem; color: var(--color-gold); font-weight: 500; }
        .notification-list { max-height: 400px; overflow-y: auto; }
        .notification-empty { padding: 24px 16px; text-align: center; color: var(--color-text-muted); font-size: 0.875rem; }
        .notification-item {
          padding: 12px 16px; border-bottom: 1px solid var(--color-border);
          cursor: pointer; transition: background var(--transition-fast);
        }
        .notification-item:last-child { border-bottom: none; }
        .notification-item:hover { background: rgba(255,255,255,0.03); }
        .notification-item.unread { background: rgba(201,162,39,0.05); border-left: 3px solid var(--color-gold); }
        .notification-item-title { font-weight: 600; font-size: 0.85rem; color: var(--color-ivory); margin-bottom: 4px; }
        .notification-item-message { font-size: 0.8rem; color: var(--color-text-secondary); margin-bottom: 8px; line-height: 1.4; }
        .notification-item-time { font-size: 0.7rem; color: var(--color-text-muted); }
        
        @media (max-width: 768px) {
          .notification-dropdown {
            position: fixed; top: 60px; right: 16px; left: 16px; width: auto;
          }
        }
      `}</style>
    </div>
  );
};
