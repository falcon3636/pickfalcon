function sendFormData() {

  function sendData() {
    var XHR = new XMLHttpRequest()
    var FD = new FormData(form)
    XHR.addEventListener('load', function(event) {
      form.classList.add('inactive')
      var success = document.querySelectorAll('.post-sent')[0]
      success.classList.add('active')
    })
    XHR.addEventListener('error', function(event) {
      form.classList.add('inactive')
      var error = document.querySelectorAll('.post-error')[0]
      error.classList.add('active')
    })
    XHR.open('POST', '#')
    XHR.send(FD)
  }

  var form = document.querySelectorAll('.my-form')[0]
  form.addEventListener('submit', function (e) {
    e.preventDefault()
    sendData()
  })

}

export default sendFormData
