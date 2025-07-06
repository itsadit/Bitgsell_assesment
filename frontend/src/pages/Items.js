import React, { useEffect, useState } from 'react';
import { useData } from '../state/DataContext';
import { Link } from 'react-router-dom';
import { FixedSizeList as List } from 'react-window';

function Items() {
  const { items, fetchItems } = useData();
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    fetchItems()
      .then(() => {
        if (active) {
          setError(null); //  clear error on success
        }
      })
      .catch(err => {
        console.error('Failed to fetch items:', err);
        if (active) setError('Failed to load items.');
      });

    return () => {
      active = false;
    };
  }, [fetchItems]);

  //  only show error if it exists and items failed to load
  if (error && !items.length) return <p style={{ color: 'red' }}>{error}</p>;
  if (!items.length) return <p>Loading items...</p>;

  return (
    <List
      height={400}
      itemCount={items.length}
      itemSize={35}
      width={'100%'}
    >
      {({ index, style }) => (
        <div key={items[index].id} style={style}>
          <Link to={`/items/${items[index].id}`}>{items[index].name}</Link>
        </div>
      )}
    </List>
  );
}

export default Items;
