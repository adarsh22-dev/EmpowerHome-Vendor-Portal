import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Mail,
  Shield,
  Clock,
  Edit2,
  Trash2,
  UserPlus,
  CheckCircle2,
  XCircle,
  ChevronDown
} from 'lucide-react';
import VendorLayout from '../../components/vendor/VendorLayout';

const CSS = `
  .staff-container {
    padding: 24px;
    background: #f8f9fa;
    min-height: 100vh;
  }
  .staff-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }
  .staff-header h1 {
    font-size: 24px;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0;
  }
  .staff-header p {
    color: #666;
    margin: 4px 0 0;
  }
  .btn-invite-staff {
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
  .btn-invite-staff:hover {
    background: #d43d13;
  }
  .staff-stats-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 24px;
  }
  .staff-stat-card {
    background: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .staff-stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .staff-stat-value {
    font-size: 20px;
    font-weight: 700;
    color: #1a1a1a;
  }
  .staff-stat-label {
    font-size: 13px;
    color: #666;
  }
  .staff-main-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    overflow: hidden;
  }
  .staff-controls {
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
  .staff-table {
    width: 100%;
    border-collapse: collapse;
  }
  .staff-table th {
    text-align: left;
    padding: 16px 24px;
    background: #fcfcfc;
    color: #666;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 1px solid #eee;
  }
  .staff-table td {
    padding: 16px 24px;
    border-bottom: 1px solid #eee;
    vertical-align: middle;
  }
  .staff-info-cell {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .staff-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #eee;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
    font-weight: 600;
  }
  .staff-name {
    font-weight: 600;
    color: #1a1a1a;
  }
  .staff-email {
    font-size: 12px;
    color: #888;
  }
  .role-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
  }
  .role-admin { background: #fff4e6; color: #d9480f; }
  .role-manager { background: #e7f5ff; color: #1971c2; }
  .role-staff { background: #f3f0ff; color: #6741d9; }
  .status-pill {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 700;
  }
  .status-active { background: #ebfbee; color: #2b8a3e; }
  .status-pending { background: #fff9db; color: #f08c00; }
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
  }
`;

const VendorStaffManager = () => {
  const staff = [
    {
      id: 1,
      name: 'Adarsh Gupta',
      email: 'adarsh@example.com',
      role: 'Admin',
      status: 'Active',
      lastActive: '2 mins ago',
      initials: 'AG'
    },
    {
      id: 2,
      name: 'Sarah Wilson',
      email: 'sarah.w@example.com',
      role: 'Manager',
      status: 'Active',
      lastActive: '1 hour ago',
      initials: 'SW'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.j@example.com',
      role: 'Staff',
      status: 'Pending',
      lastActive: 'Never',
      initials: 'MJ'
    },
    {
      id: 4,
      name: 'Emily Chen',
      email: 'emily.c@example.com',
      role: 'Staff',
      status: 'Active',
      lastActive: '3 hours ago',
      initials: 'EC'
    }
  ];

  const getRoleClass = (role) => {
    switch (role.toLowerCase()) {
      case 'admin': return 'role-admin';
      case 'manager': return 'role-manager';
      default: return 'role-staff';
    }
  };

  return (
    <VendorLayout title="Staff Manager">
      <style>{CSS}</style>
      <div className="staff-container">
        <div className="staff-header">
          <div>
            <h1>Staff Manager</h1>
            <p>Manage your team members and their access permissions.</p>
          </div>
          <button className="btn-invite-staff">
            <UserPlus size={18} />
            Invite Team Member
          </button>
        </div>

        <div className="staff-stats-row">
          <div className="staff-stat-card">
            <div className="staff-stat-icon bg-blue-50 text-blue-600">
              <Users size={24} />
            </div>
            <div>
              <div className="staff-stat-value">8</div>
              <div className="staff-stat-label">Total Staff</div>
            </div>
          </div>
          <div className="staff-stat-card">
            <div className="staff-stat-icon bg-green-50 text-green-600">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <div className="staff-stat-value">6</div>
              <div className="staff-stat-label">Active Now</div>
            </div>
          </div>
          <div className="staff-stat-card">
            <div className="staff-stat-icon bg-yellow-50 text-yellow-600">
              <Clock size={24} />
            </div>
            <div>
              <div className="staff-stat-value">2</div>
              <div className="staff-stat-label">Pending Invites</div>
            </div>
          </div>
        </div>

        <div className="staff-main-card">
          <div className="staff-controls">
            <div className="search-wrapper">
              <Search size={18} />
              <input type="text" placeholder="Search staff by name or email..." />
            </div>
            <button className="btn-icon">
              <Filter size={18} />
            </button>
          </div>

          <table className="staff-table">
            <thead>
              <tr>
                <th>STAFF MEMBER</th>
                <th>ROLE</th>
                <th>STATUS</th>
                <th>LAST ACTIVE</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((member) => (
                <tr key={member.id}>
                  <td>
                    <div className="staff-info-cell">
                      <div className="staff-avatar">{member.initials}</div>
                      <div>
                        <div className="staff-name">{member.name}</div>
                        <div className="staff-email">{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`role-badge ${getRoleClass(member.role)}`}>
                      <Shield size={12} />
                      {member.role}
                    </span>
                  </td>
                  <td>
                    <span className={`status-pill ${member.status === 'Active' ? 'status-active' : 'status-pending'}`}>
                      {member.status === 'Active' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                      {member.status}
                    </span>
                  </td>
                  <td className="text-sm text-gray-500">{member.lastActive}</td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-icon" title="Edit"><Edit2 size={16} /></button>
                      <button className="btn-icon" title="Delete"><Trash2 size={16} /></button>
                      <button className="btn-icon"><MoreHorizontal size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </VendorLayout>
  );
};

export default VendorStaffManager;
