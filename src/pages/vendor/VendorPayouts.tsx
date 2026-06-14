import React, { useState } from 'react';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Download,
  Search,
  Filter,
  Printer,
  FileText,
  Table as TableIcon,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Plus,
  AlertCircle,
  CheckCircle2,
  Clock
} from 'lucide-react';
import VendorLayout from '../../components/vendor/VendorLayout';
import './VendorPayouts.css';

const VendorPayouts = () => {
  const [activeTab, setActiveTab] = useState('History');

  // KPI Data
  const metrics = [
    {
      title: 'Available Balance',
      value: '₹12,450.00',
      subtitle: 'Ready for withdrawal',
      icon: Wallet,
      color: 'blue'
    },
    {
      title: 'Pending Payouts',
      value: '₹4,820.00',
      subtitle: 'Processing (2-3 days)',
      icon: Clock,
      color: 'orange'
    },
    {
      title: 'Total Withdrawn',
      value: '₹142,900.00',
      subtitle: 'Lifetime earnings',
      icon: CheckCircle2,
      color: 'green'
    }
  ];

  // Transaction Data
  const transactions = [
    {
      id: 'PAY-882190',
      date: 'Oct 24, 2023',
      amount: '₹2,450.00',
      method: 'Bank Transfer (....4210)',
      status: 'Completed',
      type: 'Withdrawal'
    },
    {
      id: 'PAY-882191',
      date: 'Oct 22, 2023',
      amount: '₹1,200.00',
      method: 'PayPal (v***@email.com)',
      status: 'Processing',
      type: 'Withdrawal'
    },
    {
      id: 'PAY-882192',
      date: 'Oct 15, 2023',
      amount: '₹8,400.00',
      method: 'Bank Transfer (....4210)',
      status: 'Completed',
      type: 'Withdrawal'
    },
    {
      id: 'PAY-882193',
      date: 'Oct 01, 2023',
      amount: '₹12,000.00',
      method: 'Bank Transfer (....4210)',
      status: 'Completed',
      type: 'Withdrawal'
    }
  ];

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'status-success';
      case 'processing': return 'status-pending';
      case 'failed': return 'status-error';
      default: return '';
    }
  };

  return (
    <VendorLayout title="Payouts & Earnings">
      <div className="payouts-container">
        {/* Header Section */}
        <div className="payouts-header-row">
          <div>
            <h1>Payouts & Earnings</h1>
            <p>Track your revenue, manage withdrawal requests, and view transaction history.</p>
          </div>
          <button className="btn-request-payout">
            <Plus size={18} />
            Request Withdrawal
          </button>
        </div>

        {/* Metrics Row */}
        <div className="payouts-metrics-row">
          {metrics.map((m, i) => {
            const Icon = m.icon;
            return (
              <div key={i} className="payout-metric-card">
                <div className={`metric-icon-box bg-${m.color}-light`}>
                  <Icon size={24} className={`text-${m.color}`} />
                </div>
                <div className="metric-content">
                  <div className="metric-title">{m.title}</div>
                  <div className="metric-value">{m.value}</div>
                  <div className="metric-subtitle">{m.subtitle}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="payouts-main-card">
          {/* Tabs & Search Row */}
          <div className="payouts-controls-row">
            <div className="payouts-tabs">
              {['History', 'Withdrawal Requests', 'Settlements'].map(tab => (
                <button
                  key={tab}
                  className={`payout-tab ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="payouts-actions">
              <div className="search-box">
                <Search size={18} />
                <input type="text" placeholder="Search transactions..." />
              </div>
              <div className="export-dropdown">
                <button className="btn-export">
                  <Download size={18} />
                  Export
                </button>
                <div className="export-menu">
                  <button><Printer size={16} /> Print</button>
                  <button><TableIcon size={16} /> Excel (XLSX)</button>
                  <button><FileText size={16} /> CSV</button>
                </div>
              </div>
            </div>
          </div>

          {/* Table Area */}
          <div className="payouts-table-wrapper">
            <table className="payouts-table">
              <thead>
                <tr>
                  <th>TRANSACTION ID</th>
                  <th>DATE</th>
                  <th>TYPE</th>
                  <th>AMOUNT</th>
                  <th>METHOD</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t, i) => (
                  <tr key={i}>
                    <td className="font-mono text-sm">{t.id}</td>
                    <td>{t.date}</td>
                    <td>
                      <div className="type-cell">
                        {t.type === 'Withdrawal' ? <ArrowUpRight size={14} className="text-red" /> : <ArrowDownLeft size={14} className="text-green" />}
                        {t.type}
                      </div>
                    </td>
                    <td className="font-bold">{t.amount}</td>
                    <td className="text-grey-dark">{t.method}</td>
                    <td>
                      <span className={`status-pill ${getStatusClass(t.status)}`}>
                        {t.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn-icon-more">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="payouts-pagination">
            <div className="pagination-info">Showing 1 to 4 of 28 entries</div>
            <div className="pagination-btns">
              <button className="btn-page"><ChevronLeft size={18} /></button>
              <button className="btn-page active">1</button>
              <button className="btn-page">2</button>
              <button className="btn-page">3</button>
              <button className="btn-page"><ChevronRight size={18} /></button>
            </div>
          </div>
        </div>

        {/* Withdrawal Eligibility Notice */}
        <div className="payout-notice-card">
          <div className="notice-icon">
            <AlertCircle size={24} className="text-blue" />
          </div>
          <div className="notice-content">
            <h3>Withdrawal Eligibility</h3>
            <p>You can request a withdrawal once your balance reaches ₹5,000.00. Payouts are processed every Tuesday and Friday. For urgent requests, please contact vendor support.</p>
          </div>
          <button className="btn-outline-blue">View Policy</button>
        </div>
      </div>
    </VendorLayout>
  );
};

export default VendorPayouts;
