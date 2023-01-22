import { appendResult } from "../result"
import insertSymbol from "../symbolsTable/insertSymbol"

const treatVarDeclaration = (parseArray, _) => {
  let indiceProximaVirgula = 1
  let tipo = parseArray[0][1]

  while (parseArray[indiceProximaVirgula] !== undefined) {
    const parseAtual = parseArray[indiceProximaVirgula]
    const tokenParseAtual = parseAtual[1]
    const tipoParseAtual = parseAtual[0]
    if (!insertSymbol(
      tokenParseAtual,
      tipoParseAtual,
      'VAR',
      tipo
    )) {
      appendResult(`A variável ${tokenParseAtual} já foi declarada...`)
      return
    }

    indiceProximaVirgula += 2
  }
}

export default treatVarDeclaration
