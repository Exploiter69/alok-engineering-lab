---
title: "Astra"
description: "A modular developer QA and automation engine with explicit subsystem boundaries and a compatibility-tested core."
date: 2026-10-06
tags:
  - Python
  - Automation
  - Architecture
status: active
repository: "https://github.com/Exploiter69/astra"
stack:
  - Python
  - Modular Architecture
  - Testing
  - Automation
---

## What It Is

Astra 3.5 is a modular architectural refactor of the Astra system.

The established implementation is retained in astra/core/legacy.py as a compatibility and behavior anchor while explicit subsystem boundaries are introduced around the mature workflow.

## Architecture

The repository separates infrastructure boundaries such as CLI, state, workspace and clipboard from domains including detection, parsing, planning, execution, validation, recovery, automation, models and plugins.

The goal is incremental replacement rather than a destabilizing rewrite.

## Why It Belongs in the Lab

Astra is an engineering study in how to evolve a mature automation workflow without throwing away tested behavior.

## Current State

The repository currently describes the Astra 3.5 modular build and its Phase 3.5 architectural refactor.

This project is intentionally distinct from VAJRA. VAJRA is the broader autonomous engineering runtime; Astra is the modular automation/QA line.
