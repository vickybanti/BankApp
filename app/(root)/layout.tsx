import MobileNav from "@/components/MobileNav";
import Sidebar from "@/components/Sidebar";
import Image from "next/image";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const loggedIn = {firstName:"banti", lastName:"vikky"}
  return (
    <main className="flex w-full h-screen">
        <Sidebar user={loggedIn}/>
        <div className="flex flex-col size-full">
          <div className="root-layout">
            <Image src="/icons/logo.svg"
            width={30}
            height={30}
            alt="logo"
            />
            <div>
              <MobileNav user={loggedIn} />
            </div>
          </div>
          {children}
        </div>
        
    </main>
  );
}
