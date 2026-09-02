# STA-DOC – Windows Setup

This guide covers the setup and local development of STA-DOC on **Windows**.

The project runs on Windows using:

- **WSL 2 / Ubuntu**
- **Docker Desktop**
- **VS Code**
- **Git**
- **Node.js and npm**

> **Important:** The repository must be located inside the Ubuntu / WSL filesystem.
> Do **not** clone or work with the repository under `/mnt/c/...` or directly on the Windows filesystem.

## 1. Prerequisites

We will set up all required tools and components together in the following:

- WSL 2 with Ubuntu
- Docker Desktop with WSL integration
- VS Code with the WSL extension
- Git
- Node.js and npm inside Ubuntu

Follow the steps below in order to prepare your Windows development environment.

## 2. Set up WSL 2 and Ubuntu

Install WSL 2 and Ubuntu on Windows.

Open **Windows PowerShell** and run:

```powershell
wsl --install
```

> If you do not have permission to run this command, ask the system administrator to perform the installation.

Restart Windows if requested.

After the restart, open **Ubuntu** from the Windows Start menu and complete the initial Linux user setup. You will be asked to create a username and password.

### Verify WSL version

In PowerShell, run:

```powershell
wsl --list --verbose
```

Ubuntu should show **2** in the `VERSION` column:

```text
NAME      STATE           VERSION
Ubuntu    Running         2
```

## 3. Set up Docker Desktop

Install and start **Docker Desktop** on Windows.

> If you do not have permission to install Docker Desktop, ask the system administrator to do so again.

Docker Desktop must use the WSL 2 backend and integrate with Ubuntu.

In Docker Desktop, go to:

**Settings > Resources > WSL Integration**

Enable the integration for **Ubuntu** and apply the changes.

Then open Ubuntu and verify that Docker is available:

```bash
docker --version
```

## 4. Check Node.js and npm

Open **Ubuntu** and check whether Node.js and npm are installed:

```bash
node --version
npm --version
```

If both commands return a version number, no additional installation is required.

If one of the commands is not available, install Node.js and npm before continuing.

## 5. Clone the repository inside Ubuntu

> **Important:** Clone the repository directly into the Linux filesystem used by Ubuntu.

For example:

```bash
mkdir -p ~/projects
cd ~/projects
git clone https://github.com/deutsche-nationalbibliothek/sta-doc.git
cd sta-doc
```

> Do **not** clone it into `C:\...` and access it from WSL through `/mnt/c/...`. 

The project should be located somewhere similar to:

```text
/linux/home/<user>/projects/sta-doc
```

and **not**:

```text
/mnt/c/Users/<user>/...
```

Keeping the repository inside the WSL filesystem avoids filesystem-related compatibility issues!!!

## 6. Open the project in VS Code

From the Ubuntu terminal, inside the project directory, run:

```bash
code .
```

VS Code should open the project in the **WSL / Ubuntu environment** then.

Make sure the VS Code WSL extension is installed and that the project is connected to WSL.

## 7. Install project dependencies

From the project root, run:

```bash
npm install
```

## 8. Fetch the project data

Before starting the frontend, the required project data must be fetched. Therefore, from the project root, run:

```bash
npm run data
```

Make sure this command completes successfully before continuing.

## 9. Build the Docker images

The development environment uses Docker for the required services, including:

- Next.js
- Solr 9.1.1

Build the development images:

```bash
npm run docker:dev:build
```

## 10. Start the development environment

Start the Docker-based development environment:

```bash
npm run docker:dev:up
```

Make sure the required containers are running:

```bash
docker ps
```

## 11. Start the frontend

Once the required data has been fetched and the development environment is running, start the Next.js frontend:

```bash
npm run dev
```

The application should then be available at:

http://localhost:3000

Solr should be available at:

http://localhost:8983

## 12. Create or update the Solr index

If the Solr index needs to be initialized or updated, run:

```bash
npm run solr:index
```

> **Important:** Solr must already be running in the Docker container before executing this command.

# Quick Start

For an already configured Windows / WSL machine, the basic workflow is:

```bash
# Open Ubuntu / WSL

# Go to the project
cd ~/projects/sta-doc

# Install dependencies (only required after a fresh clone)
npm install

# Fetch or update project data (This is only required when setting up the project for the first time. Afterwards, run it only if you need to fetch or update the project data.)
npm run data

# Build Docker images (only required after changes to Docker configuration)
npm run docker:dev:build

# Start the Docker-based development environment
npm run docker:dev:up

# Create or update the Solr index if required
npm run solr:index

# Start the frontend
npm run dev
```

The application is then available at:

http://localhost:3000

Solr is available at:

http://localhost:8983