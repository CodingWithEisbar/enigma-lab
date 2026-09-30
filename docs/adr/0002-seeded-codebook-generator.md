# ADR 0002: Seeded Codebook generator

- Status: Accepted
- Date: 2026-09-30

## Decision

Codebook generator dùng PRNG nội bộ có seed và rejection sampling cho số nguyên bị chặn. Cùng seed và metadata phải cho cùng kết quả.

## Consequences

Test tái lập được và user có thể phục dựng bảng tháng. Generator không phải CSPRNG và giao diện phải luôn ghi rõ giới hạn này.
