if (window.document.location.hash !== '') {
  var ipfs = window.ipfsAPI('localhost', '5001')
  var hash = window.document.location.hash.slice(1)

  console.log(hash)
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
        var el = document.createElement('img')
        el.src = baseurl + version.snapshot
        div.appendChild(el)
      }
    })
  })
} else {
  console.log('missing hash')
}

