import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Locality from 'App/Models/Locality';
import LocalityValidator from 'App/Validators/LocalityValidator';

export default class LocalitiesController {


    public async show({view}:HttpContextContract){
        const localities=await Locality.all()
        return view.render('admin/locality',{localities})
    }

    public async store({request,response}:HttpContextContract){
                
        const {name,description}=request.body()

        await request.validate(LocalityValidator)

        await Locality.create({
            name:name,
            description:description
        })

        return response.redirect().back()
    }

    public async update({request,response,params}:HttpContextContract){

        const {name,description}=request.body()
        await request.validate(LocalityValidator)

        const locality = await Locality.findOrFail(params.id)
        locality.name=name
        locality.description=description
        await locality.save();

        return response.redirect().back()
    }

    public async delete({response,params}:HttpContextContract){
        const locality=await Locality.findOrFail(params.id)
        await locality.delete()

        return response.redirect().back()
    }
}
