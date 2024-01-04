import nodemailer from 'nodemailer'
import nodemailerSendgrid from 'nodemailer-sendgrid'
import View from '@ioc:Adonis/Core/View'
import Env from '@ioc:Adonis/Core/Env'
export default class SendgridService{


    private createTrans(){

        //TRANSPORTER MAILTRAP
        /*const transport = nodemailer.createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "62a0b1ec7673aa",
              pass: "6fffa4e520fe89"
            }
        });*/

        //TRANSPORTER SENDGRID
        const transport = nodemailer.createTransport(
            nodemailerSendgrid({
                apiKey:Env.get('SENDGRID_API_KEY')
            })
        );

        return transport;
    }


    public async sendEmailUsers(subs:string[]){
        try {
            const view = View.getRenderer()
            const transporter= this.createTrans()
            await transporter.sendMail({
                from:'"Sistemas" <sistemas@cerca.org.mx>',
                to:subs.toString(),
                subject:"Alerta!! Lecturas altas en monitoreo del aire",
                html: await view.render('partials/email_users')
            })
        } catch (error) {
            console.log('ERROR sendMail Users')
            console.log(error)
        }
    }
}