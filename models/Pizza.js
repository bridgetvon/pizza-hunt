const { Schema, model } = require('mongoose');

const PizzaSchema = new Schema({
    pizzaName: {
        type: String
    },
    createdBy: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    size: {
        type: String,
        default: 'Large'
    },
    toppings: [],
    comments: [
        {
            //tell mongoose to expect an object id and that the data comes from the comment model 
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
},
{
    toJSON: {
        virtuals: true,
    },
    id: false
}
);

//aDD A VIRTUAL- allow us to add more info to a database response so we dont add info manually with a helper 
//this is in pizza because we only care about comment sin relation to pizza
//virtuals let you add virtual properties to a document that arent stored in the database
PizzaSchema.virtual('commentCount').get(function() {
    return this.comments.length;
});



//create the pizza model using the pizzaschame
const Pizza = model('Pizza', PizzaSchema);

//export the model 
module.exports = Pizza;