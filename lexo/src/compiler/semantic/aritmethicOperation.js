const operacaoRecursiva = (arrayDeEntrada) => {
  // arrayDeEntrada.map(item => {
  //     if (item.)
  // })
}

const resolveSimpleExpression = (num1, operacao, num2) => {
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
    case '-':
      return {
        deu_certo: true,
        resultado: num1 - num2,
      }
    case '*':
      return {
        deu_certo: true,
        resultado: num1 * num2,
      }
    case 'div':
      return {
        deu_certo: true,
        resultado: Number.parseInt(num1 / num2),
      }

    default:
      return {
        deu_certo: false,
        resultado: undefined,
      }
  }
}

export default resolveSimpleExpression
