import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Model from 'App/Models/Model'
import Pollutant from 'App/Models/Pollutant'
import ModelValidator from 'App/Validators/ModelValidator'

export default class ModelsController {
    public async show({view}:HttpContextContract){

        const pollutants=await Pollutant.all()
        const models = await Model.query()
        .preload('pollutants') 
        .exec();

        return view.render('admin/model',{models,pollutants})
    }


    public async store({request,response}:HttpContextContract){

        await request.validate(ModelValidator)

        const {name,description, pollutans}=request.body()

        console.log(request.body());

        const model=await Model.create({
            name:name,
            description:description,
        })

        pollutans.forEach(async id  =>  {
            const pollutant = await Pollutant.findOrFail(parseInt(id, 10))
            // Performs insert query inside the pivot table
            await model.related('pollutants').attach([pollutant.id])
        });

       return response.redirect().back()
    }


    public async delete({response,params}:HttpContextContract){
        const model=await Model.findOrFail(params.id)
        await model.delete()

        return response.redirect().back()
    }
}
