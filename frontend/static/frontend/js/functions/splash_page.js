//main page that asks for access code
function splash_page(){
  $('.main').html(`
    <div class = 'content'>
      <h2>Please Enter Your Access Code</h2>

      <div class="input-group mb-3">
        <input type="text" class="form-control" id="password" placeholder="Enter Access Code">
        <div class="input-group-append">
          <button id = "start_exp" onclick = "return false;" class="btn btn-secondary" type="button">Start</button>
        </div>
      </div>
      <div class="alert alert-danger" id = "alert-blank" role="alert">
          Please fill out all required fields
      </div>
      <div class="alert alert-danger" id = "alert-invalid" role="alert">
        Invalid access code
      </div>
    </div>
  `)
  $('#alert-blank').hide()
  $('#alert-invalid').hide()
}