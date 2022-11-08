import './App.css';
import React, { useState } from 'react';
import parser from "./compiler/lexer/parser"
import lexer from './compiler/lexer/lexer';

function App() {
    const [file, setFile] = useState('')
    const [lexerResult, setLexerResult] = useState('')

    const inputFile = (e) => {
        var files = e.target.files[0];
        var reader = new FileReader();
        reader.readAsText(files, "UTF-8");
        reader.onload = function (evt) {
            setFile(evt.target.result)
        }
        reader.onerror = function (evt) {
            setFile("Erro ao ler o arquivo")
        }
    }

    const analyzeLexer = () => {
        try {
            lexer.setInput(file)
            let match = lexer.lex();
            let result = ''

            while (match != 1) {
                result += match + "\n"
                match = lexer.lex();
            }

            setLexerResult(result)

            //parser.parse(file)
        }
        catch (error) {
            console.log("ola");
        }
    }

    const analyzeParser = () => {
        try {
            let result = parser.parse(file)
            setLexerResult(result.join("\n") + "\nAnálise Sintática Completa")
        }
        catch (error) {
            console.log(error["hash"]);
            setLexerResult("Erro encontrado: \nEsperado " + error["hash"]["expected"] + "\nEncontrado '" + error["hash"]["text"] + "', " + error["hash"]["token"] + " na linha " + error["hash"]["loc"]["first_line"] + " coluna " + error["hash"]["loc"]["first_column"])
        }

    }

    return (
        <div className="App">

            <div className="divButton">
                <input type="file" id="fileUpload" onChange={inputFile} accept=".lalg, .pas, .txt"></input>
                <button id="analyze" onClick={analyzeLexer} disabled={file === ''}>Analize Léxica</button>
                <button id="analyze" onClick={analyzeParser} disabled={file === ''}>Analize Sintática</button>
            </div>
            <div className="divCode">
                <div className="divLabel">
                    <label for="codeArea">Código</label>
                    <textarea className="code" id="codeArea" value={file} onChange={(event) => setFile(event.target.value)}></textarea>
                </div>
                <div className="divLabel">
                    <label for="lexerArea">Separação Léxica</label>
                    <textarea className="code" id="lexerArea" value={lexerResult} ></textarea>
                </div>
            </div>

        </div>
    );
}

export default App;
