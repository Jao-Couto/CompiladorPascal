import resolveBooleanExpression from "../booleanOperation";
import getKey from "../symbolsTable/getKey";
import getSymbol from "../symbolsTable/getSymbol";
import semanticAnalysis from "./index"

const treatIf = (parseArray, _) => {
    const logicalExpr = []

    let i = 2
    for (; parseArray[i][0] !== "RPAREN"; i++) {
        logicalExpr.push(parseArray[i])
    }

    parseArray.splice(0, i + 2)
    let stateArray = []
    let blockMode = { value: 0 }
    let boolValue
    if (logicalExpr.length == 1) {
        boolValue = getSymbol(getKey(logicalExpr[0][1], "VAR")).valor
        if (boolValue)
            parseArray.map(parsingObj => semanticAnalysis(parsingObj, stateArray, blockMode))
    }

    else
        for (let i = 0; i < logicalExpr.length; i += 3) {
            boolValue = resolveBooleanExpression(
                logicalExpr[i],
                logicalExpr[i + 1][1],
                logicalExpr[i + 2]).resultado
            if (boolValue) parseArray.map(parsingObj => semanticAnalysis(parsingObj, stateArray, blockMode))
        }

    return boolValue
}

export default treatIf
