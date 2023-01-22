import getKey from "./getKey"
import getSymbol from "./getSymbol"
import getSymbolsTable from "./getSymbolsTable"

const insertSymbol = (cadeia, token, categoria, tipo = null, valor = null) => {
    const symbolsTable = getSymbolsTable()
    const key = getKey(cadeia, categoria)
    if (!getSymbol(key)) {
        symbolsTable[key] = {
            cadeia,
            token,
            categoria,
            tipo,
            valor,
            utilizada: false
        }
        return true
    }
    return false
}

export default insertSymbol
