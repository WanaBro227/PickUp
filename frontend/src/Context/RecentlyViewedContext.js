import React, { createContext, useContext, useState, useEffect } from 'react';

const RecentlyViewedContext = createContext();

export const RecentlyViewedProvider = ({ children }) => {
  const [recentItems, setRecentItems] = useState(() => {
    const saved = localStorage.getItem('pickup_recent');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('pickup_recent', JSON.stringify(recentItems));
  }, [recentItems]);

  const addToRecent = (product) => {
    setRecentItems((prev) => {
      const filtered = prev.filter(item => item.id !== product.id);
      const updated = [product, ...filtered];
      return updated.slice(0, 5);
    });
  };

  return (
    <RecentlyViewedContext.Provider value={{ recentItems, addToRecent }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
};

export const useRecent = () => useContext(RecentlyViewedContext);