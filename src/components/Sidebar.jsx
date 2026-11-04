import { NavLink, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { LayoutDashboard, Users, LogOut } from 'lucide-react';

export default function Sidebar({ onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        onLogout();
        navigate('/login');
      }
    });
  };

  return (
    <nav className="sidebar">
      <div className="brand">
        <i>C</i>
        <span>ClientFlow</span>
      </div>

      <NavLink to="/dashboard" className={({ isActive }) => `nav ${isActive ? 'active' : ''}`}>
        <LayoutDashboard size={18} /> <span>Dashboard</span>
      </NavLink>

      <NavLink to="/clients" className={({ isActive }) => `nav ${isActive ? 'active' : ''}`}>
        <Users size={18} /> <span>Clients</span>
      </NavLink>

      <button className="nav signout" onClick={handleLogout}>
        <LogOut size={18} /> <span>Logout</span>
      </button>
    </nav>
  );
}