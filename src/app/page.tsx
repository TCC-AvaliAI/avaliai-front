"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, Database, CheckCircle } from "lucide-react";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";

import Header from "@/components/header";
import MainContent from "@/components/main-content";

export default function Home() {
  return <MainContent />;
}
