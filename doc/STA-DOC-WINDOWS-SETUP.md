# STA-DOC – Windows Setup

This guide covers the setup and local development of STA-DOC on a **Windows** machine using **WSL 2 and Ubuntu**.

STA-DOC runs in a Linux environment provided by WSL 2 and Ubuntu. Windows is used as the host system together with Docker Desktop and VS Code.

The development environment consists of:

- **WSL 2 / Ubuntu** – Linux development environment
- **Docker Desktop** – container runtime
- **VS Code** – development environment
- **Git** – version control
- **Node.js / npm** – project tooling

> **Important:** This guide assumes that **Git, Node.js / npm, Docker Desktop, and VS Code are already installed.** Docker Desktop must be configured as described below to integrate with Ubuntu.

> **Important:** The repository must be located inside the Ubuntu / WSL filesystem. Do **not** clone or work with the repository under `/mnt/c/...` or directly on the Windows filesystem.

## 1. Set up WSL 2 and Ubuntu

Install WSL 2 and Ubuntu on Windows.

Open **Windows PowerShell** and run:

```powershell
wsl --install
```

> If you do not have permission to run this command, ask your system administrator to install it for you.

Restart Windows if requested.

After the restart, open **Ubuntu** from the Windows Start menu and complete the initial Linux user setup. You will be asked to create a username and password.

> **Alternative:** If the Linux user needs to be created or changed later, this can also be done from the **Ubuntu terminal** using the appropriate Linux user management commands.

### Verify WSL version

In **Windows PowerShell**, run:

```powershell
wsl --list --verbose
```

Ubuntu should show **2** in the `VERSION` column:

```text
NAME      STATE           VERSION
Ubuntu    Running         2
```

If Ubuntu is not using WSL 2, set it explicitly:

```powershell
wsl --set-version Ubuntu 2
```

## 2. Configure Docker Desktop for WSL

Docker Desktop runs on Windows but must be integrated with the Ubuntu WSL 2 distribution so that Docker commands can be used from the Ubuntu terminal.

Open **Docker Desktop** on Windows and go to:

**Settings > Resources > WSL Integration**

Enable the integration for **Ubuntu** and apply the changes.

## 3. Verify the development environment

From this point onwards, use the **Ubuntu terminal**.

Verify that Docker is available:

```bash
docker --version
```

Verify the Docker integration:

```bash
docker run --rm hello-world
```
If the command completes successfully, Docker is correctly integrated with Ubuntu.

Verify that Git is available:

```bash
git --version
```

Verify that Node.js and npm are available:

```bash
node --version
npm --version
```

If all commands return a version number and the Docker test completes successfully, the required development tools are available.

> **Note:** Git and Node.js / npm must be available inside the Ubuntu / WSL environment.

## 4. Clone the repository

> **Important:** Clone the repository directly into the Linux filesystem used by Ubuntu. Do **not** clone the repository into /mnt/c/... or another Windows-mounted path.

For example:

```bash
mkdir -p ~/projects
cd ~/projects
git clone https://github.com/deutsche-nationalbibliothek/sta-doc.git
cd sta-doc
```

The project should be located somewhere similar to:

```text
/home/<user>/projects/sta-doc
```

and **not**:

```text
/mnt/c/Users/<user>/...
```

> Keeping the repository inside the WSL filesystem helps to avoid filesystem-related issues with Linux tools, Node.js, and Docker!

## 5. Open the project in VS Code

From the **Ubuntu terminal**, inside the project directory, run:

```bash
code .
```

VS Code should open the project in the **WSL / Ubuntu environment**.

> Make sure the VS Code WSL extension is installed and that the project is connected to WSL.

You can verify the connection by checking the bottom-left corner of VS Code. It should indicate that VS Code is connected to WSL.

From this point onwards, run project-related commands from the **Ubuntu terminal in VS Code**.

## 6. Fetch the project data

Before starting the development environment, the required project data must be fetched.

From the project root, run:

```bash
npm run data
```

Make sure this command completes successfully before continuing.

## 7. Build the Docker images

The development environment uses Docker for the required services, including:

- Next.js
- Solr 9.1.1

Build the development images:

```bash
npm run docker:dev:build
```

## 8. Start the development environment

Start the Docker-based development environment:

```bash
npm run docker:dev:up
```

Make sure the required containers are running:

```bash
docker ps
```

> The output should show both the running Next.js container and the running Solr container.

## 9. Create or update the Solr index

If the Solr index needs to be initialized or updated, run the following command from the **Ubuntu terminal**:

```bash
npm run solr:index
```

> **Important:** Solr must already be running in the Docker container before executing this command.

## 10. Access the application

Once the required data has been fetched and the development environment is running, the application (Next.js) will be available at:

http://localhost:3000

Solr will be available at:

http://localhost:8983

# Quick Start

For an already configured Windows / WSL machine, open the **Ubuntu terminal in VS Code** and run:

```bash
# Go to the project
cd ~/projects/sta-doc

# Start the Docker-based development environment
npm run docker:dev:up
```
The application is then available at:

http://localhost:3000

Solr is available at:

http://localhost:8983

# Initial setup or project data update

When setting up the project for the first time, or when the project data needs to be updated, run:

```bash
# Fetch or update project data 
npm run data

# Build Docker images 
# Required for the initial setup and after changes to the Docker configuration
npm run docker:dev:build

# Start the Docker-based development environment
npm run docker:dev:up

# Create or update the Solr index if required
npm run solr:index
```