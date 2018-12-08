const http = require("http");

let friends = [
  {
    name: "lalit",
    age: 27,
    profession: "Doctor"
  },
  {
    name: "Satyapal",
    age: 30,
    profession: "Civil Engineer"
  },
  {
    name: "Nayan",
    age: 28,
    profession: "Assistant Manager"
  },
  {
    name: "Urvish",
    age: 27,
    profession: "Network Engineer"
  }
];

const server = http
  .createServer((request, response) => {
    if (request.url === "/") {
      response.write("Hello World");
      response.end();
    }

    if (request.url === "/api/friends") {
      response.write(JSON.stringify(friends));
      response.end();
    }
  })
  .listen(5001);
console.log("Serever Connected");
