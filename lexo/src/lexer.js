const JisonLex = require("jison-lex")


const state = {
    openComment: false
}

const bnf = {
    macros: {
        "DIGIT": "[0-9]",
        "IDENTIFIER": "[A-Za-z_][A-Za-z_0-9]*",
        "LINE_FEED": "(\r|\n|\r\n)"
    },
    rules: [
        // Identificadores e números
        ["{IDENTIFIER}", "return yytext;"],
        ["{DIGIT}+", "return yytext;"],
        [",", "return ',';"],
        [";", "return ';';"],
        [" ", "return;"],
        ["/\\\*(.*{LINE_FEED}+)+", () => state.openComment = true],
        ["\\\*/.*{LINE_FEED}+", () => state.openComment = false],
        ["//.*{LINE_FEED}+", "return;"],
        ["{LINE_FEED}+", "return;"],
        ["$", () => state.openComment ? "UNEXPECTED_EOF" : "EOF"]
    ]
}

const lexer = new JisonLex(bnf)

export { lexer } 
