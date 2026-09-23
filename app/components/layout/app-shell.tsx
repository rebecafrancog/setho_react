"use client";

import {useState, type ReactNode} from 'react';
import {ArrowLeft, Bell, Building2, ChevronRight, ClipboardList, HandHeart, Heart, Home, Menu, Search, UserRound} from 'lucide-react';
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from '@/components/ui/sheet';
import {Toaster} from '@/components/ui/sonner';
import {accountHome} from '../../auth';
import type {Account, Notification} from '../../models/setho';
import type {LucideIcon} from 'lucide-react';

interface AppShellProps {
  user: Account | null;
  admin: boolean;
  ready: boolean;
  route: string;
  notifications: Notification[];
  children: ReactNode;
}

type NavigationItem = [LucideIcon, string, string];

const userMenu = [
  ['inicio', 'Início'], ['ongs', 'ONGs'], ['voluntariado', 'Voluntariar'],
  ['projetos', 'Projetos'], ['doacoes', 'Doações'],
  ['meus-voluntariados', 'Meus voluntariados'], ['perfil', 'Perfil'],
];

const adminMenu = [
  ['painel', 'Painel'], ['minha-ong', 'Minha ONG'],
  ['gerenciar/needs', 'Necessidades'], ['gerenciar/projects', 'Projetos'],
  ['gerenciar/opportunities', 'Oportunidades de voluntariado'],
  ['inscritos', 'Voluntários inscritos'], ['recebidas', 'Doações recebidas'],
  ['notificacoes', 'Notificações'], ['perfil', 'Perfil'],
];

export function AppShell({user, admin, ready, route, notifications, children}: AppShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const page = route.split('/')[0] || 'landing';
  const nav: NavigationItem[] = admin
    ? [[Home, 'Painel', 'painel'], [Building2, 'Minha ONG', 'minha-ong'], [ClipboardList, 'Necessidades', 'gerenciar/needs'], [HandHeart, 'Voluntários', 'inscritos'], [Heart, 'Doações', 'recebidas'], [UserRound, 'Perfil', 'perfil']]
    : [[Home, 'Início', user ? 'inicio' : ''], [Search, 'ONGs', 'ongs'], [HandHeart, 'Voluntariar', 'voluntariado'], [Heart, 'Doações', 'doacoes'], [UserRound, 'Perfil', 'perfil']];

  const hasUnreadNotification = notifications.some(
    notification => !notification.read &&
      (notification.owner === user?.id || notification.owner === user?.org),
  );

  return <div className={(user && ready ? 'phone authenticated ' : 'phone public ') + (admin ? 'admin-look ' : 'user-look ') + 'page-' + page}>
    <header>
      <a href={user ? '#/' + accountHome(user.role) : '#/'}>
        <img src="/setho.jpeg" alt="SETHO — juntos por um futuro melhor"/>
      </a>
      {ready && user && <div>
        {!admin && <a className="header-profile" href="#/perfil" aria-label="Meu perfil">
          {user.photo ? <img src={user.photo} alt=""/> : <UserRound size={20}/>} 
        </a>}
        <a className="header-icon-button" aria-label="Notificações" href="#/notificacoes">
          <Bell size={21}/>{hasUnreadNotification && <span className="notification-dot"/>}
        </a>
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild><button aria-label="Abrir menu"><Menu/></button></SheetTrigger>
          <SheetContent className="mobile-menu">
            <SheetHeader><SheetTitle>SETHO</SheetTitle></SheetHeader>
            {(admin ? adminMenu : userMenu).map(([path, text]) =>
              <a className="menu-link" key={path} href={'#/' + path} onClick={() => setMenuOpen(false)}>
                {text}<ChevronRight size={16}/>
              </a>)}
          </SheetContent>
        </Sheet>
      </div>}
    </header>

    <main>
      {!ready ? <p>Preparando seu SETHO…</p> : <>
        {route && <button className="back" onClick={historyBack}><ArrowLeft size={16}/>Voltar</button>}
        {children}
        <footer><span>SETHO · juntos por um futuro melhor</span></footer>
      </>}
    </main>

    {ready && user && <nav className="bottom" aria-label="Navegação principal">
      {nav.map(([Icon, text, path]) =>
        <a className={route === path ? 'active' : ''} href={'#/' + path} key={path}>
          <Icon size={20}/><span>{text}</span>
        </a>)}
    </nav>}
    <Toaster position="top-center"/>
  </div>;
}

function historyBack() {
  if (window.history.length > 1) window.history.back();
  else location.hash = '/';
}
