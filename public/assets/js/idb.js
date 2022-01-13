const { response } = require("express");
const { Pizza } = require("../../../models");
const { get } = require("../../../routes");

//create variable to hold db connection 
let db;
//establish connection to indexdb database called pizza_hunt and set it to version 1
//act as an event listener for the database 
//the open method takes two parameters
//1. the name of the indexeddb database youd like to create
//2. the version of the database, by default we start at one  
const request = indexedDB.open('pizza_hunt', 1);

//create the object store- the container that stores the data 
//emit event if database version changes 
request.onupgradeneeded = function (event) {
    //save a reference to the database 
    const db = event.target.result;
    //create an object store (table) called new_pizza, set it to have an auto incrementing primary key 
    db.createObjectsStore('new_pizza', {autoIncrement: true});
};

//upon a successful 
request.onsuccess = function(event) {
    //when db is successfully created with its object store (from onupgradeneeded above) or simply established a connection, save reference to global variable 
    db = event.target.result;


    //check if app is online, if yes then run uploadpizza()to send all local data to api
    if(navigator.onLine) {
        //uploadPizza();
    }
};

request.onerror = function(event) {
    console.log(event.target.errorCode);
};

//this function will xecute if we attempt to submit a new pizza with no connection 
//it is used if the fetch functions catch method is executed
function saveRecord(record) {
    //open a new transaction with the database with read and write permissions
    //transaction- temporary connection to the database 
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    //access the object store for new_pizza
    const pizzaObjectStore = transaction.objectStore('new_pizza');

    //add record to your store with add method 
    pizzaObjectStore.add(record);
};

function uploadPizza() {
    //open a transaction on your db 
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    //access your object store 
    const pizzaObjectStore = transaction.objectStore('new_pizza');

    //get al records from store and set to a variable 
    //getall is an asynch function 
    const getAll = pizzaObjectStore.getAll();

    //upon a successful .getAll() execution run this function 
    getAll.onsuccess = function () {
        //if there is data in indexed dbs store send it to the api server 
        if(getAll.result.length > 0) {
            fetch('/api/pizzas', {
                method: POST,
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(serverResponse => {
                if (serverResponse.message) {
                    throw new Error(serverResponse);
                }
                //open one more transaction 
                const transaction = db.transaction(['new_pizza'], 'readwrite');
                //access the new_pizza object store 
                const pizzaObjectStore = transaction.objectStore('new_pizza');
                //clear all items in your store
                Pizza.objectStore.clear();

                alert('All pizza has been submitted ');
            })
            .catch(err => {
                console.log(err);
            });
        }
    };


}

//listen for the app to combe back online 
window.addEventListener('online', uploadPizza);

