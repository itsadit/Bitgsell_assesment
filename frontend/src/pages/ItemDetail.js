import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    fetch(`/api/items/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Item not found');
        return res.json();
      })
      .then(data => {
        if (active) {
          setItem(data);
          setError(null);
        }
      })
      .catch(err => {
        console.error('Error fetching item:', err);
        if (active) setError('Failed to load item.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false; // cancel fetch on unmount
    };
  }, [id]);

  if (loading) return <p>Loading item...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!item) return <p>Item not found.</p>;

  return (
    <div style={{ padding: 16 }}>
      <h2>{item.name}</h2>
      <p><strong>Category:</strong> {item.category || 'N/A'}</p>
      <p><strong>Price:</strong> ${item.price}</p>
    </div>
  );
}

export default ItemDetail;
