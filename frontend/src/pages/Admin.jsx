import { useState, useEffect } from 'react';
import { http } from '../api/http';
import EventForm from '../components/Admin/EventForm';
import EventList from '../components/Admin/EventList';
import UserForm from '../components/Admin/UserForm';
import UserList from '../components/Admin/UserList';

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);

  // User states
  const [editingUserId, setEditingUserId] = useState(null);
  const [showUserCreateForm, setShowUserCreateForm] = useState(false);
  const [userEditData, setUserEditData] = useState({
    name: '',
    email: '',
    role: 'volunteer',
    password: '',
  });

  // Event states
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [eventEditData, setEventEditData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    max_volunteers: '',
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

  // --- User handlers ---
  function startEditingUser(user) {
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
    setShowUserCreateForm(true);
    setShowEventForm(false);
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

  // --- Event handlers ---
  function startCreatingEvent() {
    setEditingEventId(null);
    setShowEventForm(true);
    setShowUserCreateForm(false);
    setEditingUserId(null);
    setEventEditData({
      title: '',
      description: '',
      date: '',
      location: '',
      max_volunteers: '',
    });
  }

  function startEditingEvent(event) {
    setEditingEventId(event.id);
    setShowEventForm(true);
    setShowUserCreateForm(false);
    setEditingUserId(null);
    setEventEditData({
      title: event.title,
      description: event.description,
      date: event.date,
      location: event.location,
      max_volunteers: event.max_volunteers,
    });
  }

  function cancelEventForm() {
    setEditingEventId(null);
    setShowEventForm(false);
    setEventEditData({
      title: '',
      description: '',
      date: '',
      location: '',
      max_volunteers: '',
    });
  }

  async function createEvent() {
    setMessage(null);
    try {
      setLoading(true);
      await http.post('/events', eventEditData);
      setMessage({ type: 'success', text: 'Event created successfully!' });
      setShowEventForm(false);
      fetchEvents();
    } catch {
      setMessage({ type: 'error', text: 'Error creating event.' });
    } finally {
      setLoading(false);
    }
  }

  async function saveEvent() {
    setMessage(null);
    try {
      setLoading(true);
      console.log('saveEvent payload:', eventEditData);
      await http.put(`/events/${editingEventId}`, eventEditData);
      setMessage({ type: 'success', text: 'Event updated successfully!' });
      setEditingEventId(null);
      setShowEventForm(false);
      fetchEvents();
    } catch (error) {
      console.error(
        'error in saveEvent:',
        error?.response?.data || error.message
      );
      setMessage({ type: 'error', text: 'Error updating event.' });
    } finally {
      setLoading(false);
    }
  }

  async function deleteEvent(id) {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    setMessage(null);
    try {
      setLoading(true);
      await http.delete(`/events/${id}`);
      setMessage({ type: 'success', text: 'Event deleted successfully!' });
      fetchEvents();
    } catch {
      setMessage({ type: 'error', text: 'Error deleting event.' });
    } finally {
      setLoading(false);
    }
  }

  const isEditingUser = editingUserId !== null;
  const isEditingEvent = editingEventId !== null;

  const isFormActive = isEditingUser || showUserCreateForm || showEventForm;

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
      {showUserCreateForm && (
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
      {isEditingUser && (
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
      {showEventForm && (
        <>
          <EventForm
            formTitle={isEditingEvent ? 'Edit Event' : 'Create Event'}
            eventData={eventEditData}
            onChange={setEventEditData}
            onSubmit={isEditingEvent ? saveEvent : createEvent}
            onCancel={cancelEventForm}
            loading={loading}
            submitLabel={isEditingEvent ? 'Save' : 'Create Event'}
          />
        </>
      )}

      {/* Lists */}
      {!isFormActive && (
        <>
          <UserList
            users={users}
            onEdit={startEditingUser}
            onDelete={deleteUser}
            onCreate={startCreatingUser}
            loading={loading}
          />

          <EventList
            events={events}
            onCreate={startCreatingEvent}
            onEdit={startEditingEvent}
            onDelete={deleteEvent}
            loading={loading}
          />
        </>
      )}
    </section>
  );
}
