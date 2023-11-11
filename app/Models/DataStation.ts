import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo} from '@ioc:Adonis/Lucid/Orm'
import Station from './Station'

export default class DataStation extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public station_id:'required|exists:stations,id' 

  @column()
  public solarRadiation:number 

  @column()
  public uv:number 

  @column()
  public winddir:number 

  @column()
  public humidity:number 

  @column()
  public temp:number 

  @column()
  public dewpt:number 

  @column()
  public windSpeed:number 

  @column()
  public windGust:number 

  @column()
  public pressure:number 

  @column()
  public precipRate:number 

  @column()
  public precipTotal:number 

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime


  @belongsTo(()=> Station)
  public station: BelongsTo<typeof Station>


}
