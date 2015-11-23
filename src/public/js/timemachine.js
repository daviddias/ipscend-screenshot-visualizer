/**
 * Script helpful to emulate Mac OS X timemachine effect with javascript/css
 * Based on this code: https://github.com/coderLMN/CSS3dTimeMachine
 */
var CURRENT_ITEM_STATE = {
  translate_y: 0,
  scale: 1,
  opacity: 1,
};

var INITIAL_MAX_INDEX = 1000;

/**
 * Intialize timemachine preview
 *
 * @param {DOM} versions
 * @param {Object} options
 */
function TimeMachine(versions_dom, options) {
  this.options = _.extend({
    space: -30,
    page_size: 10,
    angle: 3,
    scale_change: 0.05,
    y_scale_change: 0.02,
    opacity_scale_change: 0.09,
    MAX_SIZE: 60,
    current_index: 1,
    max_index: 0,
    next_button: null,
    prev_button: null,
  }, options);
  
  this.next_button = this.options.next_button;
  this.prev_button = this.options.prev_button;
  this.versions_dom = versions_dom;
  this.current_index = this.options.current_index;
  this.data = [];	
  this.versions = [];
  this.max_index = this.options.max_index;
}

TimeMachine.prototype = {
  /**
   * Init timemachine viewer with ipscend versions array
   *
   * @param {Arrya<Object>} versions
   */
  init: function (versions) {
    this.versions = versions.reverse();

    var self = this;
    var paginated_versions = this.versions.slice(0, this.options.page_size);

    _.each(paginated_versions, function (version, i) {
      var index = i + 1;
      var item = self.add(index, version);
      self.animate(index, item);
    });
  },

  /**
   * Add new item to list
   *
   * @param {Integer} index
   * @param {Object} version
   * @return {Array}
   */
  add: function (index, version) {
    var self = this;
    var z_index = INITIAL_MAX_INDEX - index;

    this.data.push(_.extend(this.getItemData(this.current_index, index), {
      z_index: z_index,
      version: version,
    }));

    var item = document.createElement('li');

    item.className = 'browser-ui';
    item.id = index;
    item.style.zIndex = z_index;
    item.onclick = function() {
      self.jumpTo(index);
    };

    var image = this.getTemplate(version);

    item.innerHTML = image;
    this.versions_dom.appendChild(item);
    this.max_index ++;

    return _.last(this.data);
  },

  /**
   * Get header template
   *
   * @param {Object} version
   * @return {String} 
   */
  getTemplate: function (version, publication_date) {
    var template = _.template('<div class="cf browser-ui__header">' + 
      '<span class="browser-ui__buttons"><span></span><span></span><span></span></span>' +
      '<span class="browser-ui__title">Published: <%= date %></span>' +
      '</div>' +
      '<div class="browser-ui__content">' +
      '<img src="<%= snapshot %>"/>' +
      '</div>');

    return template({
      date: new Date(version.timestamp),
      snapshot: version.snapshot,
    });
  },

  /**
   * keep moving forward to show the n th item
   * 
   * @param {Integer} index
   */
  jumpTo: function(index) {	
    for(var i = this.current_index; i < index; i++){
      this.next();
    }
  },

  /**
   * Move to previous image
   */
  prev: function() {
    if(this.current_index <= 1) {
      return;
    }

    this.current_index --;
    this.moveTo(this.current_index);
  },

  /**
   * Move to next image
   */
  next: function() {
    if(this.current_index >= this.data.length) {
      return;
    }

    this.addItem();

    this.current_index ++;
    this.moveTo(this.current_index);
  },

  /**
   * Add a new item if it greater than current version
   */
  addItem: function () {
    var next_index = this.current_index + 1 + this.options.page_size - 1;
    var version = this.versions[next_index - 1];

    if (next_index <= this.max_index || !version) {	
      return;
    }

    this.add(next_index, version);
  },

  /**
   * Animate changing CSS properties of item
   * 
   * @param {Integer} item_index
   * @param {Object} item
   */
  animate: function(item_index, item) {
    var self = this;
    var data_index = item_index - 1;
    var item_data = item ? item : this.data[data_index];

    var element = document.getElementById(item_index);

    element.onclick = function() {
      self.jumpTo(item_index);
    };

    var transform = 'translateY(' + item_data.translate_y + 'px) scale(' + item_data.scale + ', ' + item_data.scale + ')';
    element.style.webkitTransform = transform;
    element.style.transform = transform;
    element.style.opacity = item_data.opacity;
    element.style.zIndex = item_data.opacity === 0 ? -1000 : this.data[data_index].z_index;
  },

  /**
   * Move each element base on current index
   * 
   * @param {Integer} index
   */
  moveTo: function(current_index) {
    self = this;

    _.each(this.data, function (data_item, i) {
      var index = i + 1;

      var item = self.getItemData(current_index, index);

      self.animate(index, item);
    });

    this.toggleButtons();
  },

  /**
   * Enable/disable navigation buttons
   */
  toggleButtons: function() {
    this.prev_button.disabled = this.current_index === this.max_index;
    this.next_button.disabled = this.current_index  === 1;
  },

  /**
   * Get data to position and scale the item
   *
   * @param {Integer} current_index
   * @param {Integer} index
   * @return {Object} 
   */
  getItemData: function(current_index, index) {
    var translate_y;
    var scale;
    var opacity;

    if (current_index === index) {
      return CURRENT_ITEM_STATE;
    } else {
      var difference = index - current_index;

      var abs_difference = Math.abs(difference);
      var y_scale = 1 - (this.options.y_scale_change * abs_difference);

      var translate_y_difference = (Math.abs(this.options.space * abs_difference) * y_scale);
      var scale_difference = this.options.scale_change * abs_difference;
      var opacity_difference = this.options.opacity_scale_change * abs_difference;

      if (difference > 0) {
        return {
          translate_y: CURRENT_ITEM_STATE.translate_y - translate_y_difference,
          scale: CURRENT_ITEM_STATE.scale - scale_difference,
          opacity: CURRENT_ITEM_STATE.opacity - opacity_difference,
        };
      }

      return {
        translate_y: CURRENT_ITEM_STATE.translate_y + translate_y_difference,
        scale: CURRENT_ITEM_STATE.scale + scale_difference,
        opacity: 0,
      };
    }
  }
};

