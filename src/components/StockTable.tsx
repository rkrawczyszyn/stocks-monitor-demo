import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { StockAnalysisResult } from "../yahoo/getAnalysisForStock";

interface StockAnalysisResultExtended extends StockAnalysisResult {
  averageOfLocalMinimas: number;
  percentageOfAverage: number;
}

export const StockTable: React.FC = () => {
  const [stocks, setStocks] = useState<StockAnalysisResultExtended[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleSort = () => {
    const sortedStocks = [...stocks].sort((a, b) => {
      if (sortOrder === "asc") {
        return a.percentageOfAverage - b.percentageOfAverage;
      } else {
        return b.percentageOfAverage - a.percentageOfAverage;
      }
    });
    setStocks(sortedStocks);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  useEffect(() => {
    const fetchData = async () => {
      const stockData = (await (
        await fetch(
          "https://raw.githubusercontent.com/rkrawczyszyn/demos/refs/heads/main/dist/stock-results.json"
        )
      ).json()) as StockAnalysisResult[];

      console.log("show stockData", stockData);

      const updatedStockData = stockData.map((stock) => {
        const averageOfLocalMinimas =
          stock.localMinimas.reduce((sum, minima) => sum + minima.low, 0) /
          stock.localMinimas.length;
        const percentageOfAverage =
          ((stock.currentPrice - averageOfLocalMinimas) /
            averageOfLocalMinimas) *
          100;

        return {
          ...stock,
          averageOfLocalMinimas,
          percentageOfAverage,
        };
      });

      setStocks(updatedStockData);
    };

    fetchData();
  }, []);

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Code</th>
          <th>Name</th>
          <th>Absolute Min</th>
          <th>Absolute Max</th>
          <th>Local Minimas</th>
          <th>Current Price</th>
          <th>Average of Local Minimas</th>
          <th onClick={handleSort} style={{ cursor: "pointer" }}>
            Percentage of Average {sortOrder === "asc" ? "↑" : "↓"}
          </th>
        </tr>
      </thead>
      <tbody>
        {stocks.map((stock, index) => (
          <tr key={index}>
            <td>{stock.stockCode}</td>
            <td>{stock.stockName}</td>
            <td>{stock.absoluteMin.toFixed(2)}</td>
            <td>{stock.absoluteMax.toFixed(2)}</td>
            <td>
              {stock.localMinimas
                .map((minima) => minima.low.toFixed(2))
                .join(", ")}
            </td>
            <td>{stock.currentPrice.toFixed(2)}</td>
            <td>{stock.averageOfLocalMinimas.toFixed(2)}</td>
            <td>{stock.percentageOfAverage.toFixed(2)}%</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
