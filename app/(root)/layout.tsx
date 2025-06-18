import AppSidebar from "@/components/AppSidebar";
import MobileNav from "@/components/MobileNav";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import Image from "next/image";
import { redirect } from "next/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const loggedIn = await getLoggedInUser();

  if(!loggedIn) redirect('/sign-in')

  return (
    <SidebarProvider>


    <main className="flex w-full h-screen">
                    <AppSidebar user={loggedIn} />

                <SidebarTrigger />

        <div className="flex flex-col size-full">
          <div className="root-layout">
            <Image src="/icons/logo.svg"
            width={30}
            height={30}
            alt="logo"
            />
            <div>
              {/* Only render MobileNav if loggedIn is not null */}
              <MobileNav user={loggedIn} />
            </div>
          </div>
          {children} 
        </div>
        
    </main>
    </SidebarProvider>

  );
}