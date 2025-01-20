import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";

enum ShareType {
  Stock,
  Coin,
}

interface AttractiveStock {
  stockCode: string;
  stockName: string;
  absoluteMin: number;
  absoluteMax: number;
  currentPrice: number;
  periodStart: string;
  periodEnd: string;
  attractivePriceStart: number;
  attractivePriceUberLow: number;
  percentageProgressToAttractivePriceStart: number;
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
          "https://raw.githubusercontent.com/rkrawczyszyn/demos/refs/heads/main/dist/apps/customStocks/custom-stock-watch-results.json"
        )
      ).json()) as AttractiveStock[];

      setStocks(stockData);
    };

    fetchData();
  }, []);

  const toggleSort = () => {
    const sortedStocks = [...stocks].sort((a, b) => {
      return sortMode === "Closest"
        ? a.percentageProgressToAttractivePriceStart -
            b.percentageProgressToAttractivePriceStart
        : b.percentageProgressToAttractivePriceStart -
            a.percentageProgressToAttractivePriceStart;
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
            <th>Attractive price uber low</th>
            <th>Attractive price start (APS)</th>
            <th>Current Price</th>
            <th>Progress to APS</th>
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
                  ? Number(stock.attractivePriceUberLow.toFixed(2))
                  : Number(stock.attractivePriceUberLow.toFixed(8))}
              </td>
              <td>
                {stock.type === ShareType.Stock
                  ? Number(stock.attractivePriceStart.toFixed(2))
                  : Number(stock.attractivePriceStart.toFixed(8))}
              </td>
              <td>
                {stock.type === ShareType.Stock
                  ? Number(stock.currentPrice.toFixed(2))
                  : Number(stock.currentPrice.toFixed(8))}
              </td>
              <td>
                {stock.percentageProgressToAttractivePriceStart.toFixed(0)}%
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
