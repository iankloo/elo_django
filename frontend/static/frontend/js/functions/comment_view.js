//main page that asks for access code
function comment_view(access_code, comments_required){

  //hit API to build comment section
  $.ajax({
    url: 'api/v1/comments?uuid=' + access_code,
    type: "GET",
    dataType: "json",

    success: function (data){
      //shell html for the comment section
      if(data.length == 0){
        //this means no more comments to make - so check to see if still need to do pairwise ratings:
        update_pair(access_code)
      } else{
        $('.main').html(`
          <div class = 'content'>
            <h4 id = 'num_left'></h4>
            <br>
            <h2>Please select a teammate and provide comments.</h2>
            <h5>Note, you cannot edit your comments after you submit them</h5>
            <br><br>
            <form>
              <div class="form-group">
                <select class="dropdown_list" id="exp_drop" name="exp_drop" style = 'width: 100%'>
                  <option></option>
                </select>
              </div>
              <div class="form-group">
                <label for="commentarea">Comments</label>
                <textarea class="form-control" id="commentarea" rows="6"></textarea>
              </div>
              <div class = 'form-group'>
                <button id = 'submit_comment' onclick = "return false;" class = 'btn btn-secondary' type = "button">Submit</button>
              </div>
            </form>
            <br><br><br>
            <div id="no_more_comments">
              <center>
                <button id="finished" onclick = "return false;" class = "btn btn-primary" type = "button" style = 'width: 50%;'>No More Comments</button>
              </center>
            </div>
          </div>
        `)

        if(comments_required == false){
          $("#no_more_comments").hide()
        }

        $('.dropdown_list').select2({placeholder: "Please select an person to comment on"});

        //add each name to the dropdown
        for(i = 0; i < data.length; i++){
          $(".dropdown_list").append("<option value = '"+data[i].id+"'>"+data[i].rank + " " +data[i].first+" " +data[i].last+"</option>")
        }


        $('#submit_comment').click(function(){
          subject = $(".dropdown_list").val()
          uuid = access_code
          comment = $("#commentarea").val()
          console.log(comment.length)
          if(comment.length == 0 & comments_required == true){
            alert('Please provide a comment for this person.')
          } else{
            console.log('go')
            add_comment(uuid, subject, comment, comments_required)
          }
        });

        //if someone bails out of the comments, store blanks in data table - best approach?
        $('#finished').click(function(){
          for(i = 0; i < data.length; i++){
            add_comment(access_code, data[i].id, '')
          }
          comment_view(access_code, comments_required)
        })
      }
    }
  });

}

function add_comment(uuid, subject, comment, comments_required){
  //make sure the csrf token is passed along...should satisfy django security
  function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie != '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
          var cookie = jQuery.trim(cookies[i]);
          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) == (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
  }
  var csrftoken = getCookie('csrftoken');
  function csrfSafeMethod(method) {
     return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
  }
  $.ajaxSetup({
      beforeSend: function(xhr, settings) {
         if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
             xhr.setRequestHeader("X-CSRFToken", csrftoken);
       }
    }
  });

  //actually send the request with relevant info
  $.ajax({
    url: 'api/v1/add_comment/',
    data:{
      uuid: uuid,
      subject_id: subject,
      comment: comment
    },
    type: 'POST',
    content_type: 'application/json',
    success: function (){
      comment_view(uuid, comments_required)
    }
  })
}


