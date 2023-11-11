import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ClinicValidator from 'App/Validators/ClinicValidator';
import Clinic from "App/Models/Clinic";
import Ailment from 'App/Models/Ailment';
import Database from '@ioc:Adonis/Lucid/Database';

export default class ClinicsController {

    public async show({view}:HttpContextContract){
        const clinics=await Clinic.query()
        .preload('ailments') 
        .exec();
        const years=await Database
        .from('ailment_clinics')
        .select('year').distinct('year')
        const ailments=await Ailment.all()
        let flag=false
        return view.render('admin/clinic',{clinics,ailments,flag,years})
    }

    public async store({request,response}:HttpContextContract){

        await request.validate(ClinicValidator)

        const {name,longitude, latitude,neighborhood,ailments, year}=request.body();
        console.log(request.body())

        const clinic=await Clinic.create({
            name:name,
            longitude:longitude,
            latitude:latitude,
            neighborhood:neighborhood
        });

        if(ailments!=null){
            if(typeof(ailments)=="string"){
                const ailment = await Ailment.findOrFail(parseInt(ailments, 10))
                await clinic.related('ailments').attach({[ailment.id]: { year }})
            }else{
                ailments.forEach(async id  =>  {
                    const ailment = await Ailment.findOrFail(parseInt(id, 10))
                    await clinic.related('ailments').attach({[ailment.id]: { year }})
                });
            }
        }

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
    }

    public async addAilments({request,response,params,session}:HttpContextContract){
        try {
            const {ailments, year, total}=request.body();

            const totalfil = total.filter(elemento => elemento !== '0');

            const clinic=await Clinic.findOrFail(params.id)
            
            
            if(typeof(ailments)=="string"){
                const ailment = await Ailment.findOrFail(parseInt(ailments, 10))
                await clinic.related('ailments').attach({[ailment.id]: { year:year ,total:totalfil[0]}})
            }else{
                const join = ailments.map((valor, indice) => [valor, totalfil[indice]]);
                join.forEach(async element  =>  {
                    const ailment = await Ailment.findOrFail(parseInt(element[0], 10))
                    await clinic.related('ailments').attach({[ailment.id]: { year:year,total: element[1]}})
                });
            }

            return response.redirect().back()
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                session.flash('ER_DUP_ENTRY','Elementos ya creados para este año.')
                return response.redirect('back')
            }
            return response.redirect().back()
        }
    }

    public async deleteAilmentsYear({response,params}:HttpContextContract){
        const id=params.id
        const year=params.year

        await Database.from('ailment_clinics')
        .select('*')
        .whereRaw('ailment_clinics.clinic_id=? ',[id])
        .andWhereRaw('ailment_clinics.year=?',[year])
        .delete()

        return response.redirect().back()
    }
}

    
