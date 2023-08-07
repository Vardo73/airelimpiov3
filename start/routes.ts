import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async ({ view }) => {
  return view.render('public/map_stations')
})

//View
Route.post('pollutant','PollutantsController.show')


Route.group(()=>{
  Route.post('store','RolsController.store')
  Route.delete('delete','RolsController.delete')
  Route.get('all','RolsController.show')
}).prefix('rol')

Route.group(()=>{
  Route.post('store','TypesController.store').as('new_type')
  Route.delete('/:id','TypesController.delete')
  Route.get('all','TypesController.show')
}).prefix('type')

Route.group(()=>{
  Route.post('store','PollutantsController.store').as('new_pollutant')
  Route.delete('/:id','PollutantsController.delete').as('delete_pollutant')
  Route.get('all','PollutantsController.all')
  Route.put(':id','PollutantsController.edit').as('edit_pollutant')
}).prefix('pollutant')
