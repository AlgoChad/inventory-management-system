import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
  } from "@remix-run/react";
  import "./tailwind.css";
  import Navbar from "./components/app/custom/NavBar";
  import { QueryClient, QueryClientProvider } from 'react-query';
  
  // Create a client
  const queryClient = new QueryClient();
  
  function Document({children}: {children: React.ReactNode}) {
      return (
          <html lang="en">
              <head>
                  <meta charSet="utf-8" />
                  <meta name="viewport" content="width=device-width, initial-scale=1" />
                  <Meta />
                  <Links />
              </head>
              <body className="bg-gray-100 text-gray-900">
                  {children}
                  <ScrollRestoration />
                  <Scripts />
              </body>
          </html>
      );
  }
  
  export function Layout({ children }: { children: React.ReactNode }) {
    return (
      <Document>
          <div className="flex h-screen">
              <Navbar />
              <main className="flex-1 container mx-auto p-4 mt-5">
                  {children}
              </main>
          </div>
      </Document>
    );
  }
  
  export default function App() {
    return (
      <QueryClientProvider client={queryClient}>
        <Outlet />
      </QueryClientProvider>
    );
  }