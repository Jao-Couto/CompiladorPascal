const Lexer = require("jison-lex")
const Jison = require('jison')

const lexemes = {
    lex: {
        macros: {
            "DIGIT": "[0-9]",
            "INVALID_IDENTIFIER": "[A-Za-z_][A-Za-z_0-9]{15,}",
            "VALID_IDENTIFIER": "[A-Za-z_][A-Za-z_0-9]{0,14}",
            "LINE_FEED": "(\\r|\\n|\\r\\n)",
            "TYPES": "(Integer|Real|Character|Boolean)"
        },
        rules: [
            // Reservadas
            ["var", "return 'var';"],

            // Identificadores e números
            ["{INVALID_IDENTIFIER}", "return ['INVALID_ID_LENGTH', yytext, [yylloc.first_line, yylloc.first_column]];"],
            ["{VALID_IDENTIFIER}", "return 'ID';"],
            ["{DIGIT}{9,}", "return ['OVERFLOW_NUMBER', yytext, [yylloc.first_line, yylloc.first_column]];"],
            ["{DIGIT}{1,8}", "return 'NUMBER';"],

            // Delimitadores
            [",", "return 'COLON';"],
            [";", "return 'SEMICOLON';"],
            [" ", "return;"],
            ["\t", "return;"],
            ["{LINE_FEED}+", "return;"],

            // Comentários
            ["\/\/.*{LINE_FEED}+", "return;"],
            ["\\\{([^*]*?)\\\}", "return;"],
            ["\\\{(\\*(?!\/)|[^*])*", "return ['UNEXPECTED_EOF', null, [yylloc.first_line, yylloc.first_column]];"],

            // Parênteses
            ["\\(", "return 'LPAREN';"],
            ["\\)", "return 'RPAREN';"],

            // Operadores
            [":=", "return 'ASSIGN';"],
            ["(<>|<=|<|>=|>|=)", "return 'RELATIONAL_OP';"],
            ["(\\*|\\+|\\-|\\/|%)", "return ['ARITMETHIC_OP', yytext, [yylloc.first_line, yylloc.first_column]];"],

            // Declaração de tipo
            [":", "return ['TYPE_DECLARATION', null, [yylloc.first_line, yylloc.first_column]];"],

            // Final de arquivo
            ["\\.", "return ['EOP', null, [yylloc.first_line, yylloc.first_column]];"],
            ["$", "return 'EOF';"],

            // Símbolos fora do alfabeto
            ["[^*]", "return ['UNEXPECTED_TOKEN', yytext, [yylloc.first_line, yylloc.first_column]]"],



        ]
    },
    bnf: {
        "VAR": ['var IDENTIFIER'],
        "IDENTIFIER": ['ID SEMICOLON IDENTIFIER', "ID COLON IDENTIFIER", "EOF"],
    }
}


var parser = new Jison.Parser(lexemes);


export default parser
