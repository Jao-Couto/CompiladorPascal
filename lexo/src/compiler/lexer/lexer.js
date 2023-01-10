const Lexer = require("jison-lex")
const Jison = require('jison')

const lexemes = {
    macros: {
        "DIGIT": "[0-9]",
        "INVALID_IDENTIFIER": "[A-Za-z_][A-Za-z_0-9]{15,}",
        "VALID_IDENTIFIER": "[A-Za-z_][A-Za-z_0-9]{0,14}",
        "LINE_FEED": "(\\r|\\n|\\r\\n)",
        "TYPES": "(int|boolean)"
    },
    rules: [
        // Palavras reservadas
        ["program", "return ['PROGRAM', yytext, [yylloc.first_line, yylloc.first_column]];"],
        ["var", "return ['VAR', yytext, [yylloc.first_line, yylloc.first_column]];"],
        ["{TYPES}", "return ['TYPE', yytext, [yylloc.first_line, yylloc.first_column]];"],
        ["begin", "return ['BEGIN', yytext, [yylloc.first_line, yylloc.first_column]];"],
        ["end", "return ['END', yytext, [yylloc.first_line, yylloc.first_column]];"],
        ["procedure", "return ['PROCEDURE', yytext, [yylloc.first_line, yylloc.first_column]];"],
        ["if", "return ['IF', yytext, [yylloc.first_line, yylloc.first_column]];"],
        ["then", "return ['THEN', yytext, [yylloc.first_line, yylloc.first_column]];"],
        ["else", "return ['ELSE', yytext, [yylloc.first_line, yylloc.first_column]];"],
        ["while", "return ['WHILE', yytext, [yylloc.first_line, yylloc.first_column]];"],
        ["do", "return ['DO', yytext, [yylloc.first_line, yylloc.first_column]];"],

        // Operadores
        [":=", "return ['ASSIGN', yytext, [yylloc.first_line, yylloc.first_column]];"],
        ["(<>|<=|<|>=|>|=)", "return ['RELATIONAL_OP', yytext, [yylloc.first_line, yylloc.first_column]];"],
        ["(\\*|div|and)", "return ['ARITMETHIC_OP_FACTOR', yytext, [yylloc.first_line, yylloc.first_column]];"],
        ["(\\+|\\-)", "return ['ARITMETHIC_OP_SIMPLE', yytext, [yylloc.first_line, yylloc.first_column]];"],
        ["or", "return ['OR', yytext, [yylloc.first_line, yylloc.first_column]];"],
        ["not", "return ['NOT', yytext, [yylloc.first_line, yylloc.first_column]];"],

        // Identificadores e números
        ["{INVALID_IDENTIFIER}", "return ['INVALID_ID_LENGTH', yytext, [yylloc.first_line, yylloc.first_column]];"],
        ["{VALID_IDENTIFIER}", "return ['ID', yytext, [yylloc.first_line, yylloc.first_column]];"],
        ["{DIGIT}{9,}", "return ['OVERFLOW_NUMBER', yytext, [yylloc.first_line, yylloc.first_column]];"],
        ["{DIGIT}{1,8}", "return ['NUMBER', yytext, [yylloc.first_line, yylloc.first_column]];"],

        // Delimitadores
        [",", "return ['COLON', ',', [yylloc.first_line, yylloc.first_column]];"],
        [";", "return ['SEMICOLON', ';', [yylloc.first_line, yylloc.first_column]];"],
        ["\\.", "return ['DOT', '.', [yylloc.first_line, yylloc.first_column]];"],
        [" ", "return;"],
        ["\t", "return;"],
        ["{LINE_FEED}+", "return;"],

        // Comentários
        ["\/\/.*{LINE_FEED}+", "return;"],
        ["\\\{([^*]*?)\\\}", "return;"],
        ["\\\{(\\*(?!\/)|[^*])*", "return ['UNEXPECTED_EOF', null, [yylloc.first_line, yylloc.first_column]];"],

        // Parênteses
        ["\\(", "return ['LPAREN', '(', [yylloc.first_line, yylloc.first_column]]"],
        ["\\)", "return ['RPAREN', ')', [yylloc.first_line, yylloc.first_column]]"],



        // Declaração de tipo
        [":", "return ['TYPE_DECLARATION', ':', [yylloc.first_line, yylloc.first_column]];"],

        // Final de arquivo
        ["\\.", "return ['EOP', null, [yylloc.first_line, yylloc.first_column]];"],
        ["$", "return ['EOF', null, [yylloc.first_line, yylloc.first_column]];"],

        // Símbolos fora do alfabeto
        ["[^*]", "return ['UNEXPECTED_TOKEN', yytext, [yylloc.first_line, yylloc.first_column]]"],

    ]
}


var lexer = new Lexer(lexemes);


export default lexer
