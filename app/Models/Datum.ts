import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo} from '@ioc:Adonis/Lucid/Orm'
import Type from './Type'
import Monitor from './Monitor'

export default class Datum extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public type_id: 'required|exists:types,id'

  @column()
  public monitor_id: 'required|exists:monitors,id'

  @column()
  public average:number 

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime


  //relationships
  @belongsTo(() => Type)
  public type:BelongsTo<typeof Type>


  @belongsTo(()=> Monitor)
  public monitor: BelongsTo<typeof Monitor>
}
