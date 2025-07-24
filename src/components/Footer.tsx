import { Button } from "@/components/ui/button";
import { getDate } from "date-fns";
import { Github, Mail, Heart, Cloud } from "lucide-react";

interface FooterProps {
  onContactClick?: () => void;
}

export const Footer = ({ onContactClick }: FooterProps) => {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border bg-background/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-2xl flex items-center justify-center">
                <Cloud className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-bold">infros</h3>
                <p className="text-sm text-muted-foreground">DevOps Assistant</p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm">
              Simplifying Infrastructure as Code.
            </p>
          </div>

          {/* Tools */}
          <div className="space-y-4">
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold"></h4>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h4 className="font-semibold">Connect</h4>
            <div className="flex gap-3">
              <Button 
                variant="glass" 
                size="icon" 
                className="hover:scale-105 transition-transform"
                onClick={() => window.open("https://github.com/azi74", "_blank")}>
                <Github className="w-5 h-5" />
              </Button>
              <Button 
                variant="glass" 
                size="icon" 
                className="hover:scale-105 transition-transform"
                onClick={onContactClick}>
                <Mail className="w-5 h-5" />
              </Button>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>aboobackerasi198@gmail.com</p>
              <p>Follow us for updates</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500" />
            <span>for the DevOps community</span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span>© {year} infros</span>
          </div>
        </div>
      </div>
    </footer>
  );
};