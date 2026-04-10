import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Fetch items from the backend
  useEffect(() => {
    axios.get(`${API_URL}/items`)
      .then(response => setItems(response.data))
      .catch(error => console.log(error));
  }, []);

  // Add or Update item
  const handleSubmit = () => {
    if (!name.trim()) return;

    if (editingId) {
      axios.put(`${API_URL}/items/${editingId}`, { name })
        .then(response => {
          setItems(items.map(item => item._id === editingId ? response.data : item));
          setName('');
          setEditingId(null);
        })
        .catch(error => console.log(error));
    } else {
      axios.post(`${API_URL}/items`, { name })
        .then(response => {
          setItems([...items, response.data]);
          setName('');
        })
        .catch(error => console.log(error));
    }
  };

  // Edit item
  const handleEdit = (item) => {
    setName(item.name);
    setEditingId(item._id);
  };

  // Delete item
  const handleDelete = (id) => {
    axios.delete(`${API_URL}/items/${id}`)
      .then(() => {
        setItems(items.filter(item => item._id !== id));
      })
      .catch(error => console.log(error));
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Simple MERN Example</h1>
      
      <div className="mb-3">
        <input 
          type="text" 
          className="form-control" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Enter item name" 
        />
      </div>
      
      <button className="btn btn-primary" onClick={handleSubmit}>
        {editingId ? 'Update Item' : 'Add Item'}
      </button>
      {editingId && (
        <button className="btn btn-secondary ms-2" style={{ marginLeft: '10px' }} onClick={() => {
          setName('');
          setEditingId(null);
        }}>Cancel</button>
      )}

      <h2 className="mt-4">Items:</h2>
      <ul className="list-group">
        {items.map(item => (
          <li key={item._id} className="list-group-item d-flex justify-content-between align-items-center" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{item.name}</span>
            <div>
              <button className="btn btn-sm btn-info me-2" style={{ marginRight: '5px' }} onClick={() => handleEdit(item)}>Edit</button>
              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
