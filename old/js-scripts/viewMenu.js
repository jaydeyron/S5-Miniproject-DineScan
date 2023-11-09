var express = require('express');
var router = express.Router();
var database = require('../database');
router.get("/",function(request,response,next)){
    var query = "SELECT dish_name, price FROM DISHES WHERE available = 'true'";
    database.query(query,function(error,data)){
        if(error){
            throw error;
        }
        else{
            response.render('sample_data',{name: });
        }
    };
}