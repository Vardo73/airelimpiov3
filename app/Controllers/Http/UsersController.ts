import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserValidator from 'App/Validators/UserValidator'
import User from 'App/Models/User'
import Rol from 'App/Models/Rol';


export default class UsersController {

    public async store({request,response,auth}:HttpContextContract){

        await request.validate(UserValidator);

        const {username, name, email, password}=request.body();
        const rol=await Rol.findBy('name', 'user')
        await rol?.related('users').create({
            username:username,
            name:name,
            email:email,
            password:password
        })
        await auth.use('web').attempt(email, password)
        response.redirect('/')
    }

    public async login({auth, request, response,session,view}:HttpContextContract){

        const email = request.input('email')
        const password = request.input('password')
        try {
            
            await auth.use('web').attempt(email, password) 
            await auth.login(auth.user!);
            response.redirect('/')

        } catch (error){
            console.log(error)
            session.flash('BAD_CREDENTIALS', 'Tu correo y/o contraseña no coindicen, favor de validar tu información.')
            response.redirect('back')

        }
    }

    public async register({view}:HttpContextContract){
        return view.render('public/user/register')
    }

    public async logout({auth, response }:HttpContextContract){
        await auth.use('web').logout()
        response.redirect('/')
    }
}
