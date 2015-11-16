define([
  "jquery",
  "underscore",
  "hyprlive",
  "modules/backbone-mozu-model"
], function ($, _, Hypr, Backbone) {

  /**
   * [defaultPageSize description]
   * @type {[type]}
   */
  var defaultPageSize = Hypr.getThemeSetting('defaultPageSize'),
    defaultSort = Hypr.getThemeSetting('defaultSort'),
    sorts = [{
      "text": Hypr.getLabel('default'),
      "value": defaultSort
    }, {
      "text": Hypr.getLabel('sortByPriceAsc'),
      "value": "price asc"
    }, {
      "text": Hypr.getLabel('sortByPriceDesc'),
      "value": "price desc"
    }, {
      "text": Hypr.getLabel('sortByNameAsc'),
      "value": "productName asc"
    }, {
      "text": Hypr.getLabel('sortByNameDesc'),
      "value": "productName desc"
    }, {
      "text": Hypr.getLabel('sortByDateDesc'),
      "value": "createDate desc"
    }, {
      "text": Hypr.getLabel('sortByDateAsc'),
      "value": "createDate asc"
    }];


  /**
   * [PagedCollection description]
   * @type {[type]}
   */
  var PagedCollection = Backbone.MozuPagedCollection = Backbone.MozuModel.extend({
    helpers: [
      'firstIndex',
      'lastIndex',
      'middlePageNumbers',
      'hasPreviousPage',
      'hasNextPage',
      'currentPage',
      'sorts',
      'currentSort'
    ],

    validation: {
      pageSize: {
        min: 1
      },
      pageCount: {
        min: 1
      },
      totalCount: {
        min: 0
      },
      startIndex: {
        min: 0
      }
    },

    dataTypes: {
      pageSize: Backbone.MozuModel.DataTypes.Int,
      pageCount: Backbone.MozuModel.DataTypes.Int,
      startIndex: Backbone.MozuModel.DataTypes.Int,
      totalCount: Backbone.MozuModel.DataTypes.Int
    },

    defaultSort: defaultSort,

    _isPaged: true,

    /**
     * [getQueryParams description]
     * @return {[type]} [description]
     */
    getQueryParams: function () {
      var self = this,
        lrClone = _.clone(this.lastRequest);

      _.each(lrClone, function (v, p) {
        if (self.baseRequestParams && (p in self.baseRequestParams)) {
          delete lrClone[p];
        }
      });

      if (parseInt(lrClone.pageSize, 10) === defaultPageSize) {
        delete lrClone.pageSize;
      }

      var startIndex = this.get('startIndex');

      if (startIndex) {
        lrClone.startIndex = startIndex;
      }

      return lrClone;
    },


    /**
     * [getQueryString description]
     * @return {[type]} [description]
     */
    getQueryString: function () {
      var params = this.getQueryParams();
      if (!params || _.isEmpty(params)) {
        return "";
      }
      return "?" + $.param(params)
        .replace(/\+/g, ' ');
    },


    /**
     * [buildRequest description]
     * @return {[type]} [description]
     */
    buildRequest: function () {
      var conf = this.baseRequestParams ? _.clone(this.baseRequestParams) : {},
        pageSize = this.get("pageSize"),
        startIndex = this.get("startIndex"),
        sortBy = $.deparam().sortBy || this.currentSort() || defaultSort;
      conf.pageSize = pageSize;
      if (startIndex) {
        conf.startIndex = startIndex;
      }
      if (sortBy) {
        conf.sortBy = sortBy;
      }
      return conf;
    },


    /**
     * [previousPage description]
     * @return {[type]} [description]
     */
    previousPage: function () {
      try {
        return this.apiModel.prevPage(this.lastRequest);
      }
      catch (e) {}
    },


    /**
     * [nextPage description]
     * @return {[type]} [description]
     */
    nextPage: function () {
      try {
        return this.apiModel.nextPage(this.lastRequest);
      }
      catch (e) {}
    },


    /**
     * [syncIndex description]
     * @param  {[type]} currentUriFragment [description]
     * @return {[type]}                    [description]
     */
    syncIndex: function (currentUriFragment) {
      try {
        var uriStartIndex = parseInt(($.deparam(currentUriFragment).startIndex || 0), 10);
        if (!isNaN(uriStartIndex) && uriStartIndex !== this.apiModel.getIndex()) {
          this.lastRequest.startIndex = uriStartIndex;
          return this.apiModel.setIndex(uriStartIndex, this.lastRequest);
        }
      }
      catch (e) {}
    },


    /**
     * [syncIndex description]
     * @param  {[type]} currentUriFragment [description]
     * @return {[type]}                    [description]
     */
    setPage: function (num) {
      num = parseInt(num, 10);
      if (num != this.currentPage() && num <= parseInt(this.get('pageCount'), 10)) return this.apiModel.setIndex((num - 1) * parseInt(this.get('pageSize'), 10), this.lastRequest);
    },


    /**
     * [changePageSize description]
     * @return {[type]} [description]
     */
    changePageSize: function () {
      return this.apiGet($.extend(this.lastRequest, {
        pageSize: this.get('pageSize')
      }));
    },


    /**
     * [changePageSize description]
     * @return {[type]} [description]
     */
    firstIndex: function () {
      return this.get("startIndex") + 1;
    },


    /**
     * [changePageSize description]
     * @return {[type]} [description]
     */
    lastIndex: function () {
      return this.get("startIndex") + this.get("items").length;
    },


    /**
     * [changePageSize description]
     * @return {[type]} [description]
     */
    hasPreviousPage: function () {
      return this.get("startIndex") > 0;
    },


    /**
     * [changePageSize description]
     * @return {[type]} [description]
     */
    hasNextPage: function () {
      return this.lastIndex() < this.get("totalCount");
    },


    /**
     * [changePageSize description]
     * @return {[type]} [description]
     */
    currentPage: function () {
      return Math.ceil(this.firstIndex() / (this.get('pageSize') || 1));
    },


    /**
     * [changePageSize description]
     * @return {[type]} [description]
     */
    middlePageNumbers: function () {
      var current = this.currentPage(),
        ret = [],
        pageCount = this.get('pageCount'),
        i = Math.max(Math.min(current - 2, pageCount - 4), 2),
        last = Math.min(i + 5, pageCount);
      while (i < last) {
        ret.push(i++);
      }
      return ret;
    },


    /**
     * [changePageSize description]
     * @return {[type]} [description]
     */
    sorts: function () {
      return sorts;
    },


    /**
     * [changePageSize description]
     * @return {[type]} [description]
     */
    currentSort: function () {
      return (this.lastRequest && this.lastRequest.sortBy && decodeURIComponent(this.lastRequest.sortBy).replace(/\+/g, ' ')) || '';
    },


    /**
     * [changePageSize description]
     * @return {[type]} [description]
     */
    sortBy: function (sortString) {
      return this.apiGet($.extend(this.lastRequest, {
        sortBy: sortString
      }));
    },


    /**
     * [changePageSize description]
     * @return {[type]} [description]
     */
    initialize: function () {
      this.lastRequest = this.buildRequest();
    }
  });


  return Backbone;
});
