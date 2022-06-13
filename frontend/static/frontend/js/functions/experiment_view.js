function experiment_view(){
  //basic html including placeholders for the table and the edit/delete modals
  $('.main').html(`
    <div class = 'content'>
      <h2>Experiment Manager</h2>
      <br>
      <p>This page allows you to add and delete experiments.</p>
      <button id = "add_exp" onclick = "return false;" class="btn btn-dark" type="button" style='width:25%;' data-toggle="modal" data-target="#exp_modal" >Add Experiment</button>
      <button id = "view_users" onclick = "return false;" class="invisible btn btn-dark" type="button" style='width:0%;' data-toggle="modal" data-target="#view_exp_modal" ></button>
      <br>
      <br>
      <br>
      <table id="exp_table" class="display nowrap table compact" style="width:100%">
          <thead>
              <tr>
                  <th>Title</th>
                  <th>Creator</th>
                  <th># Participants</th>
                  <th>Question</th>
                  <th>Users</th>
                  <th>Delete</th>
              </tr>
          </thead>
      </table>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="view_exp_modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">View Experiment Users</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
          <table id="user_code_table" class="display nowrap table compact" style="width:100%">
            <thead>
              <tr>
                <th>Rank</th>
                <th>First</th>
                <th>Last</th>
                <th>Email</th>
                <th>Access Code</th>
              </tr>
            </thead>
          </table>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-dark" data-dismiss="modal">close</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="exp_modal" tabindex="-1" role="dialog" aria-labelledby="expModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Add an Experiment</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
          <div class = 'content'>
            <form>
              <div class="form-group col-md-12 required">
                <label class = 'control-label' for="title">Title</label>
                <input type="text" class="form-control" id="title" placeholder="" required = 'required'>
              </div>
              <div class="form-group col-md-12 required">
                <label class = 'control-label' for="creator">Creator</label>
                <input type="text" class="form-control" id="creator" placeholder="">
              </div>
              <div class="form-group col-md-12 required">
                <label class = 'control-label' for="question">Question</label>
                <input type="text" class="form-control" id="question" placeholder="">
              </div>
              <div class="form-group col-md-12 required">
                <label class = 'control-label' for="my-select">Select Users</label>
                <center>
                  <select id='user_search' multiple='multiple'>
                  </select>
                </center>
              </div>
              <input type="text" class="form-control" id="id" placeholder="id">
              <div class="form-group col-md-12">
                <button id = "add_exp_db" onclick = "return false;" class="btn btn-dark" type="button" style='width:100%;'>Add Experiment</button>
              </div>
            </form>
            <div class="alert alert-danger" id = "alert-req" role="alert"> Please provide all required information </div>
            <div class="alert alert-danger" id = "alert-user-req" role="alert"> Must select 3 or more users</div>
            <div class="alert alert-success" id = "alert-success" role="success"> Experiment added successfully </div>
            <div class="alert alert-danger" id = "alert-dup" role="alert"> Experiment with this name already exists </div>
          </div>
          <div class="modal-footer">
          </div>
        </div>
      </div>
    </div>
  `)


  //hide all of the alerts by default (these are in the modals)
  $('#id').hide()
  $('#alert-req').hide()
  $('#alert-success').hide()
  $('#alert-dup').hide()
  $('#alert-user-req').hide()

  //setup tables - one for main page, one for users in the edit screens
  t = $('#exp_table').DataTable({
      language: {
          searchPanes: {
              emptyPanes: 'There are no experiments to display. :/'
          }
      },
      "bSortClasses": false
  });

  t2 = $('#user_code_table').DataTable({
      language: {
          searchPanes: {
              emptyPanes: 'There are no users to display. :/'
          }
      },
      "bSortClasses": false,
      dom: 'Bfrtip',
      buttons: [{
        extend: "csv",
        text: "Export to CSV"
      }],
  });

  //on load, load experiments into the table using GET request to API
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
      //clear old stuff from table and populate it
      t.clear()
      for(var i = 0; i < data.length; i++){
        t.row.add([data[i].title, data[i].creator, data[i].names.length, data[i].question,'<button id = "delete_btn" data='+data[i].id+' onclick = "return false;" class="btn btn-light show_users_btn btn-sm" type="button" ><i class="bi bi-box-arrow-up-right"></i></button>',
        '<button id = "delete_btn" data='+data[i].id+' onclick = "return false;" class="btn btn-danger delete_btn btn-sm" type="button" ><i class="bi bi-trash"></i></button>']).draw()
      }

      //setup listener that takes action when edit button is pressed - have to do this after the buttons
      //are created in the above loop.
      //hits API to get users associated with the experiment and loads them into a table
      $(".show_users_btn").click(function(){
        $('#view_users').click()
        var exp_id = $(this).attr('data')
        $.ajax({
          url: 'api/v1/user_code_view/',
          type: 'POST',
          data: {exp_id:exp_id},
          beforeSend: function(xhr){
            if(localStorage.token){
              xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token)
            }
          },
          success: function(data){
            t2.clear()
            for(var i = 0; i < data.length; i++){
              t2.row.add([data[i][0], data[i][1], data[i][2], data[i][3], data[i][4]]).draw()
            }
          }
        })
      })

      //same idea as edit buttons - use API to delete an experiment when button is clicked
      //if successful, this reloads the experiment manager page to reflect updated table
      $(".delete_btn").click(function(){
        var id = $(this).attr('data')
        $.ajax({
          url: 'api/v1/delete_exp_internal/',
          type: "POST",
          data: {id:id},
          beforeSend:function(xhr){
            if(localStorage.token){
              xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token)
            }
            return confirm("Are you sure you want to delete this experiment?");
          },
          success: function (data){
            experiment_view()
          }
        })
      })
    }
  })



  //hit API to load up users that we can add to the experiments
  //only do this when someone clicks to add an experiment
  $("#add_exp").click(function(){
    $.ajax({
      url: 'api/v1/people_internal/',
      type: "GET",
      dataType: "json",
      beforeSend: function(xhr){
        if(localStorage.token){
          xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token)
        }
      },
      success: function(data) {
        for(i=0; i < data.length; i++){
          var nice_name = data[i].rank + ' ' + data[i].first + ' ' + data[i].last
          $('#user_search').append("<option data = "+data[i].id+" value='" + nice_name + "'>" + nice_name + "</option>")
        }

        $('#user_search').multiSelect({
          selectableHeader: "<input type='text' class='search-input' autocomplete='off' placeholder='Type to Search'>",
          selectionHeader: "<input type='text' class='search-input' autocomplete='off' placeholder='Type to Search'>",
          selectableFooter: "<div class='custom-header'>Available Users</div>",
          selectionFooter: "<div class='custom-header'>Selected Users</div>",
          afterInit: function(ms){
            var that = this,
                $selectableSearch = that.$selectableUl.prev(),
                $selectionSearch = that.$selectionUl.prev(),
                selectableSearchString = '#'+that.$container.attr('id')+' .ms-elem-selectable:not(.ms-selected)',
                selectionSearchString = '#'+that.$container.attr('id')+' .ms-elem-selection.ms-selected';

            that.qs1 = $selectableSearch.quicksearch(selectableSearchString)
            .on('keydown', function(e){
              if (e.which === 40){
                that.$selectableUl.focus();
                return false;
              }
            });

            that.qs2 = $selectionSearch.quicksearch(selectionSearchString)
            .on('keydown', function(e){
              if (e.which == 40){
                that.$selectionUl.focus();
                return false;
              }
            });
          },
          afterSelect: function(){
            this.qs1.cache();
            this.qs2.cache();
          },
          afterDeselect: function(){
            this.qs1.cache();
            this.qs2.cache();
          }
        });
      }
    })
  })
  

  //when "add experiment" button pressed in modal, create the experiment with a POST request to API
  //if successful, reload the experiment manager, otherwise show the correct error
  //note: i use status 201 and 202 to prompt the user if they didn't provide all required fields or if they
  //didn't provide enough users, respectively.  The 500 error that triggers the error() function is for duplicate
  //titles, which aren't allowed.
  $("#add_exp_db").click(function() {
    var title = $("#title").val()
    var creator = $("#creator").val()
    var names = $(".ms-selection>.ms-list>.ms-selected").map(function(){return $(this).attr('data')}).get()
    var question = $("#question").val()
    var email = $("#email").val()

    $.ajax({
      url: 'api/v1/add_exp_internal/',
      type: "POST",
      data: {title:title, creator:creator, names:names, question:question, email:email},
      beforeSend: function(xhr){
        if(localStorage.token){
          xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token)
        }
      },

      success: function (data, textStatus, xhr){
        if(xhr.status == 201){
          $('#alert-req').hide()
          $('#alert-success').hide()
          $('#alert-dup').hide()
          $('#alert-user-req').hide()
          $('#alert-req').show()
          $('#alert-req').delay(2500).fadeOut('slow')

        } else if(xhr.status == 202){
          $('#alert-req').hide()
          $('#alert-success').hide()
          $('#alert-dup').hide()
          $('#alert-user-req').show()
          $('#alert-req').hide()
          $('#alert-user-req').delay(2500).fadeOut('slow')

        } else{
          $('#alert-req').hide()
          $('#alert-success').hide()
          $('#alert-dup').hide()
          $('#alert-user-req').hide()
          $('#alert-success').show()
          $('.close').click()
          $(".modal-fade").modal("hide");
          $(".modal-backdrop").remove();
          experiment_view()
        }
      },
      error: function (data){
        $('#alert-req').hide()
        $('#alert-success').hide()
        $('#alert-dup').hide()
        $('#alert-user-req').hide()
        $('#alert-dup').show()
        $('#alert-dup').delay(5000).fadeOut('slow')
      }
    })
  })
}