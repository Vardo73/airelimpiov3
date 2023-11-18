import { schema, CustomMessages,rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class MonitorValidator {
  constructor(protected ctx: HttpContextContract) {}
  public schema = schema.create({
    slug:schema.number([
      rules.unique({ table: 'monitors', column: 'slug' })
    ]),
    name:schema.string({},[
        rules.minLength(4),
        rules.maxLength(25)
    ]),
    apikey:schema.string.optional([
        rules.alphaNum(),
        rules.unique({ table: 'monitors', column: 'apikey' }),
    ]),
    neighborhood_id:schema.number(),
    longitude:schema.number(),
    latitude:schema.number(),
    model_id:schema.number(),
    active:schema.number()
  })
  public messages: CustomMessages = {
    required:'El campo {{field}} es requerido para registrar el contaminante.',
    minLength:'Campo {{field}} muy corto.(min {{options.minLength}} caracteres)',
    maxLength:'Campo {{field}} muy largo.(max {{options.maxLength}} caracteres)',
    number:'Dato {{field}} no son de tipo {{options.number}}',
    unique:'Ya se encuentra registrado un elemento con el mismo valor para {{field}}'
  }
}
