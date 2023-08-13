import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import PollutantValidator from 'App/Validators/PollutantValidator';
import Pollutant from 'App/Models/Pollutant';


export default class PollutantsController {

    public async store({request,response}:HttpContextContract){

        await request.validate(PollutantValidator)

        const {name, description}=request.body();

        await Pollutant.create({
            name:name,
            description:description
        });

       return response.redirect().back();
    }

    public async update({request,response,params}:HttpContextContract){
        await request.validate(PollutantValidator)

        const {name, description}=request.body();

        const pollutant = await Pollutant.findOrFail(params.id)
        pollutant.name=name
        pollutant.description=description

        await pollutant.save();

        return response.redirect().back();

    }

    public async delete({response,params}:HttpContextContract){
        const pollutant=await Pollutant.findOrFail(params.id)
        await pollutant.delete()

        return response.redirect().back();
    }

    public async show({view}:HttpContextContract){
        const pollutants=await Pollutant.all();
        return view.render('admin/pollutant',{pollutants});
    }

}
