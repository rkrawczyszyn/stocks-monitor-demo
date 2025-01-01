import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";

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

  return (
    <div className="table-responsive">
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
              <td>{stock.type === 0 ? "Stock" : "Coin"}</td>
              <td>{stock.attractivePriceMax.toFixed(2)}</td>
              <td>{stock.attractivePriceMin.toFixed(2)}</td>
              <td>{stock.currentPrice.toFixed(2)}</td>
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
