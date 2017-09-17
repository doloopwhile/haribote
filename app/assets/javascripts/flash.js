(function() {
  window.addEventListener('load', function() {
    var error = document.body.dataset.flashAlert;
    var info = document.body.dataset.flashNotice;

    if (error != null) {
      toastr.error(error);
    }

    if (info != null) {
      toastr.info(info);
    }
  });
})();
