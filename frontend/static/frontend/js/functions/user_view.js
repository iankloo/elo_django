function user_view(){
  //this is the scaffolding for everything that we'll generate.  similar to experiment view above.
  $('.main').html(`
    <div class = 'content'>

      <h2>User Manager</h2>
      <br>
      <p>This page allows you to add new users via form or bulk upload as well as edit and delete existing users.</p>
      <button id = "add_user_form" onclick = "return false;" class="btn btn-dark" type="button" style='width:25%;' data-toggle="modal" data-target="#exampleModal" >Add New User</button>
      <br>
      <br>
      <br>
      <table id="example" class="display nowrap table compact" style="width:100%">
          <thead>
              <tr>
                  <th>First Name</th>
                  <th>Middle Name</th>
                  <th>Last Name</th>
                  <th>Rank</th>
                  <th>Email</th>
                  <th>Edit</th>
                  <th>Delete</th>
              </tr>
          </thead>
      </table>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="delete_modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">Delete User</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            Are you sure you want to delete this user?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-dark" data-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-danger">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Add a User</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
          <div class = 'content'>
            <form>
              <div class="form-group col-md-12 required">
                <label class = 'control-label' for="first_name">First Name</label>
                <input type="text" class="form-control" id="first_name" placeholder="" required = 'required'>
              </div>
              <div class="form-group col-md-12">
                <label for="middle_name">Middle Name</label>
                <input type="text" class="form-control" id="middle_name" placeholder="">
              </div>
              <div class="form-group col-md-12 required">
                <label class = 'control-label' for="last_name">Last Name</label>
                <input type="text" class="form-control" id="last_name" placeholder="">
              </div>
              <div class="form-group col-md-12 required">
                <label class = 'control-label' for="rank_select">Rank</label>
                <select class="form-control" id="rank_select">
                  <option>PVT</option>
                  <option>PV2</option>
                  <option>PFC</option>
                  <option>SPC</option>
                  <option>CPL</option>
                  <option>SGT</option>
                  <option>SSG</option>
                  <option>SFT</option>
                  <option>MSG</option>
                  <option>1SG</option>
                  <option>SGM</option>
                  <option>2LT</option>
                  <option>1LT</option>
                  <option selected>CPT</option>
                  <option>MAJ</option>
                  <option>LTC</option>
                  <option>COL</option>
                </select>
              </div>
              <div class="form-group col-md-12 required">
                <label class = 'control-label' for="email">Email address</label>
                <input type="email" class="form-control" id="email" aria-describedby="emailHelp" placeholder="">
              </div>
              <input type="text" class="form-control" id="id" placeholder="id">
              <div class="form-group col-md-12">
                <button id = "add_user" onclick = "return false;" class="btn btn-dark" type="button" style='width:100%;'>Add User</button>
              </div>
            </form>
            <div class="alert alert-danger" id = "alert-req" role="alert"> Please provide all required information </div>
            <div class="alert alert-success" id = "alert-success" role="success"> User added successfully </div>
            <div class="alert alert-danger" id = "alert-dup" role="alert"> User already exists </div>
          </div>
          <div class="modal-footer">
          </div>
        </div>
      </div>
    </div>

  `)

  //binds enter key to the button in the modal
  $('input').on('keypress', (event)=> {
      if(event.which === 13){
          $('#add_user').click();
      }
  });

  $('#id').hide()

  //setup table
  t = $('#example').DataTable({
      language: {
          searchPanes: {
              emptyPanes: 'There are no users to display. :/'
          }
      },
      "bSortClasses": false
  });

  $('#alert-req').hide()
  $('#alert-success').hide()
  $('#alert-dup').hide()
  //need to reset these in case they were set by an edit
  $('#add_user_form').click(function(){
    $('#first_name').val('')
    $('#middle_name').val('')
    $('#last_name').val('')
    $('#rank_select').val('')
    $('#email').val('')
    $('#id').val('')
  })

  //make GET request to get the users already in the database, populate table
  $.ajax({
    url: 'api/v1/people_internal/',
    type: "GET",
    dataType: "json",
    beforeSend: function(xhr){
      if(localStorage.token){
        xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token)
      }
    },

    success: function (data){

      for(var i = 0; i < data.length; i++){
        t.row.add([data[i].first, data[i].middle, data[i].last, data[i].rank, data[i].email, '<button id = "edit_btn" data = '+data[i].id+' onclick = "return false;" class="edit_btn btn btn-dark btn-sm" type="button"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/></svg></button>',
      '<button id = "delete_btn" data='+data[i].id+' " onclick = "return false;" class="btn btn-danger delete_btn btn-sm" type="button"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg></button>']).draw()
      }

      //when edit button pressed, load all relevant data into the form and open it
      $('.edit_btn').click(function(){
        var this_button = data.filter(x => x.id == $(this).attr('data'))[0]
        $('#add_user_form').click()
        $('#first_name').val(this_button.first)
        $('#middle_name').val(this_button.middlle)
        $('#last_name').val(this_button.last)
        $('#rank_select').val(this_button.rank)
        $('#email').val(this_button.email)
        $('#id').val(this_button.id)
      })

      //make POST request to delete user on click, reload user manager
      $(".delete_btn").click(function(){
        var id = $(this).attr('data')
        $.ajax({
          url: 'api/v1/delete_people_internal/',
          type: "POST",
          data: {id:id},
          beforeSend:function(xhr){
            if(localStorage.token){
              xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token)
            }
            return confirm("Are you sure you want to delete this user?");
          },
          success: function (data, textStatus, xhr){
            if(xhr.status == 201){
              alert("Cannot delete user that is in one or more Experiment(s).  Please delete any Experiments involving this user before trying to delete them.")
            } else{
              user_view()
            }
          }
        })
      })
    }
  })

  //hit API with POST request when user add form is filled out
  //using 201 code to prompt that not enough all required fields provided
  //if successful, reload page
  $("#add_user").click(function() {
    var first = $("#first_name").val()
    var middle = $("#middle_name").val()
    var last = $("#last_name").val()
    var rank = $("#rank_select").val()
    var email = $("#email").val()
    var id = $("#id").val()

    $.ajax({
      url: 'api/v1/add_people_internal/',
      type: "POST",
      data: {first:first, middle:middle, last:last, rank:rank, email:email, id:id},
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
          $('#alert-req').show()
          $('#alert-req').delay(2500).fadeOut('slow')

        } else{
          $('form').get(0).reset()
          $('#alert-req').hide()
          $('#alert-success').hide()
          $('#alert-dup').hide()
          $('#alert-success').show()
          $('#alert-success').delay(2500).fadeOut('slow')
          $(".modal-fade").modal("hide");
          $(".modal-backdrop").remove();
          user_view()
        }
      },
      error: function (data){
        $('#alert-req').hide()
        $('#alert-success').hide()
        $('#alert-dup').hide()
        $('#alert-dup').show()
        $('#alert-dup').delay(2500).fadeOut('slow')
      }
    })
  })
}