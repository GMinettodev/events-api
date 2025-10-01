import { useState, useEffect } from 'react';
import { useAuth } from '../auth/UseAuth';
import { http } from '../api/http';
import EventForm from '../components/EventForm';

export default function Dashboard() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    http
      .get('/protected/dashboard')
      .then(({ data }) => setEvents(data))
      .catch(() => setEvents([]));
  }, []);

  async function createEvent(formData) {
    await http.post('/events', formData);
    setShowForm(false);
    // Update events
    const { data } = await http.get('/protected/dashboard');
    setEvents(data);
  }

  return (
    <section className="card" style={{ width: '100%' }}>
      <h1>Dashboard</h1>

      {user?.role === 'admin' && (
        <>
          <button className="btn" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Fechar formulário' : 'Criar novo evento'}
          </button>

          {showForm && (
            <EventForm
              onSubmit={createEvent}
              onCancel={() => setShowForm(false)}
            />
          )}
        </>
      )}

      {!showForm && (
        <ul style={{ marginTop: '2rem' }}>
          {events.map((event) => (
            <li key={event.id} style={{ marginBottom: '1rem' }}>
              <strong>{event.title}</strong>
              <br />
              {event.date} - {event.location}
              <br />
              Criado por: {event.created_by_name}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
