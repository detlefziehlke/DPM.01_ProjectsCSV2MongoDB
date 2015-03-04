/**
 * Created by detlefziehlke on 03.03.15.
 */

"use strict";

var fs = require('fs');
var parse = require('csv-parse'),
      mongoose = require('mongoose'),
      conn = 0;

require('./models/projects');

var projekte = [];

var parser = parse({delimiter: ';'}, function (err, data) {

  if (err) {
    console.log(err);
    return;
  }

  if (data) {
    for (var i = 0; i < data.length; i++) {
      if (!data[i][0]) continue
      projekte.push({name: data[i][0], area: data[i][1]});
    }
    loadData2MongoDB(projekte);
  }

});

var ret = fs.createReadStream(__dirname + '/Projekte4.csv').pipe(parser);

function loadData2MongoDB(projekte) {
  mongoose.connect('mongodb://localhost:27017/test');
  mongoose.connection.on("open", function (err, con) {

    if (err) {
      console.log(err);
      return;
    }

    conn++;
    mongoose.model('projects').collection.insert(projekte, function (err, results) {
      console.log('Results from insert:');

      if (err) {
        console.log('error occured: ' + err);
        return;
      }

      conn--;
      conCanClose();
    });

    mongoose.connection.close();
  })
}

function conCanClose() {
  //console.log('open request = ' + conn);

  if (!conn)
    mongoose.connection.close();
}


