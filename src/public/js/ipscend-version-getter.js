var DEFAULT_IPFS_HASH = 'QmdqoXTW5WGEMiU1QiUnhBMHQpiVnQ8sKSUrN3pb6k3PxF';

/**
 * Start ipscend visualizer and attach to DOM node
 */
function IpscendVersionGetter() {
  this.options = _.extend({
    base_ipfs_url: 'http://localhost:8080/ipfs/',
    ipfs_host: 'localhost',
    ipfs_port: '5001',
    hash: DEFAULT_IPFS_HASH,
  });
  
  this.ipfs = new window.ipfsAPI(this.options.ipfs_host, this.options.ipfs_port);
  this.init();
}

IpscendVersionGetter.prototype = {
  /**
   * Start ipscend viewer. Get ipscend by URL hash
   * and get data with ipfs javascript API
   * 
   * @param {Function} success
   * @param {Function} error
   */
  init: function (success, error) {
    var hash = window.document.location.hash.slice(1) || this.options.hash;
    var self = this;

    this.ipfs.cat(hash, function (err, res) {
      if (!_.isFunction(success)) {
        return;
      }

      var versions = [];

      if (err || !res) {
        console.log('error on cat ipfs', err);
        error(err);
        return;
      }

      res.forEach(function (version) {
        if (version.snapshot) {
          versions.push({
            snapshot: self.options.base_ipfs_url + version.snapshot,
            hash: version.hash,
            timestamp: version.timestamp,
          });
        }
      });
      
      success(versions);
    });
  },
};
