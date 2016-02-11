var SidebarComponent = ng.core.Component({
  selector: 'x-sidebar',
  templateUrl: '/app/sidebar.html',
  directives: [
  ],
}).Class({
  constructor: [function() {
  }],
  onClick: function(evt, file) {
    evt.preventDefault();

    //Dispatcher.viewer$.next(file);
    
  }
});

module.exports = SidebarComponent;


