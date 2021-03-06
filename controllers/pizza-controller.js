const { Pizza } = require('../models');

const pizzaController = {
    //the functions will go here as methods
    //get all pizzas
    getAllPizza(req, res) {
        Pizza.find({})
          .populate({
            //use the select option inside populate to tell mongoose we dont care about the __v field on comments 
            //the minus sign in front of the v indicates we dont want it returned 
            path: 'comments',
            select: '-__v'
          })
          .select('-__v')
          .sort({ _id: -1 })
        .then(dbPizzaData => res.json(dbPizzaData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
      },
    
      // get one pizza by id
      getPizzaById({ params }, res) {
        Pizza.findOne({ _id: params.id })
        .populate({
            path: 'comments',
            select: '-__v'
        })
        .select('-__v')
          .then(dbPizzaData => {
              if(!dbPizzaData) {
                  res.status(404).json({ message: 'No pizza with this id!'});
                  return;
              }
            res.json(dbPizzaData);
          })
          .catch(err => {
            console.log(err);
            res.sendStatus(400);
          });
      },
    
      // createPizza
      createPizza({ body }, res) {
        Pizza.create(body)
          .then(dbPizzaData => res.json(dbPizzaData))
          .catch(err => res.json(err));
      },
    
      // update pizza by id
      updatePizza({ params, body }, res) {
        //add validators so updated pizzas are validated and not just new pizzas 
        Pizza.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true  })
          .then(dbPizzaData => {
            if (!dbPizzaData) {
              res.status(404).json({ message: 'No pizza found with this id!' });
              return;
            }
            res.json(dbPizzaData);
          })
          .catch(err => res.status(400).json(err));
      },
    
      // delete pizza
      deletePizza({ params }, res) {
        Pizza.findOneAndDelete({ _id: params.id })
          .then(dbPizzaData => {
            if (!dbPizzaData) {
              res.status(404).json({ message: 'No pizza found with this id!' });
              return;
            }
            res.json(dbPizzaData);
          })
          .catch(err => res.status(400).json(err));
      }
    };
    
module.exports = pizzaController;
