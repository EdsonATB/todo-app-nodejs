import jwt from 'jsonwebtoken'

function authMiddleware (req,res, next) {
    //Coloca o token vindo do request em uma variavel
    const token = req.headers['authorization']

    //Verifica se veio um valor valido nesse token e para o codigo caso contrario
    if(!token) {return res.status(401).json({message: "No token provided"})}

    //Usa o metodo verify do JWT, se err existir quer dizer que que o token nao bate ou que expirou
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {return res.status(401).json({message: "Invalid Token"})}
        
        //Se der certo, adicionamos o campo userId no request recebendo o id vindo do token que criamos quando registramos ou logamos 
        // para quando chegar no endpoint poder ser usado para fazer as açoes CRUD para esse usuario em especifico
        req.userId = decoded.id
        next()
    })
}

export default authMiddleware