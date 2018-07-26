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

function deleteDir(DirD)
{
  var rimraf = require('rimraf');
  rimraf(DirD, function () { console.log('Directorio Borrado'); });
}

function compressDir(DirC)
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
  ps.addCommand("Compress-Archive -LiteralPath " +DirC+  " -CompressionLevel Optimal -DestinationPath C:/Users/jsrojasa/Documents/PCMCIADown/PCMCIA-DOWNLOADER-ELECTRON/valhalla/N695AV201826071138.zip")

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
}

function formatear(path)
{
    var rimraf = require('rimraf');
rimraf(files[i].src, function () { console.log('Formateado'); });
}

module.exports = {
  deleteFile: deleteFile,
  deleteDir: deleteDir,
  compressDir:compressDir
}
