"""Check this checkpoint without external Python dependencies."""

import subprocess
import sys
from pathlib import Path
from shutil import which

ROOT = Path(__file__).resolve().parents[1]


def check_prerequisites():
    if sys.version_info < (3, 11):
        raise RuntimeError("Python 3.11 or newer is required for this checkpoint.")
    print(f"Python: {sys.version.split()[0]}")
    for tool in ("node", "npm", "git"):
        executable = which(tool)
        if not executable:
            raise RuntimeError(f"{tool} is unavailable. Install it or fix PATH, then reopen the terminal.")
        result = subprocess.run(
            [executable, "--version"], capture_output=True, text=True, check=False
        )
        if result.returncode:
            raise RuntimeError(f"{tool} version check failed.")
        print(f"{tool}: {result.stdout.strip()}")


def main():
    try:
        check_prerequisites()
        expected = (ROOT / ".venv").resolve()
        if Path(sys.prefix).resolve() != expected or sys.prefix == sys.base_prefix:
            raise RuntimeError("Run this check using the project's .venv Python, as shown in the setup guide.")
        for relative in (
            "README.md", ".gitignore", "requirements.txt", "web", "api/app",
            "ml", "contracts", "tests", "docs", "scripts"
        ):
            if not (ROOT / relative).exists():
                raise RuntimeError(f"Missing project entry: {relative}")
        print("SETUP CHECK PASSED: project folders and local virtual environment are ready.")
        print("AI dependencies will be selected and pinned in their own steps.")
        return 0
    except (RuntimeError, OSError) as exc:
        print(f"SETUP CHECK FAILED: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
