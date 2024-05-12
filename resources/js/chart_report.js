import AppGlobal from './app.js'
const services=new AppGlobal()

let dataFromHTML = window.data
let canvasPiePM2_5=document.getElementById('piePM2')
let canvasPiePM10=document.getElementById('piePM10')
let canvasLimPM2_5=document.getElementById('limitsPM2')
let canvasLimPM10=document.getElementById('limitsPM10')

let dataJson=services.decodeData(dataFromHTML)

let average_PM2 = dataJson.map(objet => objet.average_type_1);
let average_PM10 = dataJson.map(objet => objet.average_type_2);
let date = dataJson.map(objet => objet.created_date);
 
services.pieChart(canvasPiePM2_5,average_PM2,services.LIM_NOM_PM2,services.LIM_OMS_PM2,'PM 2.5')
services.pieChart(canvasPiePM10,average_PM10,services.LIM_NOM_PM10,services.LIM_OMS_PM10,'PM 10')

services.limitsChart(canvasLimPM2_5,average_PM2,services.LIM_NOM_PM2,services.LIM_OMS_PM2,'PM 2.5',date)
services.limitsChart(canvasLimPM10,average_PM10,services.LIM_NOM_PM10,services.LIM_OMS_PM10,'PM 10',date)


