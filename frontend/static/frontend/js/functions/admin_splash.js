//admin page
function admin_splash(){
  $.ajax({
    url: 'api/user/',
    type: "GET",
    beforeSend: function(xhr){
      if(localStorage.token){
        xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token)
      }
    },

    success: function (data){
      $("#login_toggle").remove()
      $("#logout").remove()
      $("#user_manager").remove()
      $("#exp_manager").remove()
      $("#prog_tracker").remove()
      $("#results_manager").remove()

      $(".navbar").append("<a class='navbar-item navbar-right' id='logout' href='/'>Logout</a>")
      $(".navbar").append('<a class="nav-link navbar-brand" id="user_manager" href="#" style="font-size:1rem;padding-left: 30px">User Manager</a>')
      $(".navbar").append('<a class="nav-link navbar-brand" id="exp_manager" href="#" style="font-size:1rem;padding-left: 0px">Experiment Manager</a>')
      $(".navbar").append('<a class="nav-link navbar-brand" id="prog_tracker" href="#" style="font-size:1rem;padding-left: 0px">Progress Tracker</a>')
      $(".navbar").append('<a class="nav-link navbar-brand" id="results_manager" href="#" style="font-size:1rem;padding-left: 0px">Results</a>')
      $("#logout").click(function(){
        localStorage.removeItem('token')
        //$("#navbar-main").click()
        //user_view()
      })

      //listen for button presses in header -- need smarter way to do this, isn't working because everything routes back through splash again
      $("#user_manager").click(function(){
        user_view()
      })
      $("#exp_manager").click(function(){
        experiment_view()
      })
      $("#prog_tracker").click(function(){
        progress_view()
      })
      $("#results_manager").click(function(){
        results_view()
      })

      user_view()
      //results_view()
    },
    error: function (data){
      $('.main').html(`
        <div id="overlay" style="display: none;">
          <div class="spinner"></div>
        </div>

        <div class = 'content'>
          <h2>Admin Login</h2>

          <div class="input-group mb-3">
            <input type="text" class="form-control" id="admin_id" placeholder="Username">
          </div>
          <div class="input-group mb-3">
            <input type="password" class="form-control" id="password" placeholder="Password">
            <div class="input-group-append">
            </div>
          </div>
          <div class="input-group mb-3">
            <button id = "login_btn" class="btn btn-secondary" type="submit" style='width:100%;'>Log in</button>
          </div>

          <div class="alert alert-danger" id = "alert-badpass" role="alert">
            Invalid username or password.
          </div>
        </div>
      `)
      $('#alert-badpass').hide()
      $('input').on('keypress', (event)=> {
          if(event.which === 13){
              $('#login_btn').click();
          }
      });

      $("#login_btn").click(function() {
        $('#overlay').fadeIn()
        var user = $("#admin_id").val()
        var password = $("#password").val()

        $.ajax({
          url: 'api/token/',
          type: "POST",
          data: {username:user, password:password},

          success: function (data){
            $('#overlay').fadeOut()

            access_token = data.access
            refresh_token = data.refresh

            localStorage.token = data.access
            $("#login_toggle").remove()
            $("#login_toggle").remove()
            $("#logout").remove()
            $("#user_manager").remove()
            $("#exp_manager").remove()
            $("#prog_tracker").remove()
            $("#results_manager").remove()

            $(".navbar").append("<a class='navbar-item navbar-right' id='logout' href='/'>Logout</a>")
            $(".navbar").append('<a class="nav-link navbar-brand" id="user_manager" href="#" style="font-size:1rem;padding-left: 30px">User Manager</a>')
            $(".navbar").append('<a class="nav-link navbar-brand" id="exp_manager" href="#" style="font-size:1rem;padding-left: 0px">Experiment Manager</a>')
            $(".navbar").append('<a class="nav-link navbar-brand" id="prog_tracker" href="#" style="font-size:1rem;padding-left: 0px">Progress Tracker</a>')
            $(".navbar").append('<a class="nav-link navbar-brand" id="results_manager" href="#" style="font-size:1rem;padding-left: 0px">Results</a>')
            $("#logout").click(function(){
              localStorage.removeItem('token')
              //$("#navbar-main").click()
            })

            //listen for button presses in header
            $("#user_manager").click(function(){
              user_view()
            })
            $("#exp_manager").click(function(){
              experiment_view()
            })
            $("#prog_tracker").click(function(){
              progress_view()
            })
            $("#results_manager").click(function(){
              results_view()
            })

            user_view()
            //results_view()
          },
          error: function (data){
            $('#overlay').fadeOut()

            $('#alert-badpass').show()
          }
        })
      })
    }
  })
}