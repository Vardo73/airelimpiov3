import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Model from 'App/Models/Model';
import Sponsor from 'App/Models/Sponsor';
import Station from 'App/Models/Station';
import WeatherUndergroundService from 'App/Services/WeatherUndergroundService';
import StationValidator from 'App/Validators/StationValidator';

export default class StationsController {

    
    public async show({view}:HttpContextContract){
        const models=await Model.all()
        const sponsors=await Sponsor.all()

        
        const stations=await Station.query()
        .whereHas('model', (query) => {
            query.where('name', 'WEATHER_UNDEGROUND');
        })
        .preload('model')
        .preload('sponsors')
        .exec();

        let flag=false
        return view.render('admin/station',{models, sponsors,stations,flag})
    }

    public async store({request,response}:HttpContextContract){

        await request.validate(StationValidator)

        const {slug,name,longitude, latitude,model_id,sponsors}=request.body();

        const model=await Model.findOrFail(parseInt(model_id, 10))

        const station= await model.related('stations').create({
            slug:slug,
            name:name,
            longitude:longitude,
            latitude:latitude
        })


        if(sponsors!=null){
            if(typeof(sponsors)=="string"){
                const sponsor = await Sponsor.findOrFail(parseInt(sponsors, 10))
                await station.related('sponsors').attach([sponsor.id])
            }else{
                sponsors.forEach(async id  =>  {
                    const sponsor = await Sponsor.findOrFail(parseInt(id, 10))
                    await station.related('sponsors').attach([sponsor.id])
                });
            }
        }

        return response.redirect().back()
    }

    public async delete({response,params}:HttpContextContract){
        const station=await Station.findOrFail(params.id)
        await station.delete()

        return response.redirect().back()
    }

    public async update({request,response,params}:HttpContextContract){

        const {slug,name,longitude, latitude,model_id,sponsors}=request.body();

        const model=await Model.findOrFail(parseInt(model_id, 10))
        const station=await Station.findOrFail(params.id)

        await station.related('model').dissociate()
        await station.related('sponsors').detach()

        if( station.slug!=slug){
            station.slug=slug
        }
        
        station.name=name
        station.longitude=longitude
        station.latitude=latitude

        await station.related('model').associate(model);

        if(sponsors!=null){
            if(typeof(sponsors)=="string"){
                const sponsor = await Sponsor.findOrFail(parseInt(sponsors, 10))
                await station.related('sponsors').attach([sponsor.id])
            }else{
                sponsors.forEach(async id  =>  {
                    const sponsor = await Sponsor.findOrFail(parseInt(id, 10))
                    await station.related('sponsors').attach([sponsor.id])
                });
            }
        }

        return response.redirect().back()
    }


    //public view
    public async showMap({view}:HttpContextContract){
        return view.render('public/map_stations')
    }


    public async bannerStation({view}:HttpContextContract){
        try {
            const weatherUndergroundService = await new WeatherUndergroundService(); 
            let stations= await weatherUndergroundService.queryCurrentBanner()
 
            let banners:{html:string, latitude:number,longitude:number}[]=[]
            stations?.map(async station=>{
                let html=await view.render('partials/banner_station',{station})
                let element={
                    html:html,
                    latitude:station.station.latitude, 
                    longitude: station.station.longitude
                }
                banners.push(element)
            })
            return banners
        } catch (error) {
         console.log(error)
        }
    }
}