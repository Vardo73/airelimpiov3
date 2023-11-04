import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, belongsTo, BelongsTo, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import Rol from './Rol'
import Monitor from './Monitor'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public username:string

  @column()
  public rol_id: 'required|exists:rols,id'

  @column()
  public name:string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  //relationships
  @belongsTo(() => Rol)
  public rol:BelongsTo<typeof Rol>

  @manyToMany(()=> Monitor,{
    pivotTable:'user_monitors'
  })

  public monitors: ManyToMany<typeof Monitor>
}
