import {useCallback, useState} from 'react';
import {Machine, MachineMapClient} from './proto-generated/service';

const GRPC_ADDRESS = 'http://localhost:8080';

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
    </div>
  );
}
