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
    const [semanticResult, setSemanticResult] = useState({})
    const [lexerToParser, setLexerToParser] = useState([])
    const [erroSintatico, setErroSintatico] = useState(false)
    const [table, setTable] = useState([])
    let tabelaSimbolos = {}

    const inputFile = (evt) => {
        const files = evt.target.files[0];
        const reader = new FileReader();
        reader.readAsText(files, "UTF-8");
        reader.onload = (evt) => setFile(evt.target.result)
        reader.onerror = () => setFile("Erro ao ler o arquivo")
    }

    useEffect(() => {
        setTable([])
        setErroSintatico(false)
        if (lexerToParser.length === 0)
            return

        let result = ''
        parser.parsing_stack = null

        lexerToParser.map(parsingObj => {
            let token = parsingObj[0]
            let res = parser.parseToken(token)
            if (res.has_errors) {
                result += getSyntaticErrorMessage(res.errors)
                setErroSintatico(true)
            }
        })
        setLexerResult(result || "Análise concluída com sucesso!")
    }, [lexerToParser])



    const analyzeLexer = (print = true) => {
        setTable([])
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

    const analyzeSemantic = () => {
        const symbolsTable = getSymbolsTable()
        let parseArray = []
        const blockMode = { value: 0 }
        clearSymbolsTable()
        lexerToParser.map(parsingObj => {
            semanticAnalysis(parsingObj, parseArray, blockMode)
        })
        let error = getSemanticResult()
        if (error != '') {
            setLexerResult(error)
            return
        }
        setSemanticResult(symbolsTable)
    }

    useEffect(() => {
        let table = []
        for (const chave in semanticResult) {
            table.push(<tr key={chave}>
                <td>{semanticResult[chave].cadeia}</td>
                <td>{semanticResult[chave].token}</td>
                <td>{semanticResult[chave].categoria}</td>
                <td>{semanticResult[chave].tipo}</td>
                <td>{semanticResult[chave].valor}</td>
                <td>{semanticResult[chave].utilizada + ""}</td>
            </tr>)
        }
        setTable(table)
    }, [semanticResult])


    return (
        <div className="App">

            <div className="divButton">
                <input type="file" id="fileUpload" onChange={inputFile} accept=".lalg, .pas, .txt"></input>
                <button id="analyzeLexer" onClick={analyzeLexer} disabled={file === ''}>Analize Léxica</button>
                <button id="analyzeParser" onClick={analyzeParser} disabled={file === ''}>Analize Sintática</button>
                <button id="analyzeSemantic" onClick={analyzeSemantic} disabled={lexerToParser.length === 0}>Analize Semântica</button>
            </div>
            <div className="divCode">
                <div className="divLabel">
                    <label for="codeArea">Código</label>
                    <textarea className="code" id="codeArea" value={file} onChange={(event) => setFile(event.target.value)}></textarea>
                </div>
                {table.length == 0 ?
                    <div className="divLabel">
                        <label for="lexerArea">Separação Léxica</label>
                        <textarea className="code" id="lexerArea" value={lexerResult} ></textarea>
                    </div>
                    :
                    <div className="divLabel">
                        <table>
                            <thead>
                                <tr>
                                    <th>Cadeia</th>
                                    <th>Token</th>
                                    <th>Categoria</th>
                                    <th>Tipo</th>
                                    <th>Valor</th>
                                    <th>Utilizada</th>
                                </tr>
                            </thead>
                            <tbody>
                                {table.map(item => item)}
                            </tbody>
                        </table>
                    </div>
                }

            </div>

        </div>
    );
}

export default App;
