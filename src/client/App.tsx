import {useCallback, useMemo, useEffect} from 'react';
import {
  Machine,
  MachineMapClient,
  MachineStreamRequest,
} from './proto-generated/service';
import {MapContainer, Marker, TileLayer} from 'react-leaflet';
import {useState} from 'react';

const GRPC_ADDRESS = 'http://localhost:8080';
const seattleLat = 47.60884551040699;
const seattleLon = -122.34006911204551;

type MachinesMap = {[key: number]: Machine};

const useMachines = (client: MachineMapClient): MachinesMap => {
  const [machines, setMachines] = useState<MachinesMap>({});

  useEffect(() => {
    const stream = client.MachineStream(new MachineStreamRequest(), null);

    stream.on('data', (machine) => {
      setMachines((machines) => ({...machines, [machine.id]: machine}));
    });

    stream.on('error', (err) => {
      console.error(err);
      throw new Error(err.name);
    });

    return () => {
      stream.cancel();
    };
  }, [client]);

  return machines;
};

export default function App() {
  const client = useMemo(() => new MachineMapClient(GRPC_ADDRESS), []);
  const machines = useMachines(client);

  const handleUnPause = useCallback(() => {
    client.UnPause(new Machine({id: 0}), {}, (err, resp) => {
      if (err) throw new Error(err.message);
      console.log(resp);
    });
  }, []);

  const machineMarkers = useMemo(
    () =>
      Object.values(machines).map((machine) => (
        <Marker position={[machine.location.lat, machine.location.lon]} />
      )),
    [machines]
  );

  return (
    <div>
      <div>hello from react</div>
      <button onClick={handleUnPause}>UnPause</button>
      <MapContainer
        style={{width: '600px', height: '400px'}}
        // @ts-ignore: Property 'center' does not exist; package types are incorrect
        center={[seattleLat, seattleLon]}
        zoom={15}
        scrollWheelZoom
      >
        <TileLayer
          // @ts-ignore: Property 'attribution' does not exist; package types are incorrect
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {machineMarkers}
      </MapContainer>
    </div>
  );
}
