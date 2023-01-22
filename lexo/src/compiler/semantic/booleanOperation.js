import getKey from "./symbolsTable/getKey"
import getSymbol from "./symbolsTable/getSymbol"

const operacaoRecursiva = (arrayDeEntrada) => {
    // arrayDeEntrada.map(item => {
    //     if (item.)
    // })
}

const resolveNumericBooleanExpression = (num1, operacao, num2) => {
    num1 = Number.parseInt(num1)
    num2 = Number.parseInt(num2)

    if (num1 == NaN || num2 == NaN)
        return {
            deu_certo: false,
            resultado: undefined
        }

    switch (operacao) {
        case ">":
            return {
                deu_certo: true,
                resultado: num1 > num2
            }
        case "<":
            return {
                deu_certo: true,
                resultado: num1 < num2
            }
        case ">=":
            return {
                deu_certo: true,
                resultado: num1 >= num2
            }
        case "<=":
            return {
                deu_certo: true,
                resultado: num1 <= num2
            }
        case "=":
            return {
                deu_certo: true,
                resultado: num1 === num2
            }
        case "<>":
            return {
                deu_certo: true,
                resultado: num1 !== num2
            }
        default:
            break;
    }
}

const resolveBooleanExpression = (bool1, operacao, bool2) => {
    bool1 = bool1[0] === "NUMBER"
        ? bool1[1]
        : getSymbol(getKey(bool1[1], "VAR")).valor

    bool2 = bool2[0] === "NUMBER"
        ? bool2[1]
        : getSymbol(getKey(bool2[1], "VAR")).valor

    if ((bool1 != 'false' && bool1 != 'true') || (bool2 != 'false' && bool2 != 'true'))
        return resolveNumericBooleanExpression(bool1, operacao, bool2)

    switch (bool1) {
        case "true":
            bool1 = true
            break;
        case "false":
            bool1 = false
            break;
        default:
            return {
                deu_certo: false,
                resultado: undefined
            }
    }
    switch (bool2) {
        case "true":
            bool2 = true
            break;
        case "false":
            bool2 = false
            break;
        default:
            if (operacao == 'not')
                return {
                    deu_certo: true,
                    resultado: !bool1
                }
            return {
                deu_certo: false,
                resultado: undefined
            }
    }

    switch (operacao) {
        case 'or':
            return {
                deu_certo: true,
                resultado: bool1 || bool2,
            }
        case 'and':
            return {
                deu_certo: true,
                resultado: bool1 && bool2,
            }
        default:
            return {
                deu_certo: false,
                resultado: undefined,
            }
    }
}

export default resolveBooleanExpression
