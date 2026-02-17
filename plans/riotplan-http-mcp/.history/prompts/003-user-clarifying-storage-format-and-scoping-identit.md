# Narrative: User clarifying storage format and scoping identity/security out for now

**Date**: 2026-02-13T16:39:22.363Z
**Source**: voice
**Speaker**: user

---

Hey, so the remote service will still use the file-based format under the hood. Right? It will, when I say file-based, I mean, it'll use the SQLite files format. Does that make sense? I am not looking to have different file storage formats, server or local. What I'm saying is, the primary way to use RiotPlan going forward is going to be as a remote MCP server. It's not going to be as a local MCP server. On identity and multi-tenancy, don't worry about this right now. At some point there will be some security in scope, but right now just consider that this is going to be running like localhost on a certain port.
