# Filename: prompt-toast.ps1
# FullPath: apps/CWSP-reborn/resources/clipboard-prompt/prompt-toast.ps1
# Change date and time: 04.19.00_17.07.2026
# Reason: Native borderless clipboard prompt for Windows.
#   Accept either `state` or `prompt` field from control RPC; show image
#   thumbnail when state.hasImage / imageThumbDataUrl is present; honor
#   state.dismissMs for auto-dismiss; never re-send dismiss after an action.
# Invariant: Uses only loopback HTTP control RPC. No Neutralino, WebSocket, or backend spawn.

param(
    [Parameter(Mandatory = $true)]
    [int]$ControlPort,

    [Parameter(Mandatory = $true)]
    [string]$ControlKey
)

$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

$script:endpoint = "http://127.0.0.1:$ControlPort/service/clipboard-prompt"
$script:headers = @{ "X-API-Key" = $ControlKey }
$script:actionSent = $false
$script:closing = $false
$script:stateWasVisible = $false
$script:emptyResponses = 0
$script:promptFingerprint = ""
$script:deadline = $null
$script:defaultDismissMs = 10000

function Get-PromptResponse {
    try {
        $result = Invoke-RestMethod `
            -Uri $script:endpoint `
            -Method GET `
            -Headers $script:headers `
            -TimeoutSec 1 `
            -ErrorAction Stop

        return [PSCustomObject]@{
            Ok = $true
            Data = $result
        }
    } catch {
        return [PSCustomObject]@{
            Ok = $false
            Data = $null
        }
    }
}

function Get-PromptState {
    param([object]$Data)

    if ($null -eq $Data) {
        return $null
    }

    # COMPAT: control RPC returns both `state` (legacy) and `prompt` (canonical).
    # Prefer `state`, then `prompt`; fall back to a flat object carrying `kind`.
    $stateProperty = $Data.PSObject.Properties["state"]
    if ($null -ne $stateProperty -and $null -ne $stateProperty.Value) {
        return $stateProperty.Value
    }

    $promptProperty = $Data.PSObject.Properties["prompt"]
    if ($null -ne $promptProperty -and $null -ne $promptProperty.Value) {
        return $promptProperty.Value
    }

    if ($null -ne $Data.PSObject.Properties["kind"]) {
        return $Data
    }

    return $null
}

function Send-PromptAction {
    param([string]$Action)

    if ($script:actionSent) {
        return
    }

    $script:actionSent = $true

    try {
        $postHeaders = @{
            "X-API-Key" = $ControlKey
            "Content-Type" = "application/json"
        }

        $body = @{ action = $Action } | ConvertTo-Json -Compress

        Invoke-RestMethod `
            -Uri $script:endpoint `
            -Method POST `
            -Headers $postHeaders `
            -Body $body `
            -TimeoutSec 2 `
            -ErrorAction Stop | Out-Null
    } catch {
        # The backend may clear prompt state before it receives this action.
    }
}

function Close-Toast {
    param([string]$Action = "")

    if ($Action) {
        Send-PromptAction $Action
    }

    $script:closing = $true
    $form.Close()
}

function Get-ShortPreview {
    param([object]$Value)

    if ($null -eq $Value) {
        return "Clipboard data is ready."
    }

    $text = ([string]$Value -replace "\s+", " ").Trim()

    if (!$text) {
        return "Clipboard data is ready."
    }

    if ($text.Length -gt 180) {
        return $text.Substring(0, 177) + "..."
    }

    return $text
}

function Set-PrimaryAction {
    param([object]$State)

    $kind = [string]$State.kind
    $mode = [string]$State.mode
    $action = ""
    $caption = ""

    if ($kind -eq "inbound" -and $mode -eq "ask") {
        $action = "accept"
        $caption = "Accept"
    } elseif ($kind -eq "outbound" -and $mode -eq "ask") {
        $action = "share"
        $caption = "Share"
    } elseif ($kind -eq "inbound" -and [bool]$State.showUndo) {
        $action = "undo"
        $caption = "Undo"
    } elseif ($kind -eq "outbound" -and [bool]$State.showErase) {
        $action = "erase"
        $caption = "Erase"
    }

    if ($action) {
        $primaryButton.Tag = $action
        $primaryButton.Text = $caption
        $primaryButton.Visible = $true
        $primaryButton.Location = New-Object System.Drawing.Point(12, 132)
        $primaryButton.Size = New-Object System.Drawing.Size(164, 30)

        $dismissButton.Location = New-Object System.Drawing.Point(184, 132)
        $dismissButton.Size = New-Object System.Drawing.Size(164, 30)
        return
    }

    $primaryButton.Visible = $false
    $dismissButton.Location = New-Object System.Drawing.Point(12, 132)
    $dismissButton.Size = New-Object System.Drawing.Size(336, 30)
}

$form = New-Object System.Windows.Forms.Form
$form.Text = "CWSP Clipboard"
$form.FormBorderStyle = [System.Windows.Forms.FormBorderStyle]::None
$form.ShowInTaskbar = $false
$form.TopMost = $true
$form.StartPosition = [System.Windows.Forms.FormStartPosition]::Manual
$form.ClientSize = New-Object System.Drawing.Size(360, 174)
$form.BackColor = [System.Drawing.Color]::FromArgb(23, 25, 30)
$form.ForeColor = [System.Drawing.Color]::FromArgb(239, 241, 245)
$form.Font = New-Object System.Drawing.Font("Segoe UI", 9.0)
$form.KeyPreview = $true

$screen = [System.Windows.Forms.Screen]::FromPoint(
    [System.Windows.Forms.Cursor]::Position
)
$workArea = $screen.WorkingArea

$form.Location = New-Object System.Drawing.Point(
    [Math]::Max(12, $workArea.Right - $form.Width - 12),
    [Math]::Max(12, $workArea.Bottom - $form.Height - 12)
)

$header = New-Object System.Windows.Forms.Panel
$header.Location = New-Object System.Drawing.Point(0, 0)
$header.Size = New-Object System.Drawing.Size(360, 36)
$header.BackColor = [System.Drawing.Color]::FromArgb(35, 39, 48)
$form.Controls.Add($header)

$titleLabel = New-Object System.Windows.Forms.Label
$titleLabel.Text = "Clipboard"
$titleLabel.Location = New-Object System.Drawing.Point(12, 9)
$titleLabel.Size = New-Object System.Drawing.Size(180, 18)
$titleLabel.Font = New-Object System.Drawing.Font("Segoe UI Semibold", 9.0)
$titleLabel.ForeColor = [System.Drawing.Color]::FromArgb(239, 241, 245)
$header.Controls.Add($titleLabel)

$countdownLabel = New-Object System.Windows.Forms.Label
$countdownLabel.Location = New-Object System.Drawing.Point(252, 9)
$countdownLabel.Size = New-Object System.Drawing.Size(96, 18)
$countdownLabel.TextAlign = [System.Drawing.ContentAlignment]::MiddleRight
$countdownLabel.ForeColor = [System.Drawing.Color]::FromArgb(168, 174, 186)
$header.Controls.Add($countdownLabel)

$messageLabel = New-Object System.Windows.Forms.Label
$messageLabel.Location = New-Object System.Drawing.Point(12, 48)
$messageLabel.Size = New-Object System.Drawing.Size(336, 68)
$messageLabel.ForeColor = [System.Drawing.Color]::FromArgb(218, 222, 230)
$messageLabel.Text = "Waiting for clipboard prompt..."
$form.Controls.Add($messageLabel)

# Optional image thumbnail (shown when state.hasImage + imageThumbDataUrl).
$imageBox = New-Object System.Windows.Forms.PictureBox
$imageBox.Location = New-Object System.Drawing.Point(12, 48)
$imageBox.Size = New-Object System.Drawing.Size(336, 68)
$imageBox.SizeMode = [System.Windows.Forms.PictureBoxSizeMode]::Zoom
$imageBox.Visible = $false
$form.Controls.Add($imageBox)

$primaryButton = New-Object System.Windows.Forms.Button
$primaryButton.FlatStyle = [System.Windows.Forms.FlatStyle]::Flat
$primaryButton.FlatAppearance.BorderSize = 0
$primaryButton.BackColor = [System.Drawing.Color]::FromArgb(55, 110, 190)
$primaryButton.ForeColor = [System.Drawing.Color]::White
$primaryButton.Cursor = [System.Windows.Forms.Cursors]::Hand
$primaryButton.Visible = $false
$primaryButton.Add_Click({
    Send-PromptAction ([string]$primaryButton.Tag)
    Close-Toast
})
$form.Controls.Add($primaryButton)

$dismissButton = New-Object System.Windows.Forms.Button
$dismissButton.Text = "Dismiss"
$dismissButton.FlatStyle = [System.Windows.Forms.FlatStyle]::Flat
$dismissButton.FlatAppearance.BorderSize = 0
$dismissButton.BackColor = [System.Drawing.Color]::FromArgb(52, 56, 66)
$dismissButton.ForeColor = [System.Drawing.Color]::FromArgb(239, 241, 245)
$dismissButton.Cursor = [System.Windows.Forms.Cursors]::Hand
$dismissButton.Add_Click({
    Close-Toast "dismiss"
})
$form.Controls.Add($dismissButton)

Set-PrimaryAction $null

$form.Add_KeyDown({
    param($sender, $eventArgs)

    if ($eventArgs.KeyCode -eq [System.Windows.Forms.Keys]::Escape) {
        Close-Toast "dismiss"
    }
})

$form.Add_FormClosing({
    if (
        -not $script:closing -and
        -not $script:actionSent -and
        $script:stateWasVisible
    ) {
        Send-PromptAction "dismiss"
    }
})

$timer = New-Object System.Windows.Forms.Timer
$timer.Interval = 1000

$timer.Add_Tick({
    $response = Get-PromptResponse
    $state = if ($response.Ok) { Get-PromptState $response.Data } else { $null }

    if ($null -eq $state -or [string]::IsNullOrWhiteSpace([string]$state.kind)) {
        # A network failure is not evidence that the prompt was dismissed.
        if ($response.Ok) {
            $script:emptyResponses++
        }

        # Host starts this script only for an existing prompt. Six confirmed empty
        # responses means the backend has cleared it; transient RPC failures do not.
        if ($response.Ok -and $script:emptyResponses -ge 6) {
            Close-Toast
        }

        return
    }

    $script:emptyResponses = 0
    $script:stateWasVisible = $true

    $kind = [string]$state.kind
    $mode = [string]$state.mode
    $dismissMs = $script:defaultDismissMs

    if ($null -ne $state.dismissMs -and [int]$state.dismissMs -gt 0) {
        $dismissMs = [int]$state.dismissMs
    }

    $fingerprint = "$kind|$mode|$dismissMs|$($state.textPreview)"

    if ($fingerprint -ne $script:promptFingerprint) {
        $script:promptFingerprint = $fingerprint
        $script:deadline = (Get-Date).AddMilliseconds($dismissMs)
        $form.Activate()
        $form.BringToFront()
    }

    $verb = if ($kind -eq "inbound") { "Incoming clipboard" } else { "Outgoing clipboard" }
    $preview = Get-ShortPreview $state.textPreview

    # Image thumbnail: state.hasImage + imageThumbDataUrl (data URL). Falls back
    # to a text mention if the data URL is missing or undecodable.
    $hasImage = [bool]$state.hasImage
    $thumbDataUrl = [string]$state.imageThumbDataUrl
    if ($hasImage -and $thumbDataUrl) {
        try {
            $base64 = $null
            if ($thumbDataUrl -match "^data:image/[^;]+;base64,(.*)$") {
                $base64 = $matches[1]
            } elseif ($thumbDataUrl -match "^[A-Za-z0-9+/=]+$") {
                $base64 = $thumbDataUrl
            }
            if ($base64) {
                $bytes = [Convert]::FromBase64String($base64)
                $ms = New-Object System.IO.MemoryStream(,$bytes)
                $img = [System.Drawing.Image]::FromStream($ms)
                $imageBox.Image = $img
                $imageBox.Visible = $true
                $messageLabel.Visible = $false
            } else {
                $imageBox.Visible = $false
                $messageLabel.Visible = $true
                $messageLabel.Text = "Clipboard image is ready."
            }
        } catch {
            $imageBox.Visible = $false
            $messageLabel.Visible = $true
            $messageLabel.Text = "Clipboard image is ready."
        }
    } else {
        $imageBox.Visible = $false
        $messageLabel.Visible = $true
        if ($hasImage) {
            $messageLabel.Text = "Clipboard image is ready."
        } else {
            $messageLabel.Text = $preview
        }
    }

    $titleLabel.Text = $verb
    Set-PrimaryAction $state

    $remainingMs = [Math]::Max(
        0,
        ($script:deadline - (Get-Date)).TotalMilliseconds
    )

    $countdownLabel.Text = ("{0:N0}s" -f ($remainingMs / 1000))

    if ($remainingMs -le 0) {
        Close-Toast "dismiss"
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