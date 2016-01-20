var klass = require('klass')
  , MySqlStore = require('./mysqlstore')
  , KeenStore = require('./keenstore')
  , _ = require('underscore')
  , crypto = require('crypto');

var SQLCandidateStore = module.exports = klass(function () {

  // constructor
}).methods({
    getCandidates : function (done) {
      var sqlStore = new MySqlStore(),
      self = this;
      sqlStore.callStoredProcedure('uspGetCandidates' , function (err, encryptedResults) {
        var results = [];
        _.each(encryptedResults, function(res,index) {
            res.state = {
              name : res.State_Name,
              id : res.State_Id,
              order : res.State_Id
            };
            results.push(self.__decryptCandidate(res));
          });

        done(err,{ results : results});
      });
    },

    getPositions  : function (done) {
      var sqlStore = new MySqlStore(),
        self = this;
        sqlStore.callStoredProcedure("uspGetPositions", function (err, positions) {
          done(err, positions);
        });
    },

    getStates  : function (done) {
      var sqlStore = new MySqlStore(),
        self = this;
        sqlStore.callStoredProcedure("uspGetStates", function (err, states) {
          done(err, states);
        });
    },

    getRecruiters  : function (done) {
      var sqlStore = new MySqlStore(),
        self = this;
        sqlStore.callStoredProcedure("uspGetRecruiters", function (err, recruiters) {
          done(err, recruiters);
        });
    },

    getPersons  : function (done) {
      var sqlStore = new MySqlStore(),
        self = this;
        sqlStore.callStoredProcedure("uspGetPersons", function (err, persons) {
          done(err, persons);
        });
    },

    addCandidate : function(candidate, done) {
      var encryptedCandidate = this.__encryptCandidate(candidate);
      var sqlStore = new MySqlStore(),
      self = this;
      sqlStore.callStoredProcedure("uspInsertCandidate("
        +"'"+encryptedCandidate.firstName+"', "
        +"'"+encryptedCandidate.lastName+"' ,"
        +"'"+encryptedCandidate.email+"', "
        +"'"+encryptedCandidate.tagLine+"', "
        +"'"+encryptedCandidate.position+"', "
        +"'"+encryptedCandidate.recruiter+"', "
        +"'"+encryptedCandidate.owner+"', "
        +"'"+encryptedCandidate.tagLine+"'"
      +")" , function (err, encryptedResults) {
        var results = [];
        _.each(encryptedResults, function(res,index) {
            results.push(self.__decryptCandidate(res));
          });

        self.__sendStatusUpdateMsg(done, err, results);
      });
    },

    changeCandidateState : function(candidate, done) {
      var sqlStore = new MySqlStore(),
      self = this;
      sqlStore.callStoredProcedure("uspChangeState("
        +"'"+candidate.id+"', "
        +"'"+candidate.stateId+"'"
      +")" , function (err, encryptedResults) {
        var results = [];
        console.log(encryptedResults.length);
        _.each(encryptedResults, function(res,index) {
            results.push(self.__decryptCandidate(res));
          });

        self.__sendStatusUpdateMsg(done, err, results);
      });
    },

    changeCandidateOwner : function(candidate, done) {
      console.log("WF");
      console.log(candidate);
      var sqlStore = new MySqlStore(),
      self = this;
      sqlStore.callStoredProcedure("uspChangeOwner("
        +"'"+candidate.id+"', "
        +"'"+candidate.personId+"'"
      +")" , function (err, encryptedResults) {
        var results = [];
        console.log(encryptedResults.length);
        _.each(encryptedResults, function(res,index) {
            results.push(self.__decryptCandidate(res));
          });

        done(err,{ results : results});
      });
    },

    changeCandidateDueDate : function(candidate, done) {
      var sqlStore = new MySqlStore(),
      self = this;
      sqlStore.callStoredProcedure("uspChangeDueDate("
        +"'"+candidate.id+"', "
        +"'"+candidate.dueDate+"'"
      +")" , function (err, encryptedResults) {
        var results = [];
        console.log(encryptedResults.length);
        _.each(encryptedResults, function(res,index) {
            results.push(self.__decryptCandidate(res));
          });

        done(err,{ results : results});
      });
    },

    changeCandidateNote : function(candidate, done) {
      candidate.notes = this.__encrypt(candidate.notes || candidate.Notes);
      var sqlStore = new MySqlStore(),
      self = this;
      sqlStore.callStoredProcedure("uspChangeNote("
        +"'"+candidate.id+"', "
        +"'"+candidate.notes+"'"
      +")" , function (err, encryptedResults) {
        var results = [];
        _.each(encryptedResults, function(res,index) {
            results.push(self.__decryptCandidate(res));
          });

        done(err,{ results : results});
      });
    },

    addPosition : function(position, done) {
      var sqlStore = new MySqlStore(),
      self = this;
      sqlStore.callStoredProcedure("uspInsertPosition("
        +"'"+position.name+"', "
        +"'"+position.description+"' ,"
        +"'"+position.reqLink+"'"
        +")",
        function (err, results) {
          debugger;
          done(err, { results : results});
        });
    },

    __sendStatusUpdateMsg : function (done, err, results) {
      var keenStore = new KeenStore();
      var msg = {};
      _.each(results, function(res,index) {
            var msg = {};
            switch(res.StageId) {
              case 1:
                msg = keenStore.createLeadMsg(res.CandidateId, res.Recruiter_PersonId, '1')
                break;
              case 2:
                msg = keenStore.createScreenMsg(res.CandidateId, res.Recruiter_PersonId, '1')
                break;
              case 3:
                msg = keenStore.createInterviewMsg(res.CandidateId, res.Recruiter_PersonId, '1')
                break;
              case 4:
                msg = keenStore.createOfferMsg(res.CandidateId, res.Recruiter_PersonId, '1')
                break;
              case 5:
                msg = keenStore.createAcceptedMsg(res.CandidateId, res.Recruiter_PersonId, '1')
                break;
              case 6:
                msg = keenStore.createWithdrawnMsg(res.CandidateId, res.Recruiter_PersonId, '1')
                break;
              case 7:
                msg = keenStore.createRejectedMsg(res.CandidateId, res.Recruiter_PersonId, '1')
                break;
            }

            keenStore.sendStatusMsg(msg, function(){})
          });

      done(err,{ results : results});
    },

    __encryptCandidate : function (candidate) {
      candidate.firstName = this.__encrypt(candidate.firstName ||candidate.FirstName );
      candidate.lastName = this.__encrypt(candidate.lastName || candidate.LastName);
      candidate.tagLine = this.__encrypt(candidate.tagLine || candidate.TagLine);
      candidate.email = this.__encrypt(candidate.email || candidate.EmailAddress);
      candidate.notes = this.__encrypt(candidate.notes || candidate.Notes);
      return candidate;
    },

    __decryptCandidate : function (candidate) {
      candidate.firstName = this.__decrypt(candidate.firstName ||candidate.FirstName );
      candidate.lastName = this.__decrypt(candidate.lastName || candidate.LastName);
      candidate.tagLine = this.__decrypt(candidate.tagLine || candidate.TagLine);
      candidate.email = this.__decrypt(candidate.email || candidate.EmailAddress);
      candidate.notes = this.__decrypt(candidate.notes || candidate.Notes);
      return candidate;
    },

    __encrypt : function (text) {
      text = text || "";
      var passPhrase = this.__getPassPhrase();
      var cipher = crypto.createCipher('aes-256-cbc', passPhrase);
      var crypted = cipher.update(text,'utf8','hex');
       crypted += cipher.final('hex');
      return crypted;
    },

    __decrypt : function (crypted) {
      crypted = crypted ||"";
      var passPhrase = this.__getPassPhrase();
      var decipher = crypto.createDecipher('aes-256-cbc', passPhrase);
      var dec = decipher.update(crypted,'hex','utf8');
      dec += decipher.final('utf8');
      return dec;
    },

    __getPassPhrase : function () {
      return process.env.passPhrase;
    }
});
