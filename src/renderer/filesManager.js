const fs = require('fs')
import path from 'path'
import filesize from 'filesize'

function fleet(files){
  console.log("Esta es una flota normal");
}
function deleteFile(FileD)
{
  fs.unlink(FileD.src, (err) => {
      if (err) throw err;
      console.log('El archivo ajeno se elimino');
    });
}

function deleteDir(DirD,Tail)
{
  var rimraf = require('rimraf');
  rimraf(DirD, function () { console.log('Directorio Borrado'); });
}

function createDir(path)
{

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
    ps.addCommand("New-Item -ItemType directory -Path "+path)

      // Pull the Trigger
      ps.invoke()
      .then(output => {
          console.log("Creando direccion");
          console.log(output)
      })
      .catch(err => {
          console.error(err)
          ps.dispose()
      })

    })
}

function compressDir(DirC, Tail)
{
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours() + 1 ;
  var min = date.getMinutes();

  if (month>0 && month<10) {
    month = "0"+month
  }
  if (day>0 && day<10) {
    day = "0"+day
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
  ps.addCommand("Compress-Archive -LiteralPath " +DirC+  " -CompressionLevel Optimal -DestinationPath //fscav-segoperfs/Data/"+Tail+day+month+year+hour+min+"00M.zip")

    // Pull the Trigger
    ps.invoke()
    .then(output => {
        console.log("Copiado en DATA");
        console.log(output)
        return true;
    })
    .catch(err => {
        console.error(err)
        ps.dispose()
    })

  })
}

function copyREPS(U,DirRep,Tail)
{
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours() + 1 ;
  var min = date.getMinutes();

  if (month>0 && month<10) {
    month = "0"+month
  }
  if (day>0 && day<10) {
    day = "0"+day
  }

  createDir("//fscav-segoperfs/Data/Original_Data/REP/"+Tail+"/"+year+"-"+month+"-"+day)

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
  ps.addCommand(" Copy-Item -Path "+ DirRep +" -Destination //fscav-segoperfs/Data/Original_Data/REP/"+Tail+"/"+year+"-"+month+"-"+day+" -recurse -Force")

    // Pull the Trigger
    ps.invoke()
    .then(output => {
        console.log("Copiado Reportes");
        console.log(output)
        formatear(U)
    })
    .catch(err => {
        console.error(err)
        ps.dispose()
    })

  })
}

function formatear(path)
{
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
  ps.addCommand("Remove-Item -Path "+ path +" -Recurse")

    // Pull the Trigger
    ps.invoke()
    .then(output => {
        console.log("Copiado Reportes");
        console.log(output)
    })
    .catch(err => {
      const StatusGUI = document.querySelector('#Status')
      StatusGUI.innerHTML = '';
      const nodeStatus = `<h2 id="Sta">Ya se Subio la información</h2>`
      StatusGUI.insertAdjacentHTML('beforeend', nodeStatus)
        console.error(err)
        ps.dispose()
    })

  })
}

  function readPathU(pathDIR)
{
  console.log("Funcion readPathU");
  let files = []
  let ActFiles = []
  files = fs.readdirSync(pathDIR)
  for (var i = 0; i < files.length; i++) {
    let filePath = path.join(pathDIR,files[i])
    console.log(filePath);
    let stats = fs.statSync(filePath)
    let size = filesize(stats.size,{round: 0})
    ActFiles.push({filename: files[i] , src:filePath, size: size})
  }

  return ActFiles
}

function fixACTail(Uni){
  let FixFiles = []
  FixFiles = readPathU(Uni);
  const Renamer = require('renamer')
  const renamer = new Renamer()

  for (var i = 0; i < FixFiles.length; i++) {
    // console.log(FixFiles[i].src);
    // console.log(FixFiles[i].src.replace('-',''));
    fs.rename(FixFiles[i].src, FixFiles[i].src.replace('-',''), function (err) {
      if (err) throw err;
      console.log('renamed complete');
    });
  }
}



module.exports = {
  deleteFile: deleteFile,
  deleteDir: deleteDir,
  compressDir:compressDir,
  copyREPS:copyREPS,
  formatear: formatear,
  fixACTail: fixACTail,
  readPathU: readPathU
}
