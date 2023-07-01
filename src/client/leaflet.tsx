import './node_modules/leaflet/dist/leaflet.css';
import L from 'leaflet';

// patch image URLs since using bundler
// https://github.com/Leaflet/Leaflet/issues/4968#issuecomment-483402699
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});
