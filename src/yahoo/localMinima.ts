import { StockData } from "./getAnalysisForStock";

export const findLocalMinima = (results: StockData[]): StockData[] => {
  const prices = results.map((data) => data.low);
  const localMinima = [];

  for (let i = 1; i < prices.length - 1; i++) {
    if (prices[i] < prices[i - 1] && prices[i] < prices[i + 1]) {
      localMinima.push(results[i]);
    }
  }

  return localMinima;
};
