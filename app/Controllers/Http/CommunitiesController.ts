import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Community from 'App/Models/Community';
import Locality from 'App/Models/Locality';
import CommunityValidator from 'App/Validators/CommunityValidator';

export default class CommunitiesController {

    public async show({view}:HttpContextContract){
        const localities=await Locality.all()

        const communities=await Community.query()
        .preload('locality')
        .exec();

        return view.render('admin/community',{communities,localities})
    }

    public async store({request,response}:HttpContextContract){

        console.log(request.body())

        await request.validate(CommunityValidator)

        const {locality_id,name,population,municipality,photos_link,electrical_network,longitude, latitude}=request.body();

        const locality=await Locality.findOrFail(parseInt(locality_id, 10))

        let activeCommunity=parseInt(electrical_network, 10)>0 ? true:false


        await locality.related('communities').create({
            name:name,
            population:population,
            municipality:municipality,
            photos_link:photos_link,
            longitude:longitude,
            latitude:latitude,
            electrical_network: activeCommunity
        })


        return response.redirect().back()
    }

    public async delete({response,params}:HttpContextContract){
        const community=await Community.findOrFail(params.id)
        await community.delete()

        return response.redirect().back()
    }

    public async active({request,response,params}:HttpContextContract){

        const {active}=request.body()
        const community=await Community.findOrFail(params.id)
        
        let acti = JSON.parse(active);

        community.electrical_network=acti ? false:true
        community.save()


        return response.redirect().back()
    }

    public async update({request,response,params}:HttpContextContract){

        const {locality_id,name,population,municipality,photos_link,electrical_network,longitude, latitude}=request.body();

        const locality=await Locality.findOrFail(parseInt(locality_id, 10))

        let activeCommunity=parseInt(electrical_network, 10)>0 ? true:false

        const community=await Community.findOrFail(params.id)

        await community.related('locality').dissociate()
        
        community.name=name
        community.population=population
        community.municipality=municipality
        community.photos_link=photos_link
        community.longitude=longitude
        community.latitude=latitude
        community.electrical_network=activeCommunity

        await community.related('locality').associate(locality);

        return response.redirect().back()

    }

    //public view
    public async showMap({view}:HttpContextContract){
        return view.render('public/map_communities')
    }

    public async bannerCommunity({view}:HttpContextContract){
        try{
            let communities= await Community.query()
            .preload('locality')
            .exec();

            let banners:{html:string,community:Community,latitude:number,longitude:number, active: boolean}[]=[]
            communities?.map(async community=>{
                let html=await view.render('partials/banner_community',{community})
                let element={
                    html:html,
                    community:community,
                    latitude:community.latitude, 
                    longitude: community.longitude,
                    active: community.electrical_network
                }
                banners.push(element)
            })
            return banners
        } catch (error) {
        console.log(error)
       }
    }
}
