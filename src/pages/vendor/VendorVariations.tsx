import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit2,
  Trash2,
  Copy,
  ChevronDown,
  ChevronRight,
  Package,
  Settings2,
  AlertCircle
} from 'lucide-react';
import VendorLayout from '../../components/vendor/VendorLayout';

const STYLES = `
  .variations-container {
    padding: 24px;
    background: #f8f9fa;
    min-height: 100vh;
  }
  .variations-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }
  .variations-header h1 {
    font-size: 24px;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0;
  }
  .variations-header p {
    color: #666;
    margin: 4px 0 0;
  }
  .btn-add-variation {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #e84c1e;
    color: white;
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: background 0.2s;
  }
  .btn-add-variation:hover {
    background: #d43d13;
  }
  .variations-main-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    overflow: hidden;
  }
  .variations-controls {
    padding: 16px 24px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
  }
  .search-wrapper {
    position: relative;
    flex: 1;
    max-width: 400px;
  }
  .search-wrapper svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #999;
  }
  .search-wrapper input {
    width: 100%;
    padding: 10px 12px 10px 40px;
    border: 1px solid #ddd;
    border-radius: 8px;
    outline: none;
  }
  .filter-btns {
    display: flex;
    gap: 12px;
  }
  .btn-filter {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: white;
    color: #444;
    font-weight: 500;
    cursor: pointer;
  }
  .variations-table {
    width: 100%;
    border-collapse: collapse;
  }
  .variations-table th {
    text-align: left;
    padding: 16px 24px;
    background: #fcfcfc;
    color: #666;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 1px solid #eee;
  }
  .variations-table td {
    padding: 16px 24px;
    border-bottom: 1px solid #eee;
    vertical-align: middle;
  }
  .variation-name-cell {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .variation-icon-box {
    width: 40px;
    height: 40px;
    background: #fff5f2;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #e84c1e;
  }
  .variation-title {
    font-weight: 600;
    color: #1a1a1a;
  }
  .variation-subtitle {
    font-size: 12px;
    color: #888;
  }
  .attribute-pill {
    display: inline-flex;
    padding: 4px 12px;
    background: #f0f0f0;
    border-radius: 20px;
    font-size: 12px;
    color: #444;
    margin-right: 6px;
    margin-bottom: 4px;
  }
  .status-pill {
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
  }
  .status-active { background: #e6fcf5; color: #0ca678; }
  .status-inactive { background: #fff5f5; color: #f03e3e; }
  .action-btns {
    display: flex;
    gap: 8px;
  }
  .btn-icon {
    padding: 8px;
    border-radius: 6px;
    border: 1px solid #eee;
    background: white;
    color: #666;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-icon:hover {
    background: #f8f9fa;
    border-color: #ddd;
    color: #e84c1e;
  }
`;

const VendorVariations = () => {
  const variations = [
    {
      id: 'VAR-001',
      name: 'Size & Color',
      product: 'Artisan Ceramic Vase',
      attributes: ['Size', 'Color', 'Material'],
      options: 12,
      status: 'Active'
    },
    {
      id: 'VAR-002',
      name: 'Fabric Type',
      product: 'Nordic Throw Blanket',
      attributes: ['Material', 'Pattern'],
      options: 6,
      status: 'Active'
    },
    {
      id: 'VAR-003',
      name: 'Wood Finish',
      product: 'Minimalist Oak Stool',
      attributes: ['Finish', 'Height'],
      options: 4,
      status: 'Inactive'
    },
    {
      id: 'VAR-004',
      name: 'Capacity',
      product: 'Eco-Friendly Bamboo Lunchbox',
      attributes: ['Volume', 'Compartments'],
      options: 3,
      status: 'Active'
    }
  ];

  return (
    <VendorLayout title="My Variations">
      <style>{STYLES}</style>
      <div className="variations-container">
        <div className="variations-header">
          <div>
            <h1>My Variations</h1>
            <p>Manage product variations, attributes, and options for your inventory.</p>
          </div>
          <button className="btn-add-variation">
            <Plus size={18} />
            Create Variation Set
          </button>
        </div>

        <div className="variations-main-card">
          <div className="variations-controls">
            <div className="search-wrapper">
              <Search size={18} />
              <input type="text" placeholder="Search variations..." />
            </div>
            <div className="filter-btns">
              <button className="btn-filter">
                <Filter size={16} />
                Filters
              </button>
              <button className="btn-filter">
                <Settings2 size={16} />
                Bulk Actions
              </button>
            </div>
          </div>

          <table className="variations-table">
            <thead>
              <tr>
                <th>VARIATION SET</th>
                <th>LINKED PRODUCT</th>
                <th>ATTRIBUTES</th>
                <th>OPTIONS</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {variations.map((v) => (
                <tr key={v.id}>
                  <td>
                    <div className="variation-name-cell">
                      <div className="variation-icon-box">
                        <Layers size={20} />
                      </div>
                      <div>
                        <div className="variation-title">{v.name}</div>
                        <div className="variation-subtitle">ID: {v.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="variation-title">{v.product}</div>
                  </td>
                  <td>
                    {v.attributes.map((attr, i) => (
                      <span key={i} className="attribute-pill">{attr}</span>
                    ))}
                  </td>
                  <td className="font-bold">{v.options}</td>
                  <td>
                    <span className={`status-pill ${v.status === 'Active' ? 'status-active' : 'status-inactive'}`}>
                      {v.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-icon" title="Edit"><Edit2 size={16} /></button>
                      <button className="btn-icon" title="Duplicate"><Copy size={16} /></button>
                      <button className="btn-icon" title="Delete"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3">
          <AlertCircle size={20} className="text-blue-500 flex-shrink-0" />
          <p className="text-sm text-blue-700">
            <strong>Tip:</strong> Variations help customers find exactly what they're looking for. Products with variations typically see a 15% higher conversion rate.
          </p>
        </div>
      </div>
    </VendorLayout>
  );
};

export default VendorVariations;
