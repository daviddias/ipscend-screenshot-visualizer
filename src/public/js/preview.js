// just for testing
var hash = window.document.location.hash || '#QmdqoXTW5WGEMiU1QiUnhBMHQpiVnQ8sKSUrN3pb6k3PxF'

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
        var elImg = document.createElement('img')
        elImg.src = baseurl + version.snapshot
        elImg.width = '480'
        div.appendChild(elImg)
      }
    })
    $('#coverflow').coverflow()
  })
} else {
  console.log('missing hash')
}

