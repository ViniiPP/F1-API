function errorHandler(err, req, res, next) {
    // registrar o erro no terminal
    console.error(err);

    // caso a resposta ja tenha sido iniciada
    if(res.headersSent){
        return next(err);
    }

    // retornar erro padronizado
    return res.status(500).json({
        message: "Erro interno do Servidor"
    });
}

module.exports = { errorHandler };