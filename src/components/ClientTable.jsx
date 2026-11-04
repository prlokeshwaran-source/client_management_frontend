import { useState } from 'react';
import Swal from 'sweetalert2';

import { Pencil, Trash2, Eye } from 'lucide-react';

export default function ClientTable({ clients, onEdit, onDelete, isLoading }) {
  if (isLoading) {
    return <div className="loading">Loading clients...</div>;
  }

  if (!clients || clients.length === 0) {
    return <p className="empty">No clients found. Add your first client to get started.</p>;
  }

  const handleDelete = (client) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `Delete client "${client.name}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete(client.id);
      }
    });
  };

  const handleView = (client) => {
    Swal.fire({
      title: client.name,
      html: `
        <div style="text-align:left;line-height:1.8">
          <p><strong>Email:</strong> ${client.email || '-'}</p>
          <p><strong>Phone:</strong> ${client.phone || '-'}</p>
          <p><strong>Company:</strong> ${client.company || '-'}</p>
          <p><strong>Address:</strong> ${client.address || '-'}</p>
          <p><strong>Status:</strong> <span style="display:inline-block;padding:0.2rem 0.7rem;border-radius:999px;font-size:0.75rem;font-weight:600;background:${client.status.toLowerCase()==='active'?'#dcfce7':'#fee2e2'};color:${client.status.toLowerCase()==='active'?'#15803d':'#b91c1c'}">${client.status || '-'}</span></p>
          <p><strong>Created:</strong> ${client.createdAt ? new Date(client.createdAt).toLocaleString() : '-'}</p>
          <p><strong>Updated:</strong> ${client.updatedAt ? new Date(client.updatedAt).toLocaleString() : '-'}</p>
        </div>
      `,
      confirmButtonText: 'Close',
      width: 480
    });
  };

  return (
    <div className="table">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Company</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id}>
              <td><strong>{client.name}</strong></td>
              <td>{client.email}</td>
              <td>{client.phone}</td>
              <td>{client.company}</td>
              <td>
                <span className={`chip ${client.status.toLowerCase()}`}>{client.status}</span>
              </td>
              <td>
                <button className="icon-btn" title="View" onClick={() => handleView(client)}>
                  <Eye size={16} />
                </button>
                <button className="icon-btn" title="Edit" onClick={() => onEdit(client)}>
                  <Pencil size={16} />
                </button>
                <button className="icon-btn danger" title="Delete" onClick={() => handleDelete(client)}>
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}