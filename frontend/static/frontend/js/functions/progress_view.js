function progress_view(){
  $('.main').html(`
    <div class = 'content'>
      <h2>Progress Tracker</h2>
      <p>This page allows you to see the progress of all of your experiments.</p>
      <br>
      <div id = 'inprogress_exps'>
        <h3>In-Progress Experiments</h3>
      </div>
      <br>
      <div id = 'completed_exps'>
        <h3>Completed Experiments</h3>
      </div>
    </div>

    <button id = "open_user_modal" onclick = "return false;" class="invisible btn btn-dark" type="button" style='width:25%;' data-toggle="modal" data-target="#user_comp_modal" >Open Modal</button>

    <!-- Modal -->
    <div class="modal fade" id="user_comp_modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">User Progress Tracker</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body" id='user_modal_cards'>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-dark" data-dismiss="modal">close</button>
          </div>
        </div>
      </div>
    </div>

  `)

  $.ajax({
    url: 'api/v1/exp_internal/',
    type: "GET",
    dataType: "json",
    beforeSend: function(xhr){
      if(localStorage.token){
        xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token)
      }
    },

    success: function (data){

      let ids = data.map(a => a.id);

      $.ajax({
      url: 'api/v1/get_progress_internal/',
      type: "POST",
      data: {ids:ids},
      beforeSend: function(xhr){
        if(localStorage.token){
          xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token)
        }
      },

        success: function (data_2, textStatus, xhr){
          for(i = 0; i < data.length; i++){
            let id = data[i].id
            let title = data[i].title
            let body = data[i].question
            let date = data[i].date
            let creator = data[i].creator
            let per_complete = data_2[i]
            var mycard = `
            <div class="card" data = ${id}>
              <div class="card-body">
                <h5 class="card-title">${title}</h5>
                <p>Date Created: ${date}</p>
                <p>Created By: ${creator}</p>
                <p>Question: ${body}</p>
                <div class="progress">
                  <div class="progress-bar" role="progressbar" style="width: ${per_complete}%;" aria-valuenow="${per_complete}" aria-valuemin="0" aria-valuemax="100">${per_complete}%</div>
                </div>
              </div>
            </div>
            `
            if(data_2[i] != 100){
              $("#inprogress_exps").append(mycard)
            } else{
              $("#completed_exps").append(mycard)
            }        
          }

        $(".card").click(function(){     


          u_id = $(this).attr('data')
          $.ajax({
            url: 'api/v1/get_progress_byuser_internal/',
            type: "POST",
            data: {u_id},
            beforeSend: function(xhr){
              if(localStorage.token){
                xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token)
              }
            },

              success: function (data_3, textStatus, xhr){
                $("#user_modal_cards>.card").remove()
                for(i = 0; i < data_3.length; i++){
                  first = data_3[i].first
                  last = data_3[i].last
                  per = data_3[i].per

                  var mycard = `
                  <div class="card">
                    <div class="card-body">
                      <h5 class="card-title">${first} ${last}</h5>
                      <div class="progress">
                        <div class="progress-bar" role="progressbar" style="width: ${per}%;" aria-valuenow="${per}" aria-valuemin="0" aria-valuemax="100">${per}%</div>
                      </div>
                    </div>
                  </div>
                  `
                  $("#user_modal_cards").append(mycard)
                }
                $("#open_user_modal").click()
              }
            })
          })
        }
      })
    }
  })
}