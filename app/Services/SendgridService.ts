import nodemailer from 'nodemailer'
import nodemailerSendgrid from 'nodemailer-sendgrid'
import View from '@ioc:Adonis/Core/View'
import Env from '@ioc:Adonis/Core/Env'
import { ReportEmail } from 'App/Interfaces/PurpleAirInterface';
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

    public async sendEmailReport(data:ReportEmail[]){
        try {
            const view = View.getRenderer()
            const transporter= this.createTrans()
            const date=this.dateYesterday()
            await transporter.sendMail({
                from:'"Sistemas" <sistemas@cerca.org.mx>',
                to:"salud.calidadambiental@cerca.org.mx, comunicacion@cerca.org.mx",
                subject:"Promedios diarios",
                html: await view.render('partials/email_report',{data,date})
            })
        } catch (error) {
            console.log('ERROR sendMail REPORTE DIARIO')
            console.log(error)
        }
    }

    private dateYesterday(): string {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
    
        const day = yesterday.getDate().toString().padStart(2, '0');
        const month = (yesterday.getMonth() + 1).toString().padStart(2, '0'); 
        const year = yesterday.getFullYear();
    
        return `${day}/${month}/${year}`;
    }
}