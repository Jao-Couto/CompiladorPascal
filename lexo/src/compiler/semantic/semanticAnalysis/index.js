import treatProgram from "./treatProgram"
import treatVarDeclaration from "./treatVarDeclaration"
import treatVarManipulation from "./treatVarManipulation"
import treatIf from "./treatIf"
import treatWhile from "./treatWhile"

const semanticTreatment = {
    'PROGRAM': treatProgram,
    'TYPE': treatVarDeclaration,
    'ID': treatVarManipulation,
    'IF': treatIf,
    'WHILE': treatWhile
}

const semanticAnalysis = (parsingObj, parseArray, blockMode) => {
    const token = parsingObj[0]

    if (token === "IF" || token === "WHILE") {
        blockMode.value = 1
    }

    if (token === "END")
        blockMode.value = 2

    if ((token === "BEGIN" || token === "END") && blockMode.value === 0) return

    if (token !== "SEMICOLON" || blockMode.value === 1) {
        parseArray.push(parsingObj)
        return
    }


    const currentToken = parseArray[0][0]

    if (!semanticTreatment[currentToken]) return

    semanticTreatment[currentToken](parseArray, currentToken)
    parseArray.length = 0
}

export default semanticAnalysis
