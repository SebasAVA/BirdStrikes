function applyFilter(filter, currentImage){
let imgObj = new Image();
imgObj.src = currentImage.src;

filterous.importImage(imgObj, {})
  .applyInstaFilter(filter)
  .renderHtml(currentImage);
}

module.exports = applyFilter
