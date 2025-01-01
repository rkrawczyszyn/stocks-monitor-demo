export const getAnalysisForStock = async (stocks: { code: string; name: string }[]) => {
    const results = await Promise.all(stocks.map(async (stock) => {
        const response = await fetch(`https://api.example.com/stocks/${stock.code}/analysis`);
        const data = await response.json();
        return {
            code: stock.code,
            name: stock.name,
            absoluteMin: data.absoluteMin,
            absoluteMax: data.absoluteMax,
            averageOfLocalMinimas: data.averageOfLocalMinimas,
            currentPrice: data.currentPrice,
        };
    }));
    return results;
};