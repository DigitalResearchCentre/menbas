webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	eval("__webpack_require__(2);\n__webpack_require__(5);\n__webpack_require__(7);\n__webpack_require__(9);\n\nvar AppComponent = __webpack_require__(13);\n\ndocument.addEventListener('DOMContentLoaded', function() {\n  ng.platform.browser.bootstrap(AppComponent, [\n    ng.http.HTTP_PROVIDERS,\n    ng.router.ROUTER_PROVIDERS,\n  ]).catch(function(err) {\n    console.error(err);\n  });\n});\n\n\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./app/boot.js\n ** module id = 0\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./app/boot.js?");

/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	eval("// style-loader: Adds some css to the DOM by adding a <style> tag\n\n// load the styles\nvar content = __webpack_require__(10);\nif(typeof content === 'string') content = [[module.id, content, '']];\n// add the styles to the DOM\nvar update = __webpack_require__(12)(content, {});\nif(content.locals) module.exports = content.locals;\n// Hot Module Replacement\nif(false) {\n\t// When the styles change, update the <style> tags\n\tif(!content.locals) {\n\t\tmodule.hot.accept(\"!!./../../node_modules/css-loader/index.js!./../../node_modules/less-loader/index.js?sourceMap!./app.less\", function() {\n\t\t\tvar newContent = require(\"!!./../../node_modules/css-loader/index.js!./../../node_modules/less-loader/index.js?sourceMap!./app.less\");\n\t\t\tif(typeof newContent === 'string') newContent = [[module.id, newContent, '']];\n\t\t\tupdate(newContent);\n\t\t});\n\t}\n\t// When the module is disposed, remove the <style> tags\n\tmodule.hot.dispose(function() { update(); });\n}\n\n/*****************\n ** WEBPACK FOOTER\n ** ./app/app.less\n ** module id = 9\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./app/app.less?");

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	eval("exports = module.exports = __webpack_require__(11)();\n// imports\n\n\n// module\nexports.push([module.id, \".flex-row {\\n  display: flex;\\n  display: -webkit-flex;\\n  flex-flow: row nowrap;\\n  justify-content: flex-start;\\n  align-items: stretch;\\n  align-content: stretch;\\n  -webkit-flex-flow: row nowrap;\\n  -webkit-justify-content: flex-start;\\n  -webkit-align-items: stretch;\\n  -webkit-align-content: stretch;\\n}\\n.flex-column {\\n  display: flex;\\n  display: -webkit-flex;\\n  flex-flow: row nowrap;\\n  justify-content: flex-start;\\n  align-items: stretch;\\n  align-content: stretch;\\n  -webkit-flex-flow: row nowrap;\\n  -webkit-justify-content: flex-start;\\n  -webkit-align-items: stretch;\\n  -webkit-align-content: stretch;\\n  flex-direction: column;\\n  -webkit-flex-direction: column;\\n}\\nhtml,\\nbody {\\n  width: 100%;\\n  height: 100%;\\n  margin: 0;\\n  padding: 0;\\n  border: none;\\n  overflow: hidden;\\n}\\nhtml x-app,\\nbody x-app {\\n  height: 100%;\\n  width: 100%;\\n  display: flex;\\n  display: -webkit-flex;\\n  flex-flow: row nowrap;\\n  justify-content: flex-start;\\n  align-items: stretch;\\n  align-content: stretch;\\n  -webkit-flex-flow: row nowrap;\\n  -webkit-justify-content: flex-start;\\n  -webkit-align-items: stretch;\\n  -webkit-align-content: stretch;\\n  flex-direction: column;\\n  -webkit-flex-direction: column;\\n}\\nhtml x-app x-header,\\nbody x-app x-header {\\n  flex: 0 0;\\n  -webkit-flex: 0 0;\\n  flex-basis: 40px;\\n  -webkit-flex-basis: 40px;\\n  display: flex;\\n  display: -webkit-flex;\\n  flex-flow: row nowrap;\\n  justify-content: flex-start;\\n  align-items: stretch;\\n  align-content: stretch;\\n  -webkit-flex-flow: row nowrap;\\n  -webkit-justify-content: flex-start;\\n  -webkit-align-items: stretch;\\n  -webkit-align-content: stretch;\\n  align-items: center;\\n  align-content: flex-start;\\n  border-bottom: 2px solid gray;\\n}\\nhtml x-app x-header > .left,\\nbody x-app x-header > .left {\\n  flex: 1 1;\\n  -webkit-flex: 1 1;\\n  flex-basis: auto;\\n  -webkit-flex-basis: auto;\\n  display: flex;\\n  display: -webkit-flex;\\n  flex-flow: row nowrap;\\n  justify-content: flex-start;\\n  align-items: stretch;\\n  align-content: stretch;\\n  -webkit-flex-flow: row nowrap;\\n  -webkit-justify-content: flex-start;\\n  -webkit-align-items: stretch;\\n  -webkit-align-content: stretch;\\n}\\nhtml x-app x-header > .left > .item,\\nbody x-app x-header > .left > .item {\\n  padding: 0 10px;\\n}\\nhtml x-app x-header > .right,\\nbody x-app x-header > .right {\\n  flex: 1 1;\\n  -webkit-flex: 1 1;\\n  flex-basis: auto;\\n  -webkit-flex-basis: auto;\\n  display: flex;\\n  display: -webkit-flex;\\n  flex-flow: row nowrap;\\n  justify-content: flex-start;\\n  align-items: stretch;\\n  align-content: stretch;\\n  -webkit-flex-flow: row nowrap;\\n  -webkit-justify-content: flex-start;\\n  -webkit-align-items: stretch;\\n  -webkit-align-content: stretch;\\n  justify-content: flex-end;\\n}\\nhtml x-app x-header > .right > .item,\\nbody x-app x-header > .right > .item {\\n  padding: 0 10px;\\n}\\nhtml x-content,\\nbody x-content {\\n  flex-grow: 1;\\n  flex-shrink: 1;\\n  flex-basis: 0px;\\n  display: flex;\\n  flex-flow: row nowrap;\\n  justify-content: flex-start;\\n  align-items: stretch;\\n  align-content: stretch;\\n}\\nhtml x-content x-sidebar,\\nbody x-content x-sidebar {\\n  flex: 1 1 20%;\\n  border-right: 2px solid gray;\\n  overflow: auto;\\n}\\nhtml x-content x-sidebar .item,\\nbody x-content x-sidebar .item {\\n  cursor: pointer;\\n}\\nhtml x-content x-viewer,\\nbody x-content x-viewer {\\n  flex: 1 1 80%;\\n  overflow: auto;\\n}\\n\", \"\"]);\n\n// exports\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ../~/css-loader!../~/less-loader?sourceMap!./app/app.less\n ** module id = 10\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./app/app.less?../~/css-loader!../~/less-loader?sourceMap");

/***/ },
/* 11 */,
/* 12 */,
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	eval("var AppComponent = ng.core.Component({\n  selector: 'x-app',\n  templateUrl: '/app/app.html',\n  directives: [\n    ng.router.ROUTER_DIRECTIVES,\n    __webpack_require__(14),\n  ],\n}).Class({\n  constructor: [function() {\n    var a = {\n      files: [{\n        name: 'energydata_2016_6.csv',\n        types: {\n          linechart: '../data/linechart1.json',\n          energy: '../data/energy.json',\n        },\n      }, {\n        name: 'test.csv',\n        types: {\n          linechart: '../data/linechart1.json',\n          energy: '../data/energy.json',\n        },\n      }],\n    };\n  }],\n});\n\nng.router.RouteConfig([{\n  path: '/app/', name: 'Home', component: __webpack_require__(17),\n}, {\n  path: '/app/upload', name: 'Upload', \n  component: __webpack_require__(18), \n}])(AppComponent);\n\nmodule.exports = AppComponent;\n\n\n/*\nd3.xhr('../data/energydata_2016_6.csv').get(function(err, resp) {\n  var data = {}\n    , places = data.places = {}\n    , raw, header, rows, years, cur\n  ;\n  raw = _.map(resp.responseText.split(/[\\n\\r]/), function(l) {\n    return l.split(',');\n  });\n  years = raw[2].slice(1);\n  rows = raw.splice(4, 15);\n  _.each(raw[1].slice(1), function(value, i) {\n    if (value) {\n      cur = places[value] = {};\n      _.each(rows, function(r) {\n        cur[r[0]] = [];\n      });\n    }\n    if (cur){\n      _.each(rows, function(r) {\n        cur[r[0]].push([years[i], r[i+1]]);\n      });\n    }\n  });\n\n});\n*/\n\n\n\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./app/app.component.js\n ** module id = 13\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./app/app.component.js?");

/***/ },
/* 14 */
/***/ function(module, exports) {

	eval("var HeaderComponent = ng.core.Component({\n  selector: 'x-header',\n  templateUrl: '/app/header.html',\n  directives: [\n  ],\n}).Class({\n  constructor: [function() {\n  }],\n});\n\nmodule.exports = HeaderComponent;\n\n\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./app/header.component.js\n ** module id = 14\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./app/header.component.js?");

/***/ },
/* 15 */
/***/ function(module, exports) {

	eval("var SidebarComponent = ng.core.Component({\n  selector: 'x-sidebar',\n  templateUrl: '/app/sidebar.html',\n  directives: [\n  ],\n}).Class({\n  constructor: [function() {\n  }],\n  onClick: function(evt, file) {\n    evt.preventDefault();\n\n    //Dispatcher.viewer$.next(file);\n    \n  }\n});\n\nmodule.exports = SidebarComponent;\n\n\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./app/sidebar.component.js\n ** module id = 15\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./app/sidebar.component.js?");

/***/ },
/* 16 */
/***/ function(module, exports) {

	eval("var ViewerComponent = ng.core.Component({\n  selector: 'x-viewer',\n  templateUrl: '/app/viewer.html',\n  directives: [\n  ],\n}).Class({\n  constructor: [function() {\n  //, LineChart = require('./linechart')\n  //, MyChart = require('./mychart')\n  //, d3 = require('d3')\n\n  }],\n});\n\nmodule.exports = ViewerComponent;\n\n/*\n\nvar Viewer = React.createClass({\n  componentDidMount: function() {\n    var self = this;\n    Dispatcher.viewer$.subscribe(function(file) {\n      self.setState({\n        file: file,\n      });\n      self.setState({type: null});\n    });\n  },\n  getInitialState: function() {\n    return {\n    };\n  },\n  onTypeChange: function(e) {\n    this.setState({type: e.target.value});\n  },\n  render: function() {\n    var state = this.state\n      , file = state.file\n      , type = state.type\n      , select, chart\n    ;\n    if (file) {\n      var types = _.map(file.types, function(path, type) {\n        return (\n          <option value={type}>{type}</option>\n        );\n      });\n      if (type === 'linechart') {\n        chart = <LineChart/>;\n      } else if (type === 'energy') {\n        chart = <MyChart/>;\n      }\n      select = <select onChange={this.onTypeChange}>{types}</select>;\n    }\n\n    return (\n      <div className=\"viewer\">\n        {select}\n        {chart}\n      </div>\n    );\n  },\n});\n*/\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./app/viewer.component.js\n ** module id = 16\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./app/viewer.component.js?");

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	eval("var HomeComponent = ng.core.Component({\n  selector: 'x-home',\n  template: '<x-sidebar></x-sidebar><x-viewer></x-viewer>',\n  directives: [\n    __webpack_require__(15),\n    __webpack_require__(16),\n  ],\n}).Class({\n  constructor: [function() {\n  }],\n});\n\nmodule.exports = HomeComponent;\n\n\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./app/home.component.js\n ** module id = 17\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./app/home.component.js?");

/***/ },
/* 18 */
/***/ function(module, exports) {

	eval("var UploadComponent = ng.core.Component({\n  selector: 'x-upload',\n  templateUrl: '/app/upload.html',\n  directives: [\n  ],\n}).Class({\n  constructor: [function() {\n  }],\n});\n\nmodule.exports = UploadComponent;\n\n\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./app/upload.component.js\n ** module id = 18\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./app/upload.component.js?");

/***/ }
]);