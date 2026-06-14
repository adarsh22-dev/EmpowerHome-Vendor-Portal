import React, { useState } from 'react';
import {
  MessageSquare,
  Search,
  Filter,
  MoreHorizontal,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  Reply,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Star
} from 'lucide-react';
import VendorLayout from '../../components/vendor/VendorLayout';
import './VendorEnquiries.css';

const VendorEnquiries = () => {
  const [activeTab, setActiveTab] = useState('All');

  const enquiries = [
    {
      id: 'ENQ-2023-001',
      customer: 'Rahul Sharma',
      product: 'Artisan Ceramic Vase',
      message: 'Is this vase dishwasher safe? I want to use it for fresh flowers.',
      date: '2 hours ago',
      status: 'Pending',
      priority: 'High'
    },
    {
      id: 'ENQ-2023-002',
      customer: 'Priya Patel',
      product: 'Nordic Throw Blanket',
      message: 'Do you have this in a larger size? Looking for King size.',
      date: '5 hours ago',
      status: 'Replied',
      priority: 'Medium'
    },
    {
      id: 'ENQ-2023-003',
      customer: 'Amit Kumar',
      product: 'Minimalist Oak Stool',
      message: 'What is the maximum weight capacity for this stool?',
      date: 'Yesterday',
      status: 'Pending',
      priority: 'Low'
    },
    {
      id: 'ENQ-2023-004',
      customer: 'Sneha Gupta',
      product: 'Eco-Friendly Bamboo Lunchbox',
      message: 'Is the lid leak-proof for soups?',
      date: '2 days ago',
      status: 'Replied',
      priority: 'Medium'
    }
  ];

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'status-pending';
      case 'replied': return 'status-replied';
      case 'closed': return 'status-closed';
      default: return '';
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };

  return (
    <VendorLayout title="Product Enquiries">
      <div className="enquiries-container">
        {/* Header Section */}
        <div className="enquiries-header-row">
          <div>
            <h1>Product Enquiries</h1>
            <p>Manage customer questions and provide timely responses to boost sales.</p>
          </div>
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-value">12</span>
              <span className="stat-label">Pending</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-value">4.8h</span>
              <span className="stat-label">Avg. Response</span>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="enquiries-main-card">
          {/* Tabs & Filters */}
          <div className="enquiries-controls">
            <div className="enquiries-tabs">
              {['All', 'Pending', 'Replied', 'Archived'].map(tab => (
                <button
                  key={tab}
                  className={`enquiry-tab ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="enquiries-actions">
              <div className="search-box">
                <Search size={18} />
                <input type="text" placeholder="Search enquiries..." />
              </div>
              <button className="btn-filter">
                <Filter size={18} />
                Filters
              </button>
            </div>
          </div>

          {/* Enquiries List */}
          <div className="enquiries-list">
            {enquiries.map((enq) => (
              <div key={enq.id} className="enquiry-card">
                <div className="enquiry-card-header">
                  <div className="customer-info">
                    <div className="avatar-circle">
                      <User size={16} />
                    </div>
                    <div>
                      <div className="customer-name">{enq.customer}</div>
                      <div className="enquiry-id">ID: {enq.id}</div>
                    </div>
                  </div>
                  <div className="enquiry-meta">
                    <span className={`priority-badge ${getPriorityClass(enq.priority)}`}>
                      {enq.priority} Priority
                    </span>
                    <span className={`status-pill ${getStatusClass(enq.status)}`}>
                      {enq.status}
                    </span>
                  </div>
                </div>

                <div className="enquiry-body">
                  <div className="product-reference">
                    <Star size={14} className="text-yellow" />
                    <span>Regarding: <strong>{enq.product}</strong></span>
                  </div>
                  <p className="enquiry-message">"{enq.message}"</p>
                </div>

                <div className="enquiry-footer">
                  <div className="enquiry-time">
                    <Clock size={14} />
                    <span>Received {enq.date}</span>
                  </div>
                  <div className="enquiry-actions-btns">
                    <button className="btn-action secondary">
                      <Eye size={16} />
                      View
                    </button>
                    <button className="btn-action primary">
                      <Reply size={16} />
                      Reply
                    </button>
                    <button className="btn-icon-only">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="enquiries-pagination">
            <div className="pagination-info">Showing 1 to 4 of 12 enquiries</div>
            <div className="pagination-btns">
              <button className="btn-page"><ChevronLeft size={18} /></button>
              <button className="btn-page active">1</button>
              <button className="btn-page">2</button>
              <button className="btn-page">3</button>
              <button className="btn-page"><ChevronRight size={18} /></button>
            </div>
          </div>
        </div>
      </div>
    </VendorLayout>
  );
};

export default VendorEnquiries;
