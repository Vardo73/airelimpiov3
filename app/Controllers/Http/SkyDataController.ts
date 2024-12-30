import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SkyDatum from 'App/Models/SkyDatum';
import FwopService from 'App/Services/FwopService';
import fs from 'fs'
import csv from 'csv-parser'
import xlsx from 'xlsx'
import Site from 'App/Models/Site';

export default class SkyDataController {

    public async show({view}:HttpContextContract){
        return view.render('admin/csv_sky')
    }

    public async readCsvSky({ request, response, session }: HttpContextContract) {
        try {
          // 1. Validar el archivo recibido
          const file = request.file('csvfileSky', {
            extnames: ['xlsx'], // Solo XLSX
            size: '5mb',
          })
    
          if (!file) {
            session.flash({ notification: { status: 'danger', message: 'Debe subir un archivo XLSX válido.' } })
            return response.redirect('back')
          }
    
          // Guardar el archivo temporalmente
          await file.moveToDisk('./uploads')
          const filePath = file.filePath!
    
          // Leer el archivo XLSX
          const workbook = xlsx.readFile(filePath)
          const sheetNames = workbook.SheetNames
    
          if (sheetNames.length < 2) {
            session.flash({ notification: { status: 'danger', message: 'El archivo debe contener dos hojas: SITIOS y REGISTROS.' } })
            return response.redirect('back')
          }
    
          // 2. Procesar la hoja "SITIOS"
          const sitiosSheet = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNames[0]])
          const sitios = sitiosSheet.map((row: any) => ({
            id: row['ID'],
            nombre: row['Nombre'],
            latitud: parseFloat(row['Latitud']),
            longitud: parseFloat(row['Longitud']),
            municipio: row['Municipio'],
          }))
    
          // 3. Guardar en la base de datos
          // Procesar Sitios
          for (const row of sitios) {
            const slug = String(row['id']).trim() // Slug basado en el ID del archivo
    
            // Verificar si el sitio ya existe
            let site = await Site.findBy('slug', slug)
            if (!site) {
              
                site = await Site.create({
                    name: row.nombre,
                    slug: slug,
                    latitude: row.latitud,  // Conversión segura
                    longitude: row.longitud,
                    municipality: row.municipio,
                })
            }
          }
          // 2. Procesar la hoja "REGISTROS"
          const registrosSheet = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNames[1]])
          const registros = registrosSheet.map((row: any) => ({
            id_sitio: row['id_sitio'],
            condiciones_climaticas: row['condiciones_climáticas'],
            temperatura: parseFloat(row['temperatura']),
            humedad: parseFloat(row['humedad']),
            visibilidad: parseInt(row['visibilidad']),
            magnitud_visual_al_cenit: parseFloat(row['magnitud_visual_al_cenit']),
            distancia_angular: parseFloat(row['distancia_angular_del_cenit_con_el_ecuador_celeste']),
            magnitud_norte: parseFloat(row['magnitud_visual_al_norte']),
            magnitud_este: parseFloat(row['magnitud_visual_al_este']),
            magnitud_sur: parseFloat(row['magnitud_visual_al_sur']),
            magnitud_oeste: parseFloat(row['magnitud_visual_al_oeste']),
            observadores: row['observadores'],
            escala_bortle: parseInt(row['escala_de_bortle']),
            sqm_l: parseInt(row['número_de_sqm-l']),
            altitud: parseFloat(row['altitud']),
          }))

          // 3. Guardar en la base de datos
          // Procesar Sitios
          for (const row of registros) {
            const slug = String(row['id_sitio']).trim() // Slug basado en el ID del archivo
    
            // Verificar si el sitio ya existe
            let site = await Site.findBy('slug', slug)

            if (!site) {
                continue
            }

            await SkyDatum.create({
                site_id: site.id,
                weather_conditions: row['condiciones_climaticas'],
                temperature: row['temperatura'],
                humidity: row['humedad'],
                visibility: row['visibilidad'],
                zenith_visual_magnitude: row['magnitud_visual_al_cenit'],
                zenith_equatorial_angular_distance: row['distancia_angular'],
                north_visual_magnitude: row['magnitud_norte'],
                east_visual_magnitude: row['magnitud_este'],
                south_visual_magnitude: row['magnitud_sur'],
                west_visual_magnitude: row['magnitud_oeste'],
                observers: row['observadores'],
                bortle_scale: row['escala_bortle'],
                sqm_l_number: row['sqm_l-l'],
                altitude: row['altitud'],
            })
          }
          // 4. Confirmar éxito
          session.flash({ notification: { status: 'success', message: 'Datos guardados correctamente.' } })
          return response.redirect('back')
    
        } catch (error) {
          console.error(error)
          session.flash({ notification: { status: 'errorCatch', message: `Error al procesar el archivo.: ${error.message}` } })
          return response.redirect('back')
        }
    }
    
}
