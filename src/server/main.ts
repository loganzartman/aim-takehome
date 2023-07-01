import express from 'express';
import * as grpc from '@grpc/grpc-js';
import {
  Machine,
  MachineStreamRequest,
  UnimplementedMachineMapService,
} from './proto-generated/service';
import {MachinesSimulator} from './machines';

const grpcPort = 9090;

class MachineMapService extends UnimplementedMachineMapService {
  #simulator: MachinesSimulator;

  constructor(simulator: MachinesSimulator) {
    super();
    this.#simulator = simulator;
  }

  Pause(
    call: grpc.ServerUnaryCall<Machine, Machine>,
    callback: grpc.sendUnaryData<Machine>
  ): void {
    const reqId = call.request.id;
    const machine = this.#simulator.machines.find((m) => m.id === reqId);
    if (!machine) {
      callback(new Error(`No machine with ID ${reqId}`));
    } else {
      machine.is_paused = true;
      callback(null, machine);
    }
  }

  UnPause(
    call: grpc.ServerUnaryCall<Machine, Machine>,
    callback: grpc.sendUnaryData<Machine>
  ): void {
    const reqId = call.request.id;
    const machine = this.#simulator.machines.find((m) => m.id === reqId);
    if (!machine) {
      callback(new Error(`No machine with ID ${reqId}`));
    } else {
      machine.is_paused = false;
      callback(null, machine);
    }
  }

  MachineStream(
    call: grpc.ServerWritableStream<MachineStreamRequest, Machine>
  ): void {
    let ready = true;
    call.on('drain', () => {
      ready = true;
    });

    setInterval(() => {
      if (ready) {
        this.#simulator.machines.forEach((machine) => {
          ready = call.write(machine);
        });
      }
    }, 1000 / 30);
  }
}

const createServer = () => {
  const server = new grpc.Server();
  const simulator = new MachinesSimulator();

  setInterval(() => {
    simulator.update();
  }, 1000 / 30);

  server.addService(
    UnimplementedMachineMapService.definition,
    new MachineMapService(simulator)
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
