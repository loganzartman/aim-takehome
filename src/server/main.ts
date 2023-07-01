import express from 'express';
import * as grpc from '@grpc/grpc-js';
import {
  Machine,
  MachineStreamRequest,
  UnimplementedMachineMapService,
} from './proto-generated/service';

const grpcPort = 9090;

class MachineMapService extends UnimplementedMachineMapService {
  Pause(
    call: grpc.ServerUnaryCall<Machine, Machine>,
    callback: grpc.sendUnaryData<Machine>
  ): void {
    callback(null, call.request);
  }
  UnPause(
    call: grpc.ServerUnaryCall<Machine, Machine>,
    callback: grpc.sendUnaryData<Machine>
  ): void {
    callback(null, call.request);
  }
  MachineStream(
    call: grpc.ServerWritableStream<MachineStreamRequest, Machine>
  ): void {
    throw new Error('Method not implemented.');
  }
}

const createServer = () => {
  const server = new grpc.Server();
  server.addService(
    UnimplementedMachineMapService.definition,
    new MachineMapService()
  );
  return server;
};

const routeServer = createServer();
routeServer.bindAsync(
  `0.0.0.0:${grpcPort}`,
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) throw new Error(`Bind error: ${err}`);
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
