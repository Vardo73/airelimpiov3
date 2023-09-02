import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo} from '@ioc:Adonis/Lucid/Orm'
import Type from './Type'
import Station from './Station'

export default class Datum extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public type_id: 'required|exists:types,id'

  @column()
  public station_id: 'required|exists:stations,id'

  @column()
  public average:number 

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime


  //relationships
  @belongsTo(() => Type)
  public type:BelongsTo<typeof Type>


  @belongsTo(()=> Station)
  public station: BelongsTo<typeof Station>
}
