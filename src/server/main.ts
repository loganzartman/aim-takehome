import express from 'express';
import * as grpc from '@grpc/grpc-js';
import {
  Machine,
  MachineStreamRequest,
  UnimplementedMachineMapService,
} from './proto-generated/service';

class MachineMapService extends UnimplementedMachineMapService {
  Pause(
    call: grpc.ServerUnaryCall<Machine, Machine>,
    callback: grpc.sendUnaryData<Machine>
  ): void {
    throw new Error('Method not implemented.');
  }
  UnPause(
    call: grpc.ServerUnaryCall<Machine, Machine>,
    callback: grpc.sendUnaryData<Machine>
  ): void {
    throw new Error('Method not implemented.');
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
  '0.0.0.0:50051',
  grpc.ServerCredentials.createInsecure(),
  () => routeServer.start()
);

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello from the server side!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
