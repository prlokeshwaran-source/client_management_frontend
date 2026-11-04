import { useState } from 'react';
import Swal from 'sweetalert2';

export default function ClientForm({ client, onClose, onSave, isLoading }) {
  const [values, setValues] = useState(client || {
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    status: 'Active'
  });
  const [error, setError] = useState('');

  const update = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const validate = () => {
    const requiredFields = ['name', 'email', 'phone', 'company', 'address'];
    for (const field of requiredFields) {
      if (!values[field]) {
        setError(`Please enter ${field.replace('_', ' ')}`);
        return false;
      }
    }

    if (!/^[^@]+@[^@]+\.[^@]+$/.test(values.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    setError('');
    return true;
  };

  const submit = (event) => {
    event.preventDefault();
    if (validate()) {
      onSave(values);
    }
  };

  return (
    <div className="backdrop">
      <form className="modal" onSubmit={submit}>
        <header>
          <h2>{client ? 'Edit client' : 'Add client'}</h2>
          <button type="button" onClick={onClose}>×</button>
        </header>
        
        <div className="fields">
          <label>
            Name
            <input name="name" value={values.name} onChange={update} placeholder="Client name" />
          </label>
          
          <label>
            Email
            <input name="email" type="email" value={values.email} onChange={update} placeholder="client@example.com" />
          </label>
          
          <label>
            Phone
            <input name="phone" value={values.phone} onChange={update} placeholder="+1 234 567 8900" />
          </label>
          
          <label>
            Company
            <input name="company" value={values.company} onChange={update} placeholder="Company name" />
          </label>
          
          <label className="wide">
            Address
            <input name="address" value={values.address} onChange={update} placeholder="Address" />
          </label>
          
          <label>
            Status
            <select name="status" value={values.status} onChange={update}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </label>
        </div>
        
        {error && <b className="error">{error}</b>}
        
        <footer>
          <button type="button" className="cancel" onClick={onClose}>Cancel</button>
          <button type="submit" className="primary" disabled={isLoading}>
            {isLoading ? 'Saving...' : (client ? 'Save changes' : 'Add client')}
          </button>
        </footer>
      </form>
    </div>
  );
}