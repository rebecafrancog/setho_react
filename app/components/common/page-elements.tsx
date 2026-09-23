import type {ReactNode} from 'react';
import {Leaf} from 'lucide-react';

export function link(route: string, content: ReactNode, className = 'primary') {
  return <a key={route} className={className} href={'#/' + route}>{content}</a>;
}

export function title(text: string, subtitle?: string) {
  return <><h1 className="page-title">{text}</h1>{subtitle && <p>{subtitle}</p>}</>;
}

export function empty(message: string) {
  return <div className="empty"><Leaf size={30}/><h3>{message}</h3><p>As novidades aparecerão por aqui.</p></div>;
}
