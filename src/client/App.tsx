import {useCallback, useMemo, useEffect} from 'react';
import {
  Machine,
  MachineMapClient,
  MachineStreamRequest,
} from './proto-generated/service';
import {MapContainer, Marker, TileLayer} from 'react-leaflet';
import {useState} from 'react';
import Button from './components/Button';
import L from 'leaflet';

const GRPC_ADDRESS = 'http://localhost:8080';
const seattleLat = 47.60884551040699;
const seattleLon = -122.34006911204551;

const normalMarkerSvg = `
  <svg width="48" height="48" fill="dodgerblue" stroke="white" stroke-width="1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z"/>
  </svg>
`;

const selectedMarkerSvg = `
  <svg width="48" height="48" fill="red" stroke="white" stroke-width="1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z"/>
  </svg>
`;

const normalMarkerIcon = L.divIcon({
  className: '',
  html: normalMarkerSvg,
  iconSize: [48, 48],
});

const selectedMarkerIcon = L.divIcon({
  className: '',
  html: selectedMarkerSvg,
  iconSize: [48, 48],
});

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
  const [selectedMachine, setSelectedMachine] = useState<string>('');

  const handleUnPause = useCallback(() => {
    if (selectedMachine !== '') {
      client.UnPause(
        new Machine({id: Number.parseInt(selectedMachine)}),
        {},
        (err, resp) => {
          if (err) throw new Error(err.message);
          console.log(resp);
        }
      );
    }
  }, [client, selectedMachine]);

  const handlePause = useCallback(() => {
    if (selectedMachine !== '') {
      client.Pause(
        new Machine({id: Number.parseInt(selectedMachine)}),
        {},
        (err, resp) => {
          if (err) throw new Error(err.message);
          console.log(resp);
        }
      );
    }
  }, [client, selectedMachine]);

  const machineMarkers = useMemo(
    () =>
      Object.values(machines).map((machine) => (
        <Marker
          key={machine.id}
          position={[machine.location.lat, machine.location.lon]}
          icon={
            selectedMachine === String(machine.id)
              ? selectedMarkerIcon
              : normalMarkerIcon
          }
          eventHandlers={{
            click: () => {
              setSelectedMachine(String(machine.id));
            },
          }}
        ></Marker>
      )),
    [machines, selectedMachine]
  );

  const machineSelector = useMemo(
    () => (
      <select
        className="font-bold"
        value={selectedMachine}
        onChange={(e) => {
          setSelectedMachine(e.target.value as any);
        }}
      >
        <option value="">None</option>
        {Object.values(machines).map((machine) => (
          <option key={machine.id} value={machine.id}>
            ID: {machine.id}
          </option>
        ))}
      </select>
    ),
    [machines, selectedMachine]
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
      <div className="absolute left-0 top-0 z-[1000] max-w-full">
        <div className="m-2 p-4 bg-white shadow-lg rounded-lg flex flex-col gap-2">
          <div className="flex flex-row flex-wrap items-center justify-between mb-2">
            <div className="mr-10 text-xl">Machines</div>
            {isStreaming ? (
              <div>✅ Connected</div>
            ) : (
              <div>⚠️ Not connected</div>
            )}
          </div>
          <div className="flex flex-row flex-wrap gap-2">
            <div>Select machine:</div>
            {machineSelector}
          </div>
          <div className="flex flex-row flex-wrap gap-1">
            <Button disabled={selectedMachine === ''} onClick={handlePause}>
              Pause
            </Button>
            <Button disabled={selectedMachine === ''} onClick={handleUnPause}>
              UnPause
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
