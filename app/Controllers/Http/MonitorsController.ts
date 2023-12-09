import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database';
import { format } from 'date-fns';
import Datum from 'App/Models/Datum';
import Model from 'App/Models/Model';
import Monitor from 'App/Models/Monitor';
import Neighborhood from 'App/Models/Neighborhood';
import Sponsor from 'App/Models/Sponsor';
import PurpleAirService from 'App/Services/PurpleAirService';
import MonitorValidator from 'App/Validators/MonitorValidator';
const PM_2=1,PM_10=2;
const MODEL_PURPLE='PURPLE_AIR'

export default class MonitorsController {

    public async showPurple({view}:HttpContextContract){

        const models=await Model.all()
        const sponsors=await Sponsor.all()
        const neighborhoods=await Neighborhood.all()
        
        const monitors=await Monitor.query()
        .whereHas('model', (query) => {
            query.where('name', 'PURPLE_AIR');
        })
        .preload('model')
        .preload('neighborhood')
        .preload('sponsors')
        .exec();

        let flag=false

        return view.render('admin/monitors_purple',{monitors,models,sponsors,neighborhoods,flag})
    }

    public async showFWOP({view}:HttpContextContract){

        const models=await Model.all()
        const sponsors=await Sponsor.all()
        const neighborhoods=await Neighborhood.all()

        let flag=false

        const monitors=await Monitor.query()
        .whereHas('model', (query) => {
            query.where('name', 'FWOP');
        })
        .preload('model')
        .preload('neighborhood')
        .preload('sponsors')
        .exec();

        return view.render('admin/monitors_fwop',{monitors,models,sponsors,neighborhoods,flag})
    }

    public async store({request,response}:HttpContextContract){

        await request.validate(MonitorValidator)

        const {slug,name,apikey,neighborhood_id,longitude, latitude,model_id, active,sponsors}=request.body();

        const neighborhood=await Neighborhood.findOrFail(parseInt(neighborhood_id, 10))
        const model=await Model.findOrFail(parseInt(model_id, 10))

        let activeMonitor=parseInt(active, 10)>0 ? true:false


        const monitor= await model.related('monitors').create({
            slug:parseInt(slug, 10),
            name:name,
            apikey:apikey,
            longitude:longitude,
            latitude:latitude,
            active: activeMonitor
        })

        await monitor.related('neighborhood').associate(neighborhood);


        if(sponsors!=null){
            if(typeof(sponsors)=="string"){
                const sponsor = await Sponsor.findOrFail(parseInt(sponsors, 10))
                await monitor.related('sponsors').attach([sponsor.id])
            }else{
                sponsors.forEach(async id  =>  {
                    const sponsor = await Sponsor.findOrFail(parseInt(id, 10))
                    await monitor.related('sponsors').attach([sponsor.id])
                });
            }
        }

        return response.redirect().back()
    }

    public async delete({response,params}:HttpContextContract){
        const monitor=await Monitor.findOrFail(params.id)
        await monitor.delete()

        return response.redirect().back()
    }

    public async active({request,response,params}:HttpContextContract){

        const {active}=request.body()
        const monitor=await Monitor.findOrFail(params.id)
        
        let acti = JSON.parse(active);

        monitor.active=acti ? false:true
        monitor.save()


        return response.redirect().back()
    }

    public async update({request,response,params}:HttpContextContract){

        const {slug,name,apikey,neighborhood_id,longitude, latitude,model_id, active,sponsors}=request.body();

        const neighborhood=await Neighborhood.findOrFail(parseInt(neighborhood_id, 10))

        const model=await Model.findOrFail(parseInt(model_id, 10))

        let activeMonitor=parseInt(active, 10)>0 ? true:false

        const monitor=await Monitor.findOrFail(params.id)

        await monitor.related('model').dissociate()
        await monitor.related('neighborhood').dissociate()
        await monitor.related('sponsors').detach()

        if( monitor.slug!=parseInt(slug, 10)){
            monitor.slug=parseInt(slug, 10)
        }
        
        monitor.name=name
        monitor.apikey=apikey
        monitor.longitude=longitude
        monitor.latitude=latitude
        monitor.active=activeMonitor

        await monitor.related('neighborhood').associate(neighborhood);
        await monitor.related('model').associate(model);

        if(sponsors!=null){
            if(typeof(sponsors)=="string"){
                const sponsor = await Sponsor.findOrFail(parseInt(sponsors, 10))
                await monitor.related('sponsors').attach([sponsor.id])
            }else{
                sponsors.forEach(async id  =>  {
                    const sponsor = await Sponsor.findOrFail(parseInt(id, 10))
                    await monitor.related('sponsors').attach([sponsor.id])
                });
            }
        }

        return response.redirect().back()

    }


    //public view
    public async showMap({view,auth}:HttpContextContract){
        
        return view.render('public/map_monitors')
    }

    public async bannerMonitor({view}:HttpContextContract){
       
       try {

        const purpleAirService = await new PurpleAirService(); 
        let monitors= await purpleAirService.queryCurrentBanner()

        let banners:{html:string,color:string,latitude:number,longitude:number}[]=[]
        monitors?.map(async monitor=>{
            let html=await view.render('partials/banner_monitor',{monitor})
            let element={
                html:html,
                color:monitor.color,
                latitude:monitor.monitor.latitude, 
                longitude: monitor.monitor.longitude
            }
            banners.push(element)
        })

            return banners
       } catch (error) {
        console.log(error)
       }
    }

    public async historics({view,params,response}:HttpContextContract){
        try{
            const slug=params.slug
            const monitor=await Monitor.findByOrFail('slug',slug)
            
            const monitors=await Monitor.query()
            .preload('model')
            .whereHas('model', (query) => {
                query.where('name', MODEL_PURPLE);
            })
            .where('active', true)
            .exec();


            if (!monitor.active) return response.redirect().toPath('/')
            

            const averages_all = await Datum.query()
            .select(
                Database.raw('DATE(created_at) as date'),
                Database.raw('HOUR(created_at) as hour'),
                Database.raw('ROUND(AVG(average), 2) as average'),
                'type_id'
            )
            .where('monitor_id', monitor.id)
            .whereIn('type_id', [PM_2,PM_10])
            .where('created_at', '>=', Database.raw('CURDATE() - INTERVAL 11 DAY'))
            .groupBy(['date', 'hour','type_id'])
            .orderBy('date', 'desc')
            .orderBy('hour', 'asc')

            let averages:{
                date:string;
                "PM_2.5":{[hour: string]: number }
                "PM_10":{[hour: string]: number }
            }[]=[]

            averages_all.forEach(result => {
                const date:string = format(new Date(result.$extras.date), 'dd/MM/yyyy');
                const hour:string= result.$extras.hour;
                const average:number = result.average;
                const typeId:number = result.type_id;

                let existingItem = averages.find(item => item.date === date);
                
                if (!existingItem) {
                    existingItem = { date, "PM_2.5": {}, "PM_10": {} };
                    averages.push(existingItem);
                }

                if (typeId == PM_2) {
                    existingItem["PM_2.5"][hour] = average;
                } else if (typeId == PM_10) {
                    existingItem.PM_10[hour] = average;
                }
            });

            return view.render('public/historics',{slug,monitor,averages,monitors})
        }catch(error){
            console.log(error)
        }
    }
}
