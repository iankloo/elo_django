//pull the question defined when experiment was created
function get_question(exp_id){
  $.ajax({
    url: 'api/v1/exp?exp_id=' + exp_id,
    type: "GET",
    dataType: "json",

    success: function (data){
      $('#question').text(data[0].question)
      $('#overlay').fadeOut()
    }
  })
}