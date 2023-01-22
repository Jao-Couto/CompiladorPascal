import getKey from "../symbolsTable/getKey"
import getSymbol from "../symbolsTable/getSymbol"
import treatIf from "./treatIf"

const treatWhile = (parseArray, _) => {
    let iterate = true
    while (iterate) {
        console.log(getSymbol(getKey("a", "VAR")))
        console.log(getSymbol(getKey("b", "VAR")))
        let clone = [...parseArray]
        console.log("interacao", parseArray[0], parseArray[1]);
        iterate = treatIf(clone, _)
    }
}

export default treatWhile