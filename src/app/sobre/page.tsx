import { permanentRedirect } from 'next/navigation';

export default function SobrePageRedirect() {
  permanentRedirect('/about');
}
