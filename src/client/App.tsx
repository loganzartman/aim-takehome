import {useCallback, useState} from 'react';
import {Machine, MachineMapClient} from './proto-generated/service';
import {MapContainer, TileLayer} from 'react-leaflet';

const GRPC_ADDRESS = 'http://localhost:8080';
const seattleLat = 47.60884551040699;
const seattleLon = -122.34006911204551;

export default function App() {
  const [client, setClient] = useState(
    () => new MachineMapClient(GRPC_ADDRESS)
  );

  const handleUnPause = useCallback(() => {
    client.UnPause(new Machine({id: 0}), {}, (err, resp) => {
      if (err) throw new Error(err.message);
      console.log(resp);
    });
  }, []);

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
      </MapContainer>
    </div>
  );
}
