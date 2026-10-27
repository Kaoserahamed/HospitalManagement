"""Pre-commit guard: reject secrets and PHI markers in staged files.

Lightweight heuristic scanner used by .pre-commit-config.yaml. Not a substitute
for dedicated secret scanning (gitleaks/trufflehog) which is added in Phase 9.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

SECRET_PATTERNS = [
    re.compile(r"(?i)(api[_-]?key|secret[_-]?key|access[_-]?token)\s*[:=]\s*['\"][^'\"]{8,}['\"]"),
    re.compile(r"(?i)password\s*[:=]\s*['\"][^'\"]{4,}['\"]"),
    re.compile(r"-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----"),
    re.compile(r"(?i)bearer\s+[a-zA-Z0-9._-]{20,}"),
]

PHI_MARKERS = [
    re.compile(r"\b\d{3}-\d{2}-\d{4}\b"),  # SSN-like
    re.compile(r"\bpatient[_-]?ssn\b", re.I),
]

SKIP_SUFFIXES = {".lock", ".png", ".jpg", ".jpeg", ".gif", ".pdf"}


def scan(path: Path) -> list[str]:
    if path.suffix.lower() in SKIP_SUFFIXES:
        return []
    try:
        text = path.read_text(encoding="utf-8", errors="ignore")
    except OSError:
        return []
    findings: list[str] = []
    for pattern in SECRET_PATTERNS:
        if pattern.search(text):
            findings.append(f"secret-like pattern: {pattern.pattern}")
    for pattern in PHI_MARKERS:
        if pattern.search(text):
            findings.append(f"PHI marker: {pattern.pattern}")
    return findings


def main(argv: list[str]) -> int:
    exit_code = 0
    for arg in argv:
        path = Path(arg)
        if not path.is_file():
            continue
        issues = scan(path)
        if issues:
            exit_code = 1
            print(f"[check_secrets] {path}:")
            for issue in issues:
                print(f"  - {issue}")
    return exit_code


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
