import getSymbolsTable from "./getSymbolsTable"

const symbolsTable = getSymbolsTable()

const getSymbol = (hash) => symbolsTable[hash]

export default getSymbol
