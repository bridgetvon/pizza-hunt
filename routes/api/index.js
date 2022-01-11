//import all of the api routes to prefix their endpoint names and package them 

const router = require('express').Router();
const pizzaRoutes = require('./pizza-routes');
const commentRoutes = require('./comment-routes');

//add prefix of /pizzas to routes created in pizza-routes
router.use('/pizzas', pizzaRoutes);
router.use('/comments', commentRoutes);

module.exports = router;
