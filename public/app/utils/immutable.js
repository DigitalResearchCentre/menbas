import Immutable from 'immutable';

function keyIn() {
  var keySet = Immutable.Set(arguments); 
  return function (v, k) {
    return keySet.has(k);
  }
}

function Map() {
  Immutable.Map.apply(this, arguments);
  return this;
}
Object.assign(Map, Immutable.Map);
Map.prototype = Object.create(Immutable.Map.prototype, {
  pick: function() {
    return this.filter(keyIn(...arguments));
  }
});


export default Object.assign({}, Immutable, {
  Map: Map,
  Im: Immutable,
});
