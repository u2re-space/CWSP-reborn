# Filename: prompt-toast.ps1
# FullPath: apps/CWSP-reborn/resources/clipboard-prompt/prompt-toast.ps1
# Change date and time: 20.25.00_14.07.2026
# Reason for changes: Replace broken second Neutralino toast with a tiny WinForms dialog.
# WHY: Neutralino popup repeatedly opened empty fullscreen shells; Node owns prompt state
#   on /service/clipboard-prompt — this UI only polls + posts actions.
# INVARIANT: ShowInTaskbar=$false; TopMost; no Neutralino/exe spawn; exit when prompt clears.

param(
    [Parameter(Mandatory = $true)][int]$ControlPort,
    [Parameter(Mandatory = $true)][string]$ControlKey
)

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

$base = "http://127.0.0.1:$ControlPort/service/clipboard-prompt"
$headers = @{ "X-API-Key" = $ControlKey }

function Get-PromptState {
    try {
        return Invoke-RestMethod -Uri $base -Method GET -Headers $headers -TimeoutSec 2
    } catch {
        return $null
    }
}

function Post-PromptAction([string]$Action) {
    try {
        $body = @{ action = $Action } | ConvertTo-Json -Compress
        $postHeaders = @{
            "X-API-Key" = $ControlKey
            "Content-Type" = "application/json"
        }
        Invoke-RestMethod -Uri $base -Method POST -Headers $postHeaders `
            -Body $body -TimeoutSec 3 | Out-Null
    } catch {
        # Hub may already have cleared the hold.
    }
}

$form = New-Object System.Windows.Forms.Form
$form.Text = "CWSP Clipboard"
$form.FormBorderStyle = [System.Windows.Forms.FormBorderStyle]::FixedToolWindow
$form.ShowInTaskbar = $false
$form.TopMost = $true
$form.StartPosition = [System.Windows.Forms.FormStartPosition]::Manual
$form.ClientSize = New-Object System.Drawing.Size(360, 200)
$form.BackColor = [System.Drawing.Color]::FromArgb(24, 26, 32)
$form.ForeColor = [System.Drawing.Color]::FromArgb(232, 234, 237)
$form.Font = New-Object System.Drawing.Font("Segoe UI", 9.0)

# Bottom-right of working area.
$wa = [System.Windows.Forms.Screen]::PrimaryScreen.WorkingArea
$form.Location = New-Object System.Drawing.Point(
    [Math]::Max(12, $wa.Right - $form.Width - 12),
    [Math]::Max(12, $wa.Bottom - $form.Height - 12)
)

$lblKind = New-Object System.Windows.Forms.Label
$lblKind.AutoSize = $true
$lblKind.Location = New-Object System.Drawing.Point(12, 10)
$lblKind.ForeColor = [System.Drawing.Color]::FromArgb(74, 144, 217)
$form.Controls.Add($lblKind)

$lblMode = New-Object System.Windows.Forms.Label
$lblMode.AutoSize = $true
$lblMode.Location = New-Object System.Drawing.Point(100, 10)
$lblMode.ForeColor = [System.Drawing.Color]::FromArgb(154, 160, 166)
$form.Controls.Add($lblMode)

$lblCount = New-Object System.Windows.Forms.Label
$lblCount.AutoSize = $true
$lblCount.Location = New-Object System.Drawing.Point(280, 10)
$lblCount.ForeColor = [System.Drawing.Color]::FromArgb(154, 160, 166)
$form.Controls.Add($lblCount)

$preview = New-Object System.Windows.Forms.TextBox
$preview.Multiline = $true
$preview.ReadOnly = $true
$preview.ScrollBars = "Vertical"
$preview.BorderStyle = "FixedSingle"
$preview.BackColor = [System.Drawing.Color]::FromArgb(32, 34, 40)
$preview.ForeColor = $form.ForeColor
$preview.Location = New-Object System.Drawing.Point(12, 36)
$preview.Size = New-Object System.Drawing.Size(336, 110)
$form.Controls.Add($preview)

function New-ActionButton([string]$Text, [int]$X, [scriptblock]$OnClick) {
    $btn = New-Object System.Windows.Forms.Button
    $btn.Text = $Text
    $btn.Location = New-Object System.Drawing.Point($X, 156)
    $btn.Size = New-Object System.Drawing.Size(78, 28)
    $btn.FlatStyle = "Flat"
    $btn.BackColor = [System.Drawing.Color]::FromArgb(48, 52, 64)
    $btn.ForeColor = $form.ForeColor
    $btn.Add_Click($OnClick)
    $form.Controls.Add($btn)
    return $btn
}

$btnAccept = New-ActionButton "Accept" 12 { Post-PromptAction "accept"; $form.Close() }
$btnShare  = New-ActionButton "Share"  96 { Post-PromptAction "share";  $form.Close() }
$btnUndo   = New-ActionButton "Undo"  180 { Post-PromptAction "undo";   $form.Close() }
$btnErase  = New-ActionButton "Erase" 180 { Post-PromptAction "erase";  $form.Close() }
$btnDismiss = New-ActionButton "Dismiss" 264 { Post-PromptAction "dismiss"; $form.Close() }

$btnAccept.Visible = $false
$btnShare.Visible = $false
$btnUndo.Visible = $false
$btnErase.Visible = $false

$startedAt = Get-Date
$dismissMs = 10000
$emptyPolls = 0

$timer = New-Object System.Windows.Forms.Timer
$timer.Interval = 700
$timer.Add_Tick({
    $data = Get-PromptState
    $state = $null
    if ($null -ne $data) {
        if ($data.state) { $state = $data.state }
        elseif ($data.kind) { $state = $data }
    }

    if ($null -eq $state -or -not $state.kind) {
        $script:emptyPolls++
        if ($script:emptyPolls -ge 3) { $form.Close() }
        return
    }
    $script:emptyPolls = 0

    if ($state.dismissMs) { $script:dismissMs = [int]$state.dismissMs }

    $lblKind.Text = [string]$state.kind
    $lblMode.Text = [string]$state.mode
    $preview.Text = if ($state.textPreview) { [string]$state.textPreview } else { "(no text preview)" }

    $btnAccept.Visible = ($state.kind -eq "inbound" -and $state.mode -eq "ask")
    $btnShare.Visible  = ($state.kind -eq "outbound" -and $state.mode -eq "ask")
    $btnUndo.Visible   = ($state.kind -eq "inbound" -and $state.showUndo)
    $btnErase.Visible  = ($state.kind -eq "outbound" -and $state.showErase)

    $elapsed = ((Get-Date) - $startedAt).TotalMilliseconds
    $left = [Math]::Max(0, $dismissMs - $elapsed)
    $lblCount.Text = ("{0:N1}s" -f ($left / 1000.0))
    if ($left -le 0) {
        Post-PromptAction "dismiss"
        $form.Close()
    }
})

$form.Add_Shown({ $timer.Start() })
$form.Add_FormClosed({ $timer.Stop(); $timer.Dispose() })

[void]$form.ShowDialog()
