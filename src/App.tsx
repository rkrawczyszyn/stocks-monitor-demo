import React from "react";
import { StockTable } from "./components/StockTable";

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Stock Analysis</h1>
      <StockTable />
    </div>
  );
};

export default App;
