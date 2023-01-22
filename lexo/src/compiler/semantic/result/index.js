let result = ""

export const appendResult = (appendix) => result = result + getSemanticErrorMessage(appendix)

export const getResult = () => result

const getSemanticErrorMessage = (message) =>
`Erro semântico
${message}

-------------------------------------------------

`
