import update from 'react-addons-update';
import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import _ from 'lodash';
import { Types } from '../actions';
import initialState from '../initialState';
import config from '../config';

function createReducer(reducers, errorReducers, defaultState={}) {
  return function(state=defaultState, action) {
    let _reducers = action.error ? errorReducers : reducers;
    if (_reducers.hasOwnProperty(action.type)) {
      return _reducers[action.type](state, action);
    } else {
      return state;
    }
  };
}

function reduceReducer(reducers) {
  return function(state, action) {
    return _.reduce(reducers, function(_state, reducer) {
      return reducer(_state, action);
    }, state);
  };
}

const rootReducers = {
  [Types.auth]: function(state, action) {
    var user = action.payload;
    return {
      ...state,
      user: user,
      files: user.files || [],
    };
  },
  [Types.selectFile]: function(state, action) {
    const file = action.payload;
    const index = _.findIndex(state.files, (f)=> f._id === file._id);
    return update(state, {
      files: {[index]: {$set: file}},
      selectedFile: {$set: action.payload},
    });
  },
  [Types.uploadCSV]: function(state, action) {
    const file = action.payload.value;
    const index = _.findIndex(state.files, (f)=> f._id === file._id);
    if (index === -1) {
      return update(state, {
        files: {$push: [file]},
      });
    } else {
      return update(state, {
        files: {[index]: {$set: file}},
      });
    }
  },
  [Types.saveConfig]: function(state, action) {
    const { result, name } = action.payload;
    const file = result.value;
    const index = _.findIndex(state.files, (f)=> f._id === file._id);
    if (index === -1) {
      return state;
    } else {
      return update(state, {
        files: {[index]: {$set: file}},
        selectedFile: {
          $set: {
            ...state.selectedFile,
            file,
          }
        },
        selectedConfig: {
          config: {
            $set: _.find(file.configs, function(c) {
              return c.name === name;
            }),
          }
        }
      });
    }
  },
  [Types.removeConfig]: function(state, action) {
    const payload = action.payload;
    return {
      ...state,
      configs: _.filter(state.configs, function(config) {
        return config.name !== payload.name || config.file !== payload.file;
      }),
    };
  },
  [Types.selectConfig]: function(state, action) {
    let {
      config,
      data,
    } = action.payload;
    let {
      type, places, years, abbrs, xAxis,
      formulas = '',
    } = config || {};
    let objects = (data || {}).objects;
    let dataPlaces = data.places || {}
      , dataYears = data.years || {}
      , dataAbbrs = data.abbrs || {}
    ;
    _.each(_.groupBy(objects, function(obj) {
      return `${obj.place} ${obj.year}`;
    }), function(objs, key) {
      let place, year;
      _.each(objs, function(o) {
        if (o.place) {
          place = o.place;
        }
        if (o.year) {
          year = o.year;
        }
        return !(place && year);
      });
      objs = _.groupBy(objs, 'abbr');

      let script = _.map(objs, function(d, abbr) {
        return `var ${abbr} = ${d[0].value};`;
      }).join('');

      _.each(formulas.split(';'), function(cmd) {
        if (_.trim(cmd) === '') return;
        let [variable, formula] = cmd.split('=');
        try {
          let v = eval(`${script} ${formula};`);
          script += `var ${variable} = ${v};`;
          let d = {
            abbr: _.trim(variable),
            value: v,
            place: place,
            year: year,
          };
          objects.push(d);
          if (!dataPlaces[d.place]) {
            dataPlaces[d.place] = [];
          }
          dataPlaces[d.place].push(d);
          if (!dataYears[d.year]) {
            dataYears[d.year] = [];
          }
          dataYears[d.year].push(d);
          if (!dataAbbrs[d.abbr]) {
            dataAbbrs[d.abbr] = [];
          }
          dataAbbrs[d.abbr].push(d);
        } catch (e) {
          rootErrorReducer(state, {
            ...action,
            payload: e,
            error: true,
          });
        }
      });
    });

    return {
      ...state,
      selectedConfig: {
        config: {
          ..._.defaults({}, action.payload.config, {
            places: [],
            years: [],
            abbrs: [],
            sankey: {
                "UPH" : {
                    "x" : 202.0000152587890625,
                    "y" : 273
                },
                "LP" : {
                    "x" : 235,
                    "y" : 416
                },
                "LBP" : {
                    "x" : 294,
                    "y" : 489
                },
                "TP" : {
                    "x" : 370,
                    "y" : 562
                },
                "BR" : {
                    "x" : 501,
                    "y" : 415.0000152587890625
                },
                "FW" : {
                    "x" : 168.0000152587890625,
                    "y" : 530
                },
                "FP" : {
                    "x" : 737,
                    "y" : 273
                },
                "LBS" : {
                    "x" : 345.9999847412109375,
                    "y" : 387.0000152587890625
                },
                "LBW" : {
                    "x" : 324.9999847412109375,
                    "y" : 407.0000152587890625
                },
                "ASI" : {
                    "x" : 489,
                    "y" : 56
                },
                "L" : {
                    "x" : 463,
                    "y" : 169
                },
                "FCI" : {
                    "x" : 464,
                    "y" : 205
                },
                "EI" : {
                    "x" : 260,
                    "y" : 222
                },
                "TIC" : {
                    "x" : 292.9999847412109375,
                    "y" : 202
                },
                "links" : [
                    [
                        "LP",
                        "TP",
                        [
                            [
                                228,
                                359
                            ],
                            [
                                235.0000610351562500,
                                427
                            ],
                            [
                                238,
                                513
                            ],
                            [
                                286,
                                563
                            ],
                            [
                                378,
                                569
                            ]
                        ]
                    ],
                    [
                        "LBP",
                        "TP",
                        [
                            [
                                343,
                                419
                            ],
                            [
                                286,
                                514
                            ]
                        ]
                    ],
                    [
                        "TP",
                        "BR",
                        [
                            [
                                466,
                                557
                            ],
                            [
                                500,
                                529
                            ],
                            [
                                513,
                                495
                            ],
                            [
                                498,
                                402
                            ]
                        ]
                    ],
                    [
                        "TP",
                        "FP",
                        [
                            [
                                432,
                                580
                            ],
                            [
                                765,
                                558
                            ],
                            [
                                758,
                                346
                            ],
                            [
                                715,
                                235
                            ],
                            [
                                649,
                                156
                            ],
                            [
                                663,
                                175
                            ],
                            [
                                697,
                                211
                            ],
                            [
                                718,
                                240
                            ]
                        ]
                    ],
                    [
                        "BR",
                        "TIC",
                        [
                            [
                                460,
                                250.0000152587890625
                            ],
                            [
                                399,
                                155
                            ],
                            [
                                298.9999847412109375,
                                186.9999847412109375
                            ],
                            [
                                302,
                                255
                            ]
                        ]
                    ],
                    [
                        "FP",
                        "ASI",
                        [
                            [
                                621,
                                124
                            ],
                            [
                                548,
                                63
                            ]
                        ]
                    ],
                    [
                        "ASI",
                        "EI",
                        [
                            [
                                358,
                                63
                            ],
                            [
                                268.9999694824218750,
                                135
                            ],
                            [
                                256.9999847412109375,
                                200
                            ],
                            [
                                272,
                                257
                            ]
                        ]
                    ]
                ]
            },
            formulas: '',
          }),
        },
        data: {
          ...data,
          places: dataPlaces,
          years: dataYears,
          abbrs: dataAbbrs,
          objects: objects,
        },
      },
    };
  },
  [Types.updateFormula]: function(state, action) {
    console.log('TODO: updateFormula');
    return state;

    let _energies = _.get(state, 'selectedFile._energies', {});
    let energies = _.get(state, 'selectedFile.energies', {});
    let abbr = action.payload.abbr;
    let energy = _energies[energies[abbr]];
    _energies = _.assign({}, _energies, {
      [energies[abbr]]: _.assign({}, energy, action.payload)
    });

    return {
      ...state,
      selectedFile: {
        ...state.selectedFile,
        _energies: _energies
      },
    };
  },
  [Types.showUploadCSVModal]: function(state, action) {
    return {
      ...state,
      showUploadCSVModal: action.payload,
    };
  },
  [Types.showCreateAccountModal]: function(state, action) {
    return {
      ...state,
      showCreateAccountModal: action.payload,
    };
  },
  [Types.showEditCSVModal]: function(state, action) {
    return {
      ...state,
      showEditCSVModal: action.payload,
    };
  },
};

const errorReducers = {};

function rootErrorReducer(state, action) {
  if (action.error && config.DEBUG) {
    console.log(action);
  }
  return state;
}

export default reduceReducer([
  rootErrorReducer,
  createReducer(rootReducers, errorReducers, initialState),
]);
