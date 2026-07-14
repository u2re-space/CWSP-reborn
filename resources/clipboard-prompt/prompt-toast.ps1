# Filename: prompt-toast.ps1
# FullPath: apps/CWSP-reborn/resources/clipboard-prompt/prompt-toast.ps1
# Reason: Native Windows clipboard prompt independent from the Neutralino main window.
# Invariant: The dialog only uses loopback control RPC and never connects to fleet WebSocket.

param(
    [Parameter(Mandatory = $true)]
    [int]$ControlPort,

    [Parameter(Mandatory = $true)]
    [string]$ControlKey
)

$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

Add-Type @'
using System;
using System.Runtime.InteropServices;

public static class CwspNativeMethods
{
    [DllImport("user32.dll")]
    public static extern bool ReleaseCapture();

    [DllImport("user32.dll")]
    public static extern IntPtr SendMessage(
        IntPtr hWnd,
        int msg,
        IntPtr wParam,
        IntPtr lParam
    );
}
'@

$script:baseUrl = "http://127.0.0.1:$ControlPort/service/clipboard-prompt"
$script:headers = @{
    "X-API-Key" = $ControlKey
}

$script:stateSeen = $false
$script:actionSubmitted = $false
$script:closingProgrammatically = $false
$script:stateStartedAt = $null
$script:dismissMs = 10000
$script:emptyStatePolls = 0
$script:startupNotBefore = (Get-Date).AddSeconds(8)
$script:startupDeadline = (Get-Date).AddSeconds(20)

function Get-PromptResponse {
    try {
        $body = Invoke-RestMethod `
            -Uri $script:baseUrl `
            -Method GET `
            -Headers $script:headers `
            -TimeoutSec 1

        return [PSCustomObject]@{
            Success = $true
            Body = $body
        }
    } catch {
        return [PSCustomObject]@{
            Success = $false
            Body = $null
        }
    }
}

function Get-PromptState([object]$Body) {
    if ($null -eq $Body) {
        return $null
    }

    $stateProperty = $Body.PSObject.Properties["state"]
    if ($null -ne $stateProperty) {
        return $stateProperty.Value
    }

    $kindProperty = $Body.PSObject.Properties["kind"]
    if ($null -ne $kindProperty -and $null -ne $kindProperty.Value) {
        return $Body
    }

    return $null
}

function Submit-PromptAction([string]$Action) {
    if ($script:actionSubmitted) {
        return
    }

    $script:actionSubmitted = $true

    try {
        $body = @{ action = $Action } | ConvertTo-Json -Compress
        $postHeaders = @{
            "X-API-Key" = $ControlKey
            "Content-Type" = "application/json"
        }

        Invoke-RestMethod `
            -Uri $script:baseUrl `
            -Method POST `
            -Headers $postHeaders `
            -Body $body `
            -TimeoutSec 2 | Out-Null
    } catch {
        # The backend can clear the prompt before the response is posted.
    }
}

function Close-Toast {
    param(
        [switch]$Dismiss
    )

    if ($Dismiss) {
        Submit-PromptAction "dismiss"
    }

    $script:closingProgrammatically = $true
    $form.Close()
}

function New-ActionButton {
    param(
        [string]$Text,
        [scriptblock]$OnClick
    )

    $button = New-Object System.Windows.Forms.Button
    $button.Text = $Text
    $button.Height = 28
    $button.FlatStyle = [System.Windows.Forms.FlatStyle]::Flat
    $button.FlatAppearance.BorderSize = 0
    $button.BackColor = [System.Drawing.Color]::FromArgb(48, 52, 64)
    $button.ForeColor = [System.Drawing.Color]::FromArgb(232, 234, 237)
    $button.Cursor = [System.Windows.Forms.Cursors]::Hand
    $button.TabStop = $true
    $button.Add_Click($OnClick)

    $form.Controls.Add($button)
    return $button
}

function Layout-ActionButtons {
    $visibleButtons = @(
        $script:actionButtons | Where-Object { $_.Visible }
    )

    if ($visibleButtons.Count -eq 0) {
        return
    }

    $left = 12
    $right = 12
    $gap = 8
    $availableWidth = $form.ClientSize.Width - $left - $right
    $buttonWidth = [Math]::Floor(
        ($availableWidth - (($visibleButtons.Count - 1) * $gap)) / $visibleButtons.Count
    )

    for ($index = 0; $index -lt $visibleButtons.Count; $index++) {
        $button = $visibleButtons[$index]
        $button.Width = $buttonWidth
        $button.Location = New-Object System.Drawing.Point(
            ($left + ($index * ($buttonWidth + $gap))),
            160
        )
    }
}

$form = New-Object System.Windows.Forms.Form
$form.Text = "CWSP Clipboard"
$form.FormBorderStyle = [System.Windows.Forms.FormBorderStyle]::None
$form.ShowInTaskbar = $false
$form.TopMost = $true
$form.StartPosition = [System.Windows.Forms.FormStartPosition]::Manual
$form.AutoScaleMode = [System.Windows.Forms.AutoScaleMode]::None
$form.ClientSize = New-Object System.Drawing.Size(360, 200)
$form.BackColor = [System.Drawing.Color]::FromArgb(12, 14, 18)
$form.ForeColor = [System.Drawing.Color]::FromArgb(232, 234, 237)
$form.Font = New-Object System.Drawing.Font("Segoe UI", 9.0)
$form.KeyPreview = $true
$form.Opacity = 1

$screen = [System.Windows.Forms.Screen]::FromPoint(
    [System.Windows.Forms.Cursor]::Position
)
$workArea = $screen.WorkingArea

$form.Location = New-Object System.Drawing.Point(
    [Math]::Max(12, $workArea.Right - $form.Width - 12),
    [Math]::Max(12, $workArea.Bottom - $form.Height - 12)
)

$surface = New-Object System.Windows.Forms.Panel
$surface.Location = New-Object System.Drawing.Point(1, 1)
$surface.Size = New-Object System.Drawing.Size(358, 198)
$surface.BackColor = [System.Drawing.Color]::FromArgb(24, 26, 32)
$form.Controls.Add($surface)

$header = New-Object System.Windows.Forms.Panel
$header.Location = New-Object System.Drawing.Point(0, 0)
$header.Size = New-Object System.Drawing.Size(358, 30)
$header.BackColor = [System.Drawing.Color]::FromArgb(29, 32, 40)
$surface.Controls.Add($header)

$lblKind = New-Object System.Windows.Forms.Label
$lblKind.Location = New-Object System.Drawing.Point(12, 8)
$lblKind.Size = New-Object System.Drawing.Size(84, 16)
$lblKind.ForeColor = [System.Drawing.Color]::FromArgb(91, 159, 230)
$lblKind.TextAlign = [System.Drawing.ContentAlignment]::MiddleLeft
$header.Controls.Add($lblKind)

$lblMode = New-Object System.Windows.Forms.Label
$lblMode.Location = New-Object System.Drawing.Point(96, 8)
$lblMode.Size = New-Object System.Drawing.Size(90, 16)
$lblMode.ForeColor = [System.Drawing.Color]::FromArgb(170, 176, 186)
$lblMode.TextAlign = [System.Drawing.ContentAlignment]::MiddleLeft
$header.Controls.Add($lblMode)

$lblCount = New-Object System.Windows.Forms.Label
$lblCount.Location = New-Object System.Drawing.Point(264, 8)
$lblCount.Size = New-Object System.Drawing.Size(82, 16)
$lblCount.ForeColor = [System.Drawing.Color]::FromArgb(170, 176, 186)
$lblCount.TextAlign = [System.Drawing.ContentAlignment]::MiddleRight
$header.Controls.Add($lblCount)

$preview = New-Object System.Windows.Forms.TextBox
$preview.Multiline = $true
$preview.ReadOnly = $true
$preview.ScrollBars = [System.Windows.Forms.ScrollBars]::Vertical
$preview.BorderStyle = [System.Windows.Forms.BorderStyle]::FixedSingle
$preview.BackColor = [System.Drawing.Color]::FromArgb(32, 34, 40)
$preview.ForeColor = $form.ForeColor
$preview.Location = New-Object System.Drawing.Point(12, 42)
$preview.Size = New-Object System.Drawing.Size(334, 104)
$preview.TabStop = $false
$surface.Controls.Add($preview)

$btnAccept = New-ActionButton "Accept" {
    Submit-PromptAction "accept"
    Close-Toast
}

$btnShare = New-ActionButton "Share" {
    Submit-PromptAction "share"
    Close-Toast
}

$btnUndo = New-ActionButton "Undo" {
    Submit-PromptAction "undo"
    Close-Toast
}

$btnErase = New-ActionButton "Erase" {
    Submit-PromptAction "erase"
    Close-Toast
}

$btnDismiss = New-ActionButton "Dismiss" {
    Close-Toast -Dismiss
}

$script:actionButtons = @(
    $btnAccept,
    $btnShare,
    $btnUndo,
    $btnErase,
    $btnDismiss
)

foreach ($button in $script:actionButtons) {
    $surface.Controls.Remove($button)
    $surface.Controls.Add($button)
}

$btnAccept.Visible = $false
$btnShare.Visible = $false
$btnUndo.Visible = $false
$btnErase.Visible = $false
$btnDismiss.Visible = $true

Layout-ActionButtons

$dragStart = {
    param($sender, $eventArgs)

    if ($eventArgs.Button -ne [System.Windows.Forms.MouseButtons]::Left) {
        return
    }

    [CwspNativeMethods]::ReleaseCapture() | Out-Null
    [CwspNativeMethods]::SendMessage(
        $form.Handle,
        0xA1,
        [IntPtr]2,
        [IntPtr]::Zero
    ) | Out-Null
}

$header.Add_MouseDown($dragStart)
$lblKind.Add_MouseDown($dragStart)
$lblMode.Add_MouseDown($dragStart)
$lblCount.Add_MouseDown($dragStart)

$form.Add_KeyDown({
    param($sender, $eventArgs)

    if ($eventArgs.KeyCode -eq [System.Windows.Forms.Keys]::Escape) {
        Close-Toast -Dismiss
    }
})

$form.Add_FormClosing({
    param($sender, $eventArgs)

    if (
        -not $script:closingProgrammatically -and
        -not $script:actionSubmitted -and
        $script:stateSeen
    ) {
        Submit-PromptAction "dismiss"
    }
})

$timer = New-Object System.Windows.Forms.Timer
$timer.Interval = 700

$timer.Add_Tick({
    $response = Get-PromptResponse
    $state = $null

    if ($response.Success) {
        $state = Get-PromptState $response.Body
    }

    if ($null -eq $state -or [string]::IsNullOrWhiteSpace([string]$state.kind)) {
        # Network errors are not an empty state. Do not close on a short RPC outage.
        if ($response.Success) {
            $script:emptyStatePolls++
        }

        if (-not $script:stateSeen) {
            if (
                (Get-Date) -ge $script:startupNotBefore -and
                $script:emptyStatePolls -ge 5
            ) {
                Close-Toast
                return
            }

            if ((Get-Date) -ge $script:startupDeadline) {
                Close-Toast
            }

            return
        }

        # The prompt was definitely visible before. Close only after several
        # successful responses confirm that backend state has been cleared.
        if ($script:emptyStatePolls -ge 5) {
            Close-Toast
        }

        return
    }

    $script:emptyStatePolls = 0

    if (-not $script:stateSeen) {
        $script:stateSeen = $true
        $script:stateStartedAt = Get-Date
        $form.BringToFront()
    }

    if ($null -ne $state.dismissMs) {
        $script:dismissMs = [Math]::Max(0, [int]$state.dismissMs)
    }

    $lblKind.Text = [string]$state.kind
    $lblMode.Text = [string]$state.mode

    if ($null -ne $state.textPreview -and -not [string]::IsNullOrWhiteSpace([string]$state.textPreview)) {
        $preview.Text = [string]$state.textPreview
    } else {
        $preview.Text = "(no text preview)"
    }

    $btnAccept.Visible = ($state.kind -eq "inbound" -and $state.mode -eq "ask")
    $btnShare.Visible = ($state.kind -eq "outbound" -and $state.mode -eq "ask")
    $btnUndo.Visible = ($state.kind -eq "inbound" -and [bool]$state.showUndo)
    $btnErase.Visible = ($state.kind -eq "outbound" -and [bool]$state.showErase)
    $btnDismiss.Visible = $true

    Layout-ActionButtons

    $elapsedMs = ((Get-Date) - $script:stateStartedAt).TotalMilliseconds
    $remainingMs = [Math]::Max(0, $script:dismissMs - $elapsedMs)

    $lblCount.Text = ("{0:N1}s" -f ($remainingMs / 1000.0))

    if ($remainingMs -le 0) {
        Close-Toast -Dismiss
    }
})

$form.Add_Shown({
    $timer.Start()
})

$form.Add_FormClosed({
    $timer.Stop()
    $timer.Dispose()
})

[void]$form.ShowDialog()
