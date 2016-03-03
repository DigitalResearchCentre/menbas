var $ = require('jquery')
  , EventEmitter = ng.core.EventEmitter
;

var ModalHeaderComponent = ng.core.Component({
  selector: 'x-modal-header',
  template: [
    '<div class="modal-header">',
      '<button type="button" class="close" ',
        'data-dismiss="modal" aria-label="Close">',
        '<span aria-hidden="true">&times;</span>',
      '</button>',
      '<ng-content></ng-content>',
    '</div>',
  ].join(' ')
}).Class({
  constructor: [function() {
  }],
});

var ModalBodyComponent = ng.core.Component({
  selector: 'x-modal-body',
  template: [
    '<div class="modal-body">',
      '<ng-content></ng-content>',
    '</div>',
  ].join(' ')
}).Class({
  constructor: [function() {}],
});

var ModalFooterComponent = ng.core.Component({
  selector: 'x-modal-footer',
  template: [
    '<div class="modal-body">',
      '<ng-content></ng-content>',
      '<button type="button" class="btn btn-default" data-dismiss="modal">',
        'Close',
      '</button>',
      '<button type="button" (click)="onSave($event)" ',
        'class="btn btn-primary">{{saveText}}</button>',
    '</div>',
  ].join(' '),
  inputs: [
    'saveText',
  ],
  outputs: [
    'save',
  ]
}).Class({
  constructor: [function() {
    this.save = new EventEmitter();
  }],
  ngOnInit: function() {
    if (!this.saveText) {
      this.saveText = 'Save';
    }
  },
  onSave: function(event) {
    this.save.emit(event);
  },
});

var counter = 0;
var ModalComponent = ng.core.Component({
  selector: 'x-modal',
  templateUrl: '/app/directives/modal.html',
  directives: [
  ],
  inputs: [
    'show', 'modalSize',
  ],
  outputs: [
    'onShow', 'onHide',
  ]
}).Class({
  constructor: [function() {
    this.id = 'modal-' + counter;
    counter += 1;
    this.onShow = new EventEmitter();
    this.onHide = new EventEmitter();
    this.modalLg = true;
  }],
  ngAfterViewInit: function() {
    var onShow = this.onShow
      , onHide = this.onHide
      , $modal = $('#' + this.id)
    ;
    this.$modal = $modal;
    $modal.modal({
      backdrop: true,
      keyboard: true,
      show: this.show || false,
    });
    setTimeout(function() {
      $modal.on('show.bs.modal', function(e) {
        onShow.emit(e);
      });
      $modal.on('hide.bs.modal', function(e) {
        onHide.emit(e);
      });
    });
  },
  open: function() {
    this.$modal.modal('show');
  },
  close: function() {
    this.$modal.modal('hide');
  },
  ngOnDestroy: function() {
    this.close();
  }
});

module.exports = {
  MODAL_DIRECTIVES: [
    ModalComponent, ModalHeaderComponent, 
    ModalBodyComponent, ModalFooterComponent,
  ],
  ModalComponent: ModalComponent,
  ModalHeaderComponent: ModalHeaderComponent,
  ModalBodyComponent: ModalBodyComponent,
  ModalFooterComponent: ModalFooterComponent,
};


