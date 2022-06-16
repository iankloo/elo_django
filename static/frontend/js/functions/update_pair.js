//hit api to get one of the remaining pairs for a rater
function update_pair(access_code){
  $.ajax({
    url: 'api/v1/res?uuid=' + access_code,
    type: "GET",
    dataType: "json",

    success: function (data){

      if(data.length == 0){
        $('#overlay').fadeOut()
          $('.main').html(`
            <div class = 'content'>
              <h2>Your ratings have been captured - thank you!</h2>
            </div>
          `)
      } else{
        $('.main').html(`
          <div class = 'content' style="display: none;">
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
          <div id="overlay" style="display: block;">
            <div class="spinner"></div>
          </div>
        `)

        var index = Math.floor(Math.random() * data.length)

        $.ajax({
          url: 'api/v1/exp?exp_id=' + data[index].experiment_name,
          type: "GET",
          dataType: "json",

          success: function (q_data){
            $('#overlay').fadeOut()
            $('.content').fadeIn()
            $('#question').text(q_data[0].question)

            //get timestamp when viewer first sees pair
            start = Date.now()
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
        })
      }
    }
  })
}