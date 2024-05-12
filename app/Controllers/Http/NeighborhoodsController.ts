import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Neighborhood from "App/Models/Neighborhood";
import Pollutant from 'App/Models/Pollutant';
import NeighborhoodValidator from 'App/Validators/NeighborhoodValidator';

export default class NeighborhoodsController {
    public async show({view}:HttpContextContract){
        const neighborhoods=await Neighborhood.query()
        .preload('pollutants') 
        .exec();
        const pollutants=await Pollutant.all()
        let flag=false
        return view.render('admin/neighborhood',{neighborhoods,pollutants,flag})
    }

    public async store({request,response}:HttpContextContract){
        const {name,city,longitude, latitude, pollutants}=request.body()

        console.log(request.body())

        await request.validate(NeighborhoodValidator)

        const neighborhood=await Neighborhood.create({
            name:name,
            city:city,
            longitude:longitude,
            latitude:latitude
        })
        if(pollutants!=null){
            if (typeof(pollutants) =='string') {
                const pollutant = await Pollutant.findOrFail(parseInt(pollutants, 10))
                await neighborhood.related('pollutants').attach([pollutant.id])
            }else{
                pollutants.forEach(async id  =>  {
                    const pollutant = await Pollutant.findOrFail(parseInt(id, 10))
                    await neighborhood.related('pollutants').attach([pollutant.id])
                });
            }
        }
        return response.redirect().back()
    }

    public async update({request,response,params}:HttpContextContract){

        const {name,city,longitude, latitude, pollutants}=request.body()
        await request.validate(NeighborhoodValidator)

        const neighborhood = await Neighborhood.findOrFail(params.id)
        await neighborhood.load('pollutants')
        neighborhood.name=name
        neighborhood.city=city
        neighborhood.longitude=longitude
        neighborhood.latitude=latitude

        await neighborhood.related('pollutants').detach()
        if(pollutants!=null){
            if (typeof(pollutants) =='string') {
                const pollutant = await Pollutant.findOrFail(parseInt(pollutants, 10))
                await neighborhood.related('pollutants').attach([pollutant.id])
            }else{
                pollutants.forEach(async id  =>  {
                    const pollutant = await Pollutant.findOrFail(parseInt(id, 10))
                    await neighborhood.related('pollutants').attach([pollutant.id])
                });
            }
        }

        await neighborhood.save();

        return response.redirect().back()
    }

    public async delete({response,params}:HttpContextContract){
        const neighborhood=await Neighborhood.findOrFail(params.id)
        await neighborhood.delete()

        return response.redirect().back()
    }

    //public view
    public async showMap({view}:HttpContextContract){

        return view.render('public/map_neighborhoods')
    }

    public async bannerNeighborhood({view}:HttpContextContract){
      
        try {

            const neighborhoods = await Neighborhood.query()
            .preload('pollutants')
            .exec();

            //console.log(neighborhoods[0].pollutants)

            let banners:{html:any,latitude:number,longitude:number}[]=[]

            await neighborhoods.forEach(async neighborhood=>{
                let html=await view.render('partials/banner_neighborhood',{neighborhood})

                 let element={
                     html:html, 
                     latitude:neighborhood.latitude, 
                     longitude: neighborhood.longitude
                 }
                 banners.push(element)
            })
             return banners
        } catch (error) {
         console.log(error)
        }
    }
}
