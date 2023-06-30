import express from 'express';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

const PROTO_PATH = '../../proto/service.proto';

// Suggested options for similarity to existing grpc.load behavior
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

const Pause = () => {
  throw new Error('Pause() unimplemented');
};
const UnPause = () => {
  throw new Error('UnPause() unimplemented');
};
const MachineStream = () => {
  throw new Error('MachineStream() unimplemented');
};

const createServer = () => {
  const server = new grpc.Server();
  server.addService((protoDescriptor as any).MachineMap.service, {
    Pause,
    UnPause,
    MachineStream,
  });
  return server;
};

const routeServer = createServer();
routeServer.bindAsync(
  '0.0.0.0:50051',
  grpc.ServerCredentials.createInsecure(),
  () => {
    routeServer.start();
  }
);

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello from the server side!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
