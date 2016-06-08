function SwController() {
  this._registerServiceWorker();
}

SwController.prototype._registerServiceWorker = function() {
  if (!navigator.serviceWorker) return;

  var swController = this;

  navigator.serviceWorker.register('<%= filename %>').then(function(reg) {
    if (!navigator.serviceWorker.controller) {
      return;
    }

    if (reg.waiting) {
      swController._updateReady(reg.waiting);
      return;
    }

    if (reg.installing) {
      swController._trackInstalling(reg.installing);
      return;
    }

    reg.addEventListener('updatefound', function() {
      swController._trackInstalling(reg.installing);
    });
  });

  // Ensure refresh is only called once.
  // This works around a bug in "force update on reload".
  var refreshing;
  navigator.serviceWorker.addEventListener('controllerchange', function() {
    if (refreshing) return;
    window.location.reload();
    refreshing = true;
  });
};

SwController.prototype._trackInstalling = function(worker) {
  var swController = this;
  worker.addEventListener('statechange', function() {
    if (worker.state == 'installed') {
      swController._updateReady(worker);
    }
  });
};

SwController.prototype._updateReady = function(worker) {
  worker.postMessage({action: 'skipWaiting'});
};