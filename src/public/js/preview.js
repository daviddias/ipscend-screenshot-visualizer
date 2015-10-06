// just for testing
var hash = window.document.location.hash || '#QmU4HVaMoFdFrD3Cbw8ALFw1tt6Xe9i5qdEimZCaNvWvKE'

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
        var el = document.createElement('img')
        el.src = baseurl + version.snapshot
        div.appendChild(el)
      }
    })
  })
} else {
  console.log('missing hash')
}

