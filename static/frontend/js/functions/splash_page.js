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
          Please enter your access code
      </div>
      <div class="alert alert-danger" id = "alert-invalid" role="alert">
        Invalid access code
      </div>
    </div>

    <div id="overlay" style="display: none;">
      <div class="spinner"></div>
    </div>
  `)
  $('#alert-blank').hide()
  $('#alert-invalid').hide()

  $("#start_exp").click(function() {
    $('#overlay').fadeIn()

    $('#alert-blank').hide()
    $('#alert-invalid').hide()

    if($("#password").val().length > 0){

      $.ajax({
        url: 'api/v1/res?uuid=' + $("#password").val(),
        type: "GET",
        dataType: "json",
        success: function (data){
          update_pair($("#password").val())
        },
        error: function(){
          $('#overlay').fadeOut()
          $('#alert-invalid').show()
        }
      })

    } else{
      $('#alert-blank').show()
    }
  });
}