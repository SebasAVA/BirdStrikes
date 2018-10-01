import url from 'url'
import path from 'path'
import applyFilter from './filters'
import { setIpc, uploadData, docAerocivil, sendemail } from './ipcRendererEvents'

window.addEventListener('load', () => {
  setIpc()
  addImageEvents()
  buttonEvent('upload-data', uploadData)
  buttonEvent('Aerocivil', docAerocivil)
  buttonEvent('SendEmail', sendemail)
})



const fs = require('fs-extra')
// var AdmZip = require('adm-zip')
// var zipFolder = require('zip-folder')
//const drivelist = require('drivelist')

function buttonEvent(id,func){
  const openDirectory = document.getElementById(id)
  openDirectory.addEventListener('click',func)
}

const username = require('username');

username().then(username => {
    console.log(username);
    //=> 'sindresorhus'
});

//C:\Users\jsrojasa\Documents\Archivos Prueba\PCMCIA

// drivelist.list((error, drives) => {
//
//   drives.forEach((drive) => {
//     console.log(drive);
//   });
// });

//zipFolder('C:/Users/jsrojasa/Documents/electronPro/valhalla', 'C:/Users/jsrojasa/Documents/electronPro/valhalla.zip', function(err) {
//    if(err) {
//        console.log('oh no!', err);
//    } else {
//        console.log('EXCELLENT');
//    }
//});


// var files = fs.readdirSync('F:/');
//
//
//
//
//
//
// console.log(files);





async function example () {
  try {
    await fs.emptyDir('C:/Users/jsrojasa/Documents/Archivos Prueba/PCMCIA')
    console.log('success!')
  } catch (err) {
    console.error(err)
  }
}

async function exampleDir (directory) {
  try {
    await fs.ensureDir(directory)
    console.log('success DIR!')
  } catch (err) {
    console.error(err)
  }
}

//exampleDir('C:/Users/jsrojasa/Documents/Archivos Prueba/PCMCIA/N783AV')

//example()

// Async/Await:
//async function copyFiles () {
//  try {
//    await fs.copy('C:/Users/jsrojasa/Documents/1.txt', 'C:/Users/jsrojasa/Documents/electronPro/1.txt')
//    console.log('success!')
//  } catch (err) {
//    console.error(err)
//  }
//}

//copyFiles()

function addImageEvents(){
  const thumbs = document.querySelectorAll('li.list-group-item')

  for (let i = 0; i < thumbs.length; i++) {
    thumbs[i].addEventListener('click', function(){
      changeImage(this)
    })
  }
}

function changeImage (node) {
  if (node) {
    const selected = document.querySelector('li.selected')
    if (selected) {
      selected.classList.remove('selected')
    }
    node.classList.add('selected')
    const image = document.getElementById('image-displayed')
    image.src = node.querySelector('img').src
    image.dataset.original = image.src
    document.getElementById('filters').selectedIndex = 0
  } else {
    document.getElementById('image-displayed').src = ''
  }
}



// function searImagesEvent(){
//
//   const searchBox = document.getElementById('search-box')
//
//   searchBox.addEventListener('keyup', function(){
//       const regex = new RegExp(this.value.toLowerCase(),'gi')
//     if (this.value.length >0) {
//       const thumbs = document.querySelectorAll('li.list-group-item img')
//       for (var i = 0; i < thumbs.length; i++) {
//         const fileUrl = url.parse(thumbs[i].src)
//         const fileName = path.basename(fileUrl.pathname)
//         if (fileName.match(regex)) {
//           thumbs[i].parentNode.classList.remove('hidden')
//         }
//         else {
//           thumbs[i].parentNode.classList.add('hidden')
//         }
//       }
//         selectFirstImage()
//     }
//     else {
//       const hidden = document.querySelectorAll('li.hidden')
//       for (var i = 0; i < hidden.length; i++) {
//         hidden[i].classList.remove('hidden')
//       }
//     }
//   })
// }



function selectFirstImage(){
  const image = document.querySelector('li.list-group-item:not(.hidden)')
  console.log(image);
  changeImage(image)
}

//
function selectEvent(){
  const select = document.getElementById('filters')

  select.addEventListener('change', function(){
    applyFilter(this.value, document.getElementById('image-displayed'))
  })
}
