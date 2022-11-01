import './App.css';
import React, { useState } from 'react';
import parser from "./compiler/lexer"

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

    const analyze = () => {




        console.log(parser.parse(file));
        //     lexer.setInput(file)
        //     let match = lexer.lex();
        //     let result = ''

        //     while (match != 1) {
        //         result += match + "\n"
        //         match = lexer.lex();
        //     }

        //     setLexerResult(result)
    }

    return (
        <div className="App">

            <div className="divButton">
                <input type="file" id="fileUpload" onChange={inputFile} accept=".lalg, .pas, .txt"></input>
                <button id="analyze" onClick={analyze} disabled={file === ''}>Analizar</button>
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
