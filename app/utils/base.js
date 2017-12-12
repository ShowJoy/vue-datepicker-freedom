function dragFile(droptarget) {
  const URL = window.URL || window.webkitURL;
  let getBlobURL = URL.createObjectURL;
  let revokeBlobURL = URL.revokeObjectURL;

  droptarget.ondragenter = function(e) {
    let types = e.dataTransfer.types;
    if (!types || (types.contains && types.contains('Files')) || (types.indexOf && types.indexOf('Files') !== -1)) {
        droptarget.classList.add('active');
        return false; // prevent default event
      }
  };
  droptarget.ondragleave = function() {
    droptarget.classList.remove('active');
  };

  droptarget.ondragover = function(e) {return false;};

  droptarget.ondrop = function(e) {
    let files = e.dataTransfer.files;
    console.log(files);
    for (let i = 0; i < files.length; i++) {
      let item = files[i];
      let type = item.type;
      console.log(type, type.substring(0, 6));
      if (type.substring(0, 6) === 'image/') {
        let img = document.createElement('img');
        img.src = getBlobURL(item);
        img.onload = function() {
          this.width = 100;
          document.body.appendChild(this);
          revokeBlobURL(this.src);
        };
      }
    }
    droptarget.classList.remove('active');
    return false;
  };
}

function readFile(f) {
  let reader = new FileReader();
  console.log(f.type);
  // reader.readAsText(f);
  console.log(f.slice(0, 4));
  reader.readAsArrayBuffer(f.slice(0, 4));
  reader.onload = function() {
    let buffer = reader.result;
    console.log(buffer);
    let view = new DataView(buffer); // eslint-disable-line
    let magic = view.getUint32(0, false);
    console.log(magic);
  };
  reader.onerror = function(e) {
    console.log('Error: ', e);
  };
}

export {
  dragFile,
  readFile
};
