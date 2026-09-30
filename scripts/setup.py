"""Create a local venv; do not install application dependencies at Step 01."""

import subprocess
import sys
import venv

from check_setup import ROOT, check_prerequisites


def main():
    try:
        check_prerequisites()
        directory = ROOT / ".venv"
        executable = directory / ("Scripts/python.exe" if sys.platform == "win32" else "bin/python")
        if directory.exists():
            if directory.is_symlink() or not (directory / "pyvenv.cfg").is_file() or not executable.is_file():
                raise RuntimeError("An incomplete or unexpected .venv already exists. Move it aside and retry.")
            print("Reusing the existing virtual environment.")
        else:
            print("Creating the local .venv with the Python interpreter running this script...")
            venv.EnvBuilder(with_pip=True).create(directory)
        subprocess.run([str(executable), "-m", "pip", "--version"], check=True)
        subprocess.run([str(executable), str(ROOT / "scripts/check_setup.py")], check=True)
        print("Setup finished. Follow docs/STEP_01_SETUP.md for your GitHub checkpoint.")
        return 0
    except (RuntimeError, OSError, subprocess.CalledProcessError) as exc:
        print(f"SETUP FAILED: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
