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
        let flag=false
        return view.render('admin/model',{models,pollutants,flag})
    }

    public async store({request,response}:HttpContextContract){
                
        const {name,description, pollutants}=request.body()

        await request.validate(ModelValidator)

        const model=await Model.create({
            name:name,
            description:description
        })
        if(pollutants!=null){
            if (typeof(pollutants) =='string') {
                const pollutant = await Pollutant.findOrFail(parseInt(pollutants, 10))
                await model.related('pollutants').attach([pollutant.id])
            }else{
                pollutants.forEach(async id  =>  {
                    const pollutant = await Pollutant.findOrFail(parseInt(id, 10))
                    await model.related('pollutants').attach([pollutant.id])
                });
            }
        }

        return response.redirect().back()
    }

    public async update({request,response,params}:HttpContextContract){

        const {name,description, pollutants}=request.body()
        await request.validate(ModelValidator)

        const model = await Model.findOrFail(params.id)
        await model.load('pollutants')
        model.name=name
        model.description=description

        await model.related('pollutants').detach()
       
        if(pollutants!=null){
            if (typeof(pollutants) =='string') {
                const pollutant = await Pollutant.findOrFail(parseInt(pollutants, 10))
                await model.related('pollutants').attach([pollutant.id])
            }else{
                pollutants.forEach(async id  =>  {
                    const pollutant = await Pollutant.findOrFail(parseInt(id, 10))
                    await model.related('pollutants').attach([pollutant.id])
                });
            }
        }

        await model.save();

        return response.redirect().back()
    }

    public async delete({response,params}:HttpContextContract){
        const model=await Model.findOrFail(params.id)
        await model.delete()

        return response.redirect().back()
    }
}
