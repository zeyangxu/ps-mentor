import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MinimalNav } from "@/components/MinimalNav";
import Index from "./pages/Index";
import Editor from "./pages/Editor";
import Login from "./pages/Login";
import Payment from "./pages/Payment";
import { Analytics } from "@vercel/analytics/react";

const queryClient = new QueryClient();

const App = () => (
  <div>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <MinimalNav />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/editor" element={<Editor />} />
            <Route path="/login" element={<Login />} />
            <Route path="/payment" element={<Payment />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
    <Analytics />
  </div>
);

export default App;
