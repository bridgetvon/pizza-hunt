
const router = require('express').Router();

// const { route, get } = require('../html/html-routes');


const {
    getAllPizza,
    getPizzaById,
    createPizza,
    updatePizza,
    deletePizza
} = require('../../controllers/pizza-controllers');

//set up all get and post routes 
router 
    .route('/')
    .get(getAllPizza)
    .post(createPizza);


//set up get one put and delete at /api/pizzas/:id
router
    .route('/:id')
    .get(getPizzaById)
    .put(updatePizza)
    .delete(deletePizza);


module.exports = router;

