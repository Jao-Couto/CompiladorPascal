import './App.css';
import React, { useEffect, useState } from 'react';
import lexer from './compiler/lexer/lexer';
import parser from './compiler/lexer/parser';
import { clearSymbolsTable, getSemanticResult, getSymbolsTable, semanticAnalysis } from './compiler/semantic';

const getSyntaticErrorMessage = (errors) =>
    `Erro sintático! 
Esperado: ${errors.map(error => error.expected)}.
Recebido: ${errors[0].got}.
-------------------------------------------------

`

function App() {
    const [file, setFile] = useState('')
    const [lexerResult, setLexerResult] = useState('')
    const [lexerToParser, setLexerToParser] = useState([])
    let tabelaSimbolos = {}

    const inputFile = (evt) => {
        const files = evt.target.files[0];
        const reader = new FileReader();
        reader.readAsText(files, "UTF-8");
        reader.onload = (evt) => setFile(evt.target.result)
        reader.onerror = () => setFile("Erro ao ler o arquivo")
    }

    useEffect(() => {
        const symbolsTable = getSymbolsTable()
        let result = ''

        parser.parsing_stack = null
        clearSymbolsTable()

        lexerToParser.map(parsingObj => {
            let token = parsingObj[0]
            let res = parser.parseToken(token)
            if (res.has_errors) result += getSyntaticErrorMessage(res.errors)
            if (result !== '') return
            //console.log(parsingObj, res);
            semanticAnalysis(parsingObj)
        })
        console.log(symbolsTable);
        console.log(getSemanticResult())
        setLexerResult(result || "Análise concluída com sucesso!")
    }, [lexerToParser])

    const analyzeLexer = (print = true) => {
        try {
            lexer.setInput(file)
            let match = lexer.lex();
            let result = ''
            let resultToParser = []
            while (match != 1) {
                result += match + "\n"
                resultToParser.push(match)
                match = lexer.lex();
            }

            if (print)
                setLexerResult(result)
            else
                setLexerToParser(resultToParser)

        }
        catch (error) {
            console.log(error);
        }
    }


    const analyzeParser = () => analyzeLexer(false)

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
