import { useState, useEffect } from 'react';
import { http } from '../api/http';
import EventForm from '../components/EventForm';

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [userEditData, setUserEditData] = useState({
    name: '',
    email: '',
    role: '',
  });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch users and events on mount
  useEffect(() => {
    fetchUsers();
    fetchEvents();
  }, []);

  async function fetchUsers() {
    try {
      setLoading(true);
      const { data } = await http.get('/admin/users');
      setUsers(data);
    } catch {
      setMessage({ type: 'error', text: 'Erro ao carregar usuários.' });
    } finally {
      setLoading(false);
    }
  }

  async function formatDate(dateString) {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString('pt-BR') +
      ' ' +
      date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    );
  }

  async function fetchEvents() {
    try {
      setLoading(true);
      const { data } = await http.get('/events');
      setEvents(data);
    } catch {
      setMessage({ type: 'error', text: 'Erro ao carregar eventos.' });
    } finally {
      setLoading(false);
    }
  }

  // Create event
  async function createEvent(formData) {
    setMessage(null);
    try {
      setLoading(true);
      await http.post('/events', formData);
      setMessage({ type: 'success', text: 'Evento criado com sucesso!' });
      setShowEventForm(false);
      fetchEvents();
    } catch {
      setMessage({ type: 'error', text: 'Erro ao criar evento.' });
    } finally {
      setLoading(false);
    }
  }

  // Edit user handlers
  function startEditing(user) {
    setEditingUserId(user.id);
    setUserEditData({ name: user.name, email: user.email, role: user.role });
  }

  function cancelEditing() {
    setEditingUserId(null);
    setUserEditData({ name: '', email: '', role: '' });
  }

  async function saveUser() {
    setMessage(null);
    try {
      setLoading(true);
      await http.put(`/admin/users/${editingUserId}`, userEditData);
      setMessage({ type: 'success', text: 'Usuário atualizado com sucesso!' });
      setEditingUserId(null);
      fetchUsers();
    } catch {
      setMessage({ type: 'error', text: 'Erro ao atualizar usuário.' });
    } finally {
      setLoading(false);
    }
  }

  async function deleteUser(id) {
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) return;
    setMessage(null);
    try {
      setLoading(true);
      await http.delete(`/admin/users/${id}`);
      setMessage({ type: 'success', text: 'Usuário excluído com sucesso!' });
      fetchUsers();
    } catch {
      setMessage({ type: 'error', text: 'Erro ao excluir usuário.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card" style={{ maxWidth: 900, margin: '2rem auto' }}>
      <h1>Administração</h1>

      {message && (
        <div
          className={`alert ${message.type === 'error' ? '' : 'alert-success'}`}
        >
          {message.text}
        </div>
      )}

      {/* Event creation */}
      <div style={{ marginBottom: '2rem' }}>
        <button
          className="btn"
          onClick={() => setShowEventForm((v) => !v)}
          disabled={loading}
          aria-expanded={showEventForm}
        >
          {showEventForm ? 'Fechar formulário' : 'Criar novo evento'}
        </button>

        {showEventForm && (
          <EventForm
            onSubmit={createEvent}
            onCancel={() => setShowEventForm(false)}
          />
        )}
      </div>

      {/* Users Table */}
      <h2>Gerenciar Usuários</h2>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '8px' }}>Nome</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Email</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Função</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 && (
            <tr>
              <td colSpan="4" style={{ padding: '12px', textAlign: 'center' }}>
                Nenhum usuário encontrado.
              </td>
            </tr>
          )}
          {users.map((user) => (
            <tr key={user.id}>
              <td style={{ padding: '8px' }}>
                {editingUserId === user.id ? (
                  <input
                    type="text"
                    className="form-input"
                    value={userEditData.name}
                    onChange={(e) =>
                      setUserEditData({ ...userEditData, name: e.target.value })
                    }
                    disabled={loading}
                  />
                ) : (
                  user.name
                )}
              </td>
              <td style={{ padding: '8px' }}>
                {editingUserId === user.id ? (
                  <input
                    type="email"
                    className="form-input"
                    value={userEditData.email}
                    onChange={(e) =>
                      setUserEditData({
                        ...userEditData,
                        email: e.target.value,
                      })
                    }
                    disabled={loading}
                  />
                ) : (
                  user.email
                )}
              </td>
              <td style={{ padding: '8px' }}>
                {editingUserId === user.id ? (
                  <select
                    className="form-input"
                    value={userEditData.role}
                    onChange={(e) =>
                      setUserEditData({ ...userEditData, role: e.target.value })
                    }
                    disabled={loading}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                ) : (
                  user.role
                )}
              </td>
              <td style={{ padding: '8px' }}>
                {editingUserId === user.id ? (
                  <>
                    <button
                      className="btn btn-secondary"
                      onClick={cancelEditing}
                      disabled={loading}
                      type="button"
                      style={{ marginRight: '0.5rem' }}
                    >
                      Cancelar
                    </button>
                    <button
                      className="btn"
                      onClick={saveUser}
                      disabled={loading}
                      type="button"
                    >
                      Salvar
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-secondary"
                      onClick={() => startEditing(user)}
                      disabled={loading}
                      type="button"
                      style={{ marginRight: '0.5rem' }}
                    >
                      Editar
                    </button>
                    <button
                      className="btn"
                      onClick={() => deleteUser(user.id)}
                      disabled={loading}
                      type="button"
                    >
                      Excluir
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Events Table */}
      <h2 style={{ marginTop: '3rem' }}>Eventos</h2>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '8px' }}>Título</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Data</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Localização</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Descrição</th>
          </tr>
        </thead>
        <tbody>
          {events.length === 0 && (
            <tr>
              <td colSpan="4" style={{ padding: '12px', textAlign: 'center' }}>
                Nenhum evento encontrado.
              </td>
            </tr>
          )}
          {events.map((event) => (
            <tr key={event.id}>
              <td style={{ padding: '8px' }}>{event.title}</td>
              <td style={{ padding: '8px' }}>{event.date}</td>
              <td style={{ padding: '8px' }}>{event.location || '-'}</td>
              <td style={{ padding: '8px' }}>{event.description || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
