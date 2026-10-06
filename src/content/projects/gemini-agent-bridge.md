---
title: "GeminiAgentBridge"
description: "A local OpenAI-compatible API bridge that lets coding agents use Gemini Web for reasoning while keeping tool execution in the downstream agent."
date: 2026-10-06
tags:
  - AI
  - Agents
  - Python
  - APIs
status: active
repository: "https://github.com/Exploiter69/GeminiAgentBridge"
stack:
  - Python
  - OpenAI-compatible API
  - Gemini Web
  - Asyncio
---

## The Problem

Coding agents need reasoning backends, but the reasoning layer should not silently become the component that owns filesystem, terminal or Git execution.

GeminiAgentBridge provides a local OpenAI-compatible boundary between an agent client and Gemini Web.

## Architecture

The bridge handles protocol and tool-call normalization, bounded requests and images, and cancellable streaming.

The downstream coding agent remains responsible for executing tools.

**Gemini → Bridge → normalized tool call → Agent executes → observation → Bridge → Gemini**

The bridge never executes arbitrary shell, filesystem or Git operations on behalf of the model.

## Security Boundaries

The maintained release line defaults to loopback binding.

Non-loopback listeners require explicit API-key configuration. Request bodies and remote images are bounded, redirects are revalidated, and secret or upstream transport details are kept out of ordinary logs and client errors.

Streaming is designed around a real boundary: once output has crossed the backend boundary, the request is not retried in a way that could duplicate tool-call prefixes.

## Current State

The repository describes a release-hardening line using the modern gemini-webapi transport and a Python 3.11+ implementation.

Release promotion is gated on CI, a fresh authenticated Gemini Web run and real OpenCode/Hermes validation.

## Lessons

The useful part of an agent bridge is the boundary, not merely the model adapter.

Keeping downstream tool authority in the client makes the system easier to reason about and prevents a reasoning backend from quietly becoming an execution authority.
