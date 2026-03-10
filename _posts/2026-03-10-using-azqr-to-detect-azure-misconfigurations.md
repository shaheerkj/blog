---
title: "Detecting Azure Workload Misconfigurations Using Azure Quick Review (azqr)"
date: 2026-03-10
author: shaheerkj
tags: [CSPM, security assessment, azqr, Defender for Cloud, Cloud Compliance, Cloud Security]
categories: [Cloud Security, Compliance]
description: "A hands-on lab using azqr to scan an intentionally vulnerable Azure infrastructure for misconfigurations"
image:
  path: /assets/img/3-azqr/cover.png
---


In this lab, I explore how Azure Quick Review (azqr)—a Microsoft tool—can be used to assess Azure workloads for misconfigurations.

As I discussed in my [previous post](/posts/exploring-cloud-security-assessment-tools/#azure-quick-review-azqr), azqr is one of several tools organizations can use to gain visibility into the security posture of their workloads and resources.

---

## Lab Setup

The vulnerable infrastructure was deployed using Terraform. The source code is available [here](https://github.com/shaheerkj/vulnerable-azure-lab).

Prerequisites are listed in the GitHub repo. The repo was originally built to support [Prowler](/posts/exploring-cloud-security-assessment-tools/#prowler), but it works equally well for testing azqr's capabilities.

After cloning the repo and provisioning the infrastructure with Terraform (instructions are in the GitHub repo), the next step is to install azqr.

From the official repo, there are two ways to install it:

- `winget install azqr`

OR

  ```Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://raw.githubusercontent.com/azure/azqr/main/scripts/install.ps1'))```

Since I was using PowerShell at the time, I went with the latter option. This one-liner downloads and runs the azqr install script directly from GitHub.

The script drops the `azqr.exe` executable in the current working directory. I moved it to a dedicated `Azqr/` folder inside `Program Files/` for easier access.

---

## Running azqr

Now that azqr is installed, let's look at a few of its flags and options:

![Azqr Help](/assets/img/3-azqr/azqr-help.png)

The option we're interested in is `scan`, which allows us to scan a subscription for misconfigurations.

Syntax for the scan command:

```
azqr scan -s <SUB_ID>
```
The `scan` command offers several additional flags and options, the most notable being:

1. Scanning specific resources only.
2. `--filter` to apply a filter (in YAML format).
3. `-g` to scope the scan to a specific resource group.
4. `--xlsx`, `--csv`, `--stdout` for different output formats.

Running a scan with just the `-s <SUB>` flag produces an `.xlsx` file containing all findings. For example:

![Scan Result](/assets/img/3-azqr/scan-result.png)

## Limitations of azqr

While azqr is an excellent assessment tool for Azure workloads, its output formats are not particularly user-friendly.

Part of my motivation for documenting azqr was to understand its inner workings, with the goal of building a more readable and accessible front-end. The idea is that users interact through a web UI, which in turn invokes the CLI to initiate scans and present results in a cleaner format.