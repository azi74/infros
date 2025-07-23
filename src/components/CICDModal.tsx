import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { CodePreview } from "./CodePreview";
import { GitBranch, Download, Copy, Play, TestTube, Rocket } from "lucide-react";
import githubActionsLogo from "@/assets/github-actions-logo.png";

interface CICDModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CICDModal = ({ open, onOpenChange }: CICDModalProps) => {
  const [config, setConfig] = useState({
    workflowName: "ci-cd-pipeline",
    triggers: ["push", "pull_request"],
    branches: ["main", "develop"],
    nodeVersion: "18",
    testCommand: "npm test",
    buildCommand: "npm run build",
    deployTarget: "vercel",
    runLinting: true,
    runTests: true,
    enableCaching: true,
    enableSecurity: true
  });

  const generateGitHubActionsYAML = () => {
    return `name: ${config.workflowName}

on:
  ${config.triggers.map(trigger => {
    if (trigger === "push" || trigger === "pull_request") {
      return `${trigger}:
    branches: [ ${config.branches.map(b => `"${b}"`).join(", ")} ]`;
    }
    return trigger;
  }).join("\n  ")}

jobs:
  ${config.runLinting ? `lint:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '${config.nodeVersion}'${config.enableCaching ? `
          cache: 'npm'` : ''}
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run linting
        run: npm run lint

  ` : ''}${config.runTests ? `test:
    runs-on: ubuntu-latest
    ${config.runLinting ? 'needs: lint' : ''}
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '${config.nodeVersion}'${config.enableCaching ? `
          cache: 'npm'` : ''}
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: ${config.testCommand}
        
      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        if: success()

  ` : ''}${config.enableSecurity ? `security:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Run security audit
        run: npm audit --audit-level=moderate
        
      - name: Dependency review
        uses: actions/dependency-review-action@v3
        if: github.event_name == 'pull_request'

  ` : ''}build:
    runs-on: ubuntu-latest
    needs: [${[config.runLinting && 'lint', config.runTests && 'test', config.enableSecurity && 'security'].filter(Boolean).join(', ')}]
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '${config.nodeVersion}'${config.enableCaching ? `
          cache: 'npm'` : ''}
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build application
        run: ${config.buildCommand}
        
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-files
          path: dist/

  deploy:
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    environment: production
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-files
          path: dist/
          
      ${config.deployTarget === "vercel" ? `- name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: \${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: \${{ secrets.ORG_ID }}
          vercel-project-id: \${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'` : ''}${config.deployTarget === "netlify" ? `- name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v2.0
        with:
          publish-dir: './dist'
          production-branch: main
          github-token: \${{ secrets.GITHUB_TOKEN }}
          deploy-message: "Deploy from GitHub Actions"
        env:
          NETLIFY_AUTH_TOKEN: \${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: \${{ secrets.NETLIFY_SITE_ID }}` : ''}${config.deployTarget === "aws" ? `- name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: \${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: \${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
          
      - name: Deploy to S3
        run: aws s3 sync dist/ s3://\${{ secrets.S3_BUCKET_NAME }} --delete
        
      - name: Invalidate CloudFront
        run: aws cloudfront create-invalidation --distribution-id \${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} --paths "/*"` : ''}`;
  };

  const handleDownload = () => {
    const code = generateGitHubActionsYAML();
    const blob = new Blob([code], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.workflowName}.yml`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateGitHubActionsYAML());
  };

  const handleTriggerChange = (trigger: string, checked: boolean) => {
    if (checked) {
      setConfig({...config, triggers: [...config.triggers, trigger]});
    } else {
      setConfig({...config, triggers: config.triggers.filter(t => t !== trigger)});
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-modal max-w-6xl overflow-hidden">
        <DialogHeader className="pb-6">
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="w-10 h-10 bg-background rounded-xl flex items-center justify-center p-2">
              <img src="./git.png" alt="GitHub Actions" className="w-full h-full object-contain" />
            </div>
            GitHub Actions CI/CD Generator
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full overflow-hidden">
          {/* Configuration Form */}
          <div className="space-y-6 overflow-y-auto pr-4">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-4 glass">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="triggers">Triggers</TabsTrigger>
                <TabsTrigger value="steps">Steps</TabsTrigger>
                <TabsTrigger value="deploy">Deploy</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="space-y-4">
                <div className="glass p-6 rounded-2xl space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Play className="w-5 h-5 text-primary" />
                    Workflow Configuration
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="workflowName">Workflow Name</Label>
                      <Input 
                        id="workflowName"
                        className="glass"
                        value={config.workflowName}
                        onChange={(e) => setConfig({...config, workflowName: e.target.value})}
                        placeholder="ci-cd-pipeline"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nodeVersion">Node.js Version</Label>
                      <Select value={config.nodeVersion} onValueChange={(value) => setConfig({...config, nodeVersion: value})}>
                        <SelectTrigger className="glass">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="glass-modal">
                          <SelectItem value="16">Node.js 16</SelectItem>
                          <SelectItem value="18">Node.js 18 (LTS)</SelectItem>
                          <SelectItem value="20">Node.js 20</SelectItem>
                          <SelectItem value="21">Node.js 21 (Latest)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="branches">Target Branches (comma-separated)</Label>
                      <Input 
                        id="branches"
                        className="glass"
                        value={config.branches.join(", ")}
                        onChange={(e) => setConfig({...config, branches: e.target.value.split(",").map(b => b.trim()).filter(b => b)})}
                        placeholder="main, develop"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="triggers" className="space-y-4">
                <div className="glass p-6 rounded-2xl space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <GitBranch className="w-5 h-5 text-primary" />
                    Workflow Triggers
                  </h3>
                  
                  <div className="space-y-4">
                    {["push", "pull_request", "schedule", "workflow_dispatch"].map((trigger) => (
                      <div key={trigger} className="flex items-center space-x-2">
                        <Checkbox 
                          id={trigger}
                          checked={config.triggers.includes(trigger)}
                          onCheckedChange={(checked) => handleTriggerChange(trigger, !!checked)}
                        />
                        <Label htmlFor={trigger} className="capitalize">
                          {trigger.replace("_", " ")}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="steps" className="space-y-4">
                <div className="glass p-6 rounded-2xl space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <TestTube className="w-5 h-5 text-primary" />
                    Build Steps
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="runLinting"
                        checked={config.runLinting}
                        onCheckedChange={(checked) => setConfig({...config, runLinting: !!checked})}
                      />
                      <Label htmlFor="runLinting">Run linting checks</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="runTests"
                        checked={config.runTests}
                        onCheckedChange={(checked) => setConfig({...config, runTests: !!checked})}
                      />
                      <Label htmlFor="runTests">Run test suite</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="enableCaching"
                        checked={config.enableCaching}
                        onCheckedChange={(checked) => setConfig({...config, enableCaching: !!checked})}
                      />
                      <Label htmlFor="enableCaching">Enable dependency caching</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="enableSecurity"
                        checked={config.enableSecurity}
                        onCheckedChange={(checked) => setConfig({...config, enableSecurity: !!checked})}
                      />
                      <Label htmlFor="enableSecurity">Security scanning</Label>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="testCommand">Test Command</Label>
                      <Input 
                        id="testCommand"
                        className="glass"
                        value={config.testCommand}
                        onChange={(e) => setConfig({...config, testCommand: e.target.value})}
                        placeholder="npm test"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="buildCommand">Build Command</Label>
                      <Input 
                        id="buildCommand"
                        className="glass"
                        value={config.buildCommand}
                        onChange={(e) => setConfig({...config, buildCommand: e.target.value})}
                        placeholder="npm run build"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="deploy" className="space-y-4">
                <div className="glass p-6 rounded-2xl space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Rocket className="w-5 h-5 text-primary" />
                    Deployment Configuration
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="deployTarget">Deployment Target</Label>
                    <Select value={config.deployTarget} onValueChange={(value) => setConfig({...config, deployTarget: value})}>
                      <SelectTrigger className="glass">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass-modal">
                        <SelectItem value="vercel">Vercel</SelectItem>
                        <SelectItem value="netlify">Netlify</SelectItem>
                        <SelectItem value="aws">AWS S3 + CloudFront</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex gap-3 pt-6 border-t border-border">
              <Button variant="hero" onClick={handleDownload} className="flex-1">
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
              code={generateGitHubActionsYAML()}
              language="yaml"
              title="Generated GitHub Actions Workflow"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};