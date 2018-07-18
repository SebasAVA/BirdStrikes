import {ipcRenderer} from 'electron'
const fs = require('fs')

var Unidad;
var Archivos;

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
        fs.unlink(files[i].src, (err) => {
            if (err) throw err;
            console.log('successfully deleted');
          });
      }
      else if (fs.lstatSync(files[i].src).isDirectory()) {
        var rimraf = require('rimraf');
        rimraf(files[i].src, function () { console.log('done'); });
      }
      }

}
console.log(FinalFiles);
}
// var FinalFiles = fs.readdirSync(folderPaths[0]);
// console.log(FinalFiles);



function ACTail(files){
// Reiniciar una division para que quede en blanco
  const FilesList = document.querySelector('#ACTail')
  FilesList.innerHTML = '';


  let A32S = false
  let A330 = false
  let ATR = false
  let EMR = false

  console.log(files)
  let posMSG

  for (var i = 0; i < files.length; i++) {
    var name = files[i].filename
    if(name.startsWith("_") && (name.endsWith(".QAR")||name.endsWith(".REC")||name.endsWith(".REP") ))
    {
          A32S = true
          break;
    }
    else if (name.startsWith("MSG")) {
          posMSG = i
          A330 = true
    }
  }
  if (A32S == true) {

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

////////////////////////////////////////////////////
/**
 * readTextFile read data from file
 * @param  string   filepath   Path to file on hard drive
 * @return string              String with file data
 */
function readTextFile(filepath) {
	var str = "";
	var txtFile = new File([""],filepath);
	txtFile.open("r");
	while (!txtFile.eof) {
		// read each line of text
		str += txtFile.readln() + "\n";
	}
	return str;
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

const $ = require('jquery');
const powershell = require('node-powershell');

// Testing PowerShell
$(document).ready(() => {

  // Create the PS Instance
  let ps = new powershell({
      executionPolicy: 'Bypass',
      noProfile: true
  })

  // Load the gun
ps.addCommand("Get-Process -Name electron")

  // Pull the Trigger
  ps.invoke()
  .then(output => {
      console.log(output)
  })
  .catch(err => {
      console.error(err)
      ps.dispose()
  })

})

function openDirectory(){
  ipcRenderer.send('open-directory')
}

function uploadData(files)
{
  console.log("Estos son los archivos en Upload Data");
  console.log(Archivos[1].filename);
}

function formatear(path)
{
    var rimraf = require('rimraf');
rimraf(files[i].src, function () { console.log('Formateado'); });
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
