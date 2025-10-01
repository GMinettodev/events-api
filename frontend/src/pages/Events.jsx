import { useEffect, useState } from 'react';
import { http } from '../api/http';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    http
      .get('/events')
      .then(({ data }) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Error loading events');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading events...</p>;
  if (error) return <p>{error}</p>;

  if (events.length === 0) return <p>No available events at the moment.</p>;

  return (
    <section className="card">
      <h1>Volnteer events</h1>
      <ul>
        {events.map(({ id, title, description, date, location }) => (
          <li key={id} style={{ marginBottom: '1.5rem' }}>
            <h2>{title}</h2>
            <p>{description}</p>
            <p>
              <strong>Date:</strong> {new Date(date).toLocaleDateString()}
            </p>
            <p>
              <strong>Place:</strong> {location}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
