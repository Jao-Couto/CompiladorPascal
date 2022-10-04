import './App.css';
import React, { useState } from 'react';
import { lexer } from "./lexer"

function App() {
    const [file, setFile] = useState('')
    const [lexerResult, setLexerResult] = useState('')

    const onChange = (e) => {
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

        lexer.setInput(file)
        let result = ''
        let match;
        while ((match = lexer.lex()) != 1) {
            result += match
            console.log(match)
        }
        setLexerResult(result)


    }

    return (
        <div className="App">

            <div className="divButton">
                <input type="file" id="fileUpload" onChange={onChange}></input>
                <button id="analyze">Analizar</button>
            </div>
            <div className="divCode">
                <div className="divLabel">
                    <label for="codeArea">Código</label>
                    <textarea className="code" id="codeArea" value={file}></textarea>
                </div>
                <div className="divLabel">
                    <label for="lexerArea">Separação Léxica</label>
                    <textarea className="code" id="lexerArea" value={lexerResult}></textarea>
                </div>
            </div>

        </div>
    );
}

export default App;
