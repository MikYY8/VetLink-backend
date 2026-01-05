export const authRoles = (roles = []) =>{ 
    return (req,res,next) =>{
        if(!req.user){
            return res.status(401).json({message: "Debe iniciar sesión para acceder"})
        }
        if (!roles.includes(req.user.role)){
            return res.status(401).json({message: "Acceso no autorizado"})
        }
        next()
    }
}
