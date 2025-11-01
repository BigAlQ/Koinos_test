import React, { createContext, useCallback, useContext, useState } from "react";

const DataContext = createContext();

export function DataProvider({ children }) {
  const [items, setItems] = useState([]);

  // Accept search query, page, and limit
  const fetchItems = useCallback(
    async ({ q = "", page = 1, limit = 10 } = {}) => {
      try {
        const res = await fetch(
          `http://localhost:3001/api/items?q=${q}&page=${page}&limit=${limit}`
        );
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const json = await res.json();
        if (!json || !json.items) {
          throw new Error("Invalid response format from server");
        }
        setItems(json.items);
        return json;
      } catch (error) {
        console.error("Error fetching items:", error);
        throw error;
      }
    },
    []
  );

  return (
    <DataContext.Provider value={{ items, fetchItems, setItems }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
