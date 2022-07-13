function results_view(){
  $('.main').html(`
    <div class = 'content'>
      <h2>Results</h2>
      <p>This page allows you to see the results of all of your experiments.</p>
      <p>Select a an experiment to see the final point distribution for the team.</p>
      <p>All people start with 1,000 points, so any point total below 1,000 suggests a generally negative review.  Similarly, any point total above 1,000 suggests a generally positive review.</p>
      <p>Point comparisons between experiments are NOT meaningful so please do not compare absolute point values between experiments.  Instead, point totals should be evaluated relative to others in their experiment.</p>
      <p>Only completed experiments will populate in the dropdown box below.  If you do not see an experiment that you expected to be here, please go to the progress tracker and confirm it is fully complete.</p>
      <p>The first time you select a completed experiment will trigger the code that generates the final point totals.  This might take a few seconds to a few minutes.  After that, it retrieving results will be nearly instantaneous.</p>
      <br>
      <select class="dropdown_list" id="exp_drop" name="exp_drop" style = 'width: 100%'>
        <option></option>
      </select>
      <br>
      <br>
      <div id="dl_button" style="float:right;"></div>
      <div class="chart-container" style="display: block; margin: 0 auto; height:25vh; width:50vw"></div>
      


    <div id="overlay">
      <div class = 'overlay_text'>Please wait, this could take a minute...</div>
      <div class="cv-spinner">
        <span class="spinner"></span>
      </div>
    </div>
  `)


  $('.dropdown_list').select2({placeholder: "Please select an experiment"});

  $('#exp_drop').on('select2:select', function (e) {

    $("#myChart").remove()
    $(".chart-container").append('<canvas id="myChart"></canvas>')

    id = $('#exp_drop').find(':selected').val()
    
    $.ajax({
      url: 'api/v1/get_final_results/',
      type: "POST",
      data: {id},
      beforeSend: function(xhr){
        if(localStorage.token){
          xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token)
        }
        $("#overlay").fadeIn(100);　
      },

      success: function (data, textStatus, xhr){

        $("#download").remove()
        $("#dl_button").append('<div><button class="btn btn-secondary" id="download">CSV Data <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/></svg></button><div>')

        $("#download").click(function(){
          const csvString = [
            [
              "Name",
              "Score"
            ],
            ...data.map(item => [
              item.names,
              item.score
            ])
          ]
           .map(e => e.join(",")) 
           .join("\n");

          var download = function(content, fileName, mimeType) {
            var a = document.createElement('a');
            mimeType = mimeType || 'application/octet-stream';

            if (navigator.msSaveBlob) { // IE10
              navigator.msSaveBlob(new Blob([content], {
                type: mimeType
              }), fileName);
            } else if (URL && 'download' in a) { //html5 A[download]
              a.href = URL.createObjectURL(new Blob([content], {
                type: mimeType
              }));
              a.setAttribute('download', fileName);
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            } else {
              location.href = 'data:application/octet-stream,' + encodeURIComponent(content); // only this mime type is supported
            }
          }

          download(csvString, 'score_report.csv', 'text/csv;encoding:utf-8');
      })
        


        $("#overlay").fadeOut(100);　

        var colors = []
        for(i = 0; i < data.length; i++){
          score_transform = data[i].score - 1000
          if(score_transform <= 0){
            colors.push('#F22301')
          } else{
            colors.push('#3C9AB2')
          }
        }

        plot_data = {
          labels: data.map(a => a.names),
          datasets: [{
            barPercentage: .95,
            categoryPercentage: 1,
            label: '',
            data: data.map(a => a.score - 1000),
            backgroundColor: colors
          }]
        }


        const config = {
          type: 'bar',
          data: plot_data,
          options: {
            scales: {
              x: {
                  ticks: {
                      // Include a dollar sign in the ticks
                      callback: function(value, index, ticks) {
                          return value + 1000;
                      }
                  }
              }
            },
            indexAxis: 'y',
            responsive: true,
            plugins: {
              legend: {
                display: false,
              },
              title: {
                display: false,
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return context.parsed.x + 1000;
                  }
                }
              }
            }
          },
        };

        const myChart = new Chart(
          document.getElementById('myChart'),
          config
        );


      },
    })
  });


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
        success: function (data2){
          for(i = 0; i < data.length; i++){
            if(data2[i] == 100){
              $("#exp_drop").append("<option value='"+data[i].id+"' >"+data[i].title+" - Created By: "+data[i].creator+" on "+data[i].date +"</option>")
            }
          }
        }
      })
    }
  })
}