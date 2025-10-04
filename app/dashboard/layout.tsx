import AppSidebarLayout from "@/layouts/app/app-sidebar-layout";
import { type ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <AppSidebarLayout>{children}</AppSidebarLayout>
    </SessionProvider>
  );
}
