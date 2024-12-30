import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Site from 'App/Models/Site';
import SkyDatum from 'App/Models/SkyDatum';
import SiteValidator from 'App/Validators/SiteValidator';

export default class SitesController {

    public async show({view}:HttpContextContract){
        const sites=await Site.all()
        return view.render('admin/sites',{sites})
    }

    public async store({request,response}:HttpContextContract){

        await request.validate(SiteValidator)

        const {name, slug,longitude, latitude,municipality}=request.body();

        await Site.create({
            name:name,
            slug:slug,
            longitude:longitude,
            latitude:latitude,
            municipality:municipality
        });

       return response.redirect().back();
    }

    public async update({request,response,params}:HttpContextContract){
        await request.validate(SiteValidator)

        const {name, slug,longitude, latitude,municipality}=request.body();

        const site = await Site.findOrFail(params.id)
        site.name=name
        site.slug=slug
        site.longitude=longitude
        site.latitude=latitude
        site.municipality=municipality

        await site.save();

        return response.redirect().back();

    }

    public async delete({response,params}:HttpContextContract){
        const site=await Site.findOrFail(params.id)
        await site.delete()

        return response.redirect().back();
    }

    //public view
    public async showMap({view}:HttpContextContract){
        return view.render('public/map_sky')
    }

    public async bannerSite({ view }: HttpContextContract) {
        try {
            // Consulta principal
            const sites = await Site.query().exec();
    
            // Crear un array de promesas para procesar los banners
            const banners = await Promise.all(sites.map(async (site) => {
                // Obtener datos asociados al sitio
                const value = await SkyDatum.query()
                    .where('id', '=', site.$attributes.id)
                    .orderBy('created_at', 'desc')
                    .first();
    
                // Renderizar la plantilla HTML
                const html = await view.render('partials/banner_sky', { site, value });
    
                // Devolver el objeto con los valores requeridos
                return {
                    html: html,
                    latitude: site.$attributes.latitude,
                    longitude: site.$attributes.longitude
                };
            }));
    
            // Retornar todos los banners
            return banners;
    
        } catch (error) {
            console.log(error);
            throw error; // Re-lanza el error para ser manejado externamente
        }
    }
}
