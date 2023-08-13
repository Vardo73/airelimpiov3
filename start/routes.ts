import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async ({ view }) => {
  return view.render('public/map_stations')
}).as('map')

//View
Route.get('pollutant','PollutantsController.show')
Route.get('sponsor','SponsorsController.show')
Route.get('clinic','ClinicsController.show')


Route.group(()=>{
  Route.post('store','RolsController.store')
  Route.delete('delete','RolsController.delete')
  Route.get('all','RolsController.show')
}).prefix('rol')

Route.group(()=>{
  Route.post('store','TypesController.store').as('store_type')
  Route.delete('/:id','TypesController.delete')
  Route.get('all','TypesController.show')
}).prefix('type')

Route.group(()=>{
  Route.post('store','PollutantsController.store').as('store_pollutant')
  Route.delete('delete/:id','PollutantsController.delete').as('delete_pollutant')
  Route.patch('update/:id','PollutantsController.update').as('update_pollutant')
}).prefix('pollutant')


Route.group(()=>{
  Route.post('store','SponsorsController.store').as('store_sponsor')
  Route.delete('delete/:id','SponsorsController.delete').as('delete_sponsor')
  Route.patch('update/:id','SponsorsController.update').as('update_sponsor')
}).prefix('sponsor')


Route.group(()=>{
  Route.post('store','ClinicsController.store').as('store_clinic')
  Route.delete('delete/:id','ClinicsController.delete').as('delete_clinic')
  Route.patch('update/:id','ClinicsController.update').as('update_clinic')
}).prefix('clinic')