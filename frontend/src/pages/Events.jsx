import { useState, useEffect } from 'react';
import { useAuth } from '../auth/UseAuth';
import { http } from '../api/http';

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const d = new Date(dateStr);
  return isNaN(d) ? 'Invalid Date' : d.toLocaleDateString('en-US', options);
};

export default function Dashboard() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    http
      .get('/events')
      .then(({ data }) => setEvents(data))
      .catch(() => setEvents([]));
  }, []);

  return (
    <section className="card dashboard">
      <h1 className="dashboard-header">Volunteer Events</h1>

      {events.length > 0 ? (
        <ul className="event-list">
          {events.map((event) => (
            <li key={event.id} className="event-item">
              <h2 className="event-title">{event.title}</h2>
              <p className="event-details">
                📅 {formatDate(event.date)} &nbsp;&middot;&nbsp; 📍{' '}
                {event.location || 'TBD'}
              </p>
              <p className="event-creator">
                Created by: {event.created_by_name || 'Unknown'}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-events-message">No events available.</p>
      )}
    </section>
  );
}
