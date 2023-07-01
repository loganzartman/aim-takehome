import {useCallback, useMemo, useEffect} from 'react';
import {
  Machine,
  MachineMapClient,
  MachineStreamRequest,
} from './proto-generated/service';
import {MapContainer, Marker, TileLayer} from 'react-leaflet';
import {useState} from 'react';
import Button from './components/Button';

const GRPC_ADDRESS = 'http://localhost:8080';
const seattleLat = 47.60884551040699;
const seattleLon = -122.34006911204551;

type MachinesMap = {[key: number]: Machine};

const useMachines = (
  client: MachineMapClient
): {machines: MachinesMap; isStreaming: boolean} => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [counter, setCounter] = useState(0);
  const [machines, setMachines] = useState<MachinesMap>({});

  const reconnect = () => {
    setIsStreaming(false);
    setTimeout(() => setCounter((c) => c + 1), 1000);
  };

  useEffect(() => {
    const stream = client.MachineStream(new MachineStreamRequest(), null);

    stream.on('data', (machine) => {
      setIsStreaming(true);
      setMachines((machines) => ({...machines, [machine.id]: machine}));
    });

    stream.on('error', (err) => {
      console.error(err);
      reconnect();
    });

    stream.on('end', () => reconnect());

    return () => {
      stream.cancel();
    };
  }, [client, counter]);

  return {machines, isStreaming};
};

export default function App() {
  const client = useMemo(() => new MachineMapClient(GRPC_ADDRESS), []);
  const {machines, isStreaming} = useMachines(client);

  const handleUnPause = useCallback(() => {
    client.UnPause(new Machine({id: 0}), {}, (err, resp) => {
      if (err) throw new Error(err.message);
      console.log(resp);
    });
  }, []);

  const machineMarkers = useMemo(
    () =>
      Object.values(machines).map((machine) => (
        <Marker
          key={machine.id}
          position={[machine.location.lat, machine.location.lon]}
        />
      )),
    [machines]
  );

  return (
    <div>
      <MapContainer
        className="absolute left-0 top-0 right-0 bottom-0"
        // @ts-ignore: Property 'center' does not exist; package types are incorrect
        center={[seattleLat, seattleLon]}
        zoom={15}
        zoomControl={false}
        scrollWheelZoom
      >
        <TileLayer
          // @ts-ignore: Property 'attribution' does not exist; package types are incorrect
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {machineMarkers}
      </MapContainer>
      <div className="absolute left-0 top-0 z-[1000]">
        <div className="max-w-full m-2 p-2 bg-white shadow-lg flex flex-col">
          <div>Machines</div>
          {isStreaming ? <div>✅ Connected</div> : <div>⚠️ Not connected</div>}
          <Button onClick={handleUnPause}>UnPause</Button>
        </div>
      </div>
    </div>
  );
}
