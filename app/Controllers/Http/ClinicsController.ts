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

            const years=await Database
            .from('ailment_clinics')
            .select('year')
            .whereRaw('ailment_clinics.clinic_id=? ',[params.id])
            .distinct('year')
            .orderBy('year', 'asc')

            if(!years.includes(year)){
                session.flash('ER_DUP_ENTRY','Elementos ya creados para este año.')
                return response.redirect('back')
            }


            const clinic=await Clinic.findOrFail(params.id)
            
            
            if(typeof(ailments)=="string"){
                const ailment = await Ailment.findOrFail(parseInt(ailments, 10))
                await clinic.related('ailments').attach({[ailment.id]: { year:year ,total:total}})
            }else{

                const totalfil = total.filter(elemento => elemento !== '0');
                const join = ailments.map((valor, indice) => [valor, totalfil[indice]]);
                join.forEach(async element  =>  {
                    const ailment = await Ailment.findOrFail(parseInt(element[0], 10))
                    await clinic.related('ailments').attach({[ailment.id]: { year:year,total: element[1]}})
                });
            }
            return response.redirect().back()
        } catch (error) {
            console.log(error)
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

    public async editAilmentsYear({request,response,params}:HttpContextContract){
        const id=params.id
        const year=params.year
        const {ailments, total}=request.body();

        console.log(request.body())

        const clinic = await Clinic.findOrFail(id)

        await clinic.related('ailments').pivotQuery().where('year', year).delete()

        const totalfil = total.filter(elemento => elemento !== '0');

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
    }

    //public view

    public async showMap({view}:HttpContextContract){  
        return view.render('public/map_clinics')
    }

    public async bannerClinic({view}:HttpContextContract){
      
        try {
            const year=await Database
            .from('ailment_clinics')
            .select('year')
            .distinct('year')
            .orderBy('year', 'desc')
            .first()

            let clinics;
            if(year){
                clinics = await Clinic.query()
                .preload('ailments', (query) => {
                query.pivotColumns(['year', 'total'])
                query.wherePivot('year', year?.year);
                })
                .exec();
            }else{
                 clinics=await Clinic.query()
                .preload('ailments') 
                .exec();
            }

            let banners:{html:any,latitude:number,longitude:number}[]=[]

            await clinics.forEach(async clinic=>{

                let html=await view.render('partials/banner_clinic',{clinic,year:year})

                 let element={
                     html:html, 
                     latitude:clinic.latitude, 
                     longitude: clinic.longitude
                 }
                 banners.push(element)
            })
 
             return banners
        } catch (error) {
         console.log(error)
        }
    }


    public async historics({view,params}:HttpContextContract){
        const id=params.id;


        const clinic=await Clinic.findOrFail(params.id)
        const ailments= await Ailment.all()

        const years=await Database
        .from('ailment_clinics')
        .select('year')
        .whereRaw('ailment_clinics.clinic_id=? ',[id])
        .distinct('year')
        .orderBy('year', 'asc')

        const ailments_clinic= await Database.from('ailment_clinics')
        .select('*')
        .whereRaw('ailment_clinics.clinic_id=? ',[id])
        .groupBy('year','ailment_id');

        let arr:object[]=[];

        years.forEach( y => {
            let obj:{
                year:number,
                ailments:object[]
            }={
                year:y.year,
                ailments:[]
            }            

            ailments.forEach( ail => {
                let ails_cli:{
                    ailment_id:number,
                    name:string,
                    year:number,
                    total:number,
                    check:boolean
                }={
                    ailment_id:0,
                    name:'',
                    year:0,
                    total:0,
                    check:false
                }
                let flag=false;
                let total=0

                ailments_clinic.forEach(ail_cli => {
                    if(ail.id==ail_cli.ailment_id && ail_cli.year==y.year){
                        flag=true;
                        total=ail_cli.total
                        if(total== null) {total=0}
                    }
                })

                if(flag){
                    ails_cli={
                        ailment_id:ail.id,
                        name:ail.name,
                        year:y.year,
                        total:total,
                        check:true
                    }
                }else{
                    ails_cli={
                        ailment_id:ail.id,
                        name:ail.name,
                        year:y.year,
                        total:0,
                        check:false
                    }
                }
                obj.ailments.push(ails_cli)

            })
            arr.push(obj)
        })
        return view.render('public/historics_clinic',{clinic,ailments,arr,years})
    }
}

    
