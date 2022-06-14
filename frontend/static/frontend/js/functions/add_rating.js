//push the selection back to server
function add_rating(dat, winner, start_time, end_time, access_code){
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
    url: 'api/v1/add_rating/',
    data:{
      id: dat.id,
      winner: winner.id,
      start_time: start_time,
      end_time: end_time
    },
    type: 'POST',
    content_type: 'application/json',
    success: function (){
      //trigger reload of the main pairs page - will automatically pull next pair
      update_pair(access_code)
    }
  })
}