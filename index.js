const express = require('express');
const app = express();
const path = require("path");
var mysql = require("mysql");
var inquirer = require("inquirer");
//connect database//n
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'shoulderlean',
    database: 'eticketing_systems'
});
connection.connect(function(err) {
    if (err) throw err;
    runSearch();
});
//prompt message //call inquirer
function runSearch() {
    inquirer.prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "Find a specific train route",
                "Find a specific customer",
                "Find a station",
                "Exit"
            ]
         })
        .then(function (answer) {
        switch(answer.action) {
        case "Find a specific train route":
        trainSearch();
        break;
        case "Find a specific customer":
        customerSearch();
        break;
        case "Find a station":
        stationSearch();
        break;
        case "Exit":
        connection.end();
        break;
        }
    });
}    
//funcitons        
function trainSearch() {
    inquirer
      .prompt({
        name: "trains",
        type: "input",
        message: "What train would you like to search for?"
      })
      .then(function(answer) {
        var query = "SELECT station FROM eticketing_systems WHERE ?";
        connection.query(query, { trains: answer.station }, function(err, res) {
          if (err) throw err;
          for (var i = 0; i < res.length; i++) {
            console.log("station: " + res[i].station);
          }
          runSearch();
        });
      });
  }
  function customerSearch() {
    inquirer
      .prompt({
        name: "customer",
        type: "input",
        message: "What customer would you like to look for?"
      })
      .then(function(answer) {
        console.log(answer.customer);
        connection.query("SELECT first_name, last_name, FROM eticketing_systems WHERE ?", { first_name: answer.customer }, function(err, res) {
          if (err) throw err;
          console.log(
            "First Name: " +
              res[0].first_name +
              " || Last Name: " +
              res[0].last_name +
              " || Seat: " +
              res[0].seat +
              " || station: " +
              res[0].station +
              " || Route: " +
              res[0].route
          );
          runSearch();
        });
      });
  }
  function stationSearch() {
    inquirer
    .prompt({
        name: "station",
        type: "input",
        message: "What station would you like to look for?"
      })
        .then(function(answer) {
            console.log(answer.station);
            connection.query("SELECT first_name, last_name, FROM eticketing_systems WHERE ?", { station: answer.station }, function(err, res) {
              if (err) throw err;
              console.log(
                  " || Station: " +
                  res[0].station +
                  " || Route: " +
                  res[0].route
              );
          runSearch();
        });
  });
}

