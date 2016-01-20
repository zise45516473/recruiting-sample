var klass = require('klass')
  , _ = require('underscore')
var Keen = require("keen.io");

var KeenStore = module.exports = klass(function () {

  // constructor
}).methods({

    getOverallStageFunnel : function (recruiter, done) {
      this.__getFunnelData("", recruiter, done);
    },

    getWeeklyStageFunnel : function (recruiter, done) {
      this.__getFunnelData("this_7_days", recruiter, done);
    },

    __getFunnelData : function (timeframe, recruiter, done) {
      var client = this.__configureClient();
      var definition = this.__getFunnelDefinition(timeframe, recruiter);

      self = this;
      client.run(definition, function(err, response) {
        if (err) return done([]);
        var steps = self.__aggFunnelData(response.result);
        done({ funnel : response.result, aggragate : steps});
      });
    },

    sendStatusMsg : function(statusMsg, done) {
      var client = this.__configureClient();

      client.addEvents(statusMsg, function(err, res) {
        if(err)
        {
          console.log('error sending status message...')
        }
        console.log('Change Status Event Sent')
        console.log(statusMsg);
        done();
      });
    },

    createLeadMsg : function(candidateId, recruiter, timeForStateChange) {
      return { "candidate_lead" : [{"CandidateId" : candidateId}, {"Recruiter" : recruiter}, {"Time taken:" : timeForStateChange}] }
    },

    createScreenMsg : function(candidateId, recruiter, timeForStateChange) {
      return { "candidate_screen" : [{"CandidateId" : candidateId}, {"Recruiter" : recruiter}, {"Time taken:" : timeForStateChange}] }
    },

    createInterviewMsg : function(candidateId, recruiter, timeForStateChange) {
      return { "candidate_interview" : [{"CandidateId" : candidateId}, {"Recruiter" : recruiter}, {"Time taken:" : timeForStateChange}] }
    },

    createOfferMsg : function(candidateId, recruiter, timeForStateChange) {
      return { "candidate_offer" : [{"CandidateId" : candidateId}, {"Recruiter" : recruiter}, {"Time taken:" : timeForStateChange}] }
    },

    createAcceptedMsg : function(candidateId, recruiter, timeForStateChange) {
      return { "candidate_accepted" : [{"CandidateId" : candidateId}, {"Recruiter" : recruiter}, {"Time taken:" : timeForStateChange}] }
    },

    createRejectedMsg : function(candidateId, recruiter, timeForStateChange) {
      return { "candidate_rejected" : [{"CandidateId" : candidateId}, {"Recruiter" : recruiter}, {"Time taken:" : timeForStateChange}] }
    },

    createWithdrawnMsg : function(candidateId, recruiter, timeForStateChange) {
      return { "candidate_withdrawn" : [{"CandidateId" : candidateId}, {"Recruiter" : recruiter}, {"Time taken:" : timeForStateChange}] }
    },

    __aggFunnelData : function(data) {
        var priorStep = data[0];
        var steps = [100];
        var trans = data.slice(1);
        trans.forEach(function(value) {
          var percent = (value/priorStep) * 100;
          steps.push(percent);
          priorStep = value;
        });
        return steps;
    },

    __getFunnelDefinition  : function (timeframe, recruiter) {
      var def = {
        steps: [
          {
            event_collection: "candidate_lead",
            actor_property: "CandidateId"
          },
          {
            event_collection: "candidate_screen",
            actor_property: "CandidateId"
          },
          {
            event_collection: "candidate_interview",
            actor_property: "CandidateId"
          },
          {
            event_collection: "candidate_offer",
            actor_property: "CandidateId"
          },
          {
            event_collection: "candidate_accepted",
            actor_property: "CandidateId"
          }
        ],
        timeframe: timeframe
      }

      if(recruiter && recruiter != "" && recruiter != "All" && recruiter != "all")
      {
        console.log("updating filters");
        def.steps.forEach(function(item) {
          item.filters = [ { "property_name" : "Recruiter", "operator" : "eq", "property_value" : recruiter } ];
        });
      }

      var funnel = new Keen.Query('funnel', def);
      return funnel;
    },

    __configureClient : function() {
      return Keen.configure({
      projectId: "-- insert your own --",
      writeKey: "-- insert your own --",
      readKey: "-- insert your own --"
    });
    }
});
