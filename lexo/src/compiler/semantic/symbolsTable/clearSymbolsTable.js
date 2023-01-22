import getSymbolsTable from "./getSymbolsTable"

const clearSymbolsTable = () => {
  const symbolsTable = getSymbolsTable()

  Object.keys(symbolsTable).forEach(key => delete symbolsTable[key])
}

export default clearSymbolsTable
