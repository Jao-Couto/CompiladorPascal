const Lexer = require("jison-lex")
const Jison = require('jison')

const lexemes = {
    macros: {
        "DIGIT": "[0-9]",
        "INVALID_IDENTIFIER": "[A-Za-z_][A-Za-z_0-9]{15,}",
        "VALID_IDENTIFIER": "[A-Za-z_][A-Za-z_0-9]{0,14}",
        "LINE_FEED": "(\\r|\\n|\\r\\n)",
        "TYPES": "(Integer|Real|Character|Boolean)"
    },
    rules: [
        // Palavras reservadas
        ["program", "return ['PROGRAM', yytext, [yylloc.first_line, yylloc.first_column]];"],

        // Identificadores e números
        ["{INVALID_IDENTIFIER}", "return ['INVALID_ID_LENGTH', yytext, [yylloc.first_line, yylloc.first_column]];"],
        ["{VALID_IDENTIFIER}", "return ['ID', yytext, [yylloc.first_line, yylloc.first_column]];"],
        ["{DIGIT}{9,}", "return ['OVERFLOW_NUMBER', yytext, [yylloc.first_line, yylloc.first_column]];"],
        ["{DIGIT}{1,8}", "return ['NUMBER', yytext, [yylloc.first_line, yylloc.first_column]];"],

        // Delimitadores
        [",", "return ['COLON', null, [yylloc.first_line, yylloc.first_column]];"],
        [";", "return ['SEMICOLON', ';', [yylloc.first_line, yylloc.first_column]];"],
        [" ", "return;"],
        ["\t", "return;"],
        ["{LINE_FEED}+", "return;"],

        // Comentários
        ["\/\/.*{LINE_FEED}+", "return;"],
        ["\\\{([^*]*?)\\\}", "return;"],
        ["\\\{(\\*(?!\/)|[^*])*", "return ['UNEXPECTED_EOF', null, [yylloc.first_line, yylloc.first_column]];"],

        // Parênteses
        ["\\(", "return ['LPAREN', null, [yylloc.first_line, yylloc.first_column]]"],
        ["\\)", "return ['RPAREN', null, [yylloc.first_line, yylloc.first_column]]"],

        // Operadores
        [":=", "return ['ASSIGN', null, [yylloc.first_line, yylloc.first_column]];"],
        ["(<>|<=|<|>=|>|=)", "return ['RELATIONAL_OP', yytext, [yylloc.first_line, yylloc.first_column]];"],
        ["(\\*|\\+|\\-|\\/|%)", "return ['ARITMETHIC_OP', yytext, [yylloc.first_line, yylloc.first_column]];"],

        // Declaração de tipo
        [":", "return ['TYPE_DECLARATION', null, [yylloc.first_line, yylloc.first_column]];"],

        // Final de arquivo
        ["\\.", "return ['EOP', null, [yylloc.first_line, yylloc.first_column]];"],
        ["$", "return ['EOF', null, [yylloc.first_line, yylloc.first_column]];"],

        // Símbolos fora do alfabeto
        ["[^*]", "return ['UNEXPECTED_TOKEN', yytext, [yylloc.first_line, yylloc.first_column]]"],

    ]
}


var lexer = new Lexer(lexemes);


export default lexer
