import { useState, useEffect } from 'react';
import { http } from '../api/http';
import EventForm from '../components/EventForm';
import UserList from '../components/Admin/UserList';
import UserForm from '../components/Admin/UserForm';
import EventList from '../components/Admin/EventList';

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [showUserCreateForm, setShowUserCreateForm] = useState(false);
  const [userEditData, setUserEditData] = useState({
    name: '',
    email: '',
    role: 'volunteer',
    password: '',
  });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchEvents();
  }, []);

  async function fetchUsers() {
    try {
      setLoading(true);
      const { data } = await http.get('/users');
      setUsers(data);
    } catch {
      setMessage({ type: 'error', text: 'Error loading users.' });
    } finally {
      setLoading(false);
    }
  }

  async function fetchEvents() {
    try {
      setLoading(true);
      const { data } = await http.get('/events');
      setEvents(data);
    } catch {
      setMessage({ type: 'error', text: 'Error loading events.' });
    } finally {
      setLoading(false);
    }
  }

  // Event form handlers
  async function createEvent(formData) {
    setMessage(null);
    try {
      setLoading(true);
      await http.post('/events', formData);
      setMessage({ type: 'success', text: 'Event created successfully!' });
      setShowEventForm(false);
      fetchEvents();
    } catch {
      setMessage({ type: 'error', text: 'Error creating event.' });
    } finally {
      setLoading(false);
    }
  }

  // User form handlers (edit and create)
  function startEditing(user) {
    setEditingUserId(user.id);
    setShowUserCreateForm(false);
    setShowEventForm(false);
    setUserEditData({
      name: user.name,
      email: user.email,
      role: user.role,
      password: '',
    });
  }

  function startCreatingUser() {
    setEditingUserId(null);
    setShowEventForm(false);
    setShowUserCreateForm(true);
    setUserEditData({
      name: '',
      email: '',
      role: 'volunteer',
      password: '',
    });
  }

  function cancelUserForm() {
    setEditingUserId(null);
    setShowUserCreateForm(false);
    setUserEditData({
      name: '',
      email: '',
      role: 'volunteer',
      password: '',
    });
  }

  async function saveUser() {
    setMessage(null);
    try {
      setLoading(true);
      const payload = { ...userEditData };
      if (!payload.password) {
        delete payload.password;
      }
      await http.put(`/users/${editingUserId}`, payload);
      setMessage({ type: 'success', text: 'User updated successfully!' });
      setEditingUserId(null);
      fetchUsers();
    } catch {
      setMessage({ type: 'error', text: 'Error updating user.' });
    } finally {
      setLoading(false);
    }
  }

  async function createUser() {
    setMessage(null);
    try {
      setLoading(true);
      await http.post('/auth/register', userEditData);
      setMessage({ type: 'success', text: 'User created successfully!' });
      setShowUserCreateForm(false);
      fetchUsers();
    } catch {
      setMessage({ type: 'error', text: 'Error creating user.' });
    } finally {
      setLoading(false);
    }
  }

  async function deleteUser(id) {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    setMessage(null);
    try {
      setLoading(true);
      await http.delete(`/users/${id}`);
      setMessage({ type: 'success', text: 'User deleted successfully!' });
      fetchUsers();
    } catch {
      setMessage({ type: 'error', text: 'Error deleting user.' });
    } finally {
      setLoading(false);
    }
  }

  const isEditing = editingUserId !== null;
  const isShowingEventForm = showEventForm;
  const isCreatingUser = showUserCreateForm;

  const isFormActive = isEditing || isShowingEventForm || isCreatingUser;

  return (
    <section className="card" style={{ maxWidth: 900, margin: '2rem auto' }}>
      <h1>Admin Panel</h1>

      {message && (
        <div
          className={`alert ${message.type === 'error' ? '' : 'alert-success'}`}
          style={{ marginBottom: '1rem' }}
        >
          {message.text}
        </div>
      )}

      {/* User Create Form */}
      {isCreatingUser && (
        <UserForm
          formTitle="Create New User"
          userData={userEditData}
          onChange={setUserEditData}
          onSubmit={createUser}
          onCancel={cancelUserForm}
          loading={loading}
          submitLabel="Create User"
          showPasswordRequired={true}
        />
      )}

      {/* User Edit Form */}
      {isEditing && (
        <UserForm
          formTitle="Edit User"
          userData={userEditData}
          onChange={setUserEditData}
          onSubmit={saveUser}
          onCancel={cancelUserForm}
          loading={loading}
          submitLabel="Save"
          showPasswordRequired={false}
        />
      )}

      {/* Event Form */}
      {isShowingEventForm && (
        <>
          <button
            className="btn"
            onClick={() => setShowEventForm(false)}
            disabled={loading}
            type="button"
            style={{ marginBottom: '1rem' }}
          >
            Close Event Form
          </button>

          <EventForm
            onSubmit={createEvent}
            onCancel={() => setShowEventForm(false)}
          />
        </>
      )}

      {/* Show tables and create buttons only if no form active */}
      {!isFormActive && (
        <>
          <UserList
            users={users}
            onEdit={startEditing}
            onDelete={deleteUser}
            onCreate={startCreatingUser}
            loading={loading}
          />

          <EventList
            events={events}
            onCreate={() => setShowEventForm(true)}
            loading={loading}
          />
        </>
      )}
    </section>
  );
}
