param([string]$Destination = "")
$packageRoot = Split-Path -Parent $PSScriptRoot
$launcher = Join-Path $packageRoot 'Start-ResearchData.cmd'
if (-not (Test-Path -LiteralPath $launcher)) { throw 'Start-ResearchData.cmd is missing.' }
if (-not $Destination) {
    $Destination = Join-Path ([Environment]::GetFolderPath('Desktop')) 'ResearchData.lnk'
}
if (Test-Path -LiteralPath $Destination) {
    $existingShell = New-Object -ComObject WScript.Shell
    $existingShortcut = $existingShell.CreateShortcut($Destination)
    if ($existingShortcut.TargetPath -ne $launcher) {
        throw "An unrelated shortcut exists at $Destination; choose another -Destination."
    }
}
$shortcutShell = New-Object -ComObject WScript.Shell
$shortcut = $shortcutShell.CreateShortcut($Destination)
$shortcut.TargetPath = $launcher
$shortcut.WorkingDirectory = $packageRoot
$shortcut.Description = 'Open the local ResearchData catalog and plot studio'
$shortcut.WindowStyle = 7
$shortcut.Save()
Write-Output $Destination
