import Link from 'next/link';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';

interface LayoutProps {
  children: React.ReactNode;
}

export function Header() {
  const links = [
    {
      name: 'Stake',
      path: '/',
    },
    {
      name: 'WithDraw',
      path: '/withdraw',
    },
    {
      name: 'Claim',
      path: '/claim',
    },
  ];

  const pathname = usePathname();
  console.log('%c Line:26 🥥 pathname', 'color:#33a5ff', pathname);
  const isActive = (url: string) => {
    if (url == '/') {
      return pathname == '/';
    } else {
      return pathname.includes(url);
    }
  };

  return (
    <div className="h-15 bg-gray-900/80">
      <div className="h-full w-full flex items-center max-w-7xl mx-auto">
        <div className="text-white font-bold">MetaNode Stake</div>
        <div className="flex-1 flex justify-center gap-3 items-center">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              className={clsx(isActive(link.path) ? 'text-blue-500' : 'text-white')}
            >
              {link.name}
            </Link>
          ))}
        </div>
        <ConnectButton></ConnectButton>
      </div>
    </div>
  );
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed inset-0 overflow-hidden pointer-events-none"></div>
      <div className="absolute inset-0 bg-linear-to-br from-gray-900 via-gray-800 to-gray-900"></div>
      <div className="absolute inset-0 tech-grid"></div>

      <div className="relative">
        <Header></Header>
        <div className="max-w-7xl mx-auto">{children}</div>
      </div>
    </div>
  );
}
