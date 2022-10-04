const { lexer } = require("../src/lexer")
const fs = require("fs")

fs.readFile("tests/basic_program.pas", (err, data) => {
  if(err) throw err

  const program = data.toString()
  analyze(program)
})

const analyze = (program) => {
  lexer.setInput(program)

  while((match = lexer.lex()) != 1) {
    console.log(match)
  }
}
