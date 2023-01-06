import './App.css';
import React, { useEffect, useState } from 'react';
import parser from "./compiler/lexer/parser"
import lexer from './compiler/lexer/lexer';
import { generateParser, parseToken } from "@ellyzeul_/ll1-parser";

function App() {
    const [file, setFile] = useState('')
    const [lexerResult, setLexerResult] = useState('')
    const [lexerToParser, setLexerToParser] = useState([])

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

    useEffect(() => {
        const parser = generateParser({
            headRule: '<PROGRAM>',
            '<PROGRAM>': 'PROGRAM ID SEMICOLON <BLOCK> DOT <EOF>',
            '<BLOCK>': '<COMP_COMAND> | <PART_VAR_DECLARATION> <PART_SUBROUTINE_DECLARATION> <COMP_COMAND>',
            '<PART_VAR_DECLARATION>': '<VAR_DECLARATION> SEMICOLON <REMINDER_PART_VAR_DECLARATION> | v',
            '<REMINDER_PART_VAR_DECLARATION>': '<VAR_DECLARATION> SEMICOLON <REMINDER_PART_VAR_DECLARATION> | v',
            '<VAR_DECLARATION>': 'TYPE ID <ID_LIST>',
            '<ID_LIST>': 'COLON ID <ID_LIST> | v',
            '<PART_SUBROUTINE_DECLARATION>': '<PROCEDURE_DECLARATION> SEMICOLON <PART_SUBROUTINE_DECLARATION> | v',
            '<PROCEDURE_DECLARATION>': 'PROCEDURE ID <FORMAL_PARAMS> SEMICOLON <BLOCK>',
            '<FORMAL_PARAMS>': 'LPAREN <FORMAL_PARAMS_SECTION> RPAREN | v',
            '<FORMAL_PARAMS_SECTION>': 'VAR ID <ID_LIST> TYPE_DECLARATION TYPE <MORE_FORMAL_PARAMS_SECTION> | ID <ID_LIST> TYPE_DECLARATION TYPE <MORE_FORMAL_PARAMS_SECTION>',
            '<MORE_FORMAL_PARAMS_SECTION>': 'SEMICOLON <FORMAL_PARAMS_SECTION> <MORE_FORMAL_PARAMS_SECTION> | v',
            '<COMP_COMAND>': 'BEGIN <COMAND> <COMAND_LIST> END',
            '<COMAND>': 'ID <ATTR_OR_PROCEDURE> | <COMP_COMAND> | <CODITIONAL_COMAND_1> | <LOOP_COMAND_1>',
            '<COMAND_LIST>': 'SEMICOLON <COMAND> <COMAND_LIST> | v',
            '<ATTR_OR_PROCEDURE>': 'ASSIGN <EXPRESSION> | <PROCEDURE_CALL>',
            '<EXPRESSION>': '<SIMPLE_EXPRESSION> <REMAINDER_EXPRESSION>',
            '<REMAINDER_EXPRESSION>': 'RELATIONAL_OP <SIMPLE_EXPRESSION> | v',
            '<SIMPLE_EXPRESSION>': 'ARITMETHIC_OP_SIMPLE <TERM> <REMAINDER_SIMPLE_EXPRESSION_2> | <TERM> <REMAINDER_SIMPLE_EXPRESSION_2>',
            '<REMAINDER_SIMPLE_EXPRESSION_2>': 'ARITMETHIC_OP_SIMPLE <TERM> <REMAINDER_SIMPLE_EXPRESSION_2> | OR <TERM> <REMAINDER_SIMPLE_EXPRESSION_2> | v',
            '<TERM>': '<FACTOR> <REMINDER_TERM>',
            '<REMINDER_TERM>': 'ARITMETHIC_OP_FACTOR <FACTOR> <REMINDER_TERM> | v',
            '<FACTOR>': 'ID | NUMBER | LPAREN <EXPRESSION> RPAREN | NOT <FACTOR>',
            '<PROCEDURE_CALL>': 'LPAREN <EXPRESSION> <EXPRESSION_LIST> RPAREN | v',
            '<EXPRESSION_LIST>': 'COLON <EXPRESSION> | v',
            '<CODITIONAL_COMAND_1>': 'IF <EXPRESSION> THEN <OPT_BLOCK> <OPTIONAL_ELSE>',
            '<OPTIONAL_ELSE>': 'ELSE <OPT_BLOCK> | v',
            '<LOOP_COMAND_1>': 'WHILE <EXPRESSION> DO <OPT_BLOCK>',
            '<OPT_BLOCK>': '<COMP_COMAND>', // | <COMAND> // Nao esta funcionando por causa da recursao em <COMAND>
            '<EOF>': 'EOF'
        })
        let result = ''
        lexerToParser.map(item => {
            let res = parser.parseToken(item[0])
            console.log(res);
            result += res.has_errors ? JSON.stringify(res.errors) + ' em ' + JSON.stringify(item) + "\n" : JSON.stringify(item) + " passou!" + "\n"
        })
        setLexerResult(result)

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
            console.log("ola");
        }
    }

    const analyzeParser = async () => {
        analyzeLexer(false)




        // try {
        //     let result = parser.parse(file)
        //     setLexerResult(result.join("\n") + "\nAnálise Sintática Completa")
        // }
        // catch (error) {
        //     console.log(error["hash"]);
        //     setLexerResult("Erro encontrado: \nEsperado " + error["hash"]["expected"] + "\nEncontrado '" + error["hash"]["text"] + "', " + error["hash"]["token"] + " na linha " + error["hash"]["loc"]["first_line"] + " coluna " + error["hash"]["loc"]["first_column"])
        // }

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
