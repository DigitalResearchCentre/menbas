var redux = require('redux')
  , _ = require('lodash')
  , Http = ng.http.Http
  , Store = require('./store')
  , Actions = require('../actions').Actions
;


var APIService = ng.core.Injectable().Class({
  constructor: [Http, Store, function(http, store){
    this.http = http;
    this.store = store;
    this.actions = redux.bindActionCreators(Actions, store.dispatch);
  }],
  get: function(url, options) {
    var opts = this.prepareOptions(options);
    return this.http.get(url, opts);
  },
  patch: function(url, data, options) {
    var opts = this.prepareOptions(options);
    return this.http.patch(url, JSON.stringify(data), opts);
  },
  post: function(url, data, options) {
    var opts = this.prepareOptions(options);
    return this.http.post(url, JSON.stringify(data), opts);
  },
  save: function(user) {
    var options = this.prepareOptions({});
    return this.http.post('/users', JSON.stringify(user), options);
  },
  prepareOptions: function(options) {
    options = _.clone(options || {});
    options.headers = _.assign({
      'Content-Type': 'application/json'
    }, options.headers);
    return options;
  },
  checkAuth: function() {
    var actions = this.actions;

    return this.get('/auth')
      .map(function(res) {
        return res.json();
      })
      .subscribe(function(user) {
        actions.auth(user);
      }, function(err) {
        console.log(err);
        actions.auth(new Error(err));
      });
  },
  login: function(username, password) {
    var actions = this.actions;
    return this
      .post('/login', {
        username: username,
        password: password,
      })
      .map(function(res) {
        return res.json();
      })
      .subscribe(function(user) {
        actions.auth(user);
      }, function(err) {
        actions.auth(new Error(err));
      });
  },
  showUploadCSVModal: function(show) {
    return this.actions.showUploadCSVModal(show);
  },
  showEditCSVModal: function(show) {
    return {
      type: Types.showEditCSVModal,
      payload: {
        show: show,
      },
    };
  },
  selectFile: function(file) {
    return {
      type: Types.selectFile,
      payload: {
        file: file,
      },
    };
  },
  uploadCSV: function(file) {
    var api = this.api;
    return function(dispatch, getState) {
      dispatch({
        type: Types.uploadCSV,
        payload: {
          file: file,
        },
      });
      return api.uploadCSV(file)
      .catch(function(err) {
        dispatch(handleError(err, Types.uploadCSV));
      });
    };
  },

  uploadCSV: function(file) {
    return this
      .post('/uploadCSV', file)
      .toPromise();
  }
});

module.exports = APIService;

/*
  showUploadCSVModal: function(show) {
    return {
      type: Types.showUploadCSVModal,
      payload: {
        show: show,
      },
    };
  },
  showEditCSVModal: function(show) {
    return {
      type: Types.showEditCSVModal,
      payload: {
        show: show,
      },
    };
  },
  selectFile: function(file) {
    return {
      type: Types.selectFile,
      payload: {
        file: file,
      },
    };
  },
  uploadCSV: function(file) {
    var api = this.api;
    return function(dispatch, getState) {
      dispatch({
        type: Types.uploadCSV,
        payload: {
          file: file,
        },
      });
      return api.uploadCSV(file)
        .catch(function(err) {
          dispatch(handleError(err, Types.uploadCSV));
        });
    };
  },
*/

