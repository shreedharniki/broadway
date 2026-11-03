import {createRoot} from 'react-dom/client';
import './index.css';

const pathname = window.location.pathname.replace(/\/$/, '');
const isCityPrototype = pathname === '/city-prototype';
const isAboutPage = pathname === '/about';
const root = createRoot(document.getElementById('root')!);

if (isCityPrototype) {
  const { BroadwayCityPrototype } = await import('./prototype/BroadwayCityPrototype.tsx');
  root.render(<BroadwayCityPrototype />);
} else if (isAboutPage) {
  const { AboutPage } = await import('./AboutPage.tsx');
  root.render(<AboutPage />);
} else {
  const { default: App } = await import('./App.tsx');
  root.render(<App />);
}
