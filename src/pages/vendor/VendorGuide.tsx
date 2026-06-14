import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  ChevronRight,
  Package,
  ShoppingCart,
  CreditCard,
  Tag,
  RefreshCcw,
  BarChart3,
  ExternalLink,
  PlayCircle,
  HelpCircle,
  FileText,
  MessageSquare
} from 'lucide-react';
import VendorLayout from '../../components/vendor/VendorLayout';
import './VendorGuide.css';

const VendorGuide = () => {
  const [activeSection, setActiveSection] = useState('getting-started');

  const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: BookOpen,
      content: (
        <div className="guide-content">
          <h2>Welcome to the Vendor Portal</h2>
          <p>This guide will help you navigate the features and tools available to grow your business on our platform. Whether you're a new seller or an experienced merchant, you'll find everything you need to manage your store efficiently.</p>
          
          <div className="video-placeholder">
            <PlayCircle size={48} className="text-red" />
            <span>Watch: Quick Tour of Vendor Dashboard (3:45)</span>
          </div>

          <h3>Key Features Overview</h3>
          <div className="feature-grid">
            <div className="feature-item">
              <Package className="text-blue" />
              <h4>Product Management</h4>
              <p>Add, edit, and organize your inventory with ease.</p>
            </div>
            <div className="feature-item">
              <ShoppingCart className="text-green" />
              <h4>Order Processing</h4>
              <p>Track sales and fulfill customer orders in real-time.</p>
            </div>
            <div className="feature-item">
              <CreditCard className="text-orange" />
              <h4>Payments & Payouts</h4>
              <p>Securely manage your earnings and withdrawal requests.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'products',
      title: 'Managing Products',
      icon: Package,
      content: (
        <div className="guide-content">
          <h2>Product Management Guide</h2>
          <p>Learn how to list your products effectively to attract more customers.</p>
          
          <div className="info-box blue">
            <HelpCircle size={20} />
            <div>
              <strong>Pro Tip:</strong> High-quality images and detailed descriptions can increase your conversion rate by up to 40%.
            </div>
          </div>

          <h3>Step-by-Step: Adding a Product</h3>
          <ol className="guide-steps">
            <li>Navigate to the <strong>"My Products"</strong> tab in the sidebar.</li>
            <li>Click the <strong>"Add New Product"</strong> button at the top right.</li>
            <li>Fill in the basic information (Name, Description, Category).</li>
            <li>Upload at least 3 high-resolution images.</li>
            <li>Set your pricing and inventory levels.</li>
            <li>Click <strong>"Publish"</strong> to make your product live.</li>
          </ol>
        </div>
      )
    },
    {
      id: 'orders',
      title: 'Order Fulfillment',
      icon: ShoppingCart,
      content: (
        <div className="guide-content">
          <h2>Fulfilling Orders</h2>
          <p>Timely fulfillment is crucial for maintaining a high vendor rating.</p>
          
          <h3>Order Statuses Explained</h3>
          <div className="status-guide">
            <div className="status-row">
              <span className="status-pill pending">Pending</span>
              <p>Order received but payment not yet confirmed or processing.</p>
            </div>
            <div className="status-row">
              <span className="status-pill confirmed">Confirmed</span>
              <p>Payment confirmed. You should begin preparing the shipment.</p>
            </div>
            <div className="status-row">
              <span className="status-pill shipped">Shipped</span>
              <p>Package handed over to the courier. Tracking info provided.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'payments',
      title: 'Payments & Fees',
      icon: CreditCard,
      content: (
        <div className="guide-content">
          <h2>Understanding Payments</h2>
          <p>We ensure a transparent and secure payment process for all our vendors.</p>
          
          <h3>Our Fee Structure</h3>
          <table className="guide-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Commission Fee</th>
                <th>Processing Fee</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Electronics</td>
                <td>8%</td>
                <td>2%</td>
              </tr>
              <tr>
                <td>Fashion & Apparel</td>
                <td>12%</td>
                <td>2%</td>
              </tr>
              <tr>
                <td>Home & Living</td>
                <td>10%</td>
                <td>2%</td>
              </tr>
            </tbody>
          </table>
        </div>
      )
    }
  ];

  const activeSectionData = sections.find(s => s.id === activeSection) || sections[0];

  return (
    <VendorLayout title="Vendor Guide">
      <div className="guide-container">
        {/* Header */}
        <div className="guide-header">
          <h1>Vendor Knowledge Base</h1>
          <div className="guide-search">
            <Search size={20} />
            <input type="text" placeholder="Search for guides, tutorials, or FAQs..." />
          </div>
        </div>

        <div className="guide-layout">
          {/* Sidebar Navigation */}
          <div className="guide-sidebar">
            {sections.map(section => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  className={`guide-nav-item ${activeSection === section.id ? 'active' : ''}`}
                  onClick={() => setActiveSection(section.id)}
                >
                  <Icon size={20} />
                  <span>{section.title}</span>
                  <ChevronRight size={16} className="chevron" />
                </button>
              );
            })}
            
            <div className="sidebar-footer">
              <h4>Need more help?</h4>
              <button className="btn-contact">
                <MessageSquare size={16} />
                Contact Support
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="guide-main">
            <div className="breadcrumb">
              <span>Vendor Guide</span>
              <ChevronRight size={14} />
              <span className="active">{activeSectionData.title}</span>
            </div>
            
            {activeSectionData.content}

            {/* Footer Actions */}
            <div className="guide-footer">
              <div className="was-helpful">
                <span>Was this article helpful?</span>
                <button className="btn-vote">Yes</button>
                <button className="btn-vote">No</button>
              </div>
              <div className="related-links">
                <a href="#"><FileText size={16} /> View Seller Policy</a>
                <a href="#"><ExternalLink size={16} /> Community Forum</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </VendorLayout>
  );
};

export default VendorGuide;
