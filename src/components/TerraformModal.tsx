import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodePreview } from "./CodePreview";
import { Cloud, Download, Copy } from "lucide-react";
import terraformLogoDark from "@/assets/terraform-logo-dark.png";

interface TerraformModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TerraformModal = ({ open, onOpenChange }: TerraformModalProps) => {
  const [config, setConfig] = useState({
    provider: "aws",
    region: "us-east-1",
    instanceType: "t3.micro",
    instanceName: "my-ec2-instance",
    ami: "ami-0c02fb55956c7d316",
    keyPair: "",
    securityGroup: "default"
  });

  const generateTerraformCode = () => {
    return `terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "${config.region}"
}

resource "aws_instance" "${config.instanceName.replace(/[^a-zA-Z0-9]/g, '_')}" {
  ami           = "${config.ami}"
  instance_type = "${config.instanceType}"
  key_name      = "${config.keyPair}"
  
  vpc_security_group_ids = ["${config.securityGroup}"]
  
  tags = {
    Name = "${config.instanceName}"
    Environment = "dev"
    ManagedBy = "InfraGenie"
  }
}

output "instance_ip" {
  value = aws_instance.${config.instanceName.replace(/[^a-zA-Z0-9]/g, '_')}.public_ip
}`;
  };

  const handleDownload = () => {
    const code = generateTerraformCode();
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'main.tf';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateTerraformCode());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-modal max-w-6xl overflow-hidden">
        <DialogHeader className="pb-1">
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center p-2">
              <img src={terraformLogoDark} alt="Terraform" className="w-full h-full object-contain" />
            </div>
            Terraform Infrastructure Generator
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full overflow-hidden">
          {/* Configuration Form */}
          <div className="space-y-6 overflow-y-auto pr-4">
            <Tabs defaultValue="compute" className="w-full">
              <TabsList className="grid w-full grid-cols-3 glass">
                <TabsTrigger value="compute">Compute</TabsTrigger>
                <TabsTrigger value="network">Network</TabsTrigger>
                <TabsTrigger value="storage">Storage</TabsTrigger>
              </TabsList>
              
              <TabsContent value="compute" className="space-y-4">
                <div className="glass p-6 rounded-2xl space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Cloud className="w-5 h-5 text-primary" />
                    EC2 Instance Configuration
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="provider">Cloud Provider</Label>
                      <Select value={config.provider} onValueChange={(value) => setConfig({...config, provider: value})}>
                        <SelectTrigger className="glass">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="glass-modal">
                          <SelectItem value="aws">Amazon Web Services</SelectItem>
                          <SelectItem value="azure">Microsoft Azure</SelectItem>
                          <SelectItem value="gcp">Google Cloud Platform</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="region">Region</Label>
                      <Select value={config.region} onValueChange={(value) => setConfig({...config, region: value})}>
                        <SelectTrigger className="glass">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="glass-modal">
                          <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                          <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                          <SelectItem value="eu-west-1">EU (Ireland)</SelectItem>
                          <SelectItem value="ap-southeast-1">Asia Pacific (Singapore)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="instanceType">Instance Type</Label>
                      <Select value={config.instanceType} onValueChange={(value) => setConfig({...config, instanceType: value})}>
                        <SelectTrigger className="glass">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="glass-modal">
                          <SelectItem value="t3.micro">t3.micro (1 vCPU, 1 GiB)</SelectItem>
                          <SelectItem value="t3.small">t3.small (2 vCPU, 2 GiB)</SelectItem>
                          <SelectItem value="t3.medium">t3.medium (2 vCPU, 4 GiB)</SelectItem>
                          <SelectItem value="m5.large">m5.large (2 vCPU, 8 GiB)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="instanceName">Instance Name</Label>
                      <Input 
                        id="instanceName"
                        className="glass"
                        value={config.instanceName}
                        onChange={(e) => setConfig({...config, instanceName: e.target.value})}
                        placeholder="my-ec2-instance"
                      />
                    </div>

                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="ami">AMI ID</Label>
                      <Input 
                        id="ami"
                        className="glass"
                        value={config.ami}
                        onChange={(e) => setConfig({...config, ami: e.target.value})}
                        placeholder="ami-0c02fb55956c7d316"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="keyPair">Key Pair Name</Label>
                      <Input 
                        id="keyPair"
                        className="glass"
                        value={config.keyPair}
                        onChange={(e) => setConfig({...config, keyPair: e.target.value})}
                        placeholder="my-key-pair"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="securityGroup">Security Group</Label>
                      <Input 
                        id="securityGroup"
                        className="glass"
                        value={config.securityGroup}
                        onChange={(e) => setConfig({...config, securityGroup: e.target.value})}
                        placeholder="sg-12345678"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="network" className="space-y-4">
                <div className="glass p-6 rounded-2xl">
                  <h3 className="text-lg font-semibold mb-4">Network Configuration</h3>
                  <p className="text-muted-foreground">VPC and subnet configuration coming soon...</p>
                </div>
              </TabsContent>
              
              <TabsContent value="storage" className="space-y-4">
                <div className="glass p-6 rounded-2xl">
                  <h3 className="text-lg font-semibold mb-4">Storage Configuration</h3>
                  <p className="text-muted-foreground">EBS volumes and S3 buckets coming soon...</p>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex gap-3 pt-6 border-t border-border">
              <Button variant="terraform" onClick={handleDownload} className="bg-[#7B42BC] text-white hover:bg-purple-950 hover:text-white flex-1">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" onClick={handleCopy}>
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
            </div>
          </div>

          {/* Code Preview */}
          <div className="flex flex-col h-full">
            <CodePreview 
              code={generateTerraformCode()}
              language="terraform"
              title="Generated Terraform Configuration"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};