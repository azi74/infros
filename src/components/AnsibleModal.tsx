import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { CodePreview } from "./CodePreview";
import { Server, Download, Copy, Package, Users, Play } from "lucide-react";
import ansibleLogoDark from "@/assets/ansible-logo-dark.png";

interface AnsibleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AnsibleModal = ({ open, onOpenChange }: AnsibleModalProps) => {
  const [config, setConfig] = useState({
    hostGroup: "webservers",
    packages: ["nginx", "nodejs", "git"],
    services: ["nginx", "ssh"],
    users: ["deploy"],
    playbookName: "server-setup",
    become: true,
    updateCache: true
  });

  const generateAnsiblePlaybook = () => {
    return `---
- name: ${config.playbookName} playbook
  hosts: ${config.hostGroup}
  ${config.become ? 'become: yes' : ''}
  
  vars:
    packages_to_install:
${config.packages.map(pkg => `      - ${pkg}`).join('\n')}
    
    services_to_enable:
${config.services.map(svc => `      - ${svc}`).join('\n')}
    
    users_to_create:
${config.users.map(user => `      - ${user}`).join('\n')}

  tasks:
    - name: Update package cache
      ${config.updateCache ? 'apt:\n        update_cache: yes\n        cache_valid_time: 3600' : '# Skipped'}
      when: ansible_os_family == "Debian"
      
    - name: Install required packages
      package:
        name: "{{ item }}"
        state: present
      loop: "{{ packages_to_install }}"
      
    - name: Create users
      user:
        name: "{{ item }}"
        state: present
        create_home: yes
        shell: /bin/bash
      loop: "{{ users_to_create }}"
      
    - name: Start and enable services
      service:
        name: "{{ item }}"
        state: started
        enabled: yes
      loop: "{{ services_to_enable }}"
      
    - name: Configure firewall for web traffic
      ufw:
        rule: allow
        port: '80'
        proto: tcp
      when: "'nginx' in services_to_enable"
      
  handlers:
    - name: restart nginx
      service:
        name: nginx
        state: restarted
        
    - name: reload systemd
      systemd:
        daemon_reload: yes`;
  };

  const handleDownload = () => {
    const code = generateAnsiblePlaybook();
    const blob = new Blob([code], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.playbookName}.yml`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateAnsiblePlaybook());
  };

  const handlePackageChange = (pkg: string, checked: boolean) => {
    if (checked) {
      setConfig({...config, packages: [...config.packages, pkg]});
    } else {
      setConfig({...config, packages: config.packages.filter(p => p !== pkg)});
    }
  };

  const handleServiceChange = (svc: string, checked: boolean) => {
    if (checked) {
      setConfig({...config, services: [...config.services, svc]});
    } else {
      setConfig({...config, services: config.services.filter(s => s !== svc)});
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-modal max-w-6xl overflow-hidden">
        <DialogHeader className="pb-6">
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center p-2">
              <img src="./ansible.png" alt="Ansible" className="w-full h-full object-contain" />
            </div>
            Ansible Playbook Generator
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full overflow-hidden">
          {/* Configuration Form */}
          <div className="space-y-6 overflow-y-auto pr-4">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-4 glass">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="packages">Packages</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="space-y-4">
                <div className="glass p-6 rounded-2xl space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Play className="w-5 h-5 text-primary" />
                    Playbook Configuration
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="playbookName">Playbook Name</Label>
                      <Input 
                        id="playbookName"
                        className="glass"
                        value={config.playbookName}
                        onChange={(e) => setConfig({...config, playbookName: e.target.value})}
                        placeholder="server-setup"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hostGroup">Target Host Group</Label>
                      <Input 
                        id="hostGroup"
                        className="glass"
                        value={config.hostGroup}
                        onChange={(e) => setConfig({...config, hostGroup: e.target.value})}
                        placeholder="webservers"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="become"
                        checked={config.become}
                        onCheckedChange={(checked) => setConfig({...config, become: !!checked})}
                      />
                      <Label htmlFor="become">Run with sudo privileges (become)</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="updateCache"
                        checked={config.updateCache}
                        onCheckedChange={(checked) => setConfig({...config, updateCache: !!checked})}
                      />
                      <Label htmlFor="updateCache">Update package cache</Label>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="packages" className="space-y-4">
                <div className="glass p-6 rounded-2xl space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary" />
                    Package Installation
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {["nginx", "apache2", "nodejs", "python3", "git", "docker", "mysql-server", "postgresql"].map((pkg) => (
                      <div key={pkg} className="flex items-center space-x-2">
                        <Checkbox 
                          id={pkg}
                          checked={config.packages.includes(pkg)}
                          onCheckedChange={(checked) => handlePackageChange(pkg, !!checked)}
                        />
                        <Label htmlFor={pkg}>{pkg}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="services" className="space-y-4">
                <div className="glass p-6 rounded-2xl space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Server className="w-5 h-5 text-primary" />
                    Service Management
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {["nginx", "apache2", "ssh", "docker", "mysql", "postgresql"].map((svc) => (
                      <div key={svc} className="flex items-center space-x-2">
                        <Checkbox 
                          id={svc}
                          checked={config.services.includes(svc)}
                          onCheckedChange={(checked) => handleServiceChange(svc, !!checked)}
                        />
                        <Label htmlFor={svc}>{svc}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="users" className="space-y-4">
                <div className="glass p-6 rounded-2xl space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    User Management
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="users">Users to Create (comma-separated)</Label>
                    <Input 
                      id="users"
                      className="glass"
                      value={config.users.join(", ")}
                      onChange={(e) => setConfig({...config, users: e.target.value.split(",").map(u => u.trim()).filter(u => u)})}
                      placeholder="deploy, admin, developer"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex gap-3 pt-6 border-t border-border">
              <Button variant="ansible" onClick={handleDownload} className="hover:bg-red-900 flex-1">
                <Download className="w-4 h-4 mr-2" />
                Download .yml
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
              code={generateAnsiblePlaybook()}
              language="yaml"
              title="Generated Ansible Playbook"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};