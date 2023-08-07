import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Pollutant from 'App/Models/Pollutant';
import { Pool } from 'mysql2/typings/mysql/lib/Pool';
import { reporters } from 'tests/bootstrap';


export default class PollutantsController {

    public async store({request,response}:HttpContextContract){
        const newPollutantSchema=schema.create({
            name:schema.string({},[
                rules.required(),
                rules.minLength(4)
            ]),
            description:schema.string({},[
                rules.required(),
                rules.minLength(4)
            ])
        })

        try {
            await request.validate({
                schema:newPollutantSchema,
                messages:{
                    required:'El campo {{field}} es requerido para registrar el contaminante.',
                    minLength:'Campo {{field}} muy corto.(min 4 caracteres)'
                }
            })

            const {name, description}=request.body();

            await Pollutant.create({
                name:name,
                description:description
            });

           return response.redirect().back();
        } catch (error) {
            response.badRequest(error.messages)
        }
    }

    public async edit({request,response}:HttpContextContract){
        const newPollutantSchema=schema.create({
            name:schema.string({},[
                rules.required(),
                rules.minLength(4)
            ]),
            description:schema.string({},[
                rules.required(),
                rules.minLength(4)
            ])
        })

        try {
            await request.validate({
                schema:newPollutantSchema,
                messages:{
                    required:'El campo {{field}} es requerido para registrar el contaminante.',
                    minLength:'Campo {{field}} muy corto, (min 4 caracteres)'
                }
            })

            const pollutant = await Pollutant.findOrFail(request.input('id'))
            pollutant.name=request.input('name')
            pollutant.description=request.input('description')

            await pollutant.save();


            return 'Contaminante modificado'
        } catch (error) {
            response.badRequest(error.messages)
        }
    }

    public async delete({request,response}:HttpContextContract){
        let id= request.input('id');
        try {
            const pollutant=await Pollutant.findOrFail(id)
            await pollutant.delete()
        } catch (error) {
            response.badRequest(error.messages)
        }
    }

    public async show({view}:HttpContextContract){
        const pollutants=await Pollutant.all();
        return view.render('admin/pollutant',{pollutants});
    }

    public async all(){
        const pollutants=await Pollutant.all();
        return pollutants
    }
}
