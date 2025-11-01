import React, { useEffect, useState } from "react";
import { useData } from "../state/DataContext";
import { Link } from "react-router-dom";
import { List } from "react-window";
import "./items.css"; // We'll add some styles here

function Items() {
  const { items, fetchItems, setItems } = useData();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    const loadItems = async () => {
      if (!active) return;

      try {
        setLoading(true);
        setError(null);
        const response = await fetchItems({ limit: 10, page: 1 });

        if (!active) return;

        // Since fetchItems already sets the items in DataContext, we don't need to set them again
        if (!response || !response.items) {
          throw new Error("Invalid response from server");
        }
      } catch (err) {
        if (!active) return;
        console.error("Failed to fetch items:", err);
        setError(err.message || "Failed to load items");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadItems();

    return () => {
      active = false;
    };
  }, [fetchItems, setItems]);

  if (loading) {
    // Show skeleton placeholders while loading
    return (
      <ul aria-busy="true" className="items-list">
        {Array.from({ length: 8 }).map((_, i) => (
          <li key={i} className="skeleton-item">
            <div className="skeleton-title" />
          </li>
        ))}
      </ul>
    );
  }

  if (error) {
    return <div style={{ padding: "20px", color: "red" }}>Error: {error}</div>;
  }

  if (!loading && (!items || !items.length)) {
    return <div style={{ padding: "20px" }}>No items found.</div>;
  }

  // Virtualized list item renderer
  const Row = ({ index, style }) => {
    const item = items[index];
    return (
      <div style={style} className="item-row">
        <Link to={"/items/" + item.id}>{item.name}</Link>
      </div>
    );
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <List
        height={400}
        itemCount={items.length}
        itemSize={50}
        width="100%"
        style={{ border: "1px solid #eee", borderRadius: "4px" }}
      >
        {Row}
      </List>
    </div>
  );
}

export default Items;
