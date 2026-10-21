const soap = require("soap");

soap.createClient("http://localhost:8000/book?wsdl", (err, client) => {
  client.addBook({ title: "Clean Code" }, (err, result) => {
    console.log(result);
    console.log("SOAP Request:", client.lastRequest);
    console.log("SOAP Response:", client.lastResponse);
  });
});
