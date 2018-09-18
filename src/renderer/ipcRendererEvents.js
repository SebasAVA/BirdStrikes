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
//
//
// function clearFile(){
//   const oldFile = document.querySelectorAll('li.list-group-item')
//   for (let i = 0; i < oldFile.length; i++) {
//     oldFile[i].parentNode.removeChild(oldFile[i])
//   }
// }
//
// function cleaning(files, folderPaths)
// {
//   console.log(files);
//    var rimraf = require('rimraf');
//    var FinalFiles = [];
//    Unidad = folderPaths[0];
//   //
//   for (var i = 0; i < files.length; i++) {
//     if (files[i].filename.endsWith("QAR")||files[i].filename.endsWith("REC")||files[i].filename.endsWith("REP")||
//         files[i].filename.endsWith("DAR")||files[i].filename.endsWith("MSG")||files[i].filename.endsWith("QA2")||
//         files[i].filename.endsWith("ECT")||files[i].filename.endsWith("HCP")) {
//         FinalFiles.push({filename: files[i].filesname, src: files[i].src});
//     }
//     else {
//       if (fs.lstatSync(files[i].src).isFile()) {
//          deleteFile(files[i])
//       }
//       else if (fs.lstatSync(files[i].src).isDirectory()) {
//          deleteDir(files[i].src)
//       }
//       }
//
// }
// }
//Importante SERVIRA PARA ACTUALIZAR LAS MATRICULAS Y Saber el  nombre de los archivos finales
// var FinalFiles = fs.readdirSync(folderPaths[0]);
// console.log(FinalFiles);



// function ACTail(files){
// // Reiniciar una division para que quede en blanco
//   const FilesList = document.querySelector('#ACTail')
//   FilesList.innerHTML = '';
//   console.log(files)
//   let posMSG
//
//   for (var i = 0; i < files.length; i++) {
//     var name = files[i].filename
//     if(name.startsWith("_") && (name.endsWith(".QAR")||name.endsWith(".REC")||name.endsWith(".REP") ))
//     {
//           A32S = true
//           fixACTail(Unidad)
//           break;
//     }
//     else if (name.startsWith("MSG")) {
//           posMSG = i
//           A330 = true
//     }
//   }
//   if (A32S == true) {
//     if (name.substring(1,7).includes("-")) {
//       console.log("Tiene GUION");
//       console.log(name.substring(1, 7).replace('-',''));
//       ACTAIL = name.substring(1, 7).replace('-','') ;
//     }
//     else{
//       console.log("No tiene Guion");
//     ACTAIL = name.substring(1, 7);}
//     const node = `<h1><b>Matricula</b></h1>
//                   <h2 id="AC">${name.substring(1, 7)}</h2>`
//     FilesList.insertAdjacentHTML('beforeend', node)
//     console.log(name.substring(1, 7));
//   }
//   if (A330 == true) {
//     console.log(files[posMSG].src)
//     let MSG = fs.readFile('G:/MSG.DAT')
//     console.log(MSG);
//   }
// }
//
// function loadData (files){
//   const FilesList = document.querySelector('ul.list-group')
//                 for (let i = 0; i < files.length; i++) {
//                   if (files[i].filename.endsWith("QAR")||files[i].filename.endsWith("REC")||files[i].filename.endsWith("REP")||
//                       files[i].filename.endsWith("DAR")||files[i].filename.endsWith("MSG")||files[i].filename.endsWith("QA2")||
//                       files[i].filename.endsWith("ECT")||files[i].filename.endsWith("HCP") ) {
//                   const node = `<li class="list-group-item">
//                                   <p>${files[i].src}</p>
//                                   <div class="media-body">
//                                     <strong>${files[i].filename}</strong>
//                                     <p>${files[i].size}</p>
//                                   </div>
//                                 </li>`
//                   FilesList.insertAdjacentHTML('beforeend', node)
//                 }
//                 }
//     let ACFiles = []
//     ACFiles = readPathU(Unidad);
//     ACTail(ACFiles)
//     Archivos = files;
// }



function uploadData()
{
  // Add the credentials to access your database
var connection = mysql.createConnection({
    host     : 'avianca.database.windows.net',
    user     : 'etl_fda',
    password : 'Avianca2017..', // or the original password : 'apaswword'
    database : 'SEGOP'
});

// connect to mysql
connection.connect(function(err) {
    // in case of error
    if(err){
        console.log(err.code);
        console.log(err.fatal);
    }
});

// Perform a query
var query = 'SELECT TOP (1000) * FROM [dbo].[Birdstrikes]';

connection.query(query, function(err, rows, fields) {
    if(err){
        console.log("An error ocurred performing the query.");
        console.log(err);
        return;
    }

    console.log("Query succesfully executed", rows);
});

// Close the connection
connection.end(function(){
    // The connection has been closed
});
}


function openDirectory(){
  ipcRenderer.send('open-directory')
}



function NewRead ()
{
  const StatusGUI = document.querySelector('#Status')
  StatusGUI.innerHTML = '';
  let files = [];
  let NRFiles = [];
  console.log(Unidad);
  files = fs.readdirSync(Unidad)
  for (var i = 0; i < files.length; i++) {
    let filePath = path.join(Unidad,files[i])
    console.log(filePath);
    let stats = fs.statSync(filePath)
    let size = filesize(stats.size,{round: 0})
    NRFiles.push({filename: files[i] , src:filePath, size: size})
  }
   Archivos = [];
   A32S = false;
   A330 = false;
   ATR = false;
   EMR = false;
   Finish = false;
   let folderPath =  [Unidad]
   clearFile();
   cleaning(NRFiles, folderPath);
   loadData(NRFiles);
}



module.exports = {
  setIpc: setIpc,
  uploadData: uploadData
}
