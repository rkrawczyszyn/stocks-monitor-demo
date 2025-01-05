import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";

enum ShareType {
  Stock,
  Coin,
}

interface AttractiveStock {
  stockCode: string;
  stockName: string;
  attractivePriceMax: number;
  attractivePriceMin: number;
  currentPrice: number;
  url: string;
  type: ShareType;
}

export const AttractiveStockTable: React.FC = () => {
  const [stocks, setStocks] = useState<AttractiveStock[]>([]);
  const [sortMode, setSortMode] = useState<"Closest" | "Farthest">("Closest");

  useEffect(() => {
    const fetchData = async () => {
      const stockData = (await (
        await fetch(
          "https://raw.githubusercontent.com/rkrawczyszyn/demos/refs/heads/main/dist/custom-stock-watch-results.json"
        )
      ).json()) as AttractiveStock[];

      setStocks(stockData);
    };

    fetchData();
  }, []);

  const toggleSort = () => {
    const sortedStocks = [...stocks].sort((a, b) => {
      const diffA = Math.abs(a.currentPrice - a.attractivePriceMin);
      const diffB = Math.abs(b.currentPrice - b.attractivePriceMin);
      return sortMode === "Closest" ? diffB - diffA : diffA - diffB;
    });

    setSortMode((prevMode) =>
      prevMode === "Closest" ? "Farthest" : "Closest"
    );
    setStocks(sortedStocks);
  };

  return (
    <div className="table-responsive">
      <div className="mb-3">
        <Button onClick={toggleSort}>
          Sort: {sortMode === "Closest" ? "Closest" : "Farthest"}
        </Button>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Share Type</th>
            <th>Attractive Price Max</th>
            <th>Attractive Price Min</th>
            <th>Current Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock, index) => (
            <tr key={index}>
              <td>{stock.stockCode}</td>
              <td>{stock.stockName}</td>
              <td>{stock.type === ShareType.Stock ? "Stock" : "Coin"}</td>
              <td>
                {stock.type === ShareType.Stock
                  ? Number(stock.attractivePriceMax.toFixed(2))
                  : Number(stock.attractivePriceMax.toFixed(8))}
              </td>
              <td>
                {stock.type === ShareType.Stock
                  ? Number(stock.attractivePriceMin.toFixed(2))
                  : Number(stock.attractivePriceMin.toFixed(8))}
              </td>
              <td>
                {stock.type === ShareType.Stock
                  ? Number(stock.currentPrice.toFixed(2))
                  : Number(stock.currentPrice.toFixed(8))}
              </td>
              <td>
                <a href={stock.url} target="_blank" rel="noopener noreferrer">
                  <button>Open details</button>
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};
