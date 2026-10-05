param([string]$Catalog = "", [int]$Port = 8765, [switch]$NoOpen, [switch]$Foreground)
$packageRoot = $PSScriptRoot
$runtimePython = Join-Path $packageRoot '.venv/Scripts/python.exe'
if (-not (Test-Path -LiteralPath $runtimePython)) {
    & (Join-Path $packageRoot 'scripts/setup.ps1')
    if ($LASTEXITCODE -ne 0) { throw 'Runtime installation failed; see setup output.' }
}
$action = if ($Foreground) { 'serve' } else { 'open' }
$applicationArgs = @('-m', 'research_data', $action, '--port', "$Port")
if ($Catalog) { $applicationArgs += @('--root', $Catalog) }
if ($NoOpen) { $applicationArgs += '--no-open' }
& $runtimePython @applicationArgs
exit $LASTEXITCODE
