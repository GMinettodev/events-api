import { useState, useEffect } from 'react';
import { useAuth } from '../auth/UseAuth';
import { http } from '../api/http';

export default function Dashboard() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    http
      .get('/protected/dashboard')
      .then(({ data }) => setEvents(data))
      .catch(() => setEvents([]));
  }, []);

  return (
    <section className="card" style={{ width: '100%' }}>
      <h1>Dashboard</h1>

      <ul style={{ marginTop: '2rem' }}>
        {events.length > 0 ? (
          events.map((event) => (
            <li key={event.id} style={{ marginBottom: '1rem' }}>
              <strong>{event.title}</strong>
              <br />
              {event.date} - {event.location}
              <br />
              Criado por: {event.created_by_name}
            </li>
          ))
        ) : (
          <li>No events available.</li>
        )}
      </ul>
    </section>
  );
}
