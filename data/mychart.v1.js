'use strict';

var rectWidth = 150
  , rectHeight = 150
;

module.exports = {
  place: 'Vall�s',
  year: 1999,
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
    ]
  }
};




from fractions import Fraction

db = {}

def solve2(l1, l2):
    result = []
    for a in l1:
        for b in l2:
            result += [
                a + b,
                a - b,
                b - a,
                a * b,
                Fraction(a, b),
                Fraction(b, a),
            ]
    return result

def calculate(a, b, c, d):
    # 1. ( a + b ) + ( c + d )
    # 2. (( a + b ) + c) + d
    ops = '+-*/'


def solve(nums):
    a = nums.pop(0)
    for b in nums:
        ab = solve2([a], [b])
        cd = solve2([c], [d])
        solve2list(ab, cd)
        solve2list(solve2list(ab, [c]), [d])
        solve2list(solve2list(ab, [d]), [c])


   # a, b, c, d
    # for r1 in solve2(a, b):
        # for r2 in solve2(c, d):
            # for r in solve2(r1, r2): ssdklfAAwef ss
                # if r === 24:
                    # print 'ab cd'
        # for r2 in solve2(r1, c):
            # for r in solve2(r2, d):
                # if r === 24:
                    # print 'ab c d'


while True:
    nums = raw_input('Input 4 number (Enter to quit): ')
    if not nums:
        break
    print solve(map(int, nums))
