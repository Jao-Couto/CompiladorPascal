const Lexer = require("jison-lex")
const Jison = require('jison')

const getErrorCondition = (conditionName, exitTokens) => {
	const allTokens = [
		'VAR',
		'PROGRAM',
		'TYPE',
		'INVALID_ID_LENGTH',
		'ID',
		'OVERFLOW_NUMBER',
		'NUMBER',
		'COLON',
		'SEMICOLON',
		'UNEXPECTED_EOF',
		'LPAREN',
		'RPAREN',
		'ASSIGN',
		'RELATIONAL_OP',
		'ARITMETHIC_OP',
		'TYPE_DECLARATION',
		'EOP',
		'EOF',
		'UNEXPECTED_TOKEN'
	]

	const errorMatches = allTokens
		.filter(token => exitTokens.findIndex(exit => exit === token) === -1)
		.map(token => [`${token} ${conditionName}_UNTRACK`, '$$ = ["Error", $1]']) 
	
	return [...exitTokens.map(exit => [`${exit}`, '$$']), ...errorMatches]
}

const lexemes = {
	lex: {
		macros: {
			"DIGIT": "[0-9]",
			"INVALID_IDENTIFIER": "[A-Za-z_][A-Za-z_0-9]{15,}",
			"VALID_IDENTIFIER": "[A-Za-z_][A-Za-z_0-9]{0,14}",
			"LINE_FEED": "(\\r|\\n|\\r\\n)",
			"TYPES": "(int|boolean)"
		},
		rules: [
			// Reservadas
			["var", "yytext= [yytext, yylloc.first_line, yylloc.first_column]; return 'VAR';"],
			["program", "return 'PROGRAM';"],
			["{TYPES}", "yytext= [yytext, yylloc.first_line, yylloc.first_column]; return 'TYPE';"],


			// Identificadores e números
			["{INVALID_IDENTIFIER}", "return ['INVALID_ID_LENGTH', yytext, [yylloc.first_line, yylloc.first_column]];"],
			["{VALID_IDENTIFIER}", "yytext= [yytext, yylloc.first_line, yylloc.first_column]; return 'ID';"],
			["{DIGIT}{9,}", "return ['OVERFLOW_NUMBER', yytext, [yylloc.first_line, yylloc.first_column]];"],
			["{DIGIT}{1,8}", "return 'NUMBER';"],


			// Delimitadores
			[",", "yytext= [yytext, yylloc.first_line, yylloc.first_column]; return 'COLON';"],
			[";", "yytext= [yytext, yylloc.first_line, yylloc.first_column]; return 'SEMICOLON';"],
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
			[":", "yytext= [yytext, yylloc.first_line, yylloc.first_column]; return 'TYPE_DECLARATION';"],

			// Final de arquivo
			["\\.", "return ['EOP', null, [yylloc.first_line, yylloc.first_column]];"],
			["$", "yytext= ['EOF', yylloc.first_line, yylloc.first_column];return 'EOF';"],

			// Símbolos fora do alfabeto
			["[^*]", "return ['UNEXPECTED_TOKEN', yytext, [yylloc.first_line, yylloc.first_column]]"],
		]
	},
	bnf: {
		"PROGRAM":               	[["VAR_DECLARATION", 'return $$']],
		"VAR_DECLARATION":       	[
																['TYPE ID VAR_DECLARATION_LIST VAR_DECLARATION', "$$ = [$1,$2, ...$3, ...$4]"], 
																["EOF", "$$ = [$1]"], 
																["VAR_DECLARATION_ERROR", "$$ = [['ERROR', ...$1]]"]
															],
		"VAR_DECLARATION_LIST":  	[["COLON ID VAR_DECLARATION_LIST", "$$ = [$1, $2, ...$3]"], ["SEMICOLON", "$$ = [$1]"]],
		"VAR_DECLARATION_ERROR": getErrorCondition("VAR_DECLARATION_ERROR", ["SEMICOLON"]),
		"VAR_DECLARATION_ERROR_UNTRACK": getErrorCondition("VAR_DECLARATION_ERROR", ["SEMICOLON"])
	}
}

const parser = new Jison.Parser(lexemes);
console.log(getErrorCondition("VAR_DECLARATION_ERROR", ["SEMICOLON"]))

export default parser
