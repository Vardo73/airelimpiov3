import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserValidator from 'App/Validators/UserValidator'
import User from 'App/Models/User'
import Rol from 'App/Models/Rol';


export default class UsersController {

    public async store({request,response}:HttpContextContract){

        await request.validate(UserValidator);

        const {username, name, email, password}=request.body();
        const rol=await Rol.findBy('name', 'user')

        console.log(request.body())


        await rol?.related('users').create({
            username:username,
            name:name,
            email:email,
            password:password
        })

        return response.redirect().back()

    }

    public async register({view}:HttpContextContract){
        return view.render('admin/user/register')
    }
}
