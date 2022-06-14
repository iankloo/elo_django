//page with some instructions
//if user doesn't have any ratings left to do, just push them to thank you page
function pre_survey(access_code, ex_type){
  $.ajax({
    url: 'api/v1/res?uuid=' + access_code,
    type: "GET",
    dataType: "json",

    success: function (data){
      if(data.length > 0){
        $('.main').html(`
          <div class = 'content'>
            <h2>Pre-Survey Instructions</h2>
              <p>This peer evaluation will ask you to provide feedback to your squadmates. Please be honest and professional with your ratings.</p>

            <button id = "start_exp_now" onclick = "return false;" class="btn btn-secondary" type="button">I Understand</button>
          </div>
          <div id="overlay" style="display:none;">
            <div class="spinner"></div>
          </div>
        `)
        $("#start_exp_now").click(function() {
          $('#overlay').fadeIn()
          update_pair(access_code)
        });
      } else{
        $('.main').html(`
          <div class = 'content'>
            <h2>Your ratings have been captured - thank you!</h2>
          </div>
        `)
      }
    }
  });
}