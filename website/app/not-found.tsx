import Navbar from "@/components/Navbar";

export default function Notfound() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col items-center justify-center min-h-screen bg-[#000]  px-6">
        <h1 className="text-9xl font-extrabold tracking-tight ">404</h1>
        <p className="mt-4 text-2xl font-semibold">Page Not Found</p>
        <p className="mt-2 max-w-md text-center text-[#929292]">
          The page you are looking for might have been removed or is temporarily
          unavailable.
        </p>
        <a
          href="/"
          className="mt-8 inline-block rounded-full active:scale-95 bg-[#3b82f6] px-6 py-3 text-white font-medium hover:bg-[#2563eb] transition-colors"
        >
          Go Back Home
        </a>
      </main>
    </>
  );
}
