import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ClinicValidator from 'App/Validators/ClinicValidator';
import Clinic from "App/Models/Clinic";

export default class ClinicsController {

    public async show({view}:HttpContextContract){
        const clinics=await Clinic.all()
        console.log(clinics)
        return view.render('admin/clinic',{clinics})
    }


    public async store({request,response}:HttpContextContract){

        await request.validate(ClinicValidator)

        const {name,longitude, latitude,neighborhood}=request.body();

        await Clinic.create({
            name:name,
            longitude:longitude,
            latitude:latitude,
            neighborhood:neighborhood
        });

       return response.redirect().back()
    }

    
    public async update({request,response,params}:HttpContextContract){
        await request.validate(ClinicValidator)

        const {name,longitude, latitude,neighborhood}=request.body();

        const clinic = await Clinic.findOrFail(params.id)
        clinic.name=name
        clinic.longitude=longitude
        clinic.latitude=latitude
        clinic.neighborhood=neighborhood

        await clinic.save();

        return response.redirect().back()
    }

    public async delete({response,params}:HttpContextContract){
        const clinic=await Clinic.findOrFail(params.id)
        await clinic.delete()

        return response.redirect().back()
    }}
