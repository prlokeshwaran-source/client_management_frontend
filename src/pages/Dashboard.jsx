import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Sidebar from '../components/Sidebar';
import ClientTable from '../components/ClientTable';
import ClientForm from '../components/ClientForm';
import api from '../services/api';
import { Users, UserCheck, UserX } from 'lucide-react';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [clients, setClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(storedUser));
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [statsResponse, clientsResponse] = await Promise.all([
        api.get('/clients/statistics'),
        api.get('/clients')
      ]);

      if (statsResponse.data.success) {
        setStatistics(statsResponse.data.data);
      }
      
      if (clientsResponse.data.success) {
        setClients(clientsResponse.data.data.clients);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to load dashboard data',
        icon: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleAddClient = () => {
    setEditingClient(null);
    setFormOpen(true);
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
    setFormOpen(true);
  };

  const handleSaveClient = async (clientData) => {
    try {
      setIsLoading(true);
      let response;
      
      if (editingClient) {
        response = await api.put(`/clients/${editingClient.id}`, clientData);
      } else {
        response = await api.post('/clients', clientData);
      }
      
      if (response.data.success) {
        await fetchDashboardData();
        setFormOpen(false);
        Swal.fire({
          title: 'Success',
          text: editingClient ? 'Client updated successfully' : 'Client added successfully',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error('Error saving client:', error);
      Swal.fire({
        title: 'Error',
        text: error.response?.data?.message || 'Failed to save client',
        icon: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClient = async (clientId) => {
    try {
      setIsLoading(true);
      const response = await api.delete(`/clients/${clientId}`);
      
      if (response.data.success) {
        await fetchDashboardData();
        Swal.fire({
          title: 'Success',
          text: 'Client deleted successfully',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error('Error deleting client:', error);
      Swal.fire({
        title: 'Error',
        text: error.response?.data?.message || 'Failed to delete client',
        icon: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredClients = clients.filter(client =>
    `${client.name} ${client.email} ${client.company}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="layout">
      <Sidebar onLogout={handleLogout} />
      
      <main className="main">
        <header className="top">
          <div>
            <small>OVERVIEW</small>
            <h1>Client dashboard</h1>
          </div>
          <div className="user">
            <span>{user.name}</span>
            <em>{user.email}</em>
          </div>
        </header>
        
        {isLoading ? (
          <div className="loading">Loading dashboard...</div>
        ) : (
          <>
            <section className="stats">
              <article>
                <div className="stat-icon"><Users size={20} /></div>
                <h3>Total clients</h3>
                <strong>{statistics?.totalClients || 0}</strong>
              </article>
              <article>
                <div className="stat-icon"><UserCheck size={20} /></div>
                <h3>Active clients</h3>
                <strong>{statistics?.activeClients || 0}</strong>
              </article>
              <article>
                <div className="stat-icon"><UserX size={20} /></div>
                <h3>Inactive clients</h3>
                <strong>{statistics?.inactiveClients || 0}</strong>
              </article>
            </section>
            
            <section className="panel">
              <header>
                <h2>Client management</h2>
                <button className="primary" onClick={handleAddClient} disabled={isLoading}>+ Add client</button>
              </header>
              
              <input
                className="search"
                type="text"
                placeholder="Search name, email, or company"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              
              <ClientTable
                clients={filteredClients}
                onEdit={handleEditClient}
                onDelete={handleDeleteClient}
                isLoading={isLoading}
              />
            </section>
          </>
        )}
      </main>
      
      {formOpen && (
        <ClientForm
          client={editingClient}
          onClose={() => setFormOpen(false)}
          onSave={handleSaveClient}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}