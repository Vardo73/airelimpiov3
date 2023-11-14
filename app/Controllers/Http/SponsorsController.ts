import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SponsorValidator from 'App/Validators/SponsorValidator';
import Sponsor from 'App/Models/Sponsor';
import multer from 'multer'
import fs from 'fs'

const storage=multer.diskStorage({
    destination:(req, file, cb)=>{
        cb(null,'public/uploads');
    },
    filename:(req, file, cb)=>{
        const uniqueSuffix=Date.now()+'-'+Math.round(Math.random()* 1E9);
        cb(null, file.fieldname+'-'+uniqueSuffix+'-'+file.originalname.split('.').pop())
    }
});

multer({storage:storage});


export default class SponsorsController {

    public async show({view}:HttpContextContract){
        const sponsors=await Sponsor.query()
        .orderBy('id', 'asc');
        return view.render('admin/sponsor',{sponsors});
    }


    public async store({request,response}:HttpContextContract){
        

        await request.validate(SponsorValidator)
        const logo=request.file('logo')
        const {name}=request.body();

        await logo?.move('public/uploads')


        const urlLogo=`uploads/${logo?.fileName}`
    
        console.log(urlLogo)
        await Sponsor.create({
            name:name,
            logo:urlLogo
        });
    
        return response.redirect().back();
    }

    
    public async update({request,response,params}:HttpContextContract){
        await request.validate(SponsorValidator)
        const logo=request.file('logo')
        const {name}=request.body();

        await logo?.move('public/uploads')

        const urlLogo=`uploads/${logo?.fileName}`

        const sponsor = await Sponsor.findOrFail(params.id)
        sponsor.name=name
        sponsor.logo=urlLogo

        await sponsor.save();

        return response.redirect().back();

    }

    public async delete({response,params}:HttpContextContract){
        const sponsor=await Sponsor.findOrFail(params.id)

        fs.unlinkSync(`public/${sponsor.logo}`)
        await sponsor.delete()

        return response.redirect().back();
    }

}
