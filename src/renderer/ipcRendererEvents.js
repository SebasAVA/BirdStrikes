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
  console.log("Email");
 var cmd=require('node-cmd');
 var line1 = 'start outlook /c ipm.note /m "someone@microsoft.com&subject=test%20subject&body=test%20body" /a '
 var line2 = String(path.resolve(__dirname, '../assets/doc/output.docx'));
 var command = line1.concat(line2);
 console.log(command);
 cmd.run(command);
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

let NI, CRP, CAB, CEP, CRI, CRE, CRP, CRU, CPC, GPW, TCAS, INES, GOA;

switch (Formulario[15].value) {
    case "DIA":
        NI;
        CRP;
        CAB;
        CEP;
        CRI;
        CRE; 
        CRP;
        CRU;
        CPC;
        GPW;
        TCAS;
        INES;
        GOA;
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

let RadNA,RadND,RadDDL,RadDFL,ParaNA,ParaND,ParaDDL,ParaDFL;
let NDUNO, DDLUNO, DFLUNO, NDDOS, DDLDOS, DFLDOS, NDTRES, DDLTRES, DFLTRES, NDCUA, DDLCUA, DFLCUA;
let HND,HDDL,HDFL,PLND,PLDDL,PLDFL,ROND,RODDL,RODFL,FUND,FUDDL,FUDFL,TND,TDDL,TDFL;
let EVND,EVDDL,EVDFL,EHND,EHDDL,EHDFL,LND,LDDL,LDFL,PEND,PEDDL,PEDFL,OND,ODDL,ODFL;
switch (Formulario.Radomo.value){
  case "N/A":
  RadND = "";
  RadDDL = "";
  RadDFL = "";
  break;
  case "ND":
  RadND = "X";
  RadDDL = "";
  RadDFL = "";
  break;
  case "DDL":
  RadND = "";
  RadDDL = "X";
  RadDFL = "";
  break;
  case "DFL":
  RadND = "";
  RadDDL = "";
  RadDFL = "X";
  break;
}
switch (Formulario.Parabrisas.value){
  case "N/A":
  ParaND = "";
  ParaDDL = "";
  ParaDFL = "";
  break;
  case "ND":
  ParaND = "X";
  ParaDDL = "";
  ParaDFL = "";
  break;
  case "DDL":
  ParaND = "";
  ParaDDL = "X";
  ParaDFL = "";
  break;
  case "DFL":
  ParaND = "";
  ParaDDL = "";
  ParaDFL = "X";
  break;
}
switch (Formulario.Motor1.value){
  case "N/A":
  NDUNO = "";
  DDLUNO = "";
  DFLUNO = "";
  break;
  case "ND":
  NDUNO = "X";
  DDLUNO = "";
  DFLUNO = "";
  break;
  case "DDL":
  NDUNO = "";
  DDLUNO = "X";
  DFLUNO = "";
  break;
  case "DFL":
  NDUNO = "";
  DDLUNO = "";
  DFLUNO = "X";
  break;
}
switch (Formulario.Motor2.value){
  case "N/A":
  NDDOS = "";
  DDLDOS = "";
  DFLDOS = "";
  break;
  case "ND":
  NDDOS = "X";
  DDLDOS = "";
  DFLDOS = "";
  break;
  case "DDL":
  NDDOS = "";
  DDLDOS = "X";
  DFLDOS = "";
  break;
  case "DFL":
  NDDOS = "";
  DDLDOS = "";
  DFLDOS = "X";
  break;
}
switch (Formulario.Motor3.value){
  case "N/A":
  NDTRES = "";
  DDLTRES = "";
  DFLTRES = "";
  break;
  case "ND":
  NDTRES = "X";
  DDLTRES = "";
  DFLTRES = "";
  break;
  case "DDL":
  NDTRES = "";
  DDLTRES = "X";
  DFLTRES = "";
  break;
  case "DFL":
  NDTRES = "";
  DDLTRES = "";
  DFLTRES = "X";
  break;
}
switch (Formulario.Motor4.value){
  case "N/A":
  NDCUA = "";
  DDLCUA = "";
  DFLCUA = "";
  break;
  case "ND":
  NDCUA = "X";
  DDLCUA = "";
  DFLCUA = "";
  break;
  case "DDL":
  NDCUA = "";
  DDLCUA = "X";
  DFLCUA = "";
  break;
  case "DFL":
  NDCUA = "";
  DDLCUA = "";
  DFLCUA = "X";
  break;
}
switch (Formulario.Helice.value){
  case "N/A":
  HND = "";
  HDDL = "";
  HDFL = "";
  break;
  case "ND":
  HND = "X";
  HDDL = "";
  HDFL = "";
  break;
  case "DDL":
  HND = "";
  HDDL = "X";
  HDFL = "";
  break;
  case "DFL":
  HND = "";
  HDDL = "";
  HDFL = "X";
  break;
}
switch (Formulario.Planos.value){
  case "N/A":
  PLND = "";
  PLDDL = "";
  PLDFL = "";
  break;
  case "ND":
  PLND = "X";
  PLDDL = "";
  PLDFL = "";
  break;
  case "DDL":
  PLND = "";
  PLDDL = "X";
  PLDFL = "";
  break;
  case "DFL":
  PLND = "";
  PLDDL = "";
  PLDFL = "X";
  break;
}
switch (Formulario.Rotores.value){
  case "N/A":
  ROND = "";
  RODDL= "";
  RODFL= "";
  break;
  case "ND":
  ROND = "X";
  RODDL= "";
  RODFL= "";
  break;
  case "DDL":
  ROND = "";
  RODDL= "X";
  RODFL= "";
  break;
  case "DFL":
  ROND = "";
  RODDL= "";
  RODFL= "X";
  break;
}
switch (Formulario.Fuselaje.value){
  case "N/A":
  FUND = "";
  FUDDL= "";
  FUDFL= "";
  break;
  case "ND":
  FUND = "X";
  FUDDL= "";
  FUDFL= "";
  break;
  case "DDL":
  FUND = "";
  FUDDL= "X";
  FUDFL= "";
  break;
  case "DFL":
  FUND = "";
  FUDDL= "";
  FUDFL= "X";
  break;
}
switch (Formulario.TrenAte.value){
  case "N/A":
  TND = "";
  TDDL= "";
  TDFL= "";
  break;
  case "ND":
  TND = "X";
  TDDL= "";
  TDFL= "";
  break;
  case "DDL":
  TND = "";
  TDDL= "X";
  TDFL= "";
  break;
  case "DFL":
  TND = "";
  TDDL= "";
  TDFL= "X";
  break;
}
switch (Formulario.EstabVer.value){
  case "N/A":
  EVND = "";
  EVDDL= "";
  EVDFL= "";
  break;
  case "ND":
  EVND = "X";
  EVDDL= "";
  EVDFL= "";
  break;
  case "DDL":
  EVND = "";
  EVDDL= "X";
  EVDFL= "";
  break;
  case "DFL":
  EVND = "";
  EVDDL= "";
  EVDFL= "X";
  break;
}
switch (Formulario.EstabHor.value){
  case "N/A":
  EHND = "";
  EHDDL= "";
  EHDFL= "";
  break;
  case "ND":
  EHND = "X";
  EHDDL= "";
  EHDFL= "";
  break;
  case "DDL":
  EHND = "";
  EHDDL= "X";
  EHDFL= "";
  break;
  case "DFL":
  EHND = "";
  EHDDL= "";
  EHDFL= "X";
  break;
}
switch (Formulario.Luces.value){
  case "N/A":
  LND = "";
  LDDL= "";
  LDFL= "";
  break;
  case "ND":
  LND = "X";
  LDDL= "";
  LDFL= "";
  break;
  case "DDL":
  LND = "";
  LDDL= "X";
  LDFL= "";
  break;
  case "DFL":
  LND = "";
  LDDL= "";
  LDFL= "X";
  break;
}
switch (Formulario.PitotEst.value){
  case "N/A":
  PEND = "";
  PEDDL= "";
  PEDFL= "";
  break;
  case "ND":
  PEND = "X";
  PEDDL= "";
  PEDFL= "";
  break;
  case "DDL":
  PEND = "";
  PEDDL= "X";
  PEDFL= "";
  break;
  case "DFL":
  PEND = "";
  PEDDL= "";
  PEDFL= "X";
  break;
}
switch (Formulario.Otros.value){
  case "N/A":
  OND = "";
  ODDL= "";
  ODFL= "";
  break;
  case "ND":
  OND = "X";
  ODDL= "";
  ODFL= "";
  break;
  case "DDL":
  OND = "";
  ODDL= "X";
  ODFL= "";
  break;
  case "DFL":
  OND = "";
  ODDL= "";
  ODFL= "X";
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
    fre:fre,
    rnd:RadND,
    rddl:RadDDL,
    rdfl:RadDFL,
    pnd:ParaND,
    pddl:ParaDDL,
    pdf:ParaDFL,
    und: NDUNO,
    uddl: DDLUNO,
    udf: DFLUNO,
    dnd: NDDOS,
    dddl: DDLDOS,
    ddf: DFLDOS,
    trnd: NDTRES,
    trddl: DDLTRES,
    trdf: DFLTRES,
    cnd: NDCUA,
    cddl: DDLCUA,
    cdf: DFLCUA,
    hnd: HND,
    hddl: HDDL,
    hdf: HDFL,
    plnd: PLND,
    plddl: PLDDL,
    pld: PLDFL,
    rond: ROND,
    roddl: RODDL,
    rdf: RODFL,
    fund: FUND,
    fuddl: FUDDL,
    fud: FUDFL,
    tnd: TND,
    tddl: TDDL,
    tdf: TDFL,
    evnd: EVND,
    evdd: EVDDL,
    efl: EVDFL,
    ehnv: EHND,
    ehdd: EHDDL,
    ehd: EHDFL,
    lnd: LND,
    lddl: LDDL,
    ldf: LDFL,
    pend: PEND,
    ped: PEDDL,
    pef: PEDFL,
    ond: OND,
    oddl: ODDL,
    odf: ODFL
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
