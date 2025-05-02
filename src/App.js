import React, { useState, useEffect } from 'react';
import './style.css';

const API_KEY = 'E0BTEHQEMGNGCFQY';

function App() {
  const [ticker, setTicker] = useState('');
  const [stock, setStock] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [industryFilter, setIndustryFilter] = useState('All');

  useEffect(() => {
    const saved = localStorage.getItem('favorites');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleSearch = async () => {
    try {
      const incomeRes = await fetch(`https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol=${ticker}&apikey=${API_KEY}`);
      const incomeData = await incomeRes.json();

      const overviewRes = await fetch(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=${API_KEY}`);
      const overviewData = await overviewRes.json();

      if (!incomeData.annualReports || incomeData.annualReports.length < 2 || !overviewData.PERatio) {
        if (incomeData.Note || overviewData.Note) {
          alert("API limit reached. Try again later.");
        } else {
          alert("Ticker not found or data is missing.");
        }
        return;
      }

      const netIncomeLast = parseFloat(incomeData.annualReports[1].netIncome);
      const netIncomeThis = parseFloat(incomeData.annualReports[0].netIncome);
      const growthRate = ((netIncomeThis - netIncomeLast) / netIncomeLast) * 100;

      const peRatio = parseFloat(overviewData.PERatio);
      if (isNaN(peRatio) || peRatio <= 0) {
        alert("Invalid P/E Ratio.");
        return;
      }

      const growthOverPE = growthRate / peRatio;

      const stockData = {
        name: overviewData.Name || ticker,
        industry: overviewData.Industry || 'Unknown',
        growthRate,
        peRatio,
        growthOverPE,
        high52Week: overviewData['52WeekHigh'],
        low52Week: overviewData['52WeekLow'],
        currentPrice: overviewData['PreviousClose']
      };
      

      setStock(stockData);
    } catch (err) {
      console.error(err);
      alert("An error occurred while fetching data.");
    }
  };

  const handleFavorite = () => {
    if (!stock) return;
    const updated = [...favorites, stock];
    setFavorites(updated);
  };

  const filteredFavorites = favorites.filter(fav =>
    industryFilter === 'All' || fav.industry === industryFilter
  );

  return (
    <div className="App">
      <h1>Stock Query</h1>

      <div id="search-area">
        <input
          type="text"
          value={ticker}
          onChange={e => setTicker(e.target.value.toUpperCase())}
          placeholder="Enter ticker symbol (e.g., AAPL)"
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {stock && (
        <div id="stock-info">
          <h2>{stock.name}</h2>
          <p id="growthRate">Growth Rate: {stock.growthRate.toFixed(2)}%</p>
          <p id="peRatio">P/E Ratio: {stock.peRatio.toFixed(2)}</p>
          <p id="growthOverPE">
            Growth over P/E:{' '}
            <span className={stock.growthOverPE > 1 ? 'success' : 'warning'}>
              {stock.growthOverPE.toFixed(2)}
            </span>
          </p>
          <p>52 Week High: ${stock.high52Week}</p>
          <p>52 Week Low: ${stock.low52Week}</p>
          <p>Current Price: ${stock.currentPrice}</p>

          <button onClick={handleFavorite}>Favorite</button>
        </div>
      )}

      <div id="filter-area">
        <label htmlFor="industryFilter">Filter by Industry:</label>
        <select
          id="industryFilter"
          value={industryFilter}
          onChange={e => setIndustryFilter(e.target.value)}
        >
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
          {filteredFavorites.map((fav, i) => (
            <li key={i}>
            <strong>{fav.name}</strong> ({fav.industry})<br />
            Growth Rate: {fav.growthRate.toFixed(2)}%<br />
            P/E Ratio: {fav.peRatio.toFixed(2)}<br />
            Growth over P/E: {fav.growthOverPE.toFixed(2)}<br />
            52 Week High: ${fav.high52Week}<br />
            52 Week Low: ${fav.low52Week}<br />
            Current Price: ${fav.currentPrice}
          </li>          
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
