import { Metadata } from "next";
import "../../globals.css";
import { EngFont } from "@/utils/font";
export const metadata: Metadata = {
  title: "Task Management",
  description: `Management your tasks with the effective way`,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${EngFont.className}antialiased`}>{children}</body>
    </html>
  );
}
