let fetch = require("node-fetch");
let https = require("https");

let org = [
  "Microsoft",
  "MSFTResearch",
  "Office",
  "MicrosoftTeams",
  "AzureDevOps",
  "MicrosoftIoT",
  "MSEdgeDev",
  "onedrive",
  "Windows",
  "VisualStudio",
  "MSFTImagine",
  "Azure",
  "reactjs",
  "nodejs",
  "graphqlweekly",
  "graphqlsummit",
  "apollographql",
  "prisma",
  "typescript",
  "oscafrica",
  "OpenSourceOrg",
  "freeCodeCamp",
  "MySQL",
  "MongoDB",
  "Netlify",
  "vercel",
  "GatsbyJS",
  "PostgreSQL",
];

// Get ids
fetch("https://api.twitter.com/2/tweets/search/stream/rules", {
  method: "GET",
  headers: {
    Authorization: `Bearer ${process.env.token}`,
  },
})
  .then((i) => i.json())
  .then((i) => {
    if (!i.data) {
      i.data = [];
    }
    let ids = i.data.map((i) => i.id);
    
    //delete rules
    let val = {
      delete: {
        ids: ids,
      },
    };
    fetch("https://api.twitter.com/2/tweets/search/stream/rules", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.token}`,
      },
      body: JSON.stringify(val),
    })
      .then((i) => i.json())
      .then((i) => {
        //create rules
        let val = {
          add: org.map(i=>{
              return ({
                  value: `from:${i} -is:retweet`
              })
          })
            
        };
        fetch("https://api.twitter.com/2/tweets/search/stream/rules", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.token}`,
          },
          body: JSON.stringify(val),
        })
          .then((i) => i.json())
          .then((i) => {
            https.get(
              "https://api.twitter.com/2/tweets/search/stream",
              {
                method: "GET",
                timeout: 20000,
                headers: {
                  Authorization: `Bearer ${process.env.token}`,
                },
              },
              (res) => {
                res.on("data", (d) => {
                  let res = Buffer.from(d).toString();
                  try {
                    console.log(JSON.parse(res));
                  } catch (error) {
                    console.log(error);
                  }
                });
                res.on("error", (err) => {
                  console.log(err);
                });
              }
            );
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  })
  .catch((err) => {
    console.log(err);
  });
