import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Type from 'App/Models/Type';

/*
SOLO 3 ROLES:
    -ADMIN:
        -PPERMISOS TOTALES
    -GUEST:
        - ACCESOS DE LECTURA A LA PARTE DE ADMIN
    -USER: 
        -SOLO VISTAS A LA PARTE PUBLICA
*/
export default class TypesController {

    public async store({request,response}:HttpContextContract){
        const newtypeSchema=schema.create({
            name:schema.string({},[
                rules.required(),
                rules.minLength(4)
            ])
        })

        try {
            await request.validate({
                schema:newtypeSchema,
                messages:{
                    required:'El campo {{field}} es requerido para registrar el tipo de dato.',
                    minLength:'Campo {{field}} muy corto.(min 4 caracteres)'
                }
            })

            await Type.create({
                name:request.input('name')
            });

            return 'Tipo de dato registrado'
        } catch (error) {
            response.badRequest(error.messages)
        }
    }

    public async delete({request,response}:HttpContextContract){
        let id= request.input('id');

        try {
            const type=await Type.findOrFail(id)
            await type.delete()
        } catch (error) {
            response.badRequest(error.messages)
        }
    }

    public async show(){
        const types=await Type.all();
        return types;
    }
}
