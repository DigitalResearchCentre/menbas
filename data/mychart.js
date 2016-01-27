'use strict';

var rectWidth = 150
  , rectHeight = 150
;

module.exports = {
  place: 'Vall�s',
  year: 1860,
  rect: {
    width: rectWidth,
    height: rectHeight,
    fill: 'none',
    stroke: 'green',
    'stroke-width': 5,
    data: [{
      name: 'ASSOCIATED BIODIVERSITY',
      transform: 'translate(' + rectWidth + ', ' + rectHeight + ')',
    }, {
      name: 'FARMLAND',
      transform: 
        'translate(' + (rectWidth * 1.8)  + ', ' + (rectHeight * 1.8) + ')',
    }, {
      name: 'LIVESTOCK-BARNYARD',
      transform: 
        'translate(' + (rectWidth * 2.6)  + ', ' + (rectHeight * 2.6) + ')',
    }, {
      name: 'FARMING COMMUNITY',
      transform:
        'translate(' + (rectWidth * 4.2)  + ', ' + rectHeight + ')',
    }, {
      name: 'SOCIETY',
      transform: 
        'translate(' + (rectWidth * 5)  + ', ' + (rectHeight * 0.2) + ')',
    }]
  },

  line: {
    data: [
      {name: 'SR', 'stroke-width': 20, path: [
        {x: 180, y: 400}, {x: 240, y: 350}, {x: 270, y: 300}
      ]},
      {name: 'LP', path: [
        {x: 310, y: 425}, {x: 340, y: 455}, {x: 337, y: 465},
        {x: 335, y: 485}, {x: 335, y: 505},
      ]},
      {name: 'FW', path: [
        {x: 335, y: 505}, {x: 300, y: 555}
      ]},
      {name: 'LBP', path: [
        {x: 335, y: 505}, {x: 390, y: 465}
      ]},
      {name: 'TP', path: [
        {x: 335, y: 505}, {x: 350, y: 560}, {x: 550, y: 560}
      ]},
      {name: 'BR', path: [
        {x: 550, y: 560}, {x: 600, y: 500}, {x: 610, y: 380},
        {x: 400, y: 200}, {x: 310, y: 260},
      ]},
      {name: 'FP', path: [
        {x: 550, y: 560}, {x: 800, y: 540}, {x: 850, y: 380},
        {x: 800, y: 180},
      ]},
      {name: 'ASI', path: [
        {x: 780, y: 160}, {x: 650, y: 80}, {x: 400, y: 100},
        {x: 310, y: 260},
      ]},
      {name: 'L', path: [
        {x: 740, y: 170}, {x: 400, y: 170},
      ]},
      {name: 'FCI', path: [
        {x: 740, y: 200}, {x: 400, y: 200},
      ]},

    ]
  }
};
