import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen w-full items-end bg-white overflow-hidden">
      <Navbar />
      <main className="flex-1">

      </main>
      <Footer />
    </div>
  );
}
