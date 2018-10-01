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

function sendemail()
{
  console.log("EMail");
 var cmd=require('node-cmd');
 cmd.run('start outlook /c ipm.note /m "someone@microsoft.com&subject=test%20subject&body=test%20body" /a C:/Users/jsrojasa/Documents/BirdStrikes/src/assets/doc/output.docx');
}

function uploadData()
{
  var Formulario = document.getElementById("FormBS").elements;
  console.log(Formulario);
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
         // If no error, then good to proceed Formulario.radio.checked
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
let Airline = Formulario[2].value;
let fleet = Formulario[10].value;
let Actail = Formulario[9].value;
let day = Formulario[1].value.substring(8,10);
let month = Formulario[1].value.substring(5,7);
let year = Formulario[1].value.substring(2,4);
let hour = Formulario[1].value.substring(11);
let NoFlight = Formulario[11].value;

let alba;
let dia;
let crep;
let noche;

switch (Formulario[12].value) {
    case "DIA":
        alba = "";
        dia = "X";
        crep = "";
        noche = "";
        break;
    case "NOCHE":
        alba = "";
        dia = "";
        crep = "";
        noche = "X";
        break;
    case "CREPUSCULO":
        alba = "";
        dia = "";
        crep = "X";
        noche = "";
        break;
    case "ALBA":
        alba = "X";
        dia = "";
        crep = "";
        noche = "";
        break;
    case "Indet":
        alba = "";
        dia = "";
        crep = "";
        noche = "";
        break;
}

let Airport = Formulario[3].value;
let rwy = Formulario[4].value;
let alt = Formulario[8].value;


let findet, frod, fdes, fasc, fcru, fde, fap, fat, fre;

switch (Formulario[5].value) {
    case "Indeterminada":
        findet = "X";
        frod = "";
        fdes = "";
        fasc = "";
        fcru = "";
        fde = "";
        fap = "";
        fat = "";
        fre = "";
        break;
        case "Rodaje":
            findet = "";
            frod = "X";
            fdes = "";
            fasc = "";
            fcru = "";
            fde = "";
            fap = "";
            fat = "";
            fre = "";
            break;
            case "Despegue":
                findet = "";
                frod = "";
                fdes = "X";
                fasc = "";
                fcru = "";
                fde = "";
                fap = "";
                fat = "";
                fre = "";
                break;
                case "En Ruta":
                    findet = "";
                    frod = "";
                    fdes = "";
                    fasc = "";
                    fcru = "X";
                    fde = "";
                    fap = "";
                    fat = "";
                    fre = "";
                    break;
                    case "Ascenso":
                        findet = "";
                        frod = "";
                        fdes = "";
                        fasc = "X";
                        fcru = "";
                        fde = "";
                        fap = "";
                        fat = "";
                        fre = "";
                        break;
                        case "Descenso":
                            findet = "";
                            frod = "";
                            fdes = "";
                            fasc = "";
                            fcru = "";
                            fde = "X";
                            fap = "";
                            fat = "";
                            fre = "";
                            break;
                            case "Aproximacion":
                                findet = "";
                                frod = "";
                                fdes = "";
                                fasc = "";
                                fcru = "";
                                fde = "";
                                fap = "X";
                                fat = "";
                                fre = "";
                                break;
                                case "Aterrizaje":
                                    findet = "";
                                    frod = "";
                                    fdes = "";
                                    fasc = "";
                                    fcru = "";
                                    fde = "";
                                    fap = "";
                                    fat = "X";
                                    fre = "";
                                    break;
                                    case "Remolque":
                                        findet = "";
                                        frod = "";
                                        fdes = "";
                                        fasc = "";
                                        fcru = "";
                                        fde = "";
                                        fap = "";
                                        fat = "";
                                        fre = "X";
                                        break;
}


doc.setData({
    Aerolinea: Airline,
    Flota: fleet,
    ACTail: Actail,
    ia: day,
    is: month,
    ir: year,
    Hora: hour,
    NoVuelo: NoFlight,
    Alba: alba,
    Dia: dia,
    Crep: crep,
    Noch: noche,
    Aeropuerto: Airport,
    Pista: rwy,
    Altitud: alt,
    fIdet:findet,
    fRod:frod,
    fDes:fdes,
    fAsc:fasc,
    fCru:fcru,
    fde:fde,
    fap:fap,
    fAt:fat,
    fre:fre
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
  docAerocivil: docAerocivil,
  sendemail: sendemail
}
