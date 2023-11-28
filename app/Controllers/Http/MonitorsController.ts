import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Model from 'App/Models/Model';
import Monitor from 'App/Models/Monitor';
import Neighborhood from 'App/Models/Neighborhood';
import Sponsor from 'App/Models/Sponsor';
import PurpleAirService from 'App/Services/PurpleAirService';
import MonitorValidator from 'App/Validators/MonitorValidator';

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

        //await request.validate(MonitorValidator)

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

    public async showMap({view}:HttpContextContract){
        return view.render('public/map_monitors')
    }

    public async bannerMonitor({view}:HttpContextContract){
       
       try {

        const purpleAirService = await new PurpleAirService(); 
        let monitors= await purpleAirService.queryCurrentAll()


            let banners:{html:any,latitude:number,longitude:number}[]=[]
            monitors?.map(async monitor=>{
                let html=await view.render('partials/banner_monitor',{monitor})
                let element={
                    html:html, 
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
}
