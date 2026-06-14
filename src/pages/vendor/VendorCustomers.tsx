import React, { useState, useMemo } from 'react';
import { 
  Search, Filter, Download, Mail, Phone, MapPin, 
  ChevronLeft, ChevronRight, User, ShoppingBag, 
  Calendar, MoreVertical, Star
} from 'lucide-react';
import VendorLayout from '../../components/vendor/VendorLayout';

const STYLES = `
  .vc-wrap { padding: 28px 32px; font-family: 'Segoe UI', system-ui, sans-serif; background: #f8f9fb; min-height: 100vh; }
  @media (max-width: 700px) { .vc-wrap { padding: 16px; } }
  .vc-header { display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 16px; margin-bottom: 24px; }
  .vc-header h1 { font-size: 26px; font-weight: 700; color: #111; margin: 0 0 4px; }
  .vc-header p  { font-size: 14px; color: #6b7280; margin: 0; }
  .vc-filter-bar { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 12px 16px; margin-bottom: 12px; }
  .vc-search { display: flex; align-items: center; gap: 8px; flex: 1; min-width: 200px; position: relative; }
  .vc-search input { flex: 1; border: none; outline: none; font-size: 14px; color: #111; background: transparent; padding-left: 40px !important; }
  .vc-search-icon { position: absolute; left: 12px; color: #9ca3af; }
  .tbl-wrap { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; }
  .vc-table { width: 100%; border-collapse: collapse; }
  .vc-table th { padding: 11px 14px; text-align: left; font-size: 11.5px; font-weight: 700; color: #9ca3af; letter-spacing: .07em; border-bottom: 1px solid #e5e7eb; background: #f9fafb; }
  .vc-table td { padding: 13px 14px; font-size: 13.5px; color: #374151; border-bottom: 1px solid #f3f4f6; }
  .cust-cell { display: flex; align-items: center; gap: 12px; }
  .cust-avatar { width: 40px; height: 40px; border-radius: 50%; background: #f3f4f6; display: flex; align-items: center; justify-content: center; color: #9ca3af; border: 1px solid #e5e7eb; }
  .cust-name { font-size: 14px; font-weight: 600; color: #111; }
  .cust-email { font-size: 12px; color: #9ca3af; }
  .btn-secondary { display: inline-flex; align-items: center; gap: 7px; padding: 8px 16px; background: #fff; color: #374151; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; transition: all .15s; white-space: nowrap; }
  .btn-secondary:hover { background: #f9fafb; border-color: #9ca3af; }
  .row-btn { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 6px; border: 1px solid transparent; color: #9ca3af; cursor: pointer; transition: all .15s; }
  .row-btn:hover { background: #f3f4f6; color: #111; border-color: #e5e7eb; }
`;

const CUSTOMERS = [
  { id: 1, name: 'John Doe', email: 'john@example.com', orders: 12, spent: '$1,240.00', lastOrder: '2026-02-28', location: 'New York, USA' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', orders: 5, spent: '$450.00', lastOrder: '2026-02-15', location: 'London, UK' },
  { id: 3, name: 'Robert Brown', email: 'robert@example.com', orders: 28, spent: '$4,890.00', lastOrder: '2026-03-01', location: 'Berlin, Germany' },
  { id: 4, name: 'Emily Davis', email: 'emily@example.com', orders: 2, spent: '$120.00', lastOrder: '2026-01-10', location: 'Paris, France' },
  { id: 5, name: 'Michael Wilson', email: 'michael@example.com', orders: 8, spent: '$980.00', lastOrder: '2026-02-20', location: 'Sydney, Australia' },
];

const VendorCustomers = () => {
  const [search, setSearch] = useState('');

  const filtered = CUSTOMERS.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <VendorLayout title="Customer Management">
      <style>{STYLES}</style>
      <div className="vc-wrap">
        <div className="vc-header">
          <div>
            <h1>My Customers</h1>
            <p>View and manage your store's customer base.</p>
          </div>
          <div className="vc-btn-row">
            <button className="btn-secondary"><Download size={16} /> Export Customers</button>
          </div>
        </div>

        <div className="vc-filter-bar">
          <div className="vc-search">
            <Search size={16} className="vc-search-icon" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
            />
          </div>
          <button className="btn-secondary"><Filter size={16} /> Filter</button>
        </div>

        <div className="tbl-wrap">
          <table className="vc-table">
            <thead>
              <tr>
                <th>CUSTOMER</th>
                <th>LOCATION</th>
                <th>ORDERS</th>
                <th>TOTAL SPENT</th>
                <th>LAST ORDER</th>
                <th style={{ textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '40px' }}>
                    <div style={{ color: '#9ca3af' }}>
                      <User size={48} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                      <p>No customers found matching your search.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map(c => (
                  <tr key={c.id}>
                    <td>
                      <div className="cust-cell">
                        <div className="cust-avatar">
                          <User size={20} />
                        </div>
                        <div>
                          <div className="cust-name">{c.name}</div>
                          <div className="cust-email">{c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1 text-zinc-500">
                        <MapPin size={14} />
                        <span>{c.location}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <ShoppingBag size={14} className="text-zinc-400" />
                        <span>{c.orders} orders</span>
                      </div>
                    </td>
                    <td style={{ fontWeight: 600 }}>{c.spent}</td>
                    <td>
                      <div className="flex items-center gap-1 text-zinc-500">
                        <Calendar size={14} />
                        <span>{c.lastOrder}</span>
                      </div>
                    </td>
                    <td>
                      <div className="row-actions">
                        <button className="row-btn" title="Send Email"><Mail size={15} /></button>
                        <button className="row-btn" title="View Details"><MoreVertical size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </VendorLayout>
  );
};

export default VendorCustomers;
