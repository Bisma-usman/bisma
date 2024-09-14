import React, { useState, useEffect } from 'react';

const Table = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '' });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/users')
      .then(response => response.json())
      .then(data => setUsers(data));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (editing) {
      fetch(`http://localhost:3000/users/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      })
        .then(response => response.json())
        .then(data => {
          setUsers(users.map(user => user.id === editing.id ? data : user));
          setEditing(null);
        });
    } else {
      fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      })
        .then(response => response.json())
        .then(data => setUsers([...users, data]));
    }
    setNewUser({ name: '', email: '' });
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:3000/users/${id}`, { method: 'DELETE' })
      .then(response => response.json())
      .then(() => setUsers(users.filter(user => user.id !== id)));
  };

  const handleEdit = (user) => {
    setEditing(user);
    setNewUser(user);
  };

  return (
    <div>
      <h1>Users</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <button onClick={() => handleEdit(user)}>Edit</button>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" value={newUser.name} onChange={(event) => setNewUser({ ...newUser, name: event.target.value })} />
        </label>
        <label>
          Email:
          <input type="email" value={newUser.email} onChange={(event) => setNewUser({ ...newUser, email: event.target.value })} />
        </label>
        <button type="submit">{editing ? 'Update' : 'Create'}</button>
      </form>
    </div>
  );
};

export default Table;