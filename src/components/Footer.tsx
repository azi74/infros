import { Button } from "@/components/ui/button";
import { Github, Twitter, Linkedin, Mail, Code, Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-background/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-2xl flex items-center justify-center">
                <Code className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-bold">InfraGenie</h3>
                <p className="text-sm text-muted-foreground">DevOps Assistant</p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm">
              Simplifying Infrastructure as Code through visual forms and automated script generation.
            </p>
          </div>

          {/* Tools */}
          <div className="space-y-4">
            <h4 className="font-semibold">Tools</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Terraform Generator</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Ansible Playbooks</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Docker Compose</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Kubernetes YAML</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="font-semibold">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Examples</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Community</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h4 className="font-semibold">Connect</h4>
            <div className="flex gap-3">
              <Button variant="glass" size="icon" className="hover:scale-105 transition-transform">
                <Github className="w-5 h-5" />
              </Button>
              <Button variant="glass" size="icon" className="hover:scale-105 transition-transform">
                <Twitter className="w-5 h-5" />
              </Button>
              <Button variant="glass" size="icon" className="hover:scale-105 transition-transform">
                <Linkedin className="w-5 h-5" />
              </Button>
              <Button variant="glass" size="icon" className="hover:scale-105 transition-transform">
                <Mail className="w-5 h-5" />
              </Button>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>support@infragenie.dev</p>
              <p>Follow us for updates</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500" />
            <span>for the DevOps community</span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <span>© 2024 InfraGenie. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};