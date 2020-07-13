var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var odataPastRequests = require("./odata");
var odataColleagues = require("./odataColleagues");
var approverOData = require("./approver");
var colleagues = [
  {
    name: "Dilshad Ahmad",
    eCode: "3423421",
  },
  {
    name: "Laxmikant Pathak",
    eCode: "3423422",
  },
  {
    name: "Sweta Sahu",
    eCode: "3423423",
  },
  {
    name: "Harphool Singh",
    eCode: "3423424",
  },
  {
    name: "Jayesh Popat",
    eCode: "3423425",
  },
  {
    name: "Prabhudutta Kar",
    eCode: "3423426",
  },
  {
    name: "Sunil Kumtakar",
    eCode: "3423427",
  },
  {
    name: "Sujeet Rathod",
    eCode: "3423428",
  },
  {
    name: "Rajdatta Sarwade",
    eCode: "3423429",
  },
  {
    name: "Shyamanta Nath",
    eCode: "3423430",
  },
  {
    name: "Nagamuniah Ravuru",
    eCode: "3423431",
  },
  {
    name: "Hiten Panchal",
    eCode: "3423432",
  },
];

var pastRequests = [];

app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
// * Working with odata

// *1. Pending odata requests
app.get("/odataPastRequests", (req, res, next) => {
  res.json(odataPastRequests);
});

// *2. odata Colleagues
app.get("/odataColleagues", (req, res, next) => {
  res.json(odataColleagues);
});

// *3. odata for approver
app.get("/odataPendingRequests", (req, res, next) => {
  res.json(approverOData);
});

// *Everything below working fine
// * Working for requester api
app.get("/pastRequests", (req, res, next) => {
  res.json(pastRequests);
});

app.get("/colleagues", (req, res, next) => {
  res.json(colleagues);
});

app.post("/newRequest", (req, res, next) => {
  //console.log(req.body);
  req.body["approver"] = "Hiten Panchal";
  req.body["status"] = "pending";
  console.log(req.body);

  pastRequests.unshift(req.body);
  res.json({ message: "Request has been logged successfuly", status: "200" });
});

app.post("/deleteRequest", (req, res, next) => {
  pastRequests.splice(
    pastRequests.findIndex((request) => {
      return areEqual(request, req.body);
    }),
    1
  );
  res.json({ message: "Request has been deleted successfuly", status: "200" });
});

// * Working with approval api sending pending request
app.get("/pendingRequests", (req, res, next) => {
  // * Sending only those requests which are pending for approval
  let pendingRequests = pastRequests
    .filter((request) => {
      if (request.status === "pending") {
        return request;
      }
    })
    .map((request) => request);
  // console.log(pendingRequests);
  res.json(pendingRequests);
});

// * Approve a Request
app.post("/approveRequests", (req, res, next) => {
  // console.log(req.body);
  req.body.forEach((req1) =>
    pastRequests.findIndex((request) => {
      // console.log(areEqual(request, req1));
      if (areEqual(request, req1)) {
        request.status = "approved";
        // console.log(pastRequests);
      }
    })
  );
  res.json({ message: "Request has been approved successfuly", status: "200" });
});

// * Reject a Request
app.post("/rejectRequests", (req, res, next) => {
  // console.log(req.body);
  req.body.forEach((req1) =>
    pastRequests.findIndex((request) => {
      // console.log(areEqual(request, req1));
      if (areEqual(request, req1)) {
        request.status = "rejected";
        // console.log(pastRequests);
      }
    })
  );
  res.json({ message: "Request has been rejected successfuly", status: "200" });
});

// * Function to compare the objects
function areEqual(object1, object2) {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let key of keys1) {
    if (object1[key] !== object2[key]) {
      return false;
    }
  }

  return true;
}

app.listen(3000);
