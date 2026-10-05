param([switch]$Agent, [string]$Catalog = "")
$packageRoot = Split-Path -Parent $PSScriptRoot
Push-Location $packageRoot
try {
    if (-not (Test-Path -LiteralPath '.venv/Scripts/python.exe')) {
        python -m venv .venv
        if ($LASTEXITCODE -ne 0) { throw 'Runtime creation failed' }
    }
    & '.venv/Scripts/python.exe' -m pip install -e '.[ui,formats,export]'
    if ($LASTEXITCODE -ne 0) { throw 'Package installation failed' }
    if ($Agent) {
        $installArgs = @('-m', 'research_data', 'install-agent')
        if ($Catalog) { $installArgs += @('--catalog', $Catalog) }
        & '.venv/Scripts/python.exe' @installArgs
        if ($LASTEXITCODE -ne 0) { throw 'Agent skill installation failed' }
    }
} finally { Pop-Location }
