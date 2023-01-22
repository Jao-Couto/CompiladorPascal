import { getResult } from "./result"
import semanticAnalysis from "./semanticAnalysis"
import clearSymbolsTable from "./symbolsTable/clearSymbolsTable"
import getSymbolsTable from "./symbolsTable/getSymbolsTable"

export { semanticAnalysis, getSymbolsTable, clearSymbolsTable }

export const getSemanticResult = () => getResult()
