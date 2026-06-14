import React, { useState } from 'react';
import { 
  Bell, 
  ShoppingCart, 
  Truck, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  CreditCard, 
  Package, 
  User,
  MoreVertical,
  Trash2,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const NotificationsView = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) setNotifications(await res.json());
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id: number) => {
    try {
      const res = await fetch(`/api/notifications/${id}/read`, { method: 'PUT' });
      if (res.ok) fetchNotifications();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const res = await fetch('/api/notifications/read-all', { method: 'PUT' });
      if (res.ok) fetchNotifications();
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const deleteNotification = async (id: number) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
      if (res.ok) fetchNotifications();
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (activeTab === 'all') return true;
    return notif.type === activeTab;
  });

  const tabs = [
    { name: 'All', id: 'all', count: notifications.filter(n => !n.is_read).length },
    { name: 'Orders & Payments', id: 'order', count: notifications.filter(n => !n.is_read && n.type === 'order').length },
    { name: 'Deliveries', id: 'delivery', count: notifications.filter(n => !n.is_read && n.type === 'delivery').length },
    { name: 'Platform Updates', id: 'platform', count: notifications.filter(n => !n.is_read && n.type === 'platform').length },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'order': return ShoppingCart;
      case 'delivery': return Truck;
      case 'payment': return CreditCard;
      case 'platform': return Info;
      default: return Bell;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'order': return 'text-blue-500 bg-blue-50';
      case 'delivery': return 'text-rose-500 bg-rose-50';
      case 'payment': return 'text-emerald-500 bg-emerald-50';
      case 'platform': return 'text-amber-500 bg-amber-50';
      default: return 'text-black/40 bg-black/5';
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
          <p className="text-black/40 text-sm mt-1">Stay updated with your store activity and platform news.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={markAllAsRead}
            className="flex items-center gap-2 bg-white border border-black/5 px-4 py-2 rounded-xl text-sm font-bold hover:bg-black/5 transition-colors shadow-sm">
            <Check className="w-4 h-4" /> Mark all as read
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-black/5 shadow-sm overflow-hidden">
        <div className="flex border-b border-black/5 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-8 py-5 text-sm font-bold transition-all relative whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id ? 'text-black' : 'text-black/40 hover:text-black'
              }`}
            >
              {tab.name}
              {tab.count > 0 && (
                <span className="w-5 h-5 bg-black text-white rounded-full text-[10px] flex items-center justify-center">
                  {tab.count}
                </span>
              )}
              {activeTab === tab.id && (
                <motion.div layoutId="notif-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
              )}
            </button>
          ))}
        </div>

        <div className="divide-y divide-black/5">
          {filteredNotifications.length === 0 ? (
            <div className="p-20 text-center text-black/40">
              <Bell className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="font-bold">No notifications found</p>
            </div>
          ) : (
            filteredNotifications.map((notif) => {
              const Icon = getIcon(notif.type);
              const colorClass = getColor(notif.type);
              return (
                <div key={notif.id} className={`p-8 hover:bg-black/5 transition-colors group flex items-start gap-6 ${!notif.is_read ? 'bg-black/[0.02]' : ''}`}>
                  <div className={`w-12 h-12 ${colorClass} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold flex items-center gap-2">
                        {notif.title}
                        {!notif.is_read && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                      </h4>
                      <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest">
                        {new Date(notif.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-black/60 leading-relaxed">{notif.message}</p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                    {!notif.is_read && (
                      <button 
                        onClick={() => markAsRead(notif.id)}
                        className="p-2 hover:bg-black/10 rounded-lg transition-colors text-black/60 hover:text-black" title="Mark as read">
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    )}
                    <button 
                      onClick={() => deleteNotification(notif.id)}
                      className="p-2 hover:bg-black/10 rounded-lg transition-colors text-rose-500" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="p-8 text-center border-t border-black/5">
          <button className="text-sm font-bold text-black/40 hover:text-black transition-colors">
            View All Notifications
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationsView;
