# ADR 0001: Modular monorepo

- Status: Accepted
- Date: 2026-09-30

## Decision

Dùng pnpm workspace với một web app và các package core thuần TypeScript. Chưa tạo microservice hoặc API server.

## Consequences

Logic có thể tái sử dụng và test không cần browser. Repo có nhiều config hơn file HTML đơn, nhưng ranh giới sở hữu và dependency rõ ràng hơn.
