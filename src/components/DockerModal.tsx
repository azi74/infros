import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodePreview } from "./CodePreview";
import { Download, Copy, Container } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DockerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DockerModal = ({ open, onOpenChange }: DockerModalProps) => {
  const { toast } = useToast();
  const [config, setConfig] = useState({
    baseImage: "node:18-alpine",
    workdir: "/app",
    port: "3000",
    commands: "npm install\nnpm run build",
    startCommand: "npm start",
    copyFiles: ". .",
    env: "NODE_ENV=production"
  });

  const generateDockerfile = () => {
    return `# Use official Node.js runtime as base image
FROM ${config.baseImage}

# Set working directory
WORKDIR ${config.workdir}

# Set environment variables
ENV ${config.env}

# Copy package files
COPY package*.json ./

# Install dependencies
RUN ${config.commands.split('\n').join(' && \\\n    ')}

# Copy application code
COPY ${config.copyFiles}

# Expose port
EXPOSE ${config.port}

# Start the application
CMD ["${config.startCommand.split(' ').join('", "')}"]
`;
  };

  const generateDockerCompose = () => {
    return `version: '3.8'

services:
  app:
    build: .
    ports:
      - "${config.port}:${config.port}"
    environment:
      - ${config.env}
    restart: unless-stopped
    
  # Add additional services as needed
  # database:
  #   image: postgres:15
  #   environment:
  #     POSTGRES_DB: myapp
  #     POSTGRES_USER: user
  #     POSTGRES_PASSWORD: password
  #   volumes:
  #     - postgres_data:/var/lib/postgresql/data
  #   ports:
  #     - "5432:5432"

# volumes:
#   postgres_data:
`;
  };

  const handleDownload = () => {
    const content = generateDockerfile();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Dockerfile';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Downloaded!",
      description: "Dockerfile has been downloaded successfully.",
    });
  };

  const handleDownloadCompose = () => {
    const content = generateDockerCompose();
    const blob = new Blob([content], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'docker-compose.yml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Downloaded!",
      description: "docker-compose.yml has been downloaded successfully.",
    });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateDockerfile());
      toast({
        title: "Copied!",
        description: "Dockerfile copied to clipboard.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const Content = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Container className="w-6 h-6 text-primary" />
        <div>
          <h2 className="text-xl font-semibold">Docker Configuration</h2>
          <p className="text-sm text-muted-foreground">Generate Dockerfile and docker-compose.yml</p>
        </div>
      </div>

      <Tabs defaultValue="config" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="baseImage">Base Image</Label>
              <Input
                id="baseImage"
                value={config.baseImage}
                onChange={(e) => setConfig({ ...config, baseImage: e.target.value })}
                placeholder="node:18-alpine"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workdir">Working Directory</Label>
              <Input
                id="workdir"
                value={config.workdir}
                onChange={(e) => setConfig({ ...config, workdir: e.target.value })}
                placeholder="/app"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="port">Exposed Port</Label>
              <Input
                id="port"
                value={config.port}
                onChange={(e) => setConfig({ ...config, port: e.target.value })}
                placeholder="3000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="copyFiles">Copy Files</Label>
              <Input
                id="copyFiles"
                value={config.copyFiles}
                onChange={(e) => setConfig({ ...config, copyFiles: e.target.value })}
                placeholder=". ."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="env">Environment Variables</Label>
            <Input
              id="env"
              value={config.env}
              onChange={(e) => setConfig({ ...config, env: e.target.value })}
              placeholder="NODE_ENV=production"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="commands">Build Commands (one per line)</Label>
            <Textarea
              id="commands"
              value={config.commands}
              onChange={(e) => setConfig({ ...config, commands: e.target.value })}
              placeholder="npm install&#10;npm run build"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="startCommand">Start Command</Label>
            <Input
              id="startCommand"
              value={config.startCommand}
              onChange={(e) => setConfig({ ...config, startCommand: e.target.value })}
              placeholder="npm start"
            />
          </div>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <div className="flex gap-2 mb-4">
            <Button onClick={handleDownload} size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download Dockerfile
            </Button>
            <Button onClick={handleDownloadCompose} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download Compose
            </Button>
            <Button onClick={handleCopy} variant="outline" size="sm">
              <Copy className="w-4 h-4 mr-2" />
              Copy Dockerfile
            </Button>
          </div>
          
          <Tabs defaultValue="dockerfile" className="space-y-4">
            <TabsList>
              <TabsTrigger value="dockerfile">Dockerfile</TabsTrigger>
              <TabsTrigger value="compose">docker-compose.yml</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dockerfile">
              <CodePreview code={generateDockerfile()} language="dockerfile" />
            </TabsContent>
            
            <TabsContent value="compose">
              <CodePreview code={generateDockerCompose()} language="yaml" />
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <>
      {/* Desktop Dialog */}
      <Dialog open={open} onOpenChange={() => {}}>
        <DialogContent className="hidden md:block max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Container className="w-5 h-5" />
              Docker Configuration
            </DialogTitle>
          </DialogHeader>
          <Content />
        </DialogContent>
      </Dialog>

      {/* Mobile Drawer */}
      <Drawer open={open} onOpenChange={() => {}}>
        <DrawerContent className="md:hidden">
          <DrawerHeader>
            <DrawerTitle className="flex items-center gap-2 justify-center">
              <Container className="w-5 h-5" />
              Docker Configuration
            </DrawerTitle>
          </DrawerHeader>
          <Content />
        </DrawerContent>
      </Drawer>
    </>
  );
};