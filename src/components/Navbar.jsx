import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { LayoutDashboard, Users, LogOut } from 'lucide-react';

export default function Navbar({ onLogout, user }) {
  return (
    <nav className="sidebar">
      <div className="brand">
        <i>C</i>
        <span>ClientFlow</span>
      </div>

      <button className="nav active">
        <LayoutDashboard size={18} /> <span>Dashboard</span>
      </button>

      <button className="nav">
        <Users size={18} /> <span>Clients</span>
      </button>

      <button className="nav signout" onClick={onLogout}>
        <LogOut size={18} /> <span>Logout</span>
      </button>
    </nav>
  );
}