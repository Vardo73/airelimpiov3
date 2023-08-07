import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Rol from 'App/Models/Rol'

export default class RolsController {

    public async store({request,response}:HttpContextContract){
        const newRolSchema=schema.create({
            name:schema.string({},[
                rules.required(),
                rules.minLength(4)
            ])
        })

        try {
            await request.validate({
                schema:newRolSchema,
                messages:{
                    required:'El campo {{field}} es requerido para registrar el Rol.',
                    minLength:'Campo {{field}} muy corto.(min 4 caracteres)'
                }
            })

            await Rol.create({
                name:request.input('name')
            });

            return 'Rol registrado'
        } catch (error) {
            response.badRequest(error.messages)
        }
    }

    public async delete({request,response}:HttpContextContract){
        let id= request.input('id');

        try {
            const rol=await Rol.findOrFail(id)
            await rol.delete()
        } catch (error) {
            response.badRequest(error.messages)
        }
    }

    public async show(){
        const rols=await Rol.all();
        return rols;
    }
}
