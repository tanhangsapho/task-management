import { Metadata } from "next";
import "../globals.css";
import { EngFont } from "@/utils/font";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "Task Management",
  description: "Manage your tasks effectively.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${EngFont.className} antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
