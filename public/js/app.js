
function onPositionChanged() {
  if($("#position").val() ==="new"){
    addNewPosition();
  }
}

function addNewPosition () {
  // alert('i need to add a new position');
  $("#addNewPositionModal").modal();
}

function saveNewPosition() {
  var $btn = $("#btnSavePosition").button('saving');
  $.post("/positions/add", {
      name : $("#inputPositionName").val(),
      reqLink : $("#inputRequisitionLink").val(),
      description : $("#inputPositionDescription").val()
    })
    .done(function(build) {
      $('#addNewPositionModal').modal('hide');
    });
}

function getFunnelStats(rec, own){
   $.post("/funnelStats", {
    Recruiter_PersonId : rec,
    Owner_PersonId : own,
   })
    .done(function(results) {
      var seriesdata = [];
      var sevendayseries = [];
      var stages = ["Lead", "Phone Screen", "Interview", "Offer", "Accepted"];
      var stage_icons = ["lead", "phone", "interview", "offer", "accepted"];
      //TODO: Dynamically pull stage names from backend.  Hardcoding for now
      for(i=0; i<stages.length; i++){
        var datum = [];
        var stageName = stages[i];
        if( i !=stages.length-1) {
          stageName += "("+Math.round(results.overallFunnelStats.aggragate[i+1])+"%)";
        }
        datum.push(stageName);
        datum.push(results.overallFunnelStats.funnel[i]);
        seriesdata.push (datum);
      }

      //Now for 7 day
      for(i=0; i<stages.length; i++){
        var datum = [];
        var stageName = stages[i];
        if( i !=stages.length-1) {
          stageName += "("+Math.round(results.weeklyFunnelStats.aggragate[i+1])+"%)";
        }
        datum.push(stageName);
        datum.push(results.weeklyFunnelStats.funnel[i]);
        sevendayseries.push(datum);
      }

      renderHighChartsFunnel('funnelChart', 'Historical (all)', seriesdata);
      renderHighChartsFunnel('funnelChart7Days', 'Historical (7-Day)', sevendayseries);
    });
}

function saveNote(candidateId, note) {
  $.post("/candidate/changenote", { id : candidateId, notes:  note }).done(function(build) {
    });
}


function renderHighChartsFunnel(chartid, title, seriesdata) {

  $(function () {

      $('#'+chartid).highcharts({
          chart: {
              type: 'funnel',
              marginRight: 100
          },
          title: {
              text: title,
              x: -50
          },
          plotOptions: {
              series: {
                  dataLabels: {
                      enabled: true,
                      format: '<b>{point.name}</b> ({point.y:,.0f})',
                      color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                      softConnector: true
                  },
                  neckWidth: '30%',
                  neckHeight: '25%'

                  //-- Other available options
                  // height: pixels or percent
                  // width: pixels or percent
              }
          },
          legend: {
              enabled: false
          },
          series: [{
              name: 'Candidate funnel',
              data: seriesdata
          }]
      });
  });
}

function saveState() {
  var $btn = $("#btnSaveStage").button('saving');
  //Sam is lazy and just making three Ajax calls vs. refractoring handlers.  Sorry guys.
  $.post("/candidate/changeowner", {
      id : $("#candidate_value").val(),
      personId : $("#owner_change_value").val(),

    })
    .done(function(build) {
    });

  var date = moment($(".datetimepicker").data('date'));

  $.post("/candidate/changeDueDate", {
      id : $("#candidate_value").val(),
      dueDate : date.format('YYYY-MM-DD')

    })
    .done(function(build) {
    });

  $.post("/candidate/changestate", {
      id : $("#candidate_value").val(),
      stateId : $("#stage_value").val(),

    })
    .done(function(build) {
      $('#changeStateModel').modal('hide');
      document.location = "/";
    });
}
