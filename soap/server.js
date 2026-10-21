const soap = require("soap");
const http = require("http");
const fs = require("fs");

const service = {
  BookService: {
    BookPort: {
      addBook(args) {
        return { message: "Book added: " + args.title };
      }
    }
  }
};

const wsdl = fs.readFileSync(__dirname + "/book.wsdl", "utf8");

const server = http.createServer();
server.listen(8000, () => {
  soap.listen(server, "/book", service, wsdl);
  console.log("Server running at http://localhost:8000/book?wsdl");
});
