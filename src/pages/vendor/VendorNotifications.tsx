import React, { useState } from 'react';
import {
  CheckCircle2,
  Settings,
  CreditCard,
  Truck,
  Megaphone,
  Banknote,
  Wrench,
  RefreshCw
} from 'lucide-react';
import VendorLayout from '../../components/vendor/VendorLayout';
import './VendorNotifications.css';

const VendorNotifications = () => {
  const [activeTab, setActiveTab] = useState('All');

  const tabs = ['All', 'Orders & Payments', 'Deliveries', 'Platform Updates'];

  // Grouped Notification Data
  const notificationGroups = [
    {
      dateLabel: 'TODAY',
      items: [
        {
          id: 1,
          type: 'order',
          title: 'New Order #1234 received',
          message: 'A customer just purchased "Eco-Friendly Bamboo Lunchbox (Set of 3)". Please fulfill this order within 24 hours.',
          time: '2 hours ago',
          unread: true,
          icon: CreditCard,
          iconBg: 'bg-red-light',
          iconColor: 'text-red'
        },
        {
          id: 2,
          type: 'delivery',
          title: 'Package out for delivery',
          message: 'Shipment #8829 is currently with the courier and expected to arrive by 6:00 PM tonight.',
          time: '5 hours ago',
          unread: false,
          icon: Truck,
          iconBg: 'bg-blue-light',
          iconColor: 'text-blue'
        },
        {
          id: 3,
          type: 'platform',
          title: 'New policy regarding returns',
          message: "We've updated our vendor return window to 30 days. Please review the new guidelines in the Help Center.",
          time: '8 hours ago',
          unread: true,
          icon: Megaphone,
          iconBg: 'bg-yellow-light',
          iconColor: 'text-yellow'
        }
      ]
    },
    {
      dateLabel: 'YESTERDAY',
      items: [
        {
          id: 4,
          type: 'payment',
          title: 'Payment processed',
          message: 'Your payout for the period of Aug 1-15 has been processed and sent to your linked bank account.',
          time: 'Yesterday, 4:12 PM',
          unread: false,
          icon: Banknote,
          iconBg: 'bg-green-light',
          iconColor: 'text-green'
        },
        {
          id: 5,
          type: 'platform',
          title: 'Scheduled maintenance',
          message: 'Vendor Dashboard will be offline for 30 mins this Sunday at 2 AM EST for system upgrades.',
          time: 'Yesterday, 9:00 AM',
          unread: false,
          icon: Wrench,
          iconBg: 'bg-grey-light',
          iconColor: 'text-grey'
        },
        {
          id: 6,
          type: 'delivery',
          title: 'Delivery delayed: Shipment #5521',
          message: 'Inclement weather has delayed the transit of shipment #5521. The customer has been notified.',
          time: '2 days ago',
          unread: false,
          icon: RefreshCw,
          iconBg: 'bg-pink-light',
          iconColor: 'text-pink'
        }
      ]
    }
  ];

  // Helper to get filtered groups based on active tab
  const getFilteredGroups = () => {
    if (activeTab === 'All') {
      return notificationGroups;
    }

    const typeMapping = {
      'Orders & Payments': ['order', 'payment'],
      Deliveries: ['delivery'],
      'Platform Updates': ['platform']
    };

    const allowedTypes = typeMapping[activeTab] || [];

    return notificationGroups
      .map(group => ({
        ...group,
        items: group.items.filter(item => allowedTypes.includes(item.type))
      }))
      .filter(group => group.items.length > 0); // Remove empty groups
  };

  // Helper to count unread notifications per tab (for badge)
  const getUnreadCount = (tab) => {
    if (tab === 'All') {
      return notificationGroups.reduce(
        (sum, group) => sum + group.items.filter(item => item.unread).length,
        0
      );
    }

    const typeMapping = {
      'Orders & Payments': ['order', 'payment'],
      Deliveries: ['delivery'],
      'Platform Updates': ['platform']
    };

    const allowedTypes = typeMapping[tab] || [];

    return notificationGroups.reduce((sum, group) => {
      return (
        sum +
        group.items.filter(item => item.unread && allowedTypes.includes(item.type)).length
      );
    }, 0);
  };

  const filteredGroups = getFilteredGroups();

  return (
    <VendorLayout title="Notifications">
      <div className="notifications-container">
        {/* Header Row */}
        <div className="notifications-header-row">
          <h1>Notifications</h1>
          <div className="header-actions">
            <button className="btn-mark-read">
              <CheckCircle2 size={16} strokeWidth={2.5} />
              Mark all as read
            </button>
            <button className="btn-icon-square">
              <Settings size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Tabs Row */}
        <div className="notifications-tabs-row">
          <div className="tabs-container">
            {tabs.map(tab => {
              const unreadCount = getUnreadCount(tab);
              return (
                <button
                  key={tab}
                  className={`tab-item ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                  {unreadCount > 0 && (
                    <span className="tab-pill">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Notifications List Area */}
        <div className="notifications-list-area">
          {filteredGroups.length === 0 ? (
            <div className="empty-state">
              <p>No notifications in this category.</p>
            </div>
          ) : (
            filteredGroups.map((group, groupIdx) => (
              <div key={groupIdx} className="notification-group">
                <h3 className="group-date-label">{group.dateLabel}</h3>
                <div className="group-items-wrapper">
                  {group.items.map(item => {
                    const Icon = item.icon;
                    return (
                      <div key={item.id} className={`notification-card ${item.unread ? 'unread' : ''}`}>
                        <div className="nc-left">
                          <div className={`nc-icon-box ${item.iconBg}`}>
                            <Icon size={20} className={item.iconColor} />
                          </div>
                        </div>

                        <div className="nc-middle">
                          <div className="nc-title">{item.title}</div>
                          <div className="nc-message">{item.message}</div>
                        </div>

                        <div className="nc-right">
                          <div className="nc-time">{item.time}</div>
                          {item.unread && <div className="nc-unread-dot"></div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </VendorLayout>
  );
};

export default VendorNotifications;
