import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserValidator from 'App/Validators/UserValidator'
import User from 'App/Models/User'
import Rol from 'App/Models/Rol';
import Monitor from 'App/Models/Monitor';
import Database from '@ioc:Adonis/Lucid/Database';


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

    public async show({view}:HttpContextContract){
        const users=await User.query()
        .preload('rol') 
        .exec();
        const rols=await Rol.all()

        return view.render('admin/users',{users,rols})
    }

    public async delete({response,params}:HttpContextContract){
        const user=await User.findOrFail(params.id)
        await user.delete()

        return response.redirect().back()
    }

    public async update({request,response,params}:HttpContextContract){

        const {username, name,email,rol}=request.body()

        const user = await User.findOrFail(params.id)
        await user.load('rol')

        user.name=name
        user.username=username
        user.email=email

        if (rol && user.rol_id !== rol) {
            user.rol_id = rol;
        }

        await user.save();

        return response.redirect().back()
    }
    
    public async dashboard({view,auth,response}:HttpContextContract){

        if(!auth.user) return response.redirect('/')

    

        const id_user=auth.user?.id
        const monitors=await Monitor.all()

        const user_monitors=await Database
            .from('user_monitors')
            .select('*')
            .whereRaw('user_id=? ',[id_user])

        let flag=false;
        return view.render('public/user/dashboard',{monitors, user_monitors, flag})
    }

    public async delete_panel({response,params,auth}:HttpContextContract){
        const user=await User.findOrFail(params.id)
        await auth.use('web').logout()
        await user.delete()
        response.redirect('/')
    }

    public async addMonitors({request,response,params}:HttpContextContract){
        try {
            
            const {monitors}=request.body();

            const user=await User.findOrFail(params.id);

            await user.related('monitors').detach()

            if(typeof(monitors)=="string"){
                const monitor = await Monitor.findOrFail(parseInt(monitors, 10))
                await user.related('monitors').attach([monitor.id])
            }else{
                monitors.forEach(async id  =>  {
                    const monitor = await Monitor.findOrFail(parseInt(id, 10))
                    await user.related('monitors').attach([monitor.id])
                });
            }
            return response.redirect().back()
        } catch (error) {
            console.log(error)
            return response.redirect().back()
        }
    }
}
