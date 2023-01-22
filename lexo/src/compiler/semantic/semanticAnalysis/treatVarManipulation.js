import resolveSimpleExpression from "../aritmethicOperation"
import getKey from "../symbolsTable/getKey"
import getSymbol from "../symbolsTable/getSymbol"
import updateSymbol from "../symbolsTable/updateSymbol"

const treatVarManipulation = (parseArray, token) => {
  if(parseArray[1][0] !== "ASSIGN") return

  let proximaOperacao = 3
  let valorFinal
  const [rightSideToken, rightSideValue, _] = parseArray[2]
  if((rightSideToken !== "NUMBER") && (rightSideValue !== "true") && (rightSideValue !== "false")) {
    valorFinal = getSymbol(getKey(rightSideValue, 'VAR')).valor
  }
  else
    valorFinal = parseArray[2][1]
  while(parseArray[proximaOperacao] !== undefined) {
    const parseAtual = parseArray[proximaOperacao]
    const parserTipo = parseAtual[0]
    const proximoValor = getSymbol(getKey(parseArray[proximaOperacao + 1][1], 'VAR'))

    if(parserTipo == "ARITMETHIC_OP_SIMPLE" || parserTipo == "ARITMETHIC_OP_FACTOR") {
      valorFinal = resolveSimpleExpression(valorFinal, parseAtual[1], proximoValor.valor).resultado
    }

    proximaOperacao += 2
  }

  updateSymbol(parseArray[0][1], 'VAR', valorFinal)
}

export default treatVarManipulation
