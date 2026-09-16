# 🚀 DevOps Task Manager

A containerized Task Management application built to demonstrate a real-world DevOps workflow using modern development, CI/CD and cloud-native technologies.

The project is being developed step-by-step, starting from application development and containerization and progressing towards automated CI/CD, Kubernetes deployment and monitoring.

---

## 📌 About The Project

DevOps Task Manager is a web-based task management application designed to demonstrate how an application can be developed, containerized, tested and delivered through an automated DevOps pipeline.

The main goal of this project is not only to build a web application, but to understand and implement the complete DevOps lifecycle:

**Code → Version Control → CI/CD → Docker → Kubernetes → Monitoring**

---

## 🎯 Project Objectives

- Build a practical task management application
- Containerize application components using Docker
- Manage source code using Git and GitHub
- Implement CI/CD using GitLab CI/CD
- Automate builds using Jenkins
- Deploy the application on Kubernetes
- Implement application configuration and secrets
- Add persistent storage
- Implement health checks and rolling updates
- Monitor the application using Prometheus and Grafana
- Understand how a production-style DevOps workflow works

---

## 🛠️ Technology Stack

### Application

- Backend: Python
- Frontend: HTML, CSS, JavaScript
- Database: PostgreSQL

### DevOps

- Linux
- Git
- GitHub
- GitLab CI/CD
- Jenkins
- Docker
- Docker Compose
- Kubernetes
- AWS
- Prometheus
- Grafana

---

## 🏗️ Current Project Architecture

```text
                    Developer
                        |
                        v
                     GitHub
                        |
                        v
                    Jenkins
                        |
             +----------+----------+
             |                     |
             v                     v
       Backend Validation     Docker Build
                                   |
                                   v
                            Docker Images
                                   |
                                   v
                            Application






