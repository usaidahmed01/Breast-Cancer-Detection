param([string]$PythonCommand = "python")

$ErrorActionPreference = "Stop"
& $PythonCommand "$PSScriptRoot/setup.py"
if ($LASTEXITCODE -ne 0) {
    throw "Project setup failed. Read the message above before continuing."
}
