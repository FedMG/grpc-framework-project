import grpc from "grpc";
import protoLoader from "@grpc/proto-loader";

const packageDef = protoLoader.loadSync("todo.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

const server = new grpc.Server();
server.bind("0.0.0.0:55000", grpc.ServerCredentials.createInsecure()); // communication will be plain text
server.addService(todoPackage.Todo.service, {
  createTodo: createTodo,
  readTodos: readTodos,
  readTodosStream: readTodosStream
});

server.start();

const todos = [];
function createTodo(call, callback) {
  const todoItem = {
    id: todos.length + 1,
    text: call.request.text
  }
  todos.push(todoItem)
  callback(null, todoItem)
  console.log(call);
}

function readTodos(call, callback) {
  callback(null, { items: todos })
}

function readTodosStream(call, callback) {
  todos.forEach((item) => call.write(item))
  call.end()
}

