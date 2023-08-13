import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    rol:schema.number(),

    username:schema.string({},[
      rules.minLength(4),
      rules.maxLength(25)
    ]),
    name:schema.string({},[
      rules.minLength(4),
      rules.maxLength(25)
    ]),
    email:schema.string({},[
      rules.email(),
      rules.unique({table:'users',column:'email'})
    ]),
    password:schema.string({},[
      rules.alphaNum()
    ])
  })
  public messages: CustomMessages = {
    required:'El campo {{field}} es requerido para registrar el contaminante.',
    minLength:'Campo {{field}} muy corto.(min {{options.minLength}} caracteres)',
    maxLength:'Campo {{field}} muy largo.(max {{options.maxLength}} caracteres)',
    email:'Campo {{field}} no cuenta con el formato correcto de correo electrónico',
    unique:'Ya existe una cuenta registrada con este correo'
  }
}
