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
      configs: user.configs || [],
    };
  },
  [Types.selectItem]: function(state, action) {
    return {
      ...state,
      selectedFile: {
        ...state.selectedFile,
        data: action.payload,
      },
    };
  },
  [Types.saveConfig]: function(state, action) {
    console.log(action);
    return state;
  },
  [Types.removeConfig]: function(state, action) {
    console.log(action);
    return state;
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
    let dataPlaces = {}, dataYears = {}, dataAbbrs = {};

    let objects = _.filter((data || {}).objects, function(d) {
      let included = (
        (_.isEmpty(places) || places.indexOf(d.place) !== -1) && 
        (_.isEmpty(abbrs) || abbrs.indexOf(d.abbr) !== -1) &&
        (_.isEmpty(years) || _.findIndex(years, function(range) {
          return range.length === 2 
            ? range[0] <= d.year && d.year <= range[1]
            : range[0] === d.year
        })) !== -1
      );
      if (included) {
        dataYears[d.year] 
          ? dataYears[d.year].push(d) 
          : dataYears[d.year] = [d];
        dataPlaces[d.place] 
          ? dataPlaces[d.place].push(d) 
          : dataPlaces[d.place] = [d];
        dataAbbrs[d.abbr] 
          ? dataAbbrs[d.abbr].push(d) 
          : dataAbbrs[d.abbr] = [d];
      }
      return included;
    });

    _.each(_.groupBy(objects, function(obj) {
      return `${obj.place} ${obj.year}`;
    }), function(objs, key) {
      objs = _.groupBy(objs, 'abbr');

      let script = _.map(objs, function(d, abbr) {

        return `var ${abbr} = ${d[0].value};`;
      }).join('');

      _.each(formulas.split(';'), function(cmd) {
        if (_.trim(cmd) === '') return;
        let [variable, formula] = cmd.split('=');
        try {
          let v = eval(`${script} ${formula};`);
          script += `let ${variable} = ${v}`;
          let d = {
            abbr: _.trim(variable),
            value: v,
            place: objs['POP'][0].place,
            year: objs['POP'][0].year,
          };
          objects.push(d);
          dataYears[d.year].push(d); 
          dataPlaces[d.place].push(d); 
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
            xAxis: 'year',
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
    console.log(action.error);
  }
  return state;
}

export default reduceReducer([
  rootErrorReducer,
  createReducer(rootReducers, errorReducers, initialState),
]);




