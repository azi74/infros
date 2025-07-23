# infros – DevOps Script Generator 🛠️🚀

InfraGenie is a powerful and user-friendly web application that helps developers, DevOps engineers, and sysadmins **generate Terraform and Ansible scripts visually** without writing code manually. The goal is to simplify Infrastructure as Code (IaC) for all experience levels by providing an intuitive UI and instant script generation.

---

## 🌟 Features

- 🔧 **Terraform Script Generator**

  - Choose cloud provider, region, instances, VPC, security groups, and more
  - Supports AWS (EC2, S3, RDS), GCP, and Azure (planned)
  - Generates clean, production-ready `.tf` files
- 🧰 **Ansible Playbook Builder**

  - Configure packages, services, users, environment variables, tasks
  - Generate well-structured YAML playbooks with handlers, roles, and vars
- 👀 **Live Code Preview**

  - Real-time syntax-highlighted preview using Monaco Editor
- 📦 **Export Options**

  - Download as ZIP
  - Push to GitHub (via GitHub API)
  - Copy to clipboard

## ⚙️ Tech Stack

### Frontend

- React.js + TypeScript
- Tailwind CSS for styling
- Monaco Editor (for live code editing)
