import {ipcRenderer} from 'electron'
import {deleteFile, deleteDir, compressDir, copyREPS, formatear} from './filesManager.js'
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


function clearFile(){
  const oldFile = document.querySelectorAll('li.list-group-item')
  for (let i = 0; i < oldFile.length; i++) {
    oldFile[i].parentNode.removeChild(oldFile[i])
  }
}

function cleaning(files, folderPaths)
{
  console.log(files);
   var rimraf = require('rimraf');
   var FinalFiles = [];
   Unidad = folderPaths[0];
  //
  for (var i = 0; i < files.length; i++) {
    if (files[i].filename.endsWith("QAR")||files[i].filename.endsWith("REC")||files[i].filename.endsWith("REP")||
        files[i].filename.endsWith("DAR")||files[i].filename.endsWith("MSG")||files[i].filename.endsWith("QA2")||
        files[i].filename.endsWith("ECT")||files[i].filename.endsWith("HCP")) {
        FinalFiles.push({filename: files[i].filesname, src: files[i].src});
    }
    else {
      if (fs.lstatSync(files[i].src).isFile()) {
         deleteFile(files[i])
      }
      else if (fs.lstatSync(files[i].src).isDirectory()) {
         deleteDir(files[i].src)
      }
      }

}
}
//Importante SERVIRA PARA ACTUALIZAR LAS MATRICULAS Y Saber el  nombre de los archivos finales
// var FinalFiles = fs.readdirSync(folderPaths[0]);
// console.log(FinalFiles);



function ACTail(files){
// Reiniciar una division para que quede en blanco
  const FilesList = document.querySelector('#ACTail')
  FilesList.innerHTML = '';
  console.log(files)
  let posMSG

  for (var i = 0; i < files.length; i++) {
    var name = files[i].filename
    if(name.startsWith("_") && (name.endsWith(".QAR")||name.endsWith(".REC")||name.endsWith(".REP") ))
    {
          A32S = true
          // fixACTail()
          break;
    }
    else if (name.startsWith("MSG")) {
          posMSG = i
          A330 = true
    }
  }
  if (A32S == true) {
    ACTAIL = name.substring(1, 7);
    const node = `<h1><b>Matricula</b></h1>
                  <h2 id="AC">${name.substring(1, 7)}</h2>`
    FilesList.insertAdjacentHTML('beforeend', node)
    console.log(name.substring(1, 7));
  }
  if (A330 == true) {
    console.log(files[posMSG].src)
    let MSG = fs.readFile('G:/MSG.DAT')
    console.log(MSG);
  }
}

function loadData (files){
  const FilesList = document.querySelector('ul.list-group')
                for (let i = 0; i < files.length; i++) {
                  if (files[i].filename.endsWith("QAR")||files[i].filename.endsWith("REC")||files[i].filename.endsWith("REP")||
                      files[i].filename.endsWith("DAR")||files[i].filename.endsWith("MSG")||files[i].filename.endsWith("QA2")||
                      files[i].filename.endsWith("ECT")||files[i].filename.endsWith("HCP") ) {
                  const node = `<li class="list-group-item">
                                  <p>${files[i].src}</p>
                                  <div class="media-body">
                                    <strong>${files[i].filename}</strong>
                                    <p>${files[i].size}</p>
                                  </div>
                                </li>`
                  FilesList.insertAdjacentHTML('beforeend', node)
                }
                }
    ACTail(files)
    Archivos = files;
}

function uploadData()
{
  const StatusGUI = document.querySelector('#Status')
  StatusGUI.innerHTML = '';
  const nodeStatus = `<h2 id="Sta">Subiendo Archivo, no retire la tarjeta</h2>`
  StatusGUI.insertAdjacentHTML('beforeend', nodeStatus)

  console.log("Estos son los archivos en Upload Data");
  console.log(Archivos);
  if (A32S) {
    console.log("Subiendo un 32S");
    for (var i = 0; i < Archivos.length; i++) {
    var name = Archivos[i]
    if(name.filename.endsWith(".REC"))
    {
      compressDir(name.src,ACTAIL)
    }
    else if(name.filename.endsWith(".REP"))
    {
      copyREPS(Unidad,name.src,ACTAIL)
    }
  }
  }
  else if (A330) {

  }
  // formatear(Unidad)
}


function openDirectory(){
  ipcRenderer.send('open-directory')
}


//   var filepath = "F:/Avianca.png";// Previously saved path somewhere
//
//   if (fs.existsSync(filepath)) {
//     fs.unlink(filepath, (err) => {
//         if (err) {
//             alert("An error ocurred updating the file" + err.message);
//             console.log(err);
//             return;
//         }
//         console.log("File succesfully deleted");
//     });
// } else {
//     alert("This file doesn't exist, cannot delete");
// }


module.exports = {
  setIpc: setIpc,
  openDirectory: openDirectory,
  uploadData: uploadData
}
