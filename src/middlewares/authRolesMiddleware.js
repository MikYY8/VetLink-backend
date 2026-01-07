// Auturiza a un usuario a acceder a cierta informacion
// dependiendo de su rol

export const authRolesMiddleware = (roles = []) =>{ 
    return (req,res,next) =>{
        // Si el usuario no tiene sesión iniciada
        if(!req.user){
            return res.status(401).json({message: "Debe iniciar sesión para acceder"})
        }
        // Si el usuario no tiene el rol necesario
        if (!roles.includes(req.user.role)){
            return res.status(401).json({message: "Acceso no autorizado"})
        }
        next()
    }
}
