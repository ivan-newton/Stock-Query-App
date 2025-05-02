import React, { useState } from 'react';
import './style.css'; 

function App() {
  const [ticker, setTicker] = useState('');
  const [stockData, setStockData] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const handleSearch = () => {
    // Temporary fake stock data for demo
    setStockData({
      name: ticker.toUpperCase(),
      growthRate: '15%',
      peRatio: '24.2',
      growthOverPE: '0.62',
    });
  };

  const handleFavorite = () => {
    if (stockData && !favorites.includes(stockData.name)) {
      setFavorites([...favorites, stockData.name]);
    }
  };

  return (
    <div className="App">
      <h1>Stock Query</h1>

      <div id="search-area">
        <input
          type="text"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          placeholder="Enter ticker symbol (e.g., AAPL)"
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {stockData && (
        <div id="stock-info">
          <h2>{stockData.name}</h2>
          <p>Growth Rate: {stockData.growthRate}</p>
          <p>P/E Ratio: {stockData.peRatio}</p>
          <p>Growth / P/E: {stockData.growthOverPE}</p>
          <button onClick={handleFavorite}>Favorite</button>
        </div>
      )}

      <div id="filter-area">
        <label htmlFor="industryFilter">Filter by Industry:</label>
        <select id="industryFilter">
          <option value="All">All</option>
          <option value="Technology">Technology</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Consumer Cyclical">Consumer Cyclical</option>
          <option value="Financial Services">Financial Services</option>
          <option value="Auto">Auto</option>
          <option value="Clothing">Clothing</option>
        </select>
      </div>

      <div id="favorites">
        <h2>Favorited Stocks</h2>
        <ul id="favoritesList">
          {favorites.map((fav, idx) => (
            <li key={idx}>{fav}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;

