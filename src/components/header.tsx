import Link from 'next/link';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="sticky top-0 z-10 border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">AvaliAi</h1>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/dashboard" className="text-sm font-medium">
            Dashboard
          </Link>
          <Link href="/exams" className="text-sm font-medium">
            Provas
          </Link>
          <Link href="/question-bank" className="text-sm font-medium">
            Banco de Questões
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/profile">
            <Button variant="ghost" size="sm">Perfil</Button>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm">Sair</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
