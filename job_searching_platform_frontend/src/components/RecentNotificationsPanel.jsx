import React, { useEffect, useState } from 'react';
import { loadNotifications, markAllNotificationsRead } from '../utils/notificationsStorage';
import { useNotificationsStore } from '../state/notificationsStore';
import { BsBell, BsCircle } from 'react-icons/bs';
import './styles/RecentNotificationsPanel.css';

/**
 * PUBLIC_INTERFACE
 * RecentNotificationsPanel displays a notification summary card for the dashboard
 * or a full panel on Notifications page. Blue-accent icon, rounded, shadow.
 * @param {object} props
 * @param {function} props.onViewAll - callback for "View All" link/button
 * @param {boolean} [props.summaryMode] - if true, summary style for dashboard
 */
const RecentNotificationsPanel = ({ onViewAll, summaryMode }) => {
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const unreadCount = useNotificationsStore((s) => s.unreadCount);
  const updateUnreadCount = useNotificationsStore((s) => s.updateUnreadCount);

  useEffect(() => {
    const notifs = loadNotifications();
    setRecent(
      notifs
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, summaryMode ? 3 : 5)
    );
    setLoading(false);
  }, [unreadCount, summaryMode]);

  const handleMarkAllAsRead = () => {
    markAllNotificationsRead();
    updateUnreadCount();
  };

  const relativeTime = (dateStr) => {
    const now = new Date();
    const date = new Date(dateStr);
    const seconds = Math.floor((now - date) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    if (hours > 24) {
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    if (hours >= 1) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes >= 1) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    return 'Just now';
  };

  return (
    <div className={`recent-notifications-panel dashboard-widget${summaryMode ? " notifications-panel-summary" : ""}`}>
      <div className="rnp-header">
        <span>
          <BsBell className="rnp-bell-icon blue-accent" />
          Recent Notifications
        </span>
        <div className="rnp-actions">
          {onViewAll && (
            <button className="rnp-action-link" onClick={onViewAll}>
              View All
            </button>
          )}
          {!summaryMode && unreadCount > 0 && (
            <button className="rnp-action-link" onClick={handleMarkAllAsRead}>
              Mark as Read
            </button>
          )}
        </div>
      </div>
      <div className="rnp-list">
        {loading ? (
          <div className="rnp-empty">Loading notifications...</div>
        ) : recent.length === 0 ? (
          <div className="rnp-empty">No notifications yet.</div>
        ) : (
          recent.map((notif) => (
            <div className={`rnp-item${notif.read ? '' : ' unread'}`} key={notif.id}>
              <span className="rnp-icon-wrap">
                <BsBell />
                {!notif.read && <BsCircle className="rnp-unread-dot" />}
              </span>
              <div className="rnp-text">
                <div className="rnp-msg">{notif.message || 'You have a new notification.'}</div>
                <div className="rnp-time">{relativeTime(notif.createdAt)}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentNotificationsPanel;
