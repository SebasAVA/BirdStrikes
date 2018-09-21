import {ipcRenderer} from 'electron'
import {deleteFile, deleteDir, compressDir, copyREPS, formatear, fixACTail, readPathU} from './filesManager.js'
import path from 'path'
import filesize from 'filesize'
var mysql = require('mysql');
const fs = require('fs')


var Unidad;
var Archivos = [];
let A32S = false;
let A330 = false;
let ATR = false;
let EMR = false;
var ACTAIL;
var Finish = false;


function setIpc(){
  ipcRenderer.on('load-files',(event,allFiles,folderPaths) => {
    clearFile();
    cleaning(allFiles, folderPaths);
    loadData(allFiles);
    console.log(allFiles);
  })
}



function uploadData()
{
  var Formulario = document.getElementById("FormBS").elements;

  let NumOcu = Formulario[0].value;
  let LugOcu = Formulario[2].value;
  let NumAvesGol = Formulario[15].value;
  console.log(Formulario);

  var Connection = require('tedious').Connection;
  var resultQ = []
  var config = {
      userName: 'etl_fda',
      password: 'Avianca2017..',
      server: 'avianca.database.windows.net',
      // If you are on Microsoft Azure, you need this:
      options: {encrypt: true, database: 'SEGOP'}
  }

  var connection = new Connection(config);
     connection.on('connect', function(err) {
         // If no error, then good to proceed.
         console.log("Connected");
         executeStatement();
     });

     var Request = require('tedious').Request;
     var TYPES = require('tedious').TYPES;

     function executeStatement() {
         var request = new Request(`INSERT INTO [dbo].[Birdstrikes]
           ([Ocurrencia]
           ,[NumAves]
           ,[Base])
     VALUES
           ('${NumOcu}'
           ,12
           ,'${LugOcu}')`, function(err) {
         if (err) {
             console.log(err);}
         });
         var result = "";
         request.on('row', function(columns) {
           console.log(columns);
           // const notamQ = document.querySelector('.image-container')
           // const node = `
           // <div class="notam-container">
           // <span class="nav-group-item">
           //  <span class="icon icon-flight"></span>
           //   <h4>Consecutivo: </h4><b> ${columns[0].value}</b>
           //
           //  </span>
           //  <h4>${columns[1].value}</h4>
           //  <p>${columns[2].value}</p>
           //  <p>Vigente desde: ${columns[3].value} Hasta: ${columns[4].value}</p>
           // <p>${columns[6].value}</p>
           // </div>
           //  `
             //  notamQ.insertAdjacentHTML('beforeend', node)
             // columns.forEach(function(column) {
             //   if (column.value === null) {
             //     // console.log('NULL');
             //   } else {
             //     result+= column.value + "|";
             //   }
             // });
             //   console.log(result);

             // resultQ.push(result)
             // result ="";
         });

         request.on('done', function(rowCount, more) {
         console.log(rowCount + ' rows returned');
         });
         connection.execSql(request);
     }

}

function docAerocivil(){
  console.log("Aerocivil");
  var JSZip = require('jszip');
var Docxtemplater = require('docxtemplater');

var fs = require('fs');
var path = require('path');

//Load the docx file as a binary
var content = fs
    .readFileSync(path.resolve(__dirname, '../assets/doc/Aerocivil.docx'), 'binary');

var zip = new JSZip(content);

var doc = new Docxtemplater();
doc.loadZip(zip);

//set the templateVariables
var Formulario = document.getElementById("FormBS").elements;
let fleet = Formulario[10].value;
let Actail = Formulario[9].value;
let Airline = Formulario[2].value;
doc.setData({
    Aerolinea: Airline,
    Flota: fleet,
    ACTail: Actail
});

try {
    // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
    doc.render()
}
catch (error) {
    var e = {
        message: error.message,
        name: error.name,
        stack: error.stack,
        properties: error.properties,
    }
    console.log(JSON.stringify({error: e}));
    // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
    throw error;
}

var buf = doc.getZip()
             .generate({type: 'nodebuffer'});

// buf is a nodejs buffer, you can either write it to a file or do anything else with it.
fs.writeFileSync(path.resolve(__dirname, '../assets/doc/output.docx'), buf);
}


function openDirectory(){
  ipcRenderer.send('open-directory')
}







module.exports = {
  setIpc: setIpc,
  uploadData: uploadData,
  docAerocivil: docAerocivil
}
