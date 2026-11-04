import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Sidebar from '../components/Sidebar';
import ClientTable from '../components/ClientTable';
import ClientForm from '../components/ClientForm';
import api from '../services/api';

export default function Clients() {
  const [user, setUser] = useState(null);
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
    fetchClients();
  }, [navigate]);

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/clients');
      
      if (response.data.success) {
        setClients(response.data.data.clients);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to load clients',
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
        await fetchClients();
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
        await fetchClients();
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
            <small>CLIENTS</small>
            <h1>Client management</h1>
          </div>
        </header>
        
        <section className="panel">
          <header>
            <h2>All clients</h2>
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