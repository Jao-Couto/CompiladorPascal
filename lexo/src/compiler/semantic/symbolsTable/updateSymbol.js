import { appendResult } from "../result"
import getKey from "./getKey"
import getSymbol from "./getSymbol"

const updateSymbol = (cadeia, categoria, valor) => {
  const key = getKey(cadeia, categoria)
  const symbol = getSymbol(key)
  if (!symbol) {
    appendResult(`${cadeia} não declarada`)
    return false
  }
  const type = (valor === 'false' || valor == 'true') ? 'boolean' : 'int'
  if (type !== symbol.tipo) {
    appendResult(`${valor} tem tipo diferente da declaração da variável ${cadeia}`)
    return false
  }

  symbol.valor = valor
  symbol.utilizada = true

  return true
}

export default updateSymbol
