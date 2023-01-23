import treatIf from "./treatIf"

const treatWhile = (parseArray, _) => {
    let iterate = true
    while (iterate) {
        let clone = [...parseArray]
        iterate = treatIf(clone, _)
    }
}

export default treatWhile