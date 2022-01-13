const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const PizzaSchema = new Schema({
    pizzaName: {
        type: String,
        //require makes it so data must exist for the field 
        required: 'You need to provide a name!',
        trim: true
    },
    createdBy: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        //use a mongoose getter 
        //getters transform the data by default everytime it is queried 
        get: (createdAtVal) => dateFormat(createdAtVal)
    },
    size: {
        type: String,
        required: true,
        //enum: enumerable- a set of data that can be iterated over 
        //we provide an array of options this size field can accept 
        enum: ['Personal', 'Small', 'Medium', 'Large', 'Extra Large'],
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
        getters: true
    },
    id: false
}
);

//aDD A VIRTUAL- allow us to add more info to a database response so we dont add info manually with a helper 
//this is in pizza because we only care about comment sin relation to pizza
//virtuals let you add virtual properties to a document that arent stored in the database
PizzaSchema.virtual('commentCount').get(function() {
    //include all replies in comment count 
    //use reduce method to tally up the total of every comment with its replies
    //In its basic form, .reduce() takes two parameters, an accumulator and a currentValue. Here, the accumulator is total, and the currentValue is comment. As .reduce() walks through the array, it passes the accumulating total and the current value of comment into the function, with the return of the function revising the total for the next iteration through the array
    return this.comments.reduce((total, comment) => total + comment.replies.length +1, 0);
});



//create the pizza model using the pizzaschame
const Pizza = model('Pizza', PizzaSchema);

//export the model 
module.exports = Pizza;