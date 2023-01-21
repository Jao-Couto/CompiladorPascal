import './App.css';
import React, { useEffect, useState } from 'react';
import lexer from './compiler/lexer/lexer';
import parser from './compiler/lexer/parser';

const getSyntaticErrorMessage = (errors) =>
    `Erro sintático! 
Esperado: ${errors.map(error => error.expected)}.
Recebido: ${errors[0].got}.
-------------------------------------------------

`

const getSemanticErrorMessage = (message) =>
    `Erro semântico
${message}

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
        tabelaSimbolos = {}
        let result = ''
        parser.parsing_stack = null
        let parseArray = []
        let exitMap = false
        let resultSemantico = ''

        lexerToParser.map(parsingObj => {
            if (exitMap) return
            let token = parsingObj[0]
            let res = parser.parseToken(token)
            if (res.has_errors) result += getSyntaticErrorMessage(res.errors)
            if (result !== '') return
            //console.log(parsingObj, res);
            if (token === "BEGIN" || token === "END") return
            if (token !== "SEMICOLON") {
                parseArray.push(parsingObj)
            }
            else {

                let proximoParse = parseArray[1]
                let parseAtual = parseArray[0]
                let tokenAtual = parseAtual[0]
                switch (tokenAtual) {
                    case 'PROGRAM':
                        inserir(
                            proximoParse[1],
                            tokenAtual,
                            'PROG'
                        )
                        break
                    case 'TYPE':
                        let indiceProximaVirgula = 1
                        let tipo = parseArray[0][1]

                        while (parseArray[indiceProximaVirgula] !== undefined) {
                            const parseAtual = parseArray[indiceProximaVirgula]
                            const tokenParseAtual = parseAtual[1]
                            const tipoParseAtual = parseAtual[0]
                            if (!inserir(
                                tokenParseAtual,
                                tipoParseAtual,
                                'VAR',
                                tipo
                            )) {
                                exitMap = true
                                resultSemantico = getSemanticErrorMessage(`A variável ${tokenParseAtual} já foi declarada...`)
                                return
                            }

                            indiceProximaVirgula += 2
                        }
                        break

                    case 'ID':
                        if (parseArray[1][0] !== "ASSIGN") break

                        let proximaOperacao = 3
                        let valorFinal
                        if (parseArray[2][0] !== "NUMBER" && parseArray[2][1] !== "true" && parseArray[2][1] !== "false")
                            valorFinal = buscar(parseArray[2][1] + "VAR").valor
                        else
                            valorFinal = parseArray[2][1]
                        while (parseArray[proximaOperacao] !== undefined) {
                            const parseAtual = parseArray[proximaOperacao]
                            const parserTipo = parseAtual[0]
                            const proximoValor = buscar(parseArray[proximaOperacao + 1][1] + "VAR")
                            console.log(proximoValor);

                            if (parserTipo == "ARITMETHIC_OP_SIMPLE" || parserTipo == "ARITMETHIC_OP_FACTOR")
                                valorFinal = realizaOperacao(valorFinal, parseAtual[1], proximoValor.valor).resultado


                            proximaOperacao += 2
                        }
                        console.log("valor .............", valorFinal);
                        if (!atualizar(
                            parseArray[0][1],
                            'VAR',
                            valorFinal
                        )) {
                            exitMap = true
                            resultSemantico = getSemanticErrorMessage(`Erro ${parseArray[2][1]} tipo...`)
                        }
                        break
                }

                parseArray = []
            }

        })
        console.log(tabelaSimbolos);
        console.log(resultSemantico);
        setLexerResult(result || "Análise concluída com sucesso!")
    }, [lexerToParser])

    const generateHash = (cadeia, categoria) => cadeia + categoria

    const operacaoRecursiva = (arrayDeEntrada) => {
        // arrayDeEntrada.map(item => {
        //     if (item.)
        // })
    }

    const realizaOperacao = (num1, operacao, num2) => {
        if ((num1 == 'false' || num1 == 'true') || (num2 == 'false' || num2 == 'true'))
            return {
                deu_certo: false,
                resultado: undefined
            }
        num1 = Number.parseInt(num1)
        num2 = Number.parseInt(num2)
        switch (operacao) {
            case '+':
                return {
                    deu_certo: true,
                    resultado: num1 + num2,
                }
                break;
            case '-':
                return {
                    deu_certo: true,
                    resultado: num1 - num2,
                }
                break;
            case '*':
                return {
                    deu_certo: true,
                    resultado: num1 * num2,
                }
                break;
            case 'div':
                return {
                    deu_certo: true,
                    resultado: Number.parseInt(num1 / num2),
                }
                break;

            default:
                return {
                    deu_certo: false,
                    resultado: undefined,
                }
                break;
        }
    }

    const inserir = (cadeia, token, categoria, tipo = null, valor = null) => {
        const hash = generateHash(cadeia, categoria)
        if (!buscar(hash)) {
            tabelaSimbolos[hash] = {
                cadeia,
                token,
                categoria,
                tipo,
                valor,
                atualizada: false
            }
            return true
        }
        return false
    }

    const atualizar = (cadeia, categoria, valor) => {
        const hash = generateHash(cadeia, categoria)
        if (!buscar(hash)) {
            console.log(hash, `${cadeia} não declarada`);
            return false
        }
        const tipoAtual = (valor === 'false' || valor == 'true') ? 'boolean' : 'int'
        if (tipoAtual !== tabelaSimbolos[hash].tipo) {
            console.log(`${valor} tem tipo diferente da declaração da variável ${cadeia}`);
            return false
        }
        tabelaSimbolos[hash].valor = valor
        tabelaSimbolos[hash].utilizada = true

        return true
    }

    const buscar = (hash) => tabelaSimbolos[hash]


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
