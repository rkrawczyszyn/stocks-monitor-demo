import React, { useState } from "react";
import { StockTable } from "./components/StockTable";
import { AttractiveStockTable } from "./components/AttractiveStockTable";
import "./App.css";

const App: React.FC = () => {
  const [activeTable, setActiveTable] = useState<"Yahoo" | "Custom">("Yahoo");

  return (
    <div className="App">
      <div className="sticky-header">
        <h1>Stock Analysis</h1>
        <div className="button-group">
          <button onClick={() => setActiveTable("Yahoo")}>Yahoo</button>
          <button onClick={() => setActiveTable("Custom")}>Custom</button>
        </div>
      </div>
      {activeTable === "Yahoo" ? <StockTable /> : <AttractiveStockTable />}
    </div>
  );
};

export default App;
