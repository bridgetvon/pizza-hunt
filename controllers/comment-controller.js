const { Comment, Pizza } = require('../models');

const commentController = {
//when we create a comment it does not standalone, it belongs to pizza 
//we need to know what pizza it belongs to 
addComment({ params, body }, res ) {
    console.log(body);
    Comment.create(body)
    .then(({ _id }) => {
        return Pizza.findOneAndUpdate(
            { _id: params.pizzaId },
            //push method adds to the array 
            { $push: { comments: _id } },
            { new: true }
        );
    })
    //also return the pizza promise here so we can do something with the results of the mongoose operation 
    //because we passed the option of new true we receive the updated pizza
    .then(dbPizzaData => {
        if (!dbPizzaData) {
            res.status(404).json({ message: 'No pizza found with this id!'});
            return;
        }
        res.json(dbPizzaData);
    })
    .catch(err => res.json(err));
},
        

    

 removeComment({ params }, res) {
     //deletes the document while returning the data
     Comment.findOneAndDelete({ _id: params.commentId})
     .then(deletedComment => {
         if (!deletedComment) {
             return res.status(404).json({ message: 'No comment with this id'});
         }
         return Pizza.findOneAndUpdate(
             { _id: params.pizzaId },
             //pull removes from associated pizza
             { $pull: { comments: params.commentId } },
             { new: true }
         );
     })
     .then(dbPizzaData => {
        if( !dbPizzaData) {
            res.status(404).json({ message: 'No pizza with that id!'});
            return;
        }
        res.json(dbPizzaData);
     })
     .catch(err => res.json(err));
}
};



module.exports = commentController;
