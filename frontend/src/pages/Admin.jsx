import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { http } from '../api/http';

export default function Admin() {
  const [msg, setMsg] = useState('Carregando...');
  const navigate = useNavigate();

  useEffect(() => {
    http
      .get('/protected/admin')
      .then(({ data }) => setMsg(data.message))
      .catch(() => {
        navigate('/forbidden');
      });
  }, [navigate]);

  return (
    <section className="card">
      <h1>Admin area</h1>
      <p>{msg}</p>
    </section>
  );
}
