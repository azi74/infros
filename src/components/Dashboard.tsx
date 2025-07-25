import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TerraformModal } from "./TerraformModal";
import { AnsibleModal } from "./AnsibleModal";
import { CICDModal } from "./CICDModal";
import { DockerModal } from "./DockerModal";
import { Footer } from "./Footer";
import { ContactModal } from "./ContactModal";
import { Code, Server, Cloud, Settings, Download, Github, GitBranch, Container } from "lucide-react";
import terraformLogoDark from "@/assets/terraform-logo-dark.png";
import ansibleLogoDark from "@/assets/ansible-logo-dark.png";
import githubActionsLogo from "@/assets/github-actions-logo.png";

export const Dashboard = () => {
  const [terraformOpen, setTerraformOpen] = useState(false);
  const [ansibleOpen, setAnsibleOpen] = useState(false);
  const [cicdOpen, setCicdOpen] = useState(false);
  const [dockerOpen, setDockerOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Full Width Floating Header */}
      <header className="fixed top-0 left-0 right-0 z-50 animate-fade-in">
        <div className="mx-6 mt-6">
          <div className="glass-modal px-8 py-4 rounded-3xl border-blue-400/50 backdrop-blur-md">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-2xl flex items-center justify-center animate-float">
                  <Cloud className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">infros</h1>
                  <p className="text-sm text-muted-foreground">DevOps Assistant</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-32 pt-40">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
            {/* Terraform Card */}
            <div className="glass-modal p-6 md:p-8 rounded-3xl group hover:scale-105 transition-smooth cursor-pointer animate-fade-in"
                 onClick={() => setTerraformOpen(true)}>
              <div className="w-12 h-12 md:w-16 md:h-16 bg-muted rounded-2xl flex items-center justify-center mb-4 md:mb-6 mx-auto p-2 md:p-3">
                <img src="./terraform.png" alt="Terraform" className="w-full h-full rounded object-contain" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Terraform Script</h3>
              <p className="text-muted-foreground mb-4 md:mb-6 text-sm md:text-base">
                Visual form builder for cloud infrastructure. Generate EC2, VPC, S3, and more with live preview.
              </p>
              <Button variant="terraform" size="lg" className="bg-[#7B42BC] hover:bg-purple-900 hover:text-white hover:border-purple-600 text-white w-full">
                Create Infrastructure
              </Button>
            </div>

            {/* Ansible Card */}
            <div className="glass-modal p-6 md:p-8 rounded-3xl group hover:scale-105 transition-smooth cursor-pointer animate-fade-in"
                 onClick={() => setAnsibleOpen(true)}>
              <div className="w-12 h-12 md:w-16 md:h-16 bg-muted rounded-2xl flex items-center justify-center mb-4 md:mb-6 mx-auto p-2 md:p-3">
                <img src="./ansible.png" alt="Ansible" className="w-full h-full object-contain" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Ansible Playbook</h3>
              <p className="text-muted-foreground mb-4 md:mb-6 text-sm md:text-base">
                Configure servers with playbooks. Manage packages, services, users, and deployments.
              </p>
              <Button variant="ansible" size="lg" className="bg-red-700 hover:bg-red-900 hover:text-white hover:border-red-600 w-full">
                Configure Servers
              </Button>
            </div>

            {/* CI/CD Card */}
            <div className="glass-modal p-6 md:p-8 rounded-3xl group hover:scale-105 transition-smooth cursor-pointer animate-fade-in"
                 onClick={() => setCicdOpen(true)}>
              <div className="w-12 h-12 md:w-16 md:h-16 bg-muted rounded-2xl flex items-center justify-center mb-4 md:mb-6 mx-auto p-2 md:p-3">
                <img src="./git.png" alt="GitHub Actions" className="w-full h-full object-contain" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">CI/CD YAML</h3>
              <p className="text-muted-foreground mb-4 md:mb-6 text-sm md:text-base">
                Create GitHub Actions workflows for automated testing, building, and deployment.
              </p>
              <Button variant="hero" size="lg" className="hover:bg-cyan-900 hover:text-white hover:border-cyan-600 w-full">
                Setup CI/CD
              </Button>
            </div>

            {/* Docker Card */}
            <div className="glass-modal p-6 md:p-8 rounded-3xl group hover:scale-105 transition-smooth cursor-pointer animate-fade-in"
                 onClick={() => setDockerOpen(true)}>
              <div className="w-12 h-12 md:w-16 md:h-16 bg-muted rounded-2xl flex items-center justify-center mb-4 md:mb-6 mx-auto p-2 md:p-3">
                <img src="./docker.png" alt="Docker" className="w-full h-full object-contain" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Dockerfile</h3>
              <p className="text-muted-foreground mb-4 md:mb-6 text-sm md:text-base">
                Generate Docker configurations for containerizing your applications.
              </p>
              <Button variant="outline" size="lg" className="hover:bg-blue-900 hover:text-white hover:border-blue-600 w-full">
                Create Container
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">Key Features</h3>
          
          {/* Mobile: List Layout */}
          <div className="md:hidden space-y-4">
            {[
              { icon: Code, title: "Visual Forms", desc: "No scripting needed" },
              { icon: Download, title: "Export Ready", desc: "Production configs" },
              { icon: Github, title: "Git Integration", desc: "Push to repos" },
              { icon: Settings, title: "Live Preview", desc: "Real-time syntax" },
              { icon: GitBranch, title: "CI/CD Ready", desc: "Automated pipelines" },
              { icon: Container, title: "Containerization", desc: "Docker support" }
            ].map((feature, i) => (
              <div key={i} className="glass p-4 rounded-2xl flex items-center gap-4">
                <div className="flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: Grid Layout */}
          <div className="hidden md:grid md:grid-cols-6 gap-6">
            {[
              { icon: Code, title: "Visual Forms", desc: "No scripting needed" },
              { icon: Download, title: "Export Ready", desc: "Production configs" },
              { icon: Github, title: "Git Integration", desc: "Push to repos" },
              { icon: Settings, title: "Live Preview", desc: "Real-time syntax" },
              { icon: GitBranch, title: "CI/CD Ready", desc: "Automated pipelines" },
              { icon: Container, title: "Containerization", desc: "Docker support" }
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

      {/* Footer */}
      <Footer onContactClick={() => setContactOpen(true)} />

      {/* Modals */}
      <TerraformModal open={terraformOpen} onOpenChange={setTerraformOpen} />
      <AnsibleModal open={ansibleOpen} onOpenChange={setAnsibleOpen} />
      <CICDModal open={cicdOpen} onOpenChange={setCicdOpen} />
      <DockerModal open={dockerOpen} onOpenChange={setDockerOpen} />
      <ContactModal open={contactOpen} onOpenChange={setContactOpen} />
    </div>
  );
};