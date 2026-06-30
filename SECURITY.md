# Security Audit Remediation Log

Applied fixes on 2026-06-23:

## Critical
- [x] XSS: HTML sanitized with DOMPurify on save + render
- [x] Upload: magic bytes validation (file-type), safe extensions only, .htaccess blocks scripts
- [x] Default credentials: removed from .env.example, seed requires ADMIN_PASSWORD >= 12 chars

## High
- [x] Security headers via middleware (CSP, X-Frame-Options, HSTS in prod, etc.)
- [x] Rate limiting on login, newsletter, upload
- [x] middleware.ts: central auth for /admin and /api
- [x] requireAdmin() with DB role verification on all protected API routes
- [x] JWT secret minimum 32 chars, weak secrets rejected
- [x] Remote image patterns restricted in next.config.ts
- [x] Cookie SameSite=strict, session reduced to 24h

## Medium
- [x] URL validation for image fields (Zod)
- [x] Slug format validation
- [x] Pagination capped (max page 100)
- [x] Search query capped at 200 chars
- [x] JSON-LD output escaped
- [x] Logout requires active session
- [x] Login only allows admin role

## Notes
- In-memory rate limiting works for single-instance deploys. Use Redis/Upstash for multi-instance production.
- Re-run seed after setting ADMIN_PASSWORD in .env
