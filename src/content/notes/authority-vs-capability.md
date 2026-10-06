---
title: "Capability Is Not Authority"
description: "A component may be capable of proposing an action without being allowed to authorize or perform it."
date: 2026-10-06
tags: [AI, Security, Architecture]
status: active
stage: evergreen
related: [projects:vajra, projects:gemini-agent-bridge]
---

AI systems become easier to reason about when capability and authority are separated.

A model may be capable of generating a shell command. That does not mean the model should have shell authority.

A bridge may normalize a tool call. That does not mean the bridge should execute the tool.

A durable engineering system can place policy and execution boundaries outside the reasoning component.

This is a small design distinction with large consequences.
