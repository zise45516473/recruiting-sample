var klass = require('klass')
  , _ = require('underscore')

var KeenStore = module.exports = klass(function () {

  // constructor
}).methods({

    getOverallStageFunnel : function (done) {
      this.__getFunnelData("",done);
    },

    getWeeklyStageFunnel : function (done) {
      this.__getFunnelData("this_7_days",done);
    },

    __getFunnelData : function (timeframe, done) {
      var results = [10, 6, 2, 1, 0];
      var agg = [100, 60, 33, 50, 0];
        done({ funnel : results, aggragate : agg});
    },

    sendStatusMsg : function(statusMsg, done) {
        done();
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
    }
});
