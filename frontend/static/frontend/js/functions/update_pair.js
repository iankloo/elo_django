//hit api to get one of the remaining pairs for a rater
function update_pair(access_code){
  $.ajax({
    url: 'api/v1/res?uuid=' + access_code,
    type: "GET",
    dataType: "json",

    success: function (data){

      if(data == ''){
        $.ajax({
          url: 'api/v1/res_closeness?uuid=' + access_code,
          type: "GET",
          dataType: "json",

          success: function (data){
            //if none left, kick to thank you page
            if(data.length == 0){
              $('#overlay').fadeOut()
              $('.main').html(`
                <div class = 'content'>
                  <h2>Your ratings have been captured - thank you!</h2>
                </div>
              `)
            } else{
              $('.main').html(`
              <div class = 'content'>
                <h4 id = 'num_left'></h4>
                <h4>Select the pair of circles that best describes your relationship with: <br><span id = 'question' style = 'color: red'></span></h4>
                <div class="row justify-content-center">
                  <div class="col-xs" id = 'spec_col'>
                    <div class="card">
                    <img id = '01' class="card-img-top img-responsive" src = "{% static 'frontend/img/01_alt.png' %}">
                    </div>
                  </div>
                  <div class="col-xs" id = 'spec_col'>
                    <div class="card">
                    <img id = '02' class="card-img-top img-responsive" src = "{% static 'frontend/img/02_alt.png' %}">
                    </div>
                  </div>
                </div>
                <div class="row justify-content-center">
                  <div class="col-xs" id = 'spec_col'>
                    <div class="card">
                    <img id = '03' class="card-img-top img-responsive" src = "{% static 'frontend/img/03_alt.png' %}">
                    </div>
                  </div>
                  <div class="col-xs" id = 'spec_col'>
                    <div class="card">
                    <img id = '04' class="card-img-top" src = "{% static 'frontend/img/04_alt.png' %}">
                    </div>
                  </div>
                </div>
                <div class="row justify-content-center">
                  <div class="col-xs" id = 'spec_col'>
                    <div class="card">
                    <img id = '05' class="card-img-top" src = "{% static 'frontend/img/05_alt.png' %}">
                    </div>
                  </div>
                  <div class="col-xs" id = 'spec_col'>
                    <div class="card">
                    <img id = '06' class="card-img-top" src = "{% static 'frontend/img/06_alt.png' %}">
                    </div>
                  </div>
                </div>
              </div>
              <div id="overlay" style="display:none;">
                <div class="spinner"></div>
              </div>

            `)

            $("#question").text(data[0].name.rank + ' ' + data[0].name.first + ' ' + data[0].name.last)

            $('#overlay').fadeOut()

            //get timestamp when viewer first sees pair
            start = Date.now()

            //handle clicks on names
            $('.card-img-top').click(function(){
              $('#overlay').fadeIn()
              $(window).scrollTop(0);
              end = Date.now()
              add_closeness_rating(data[0], data[0].name, this.id, start, end, access_code)
              //add_rating(data[0], data[0].name_1, start, end, access_code)
            });
          }
        }
      })
    } else if(data.length == 0){
      $('#overlay').fadeOut()
      go_to_comments(access_code)
    } else{
      $('.main').html(`
      <div class = 'content'>
        <h4 id = 'num_left'></h4>
        <br>
        <h2 id = 'question'></h2>
        <br><br>
        <div class="row">
          <div class="col-sm-6">
            <div class="card" id = 'name1_card'>
              <div class="card-body">
                <center><h4 class="card-title stretched-link" id = 'name1'></h4></center>
              </div>
            </div>
          </div>
          <div class="col-sm-6">
            <div class="card" id = 'name2_card'>
              <div class="card-body">
                <center><h4 class="card-title" id = 'name2'></h4></center>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="overlay" style="display:none;">
        <div class="spinner"></div>
      </div>
    `)

    var index = Math.floor(Math.random() * data.length)
    get_question(data[index].experiment_name)

    //get timestamp when viewer first sees pair
    start = Date.now()

    //set names according to data
    //could speed up by only returning a single object, but this shouldn't be measurably different


    if(Math.round(Math.random()) == 0){
      $('#name1').text(data[index].name_1.first + ' ' + data[index].name_1.last)
      $('#name2').text(data[index].name_2.first + ' ' + data[index].name_2.last)

      //handle clicks on names
      $('#name1_card').click(function(){
        $('#overlay').fadeIn()
        end = Date.now()
        add_rating(data[index], data[index].name_1, start, end, access_code)
      });

      $('#name2_card').click(function(){
        $('#overlay').fadeIn()
        end = Date.now()
        add_rating(data[index], data[index].name_2, start, end, access_code)
      });


    } else{
      $('#name2').text(data[index].name_1.first + ' ' + data[index].name_1.last)
      $('#name1').text(data[index].name_2.first + ' ' + data[index].name_2.last)

      //handle clicks on names
      $('#name1_card').click(function(){
        $('#overlay').fadeIn()
        end = Date.now()
        add_rating(data[index], data[index].name_2, start, end, access_code)
      });

      $('#name2_card').click(function(){
        $('#overlay').fadeIn()
        end = Date.now()
        add_rating(data[index], data[index].name_1, start, end, access_code)
      });
    }

    //set matches remaining counter
    $('#num_left').text('Matches Remaining: ' + data.length)



    //handle arrow keys - just automate clicking process
    $(document).keydown(function(e) {
      switch(e.which) {
        case 37: // left
          $('#name1_card').click()
        break;

        case 38: // up
        break;

        case 39: // right
          $('#name2_card').click()
        break;

        default: return; // exit this handler for other keys
      }

      e.preventDefault(); // prevent the default action (scroll / move caret)
    });
  }

    }
  })
}