import Route from '@ioc:Adonis/Core/Route'

//View
Route.get('/', async ({ view }) => {
  return view.render('public/map_stations')
}).as('map')
//Public
Route.get('register','UsersController.register').as('register')
//Admin
Route.get('pollutants','PollutantsController.show').as('pollutants')
Route.get('sponsors','SponsorsController.show').as('sponsors')
Route.get('clinics','ClinicsController.show').as('clinics')
Route.get('models','ModelsController.show').as('models')
Route.get('neighborhoods','NeighborhoodsController.show').as('neighborhoods')
Route.get('ailments','AilmentsController.show').as('ailments')
Route.get('monitors','MonitorsController.showPurple').as('monitors_purple')
Route.get('stations','StationsController.show').as('stations')
Route.get('ailments_clinic/:id','AilmentsController.showAilments').as('ailments_clinic')


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
  Route.post('add_ailments/:id','ClinicsController.addAilments').as('add_ailments')
  Route.delete('delete/:id','ClinicsController.delete').as('delete_clinic')
  Route.delete('delete_ailments_year/:id/:year','ClinicsController.deleteAilmentsYear').as('delete_ailments_year')
  Route.patch('update/:id','ClinicsController.update').as('update_clinic')
}).prefix('clinic')


Route.group(()=>{
  Route.post('store','UsersController.store').as('store_user')
  Route.delete('delete/:id','UsersController.delete').as('delete_user')
  Route.patch('update/:id','UsersController.update').as('update_user')
}).prefix('user')


Route.group(()=>{
  Route.post('store','ModelsController.store').as('store_model')
  Route.delete('delete/:id','ModelsController.delete').as('delete_model')
  Route.patch('update/:id','ModelsController.update').as('update_model')
}).prefix('model')

Route.group(()=>{
  Route.post('store','AilmentsController.store').as('store_ailment')
  Route.delete('delete/:id','AilmentsController.delete').as('delete_ailment')
  Route.patch('update/:id','AilmentsController.update').as('update_ailment')
}).prefix('ailment')

Route.group(()=>{
  Route.post('store','NeighborhoodsController.store').as('store_neighborhoods')
  Route.delete('delete/:id','NeighborhoodsController.delete').as('delete_neighborhoods')
  Route.patch('update/:id','NeighborhoodsController.update').as('update_neighborhoods')
}).prefix('neighborhood')