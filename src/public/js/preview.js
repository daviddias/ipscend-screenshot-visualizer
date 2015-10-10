// just for testing
var hash = window.document.location.hash || '#QmdqoXTW5WGEMiU1QiUnhBMHQpiVnQ8sKSUrN3pb6k3PxF'

var screenshotURLs = []

if (hash !== '') {
  var ipfs = window.ipfsAPI('localhost', '5001')
  hash = hash.slice(1)

  ipfs.cat(hash, function (err, res) {
    if (err || !res) {
      return console.error('err', err)
    }
    var div = document.querySelectorAll('.previews')[0]
    console.log(res)
    var baseurl = 'http://localhost:8080/ipfs/'
    res.forEach(function (version) {
      console.log(version)
      if (version.snapshot) {
        var elDiv = document.createElement('div')
        elDiv.className = 'col-md-4'
        var elImg = document.createElement('img')
        elImg.src = baseurl + version.snapshot
        screenshotURLs.push('http://ipfs.io/ipfs/' + version.snapshot)
        elImg.width = '480'
        div.appendChild(elDiv)
        elDiv.appendChild(elImg)
      }
    })
  })
} else {
  console.log('missing hash')
}

function createGif () {
  console.log('GIF')
  gifshot.createGIF({
    images: screenshotURLs
  }, function (obj) {
    if (!obj.error) {
      var image = obj.image
      var animatedImage = document.createElement('img')
      animatedImage.src = image
      document.body.appendChild(animatedImage)
    }
  })
}
