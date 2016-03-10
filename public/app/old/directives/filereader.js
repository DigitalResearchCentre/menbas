var EventEmitter = ng.core.EventEmitter
  , ElementRef = ng.core.ElementRef
  , $ = require('jquery')
;

var FileReaderComponent = ng.core.Component({
  selector: 'x-filereader',
  template: '<input type="file"/>',
  // style="width: 250px; display: inline-block" 
  outputs: [
    'filechange'
  ],
}).Class({
  constructor: [ElementRef, function(elementRef) { 
    this._elementRef = elementRef;

    this.filechange = new EventEmitter();
  }],
  ngOnInit: function() {
    var el = this._elementRef.nativeElement
      , $el = $(el)
      , self = this
    ;
    $el.bind('change', function(event) {
      var reader = new FileReader()
        , file = event.target.files[0]
      ;
      reader.onload = function(evt) {
        self.filechange.emit({
          name: file.name,
          content: evt.target.result,
        });
      };
      reader.readAsText(file);
    });
  },
});

module.exports = FileReaderComponent;


