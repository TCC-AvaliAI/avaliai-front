"use client";

import Link from "next/link";
import { FileText, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSession } from "next-auth/react";
import api from "@/lib/axios";
import { MessageAlert, MessageAlertProps } from "./message-alert";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  message: MessageAlertProps;
  setMessage: React.Dispatch<React.SetStateAction<MessageAlertProps>>;
}

const Header = ({ message, setMessage }: HeaderProps) => {
  const { data: session } = useSession();
  const userName = session?.name;
  const userAvatar = session?.image;
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    try {
      await api.post("/user/logout/");
      window.location.href = "/";
    } catch (error) {
      window.location.href = "/";
    }
  };

  return (
    <>
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">AvaliAi</h1>
            </Link>
          </div>
          {/* Menu de navegação desktop */}
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
            <Link
              href="/discipline-and-classroom"
              className="text-sm font-medium"
            >
              Turmas e Classes
            </Link>
          </nav>
          {/* Menu mobile */}
          <div className="flex items-center gap-4">
            {/* Avatar e saudação */}
            {session ? (
              <>
                <div className="hidden md:flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userAvatar} alt={userName} />
                    <AvatarFallback>{userName}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium hidden md:inline-block">
                    Olá, {userName?.toLocaleLowerCase()}
                  </span>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    Sair
                  </Button>
                </div>
                {/* Dropdown mobile */}
                <div className="md:hidden flex items-center">
                  <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label="Abrir menu">
                        <Menu className="h-6 w-6" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <div className="flex items-center gap-2 px-2 py-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={userAvatar} alt={userName} />
                          <AvatarFallback>{userName}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium truncate">
                          {userName?.toLocaleLowerCase()}
                        </span>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard" onClick={() => setMenuOpen(false)}>
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/exams" onClick={() => setMenuOpen(false)}>
                          Provas
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/question-bank"
                          onClick={() => setMenuOpen(false)}
                        >
                          Banco de Questões
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/discipline-and-classroom"
                          onClick={() => setMenuOpen(false)}
                        >
                          Turmas e Classes
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          setMenuOpen(false);
                          handleLogout();
                        }}
                        className="text-destructive"
                      >
                        Sair
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Entrar
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>
      {message.message && (
        <MessageAlert
          variant={message.variant}
          message={message.message}
          onDismiss={() => setMessage({ ...message, message: "" })}
          idToRedirect={message.idToRedirect}
          redirectText={message.redirectText}
        />
      )}
    </>
  );
};

export default Header;
