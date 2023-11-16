import grpc from "grpc";
import protoLoader from "@grpc/proto-loader";

const packageDef = protoLoader.loadSync("todo.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

// const text = process.argv[2];

const client = new todoPackage.Todo('localhost:55000', grpc.credentials.createInsecure())

client.createTodo({
    id: -1,
    text: 'Do Laundry'
}, (err, response) => {
    console.log('Recived from server ' + JSON.stringify(response))
})


client.readTodos(null, (err, response) => {
    console.log('Recived from server ' + JSON.stringify(response))
})


const call = client.readTodosStream()
call.on('data', (item) => console.log('Recived Item: ' + JSON.stringify(item)))
call.on('end', () => 'Server done')