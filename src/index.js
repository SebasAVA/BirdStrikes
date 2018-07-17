'use strict'

import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import devtools from './devtools'
import fs from 'fs'
import path from 'path'
import filesize from 'filesize'
import fleet from './fleet.js'
let win


if (process.env.NODE_ENV === 'development') {
  devtools()
}

app.on('before-quit', () => {
  console.log('Saliendo..')
})

app.on('ready', () => {
    win = new BrowserWindow({
    height: 550,
    width: 900,
    minWidth: 900,
    minHeight: 500,
    center: true,
    show: false,
    title: 'PCMCIA-DOWNLOADER'
  })

  win.once('ready-to-show', () => {
    win.show()
  })

  win.on('move', () => {
    const position = win.getPosition()
    //console.log(`La posición es ${position}`)
  })

  win.on('closed', () => {
    win = null
    app.quit()
  })

  win.loadURL(`file://${__dirname}/renderer/index.html`)
  win.toggleDevTools()
})

const username = require('username');


  username().then(username => {
      const UN = username
      console.log(username);
  });


//pedrotoniel12@hotmail.com Avianca2017++
ipcMain.on('open-directory', (event) => {
  console.log("Seleccionado Directorio");
  dialog.showOpenDialog(win, {
    title: 'Seleccione la unidad de la PCMCIA',
    buttonLabel: 'Seleccionar esta unidad',
    properties: ['openDirectory']
  },
(folderPaths) => {
  const allFiles = []
  if (folderPaths){
    console.log(folderPaths);
      fs.readdir(folderPaths[0], (err,files) => {
        if(err) throw err
      for (var i = 0; i < files.length; i++) {
        let filePath = path.join(folderPaths[0],files[i])
        let stats = fs.statSync(filePath)
        let size = filesize(stats.size,{round: 0})
        allFiles.push({filename: files[i] , src:filePath, size: size})
      }
      event.sender.send('load-files', allFiles)
    })
  }
})
})
