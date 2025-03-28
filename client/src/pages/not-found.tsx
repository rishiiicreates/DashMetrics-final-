import { Card, CardContent } from "@/components/ui/card";
import { Frown, Home } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[70vh]">
      <div className="text-center">
        <Frown className="h-24 w-24 mx-auto text-primary/80 animate-bounce-slight" />
        
        <h1 className="mt-6 text-5xl font-doodle font-bold text-white">404</h1>
        <h2 className="mt-2 text-3xl font-doodle text-white/90">Page Not Found</h2>
        
        <div className="mt-8 max-w-md mx-auto p-6 border border-purple-800/40 rounded-lg bg-purple-900/10 backdrop-blur-sm shadow-lg">
          <p className="text-xl text-gray-300 font-handwritten">
            Oops! The page you're looking for seems to have wandered off.
          </p>
          
          <p className="mt-4 text-gray-400 font-handwritten">
            Maybe it's taking a break or got lost in cyberspace?
          </p>
          
          <Link href="/">
            <Button className="mt-8 gap-2 bg-purple-800 hover:bg-purple-700 transition-all duration-300 font-doodle text-lg group">
              <Home className="w-5 h-5 group-hover:animate-bounce-slight" />
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
