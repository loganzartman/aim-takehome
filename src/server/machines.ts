import {GPS, Machine} from './proto-generated/service';

const seattleLat = 47.60884551040699;
const seattleLon = -122.34006911204551;
const seattleAlt = 39;

const rand = (mag: number) => Math.random() * mag - mag / 2;

const createDummyGPS = (): GPS =>
  new GPS({
    lat: seattleLat + rand(0.005),
    lon: seattleLon + rand(0.005),
    alt: seattleAlt,
  });

const createDummyMachines = (): Array<Machine> =>
  Array.from({length: 16}).map(
    (_, id) =>
      new Machine({
        id,
        location: createDummyGPS(),
        fuel_level: Math.random(),
        is_paused: false,
      })
  );

export class MachinesSimulator {
  machines: Array<Machine>;

  constructor() {
    this.machines = createDummyMachines();
  }

  update() {
    this.machines.forEach((machine) => {
      // brownian motion
      if (!machine.is_paused) {
        machine.location.lat += rand(0.0001);
        machine.location.lon += rand(0.0001);
      }
    });
  }
}
