// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import yahooFinance from "yahoo-finance";
import { findLocalMinima } from "./localMinima";

export interface StockData {
  date: Date;
  high: number;
  volume: number;
  open: number;
  low: number;
  close: number;
  adjClose?: number;
}

export interface StockAnalysisResult {
  stockCode: string;
  stockName: string;
  localMinimas: StockData[];
  absoluteMin: number;
  absoluteMax: number;
  currentPrice: number;
  periodStart: string;
  periodEnd: string;
}

interface StockInput {
  code: string;
  name: string;
}

export const getAnalysisForStock = async (
  stocks: StockInput[]
): Promise<StockAnalysisResult[]> => {
  const now1 = new Date();
  const now = new Date();

  const threeMonthsAgoStart = now;
  threeMonthsAgoStart.setDate(threeMonthsAgoStart.getDate() - 90);

  const results: StockAnalysisResult[] = [];

  stocks.forEach(async (stockInput: StockInput) => {
    console.log(`show
      start ${threeMonthsAgoStart},
      end ${now1},
      stockInput.code ${stockInput.code},

  `);

    const apiResults: StockData[] = await yahooFinance.historical(
      stockInput.code,
      {
        period1: threeMonthsAgoStart.toISOString().split("T")[0],
        period2: now1.toISOString().split("T")[0],

        // YTD debug
        // period1: "2023-12-29",
        // period2: "2024-12-27",
      }
    );

    const closePrices = apiResults.map((result) => result.close);

    const absoluteMin = Math.min(...closePrices);
    const absoluteMax = Math.max(...closePrices);

    // debug
    // const minObject = apiResults.find((result) => result.close === absoluteMin);
    // const maxObject = apiResults.find((result) => result.close === absoluteMax);

    const localMinimas = findLocalMinima(apiResults)
      .sort((a: StockData, b: StockData) => a.low - b.low)
      .slice(0, 3);

    const singleResult: StockAnalysisResult = {
      stockCode: stockInput.code,
      stockName: stockInput.name,
      localMinimas,
      absoluteMin,
      absoluteMax,
      currentPrice: apiResults[apiResults.length - 1].close,
      periodStart: threeMonthsAgoStart.toLocaleDateString(),
      periodEnd: now.toLocaleDateString(),
    };

    results.push(singleResult);
  });

  return results;
};
