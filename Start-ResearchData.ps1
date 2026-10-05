param([string]$Catalog = "", [int]$Port = 8765)
$packageRoot = $PSScriptRoot
$runtimePython = Join-Path $packageRoot '.venv/Scripts/python.exe'
if (-not (Test-Path -LiteralPath $runtimePython)) {
    throw 'Run scripts/setup.ps1 first to install the application runtime.'
}
$applicationArgs = @('-m', 'research_data', 'browse', '--port', "$Port")
if ($Catalog) { $applicationArgs += @('--root', $Catalog) }
& $runtimePython @applicationArgs
