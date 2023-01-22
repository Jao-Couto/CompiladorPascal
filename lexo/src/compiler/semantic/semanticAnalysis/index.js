import treatProgram from "./treatProgram"
import treatVarDeclaration from "./treatVarDeclaration"
import treatVarManipulation from "./treatVarManipulation"

const parseArray = []
const semanticTreatment = {
  'PROGRAM': treatProgram,
  'TYPE': treatVarDeclaration,
  'ID': treatVarManipulation
}

const semanticAnalysis = (parsingObj) => {
  const token = parsingObj[0]

  if (token === "BEGIN" || token === "END") return

  if (token !== "SEMICOLON") {
    parseArray.push(parsingObj)
    return
  }
  const currentToken = parseArray[0][0]

  semanticTreatment[currentToken](parseArray, currentToken)
  parseArray.length = 0
}

export default semanticAnalysis
