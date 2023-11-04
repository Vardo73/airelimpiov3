import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Ailment from 'App/Models/Ailment'
import Pollutant from 'App/Models/Pollutant'
import AilmentValidator from 'App/Validators/AilmentValidator'
import Database from '@ioc:Adonis/Lucid/Database';
import Clinic from 'App/Models/Clinic';

export default class AilmentsController {
    public async show({view}:HttpContextContract){
        const ailments=await Ailment.query()
        .preload('pollutants') 
        .exec();
        const pollutants=await Pollutant.all()
        let flag=false
        return view.render('admin/ailment',{ailments,pollutants,flag})
    }

    public async showAilments({view,params}:HttpContextContract){
        const id=params.id;

        const clinic=await Clinic.findOrFail(params.id)
        const ailments= await Ailment.all()

        const years=await Database
        .from('ailment_clinics')
        .select('year')
        .whereRaw('ailment_clinics.clinic_id=? ',[id])
        .distinct('year')

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
                        if(total== null) total=0;
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
                console.log(ails_cli)
            })
            arr.push(obj)
        })
    

        return view.render('admin/ailments_clinic',{clinic,ailments,arr})
    }

    public async showAilmentsYear({view,params}:HttpContextContract){

        const id=params.id;
        const year=params.year;

        console.log(year)

       /* const clinic=await Clinic.findOrFail(params.id)
        const ailments= await Ailment.all();

        
        const ailments_clinic= await Database.from('ailment_clinics')
        .select('*')
        .whereRaw('ailment_clinics.clinic_id=? ',[id])
        .andWhereRaw('ailment_clinics.year=?',[year]);

        //console.log(ailments_clinic)
        
        const years=await Database
        .from('ailment_clinics')
        .select('year')
        .whereRaw('ailment_clinics.clinic_id=? ',[id])
        .distinct('year')

        let flag=false
    
        return view.render('admin/ailments_clinic',{clinic,ailments,ailments_clinic,years,flag,year})*/
    }

    public async store({request,response}:HttpContextContract){
                
        const {name,pollutants}=request.body()
        await request.validate(AilmentValidator)


        const ailment=await Ailment.create({
            name:name
        })
        if(pollutants!=null){
            if(typeof(pollutants)=="string"){
                const pollutant = await Pollutant.findOrFail(parseInt(pollutants, 10))
                await ailment.related('pollutants').attach([pollutant.id])
            }else{
                pollutants.forEach(async id  =>  {
                    const pollutant = await Pollutant.findOrFail(parseInt(id, 10))
                    await ailment.related('pollutants').attach([pollutant.id])
                });
            }
        }

        return response.redirect().back()
    }

    public async delete({response,params}:HttpContextContract){
        const ailment=await Ailment.findOrFail(params.id)
        await ailment.delete()

        return response.redirect().back()
    }

    public async update({request,response,params}:HttpContextContract){

        const {name, pollutants}=request.body()
        await request.validate(AilmentValidator)

        const ailment = await Ailment.findOrFail(params.id)
        await ailment.load('pollutants')
        ailment.name=name

        await ailment.related('pollutants').detach()
        if(pollutants!=null){
            if (typeof(pollutants) =='string') {
                const pollutant = await Pollutant.findOrFail(parseInt(pollutants, 10))
                await ailment.related('pollutants').attach([pollutant.id])
            }else{
                pollutants.forEach(async id  =>  {
                    const pollutant = await Pollutant.findOrFail(parseInt(id, 10))
                    await ailment.related('pollutants').attach([pollutant.id])
                });
            }
        }

        await ailment.save();

        return response.redirect().back()
    }
}
