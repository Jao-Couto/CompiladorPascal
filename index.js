const { lexer } = require("./src/lexer")

function analyze() {
    let program = document.getElementById("codeArea").value
    console.log(program);
    lexer.setInput(program)
    let result = ''
    while ((match = lexer.lex()) != 1) {
        result += match
        console.log(match)
    }
    document.getElementById("lexerArea").value = result;
}

document.addEventListener("DOMContentLoaded", () => {


    let fileInput = document.getElementById("fileUpload");
    fileInput.addEventListener("change", () => {
        let file = fileInput.files[0];
        if (file) {
            var reader = new FileReader();
            reader.readAsText(file, "UTF-8");
            reader.onload = function (evt) {
                document.getElementById("analyze").disabled = false;
                document.getElementById("codeArea").value = evt.target.result;
            }
            reader.onerror = function (evt) {
                document.getElementById("codeArea").value = "Erro ao ler o arquivo";
            }
        }
    })





});

