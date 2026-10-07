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
objective: "Provide a local OpenAI-compatible reasoning boundary while keeping filesystem, shell and Git execution authority in the downstream coding agent."
lifecycle: "building"
architectureSummary: "A local Python bridge normalizes OpenAI-compatible requests and Gemini Web reasoning while tool proposals return to the downstream agent for execution and observation."
decisions:
  - "The bridge never executes arbitrary downstream tools for the model."
  - "Loopback operation is the default; non-loopback access requires explicit authentication."
  - "Streaming and request/image handling are bounded to preserve predictable failure behavior."
lessons:
  - "The most valuable abstraction is often an authority boundary, not a provider adapter."
  - "Compatibility APIs can decouple clients from provider-specific reasoning backends."
  - "Once output crosses a streaming boundary, retry behavior must account for duplicate side effects."
---

## Problem

Coding agents often need a reasoning backend, but the reasoning layer should not silently become the component that owns filesystem, terminal or Git execution.

GeminiAgentBridge creates a local OpenAI-compatible boundary between an agent client and Gemini Web while preserving tool authority in the downstream client.

## Constraints

- Python 3.11+.
- Local-first default operation.
- No arbitrary downstream tool execution inside the bridge.
- Non-loopback use must be explicitly authenticated.
- Request, image and streaming behavior must be bounded.
- Credentials and session material remain local and secret-safe.

## Architecture

**Coding Agent → OpenAI-compatible Bridge → Gemini Web**

The bridge handles protocol/tool-call normalization, bounded requests and images, and cancellable streaming.

For tool use:

**Gemini → proposed tool call → Bridge normalization → Agent execution → observation → Gemini**

The bridge never executes shell, filesystem or Git operations for the model.

## Security Boundaries

The maintained release line defaults to '127.0.0.1'.

Non-loopback listeners require configured API keys. Request bodies and remote image downloads are bounded, redirects are revalidated, and upstream exception details or signed URLs are not exposed in normal logs.

Streaming has an explicit failure boundary: the bridge waits for meaningful upstream output before committing HTTP 200, and after output crosses the backend boundary it does not retry in a way that could duplicate tool-call prefixes.

## Compatibility

The bridge exposes an OpenAI-compatible API so existing clients can use Gemini Web without being rewritten around a provider-specific interface.

Real-client validation targets OpenCode and Hermes in addition to deterministic tests and compilation checks.

## Current State

The repository describes a release-hardening line using the modern 'gemini-webapi' transport. Release promotion is gated on CI, a fresh authenticated Gemini Web run and real client validation.

## Design Lesson

The valuable engineering work is the **boundary**, not the adapter.

A reasoning backend can be replaced without giving it execution authority. Keeping that authority in the downstream agent makes the system easier to reason about and safer to compose.
