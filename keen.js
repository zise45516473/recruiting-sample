var Keen = require("keen.io");
var client = Keen.configure({
    projectId: "-- insert your own here--",
    writeKey: "-- insert your own here--",
    readKey: "-- insert your own here--"
});

//sendLeadEvent(client, "5", "Sam", "1");
//sendScreenEvent(client, "4", "Sam", "3");

console.log("query keen for funnel...");

var funnel = new Keen.Query('funnel', {
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
  timeframe: ""
});

console.log(funnel);

client.run(funnel, function(err, response){
  if (err) return console.log(err);
  console.log(response.result);
  
  var priorStep = response.result[0];
  var steps = [100];
  var trans = response.result.slice(1);
  trans.forEach(function(value) {
  	var percent = (value/priorStep) * 100;
  	steps.push(percent);
  	priorStep = value;
  });

  console.log(steps);

});


function sendLeadEvent(client, canidateId, recruiter, timeForStateChange) {
	client.addEvents({
		"candidate_lead" : [{"CandidateId" : canidateId}, {"Recruiter" : recruiter}, {"Time taken:" : timeForStateChange}] }, function(err, res) {
		if (err) {
			console.log("Oh no, an error!");
		} else {
			console.log("Hooray, it worked!");
		}
	});
}

function sendScreenEvent(client, canidateId, recruiter, timeForStateChange) {
	client.addEvents({
		"candidate_screen" : [{"CandidateId" : canidateId}, {"Recruiter" : recruiter}, {"Time taken:" : timeForStateChange}] }, function(err, res) {
		if (err) {
			console.log("Oh no, an error!");
		} else {
			console.log("Hooray, it worked!");
		}
	});
}

function sendInterviewEvent(client, canidateId, recruiter, timeForStateChange) {
	client.addEvents({
		"canidate_interview" : [{"CanidateId" : canidateId}, {"Recruiter" : recruiter}, {"Time taken:" : timeForStateChange}] }, function(err, res) {
		if (err) {
			console.log("Oh no, an error!");
		} else {
			console.log("Hooray, it worked!");
		}
	});
}

function sendOfferEvent(client, canidateId, recruiter, timeForStateChange) {
	client.addEvents({
		"canidate_offer" : [{"CanidateId" : canidateId}, {"Recruiter" : recruiter}, {"Time taken:" : timeForStateChange}] }, function(err, res) {
		if (err) {
			console.log("Oh no, an error!");
		} else {
			console.log("Hooray, it worked!");
		}
	});
}

function sendAcceptedEvent(client, canidateId, recruiter, timeForStateChange) {
	client.addEvents({
		"canidate_accepted" : [{"CanidateId" : canidateId}, {"Recruiter" : recruiter}, {"Time taken:" : timeForStateChange}] }, function(err, res) {
		if (err) {
			console.log("Oh no, an error!");
		} else {
			console.log("Hooray, it worked!");
		}
	});
}

function sendRejectedEvent(client, canidateId, recruiter, timeForStateChange) {
	client.addEvents({
		"canidate_rejected" : [{"CanidateId" : canidateId}, {"Recruiter" : recruiter}, {"Time taken:" : timeForStateChange}] }, function(err, res) {
		if (err) {
			console.log("Oh no, an error!");
		} else {
			console.log("Hooray, it worked!");
		}
	});
}

function sendWithdrawnEvent(client, canidateId, recruiter, timeForStateChange) {
	client.addEvents({
		"canidate_withdrawn" : [{"CanidateId" : canidateId}, {"Recruiter" : recruiter}, {"Time taken:" : timeForStateChange}] }, function(err, res) {
		if (err) {
			console.log("Oh no, an error!");
		} else {
			console.log("Hooray, it worked!");
		}
	});
}

// sendScreenEvent(client, "12345", "Wayne", "1");
// sendInterviewEvent(client, "12345", "Wayne", "4");
// sendOfferEvent(client, "12345", "Wayne", "1");
// sendAcceptedEvent(client, "12345", "Wayne", "2");

// sendLeadEvent(client, "23456", "Sam", "1");
// sendScreenEvent(client, "23456", "Sam", "3");
// sendInterviewEvent(client, "23456", "Sam", "5");
// sendOfferEvent(client, "23456", "Sam", "1");
// sendAcceptedEvent(client, "23456", "Sam", "2");

// sendLeadEvent(client, "34567", "Wayne", "1");
// sendScreenEvent(client, "34567", "Wayne", "1");
// sendInterviewEvent(client, "34567", "Wayne", "10");
// sendOfferEvent(client, "34567", "Wayne", "1");

// sendLeadEvent(client, "45678", "Wayne", "10");
// sendScreenEvent(client, "45678", "Wayne", "3");
// sendRejectedEvent(client, "45678", "Wayne", "1");

// sendLeadEvent(client, "567890", "Sam", "10");
// sendScreenEvent(client, "567890", "Sam", "10");
// sendInterviewEvent(client, "567890", "Sam", "1");
// sendOfferEvent(client, "567890", "Sam", "1");
// sendWithdrawnEvent(client, "567890", "Sam", "2");




