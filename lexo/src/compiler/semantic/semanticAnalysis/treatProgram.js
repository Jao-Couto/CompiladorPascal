import insertSymbol from "../symbolsTable/insertSymbol"

const treatProgram = (parseArray, token) => {
  const proximoParse = parseArray[1]
  insertSymbol(
    proximoParse[1],
    token,
    'PROG'
  )
}

export default treatProgram
