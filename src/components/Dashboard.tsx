import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TerraformModal } from "./TerraformModal";
import { AnsibleModal } from "./AnsibleModal";
import { Code, Server, Cloud, Settings, Download, Github } from "lucide-react";

export const Dashboard = () => {
  const [terraformOpen, setTerraformOpen] = useState(false);
  const [ansibleOpen, setAnsibleOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-2xl flex items-center justify-center">
              <Cloud className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">InfraGenie</h1>
              <p className="text-sm text-muted-foreground">DevOps Assistant</p>
            </div>
          </div>
          
          <nav className="flex items-center gap-3">
            <Button variant="ghost" size="icon">
              <Github className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8">
            <Code className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Infrastructure as Code Made Simple</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Generate Production-Ready<br />
            <span className="bg-gradient-primary bg-clip-text text-transparent">DevOps Scripts</span>
          </h2>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Create Terraform and Ansible configurations through visual forms. 
            No manual scripting required—just point, click, and deploy.
          </p>

          {/* Action Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Terraform Card */}
            <div className="glass-modal p-8 rounded-3xl group hover:scale-105 transition-smooth cursor-pointer"
                 onClick={() => setTerraformOpen(true)}>
              <div className="w-16 h-16 bg-gradient-terraform rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Cloud className="w-8 h-8 text-background" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Terraform Generator</h3>
              <p className="text-muted-foreground mb-6">
                Visual form builder for cloud infrastructure. Generate EC2, VPC, S3, and more with live preview.
              </p>
              <Button variant="terraform" size="lg" className="w-full">
                Create Infrastructure
              </Button>
            </div>

            {/* Ansible Card */}
            <div className="glass-modal p-8 rounded-3xl group hover:scale-105 transition-smooth cursor-pointer"
                 onClick={() => setAnsibleOpen(true)}>
              <div className="w-16 h-16 bg-gradient-ansible rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Server className="w-8 h-8 text-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Ansible Generator</h3>
              <p className="text-muted-foreground mb-6">
                Configure servers with playbooks. Manage packages, services, users, and deployments.
              </p>
              <Button variant="ansible" size="lg" className="w-full">
                Configure Servers
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">Key Features</h3>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Code, title: "Visual Forms", desc: "No scripting needed" },
              { icon: Download, title: "Export Ready", desc: "Production configs" },
              { icon: Github, title: "Git Integration", desc: "Push to repos" },
              { icon: Settings, title: "Live Preview", desc: "Real-time syntax" }
            ].map((feature, i) => (
              <div key={i} className="glass p-6 rounded-2xl text-center">
                <feature.icon className="w-8 h-8 text-primary mx-auto mb-4" />
                <h4 className="font-semibold mb-2">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modals */}
      <TerraformModal open={terraformOpen} onOpenChange={setTerraformOpen} />
      <AnsibleModal open={ansibleOpen} onOpenChange={setAnsibleOpen} />
    </div>
  );
};