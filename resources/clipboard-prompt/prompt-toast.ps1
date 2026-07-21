# Filename: prompt-toast.ps1
# FullPath: apps/CWSP-reborn/resources/clipboard-prompt/prompt-toast.ps1
# Change date and time: 10.35.00_20.07.2026
# Reason: Native borderless clipboard prompt for Windows.
#   Accept either `state` or `prompt` field from control RPC; show image
#   thumbnail when state.hasImage / imageThumbDataUrl / imageThumbPath present;
#   honor state.dismissMs for auto-dismiss; never re-send dismiss after an action.
#   2026-07-17: High-DPI — SetProcessDPIAware + scale layout by DpiX/96;
#   load large thumbs from imageThumbPath (hub temp PNG).
#   2026-07-17b: Harden startup (font fallback, null-safe actions, faster first
#   poll, crash log) so text/image toasts do not die silently under Stop.
#   2026-07-17c: Fonts use point sizes WITHOUT *scale — GDI already maps pt→px
#   under SetProcessDPIAware; multiplying caused clipped title / oversized buttons.
#   2026-07-17d: Multi-line textPreview — keep newlines in preview + TopLeft label.
#   2026-07-17e: Raise toast with SetWindowPos(SWP_NOACTIVATE) — no Activate().
#   2026-07-17f / 2026-07-18g: HARD RULE — never put WS_EX_NOACTIVATE /
#   ShowWithoutActivation / CwspNonActivatingForm on this toast. Those make the
#   window invisible or unclickable under ShowDialog AND under modeless Show on
#   desk hosts. Visibility contract: normal Form + ShowDialog. Focus contract:
#   CaptureForeground before show, then YieldKeyboardFocus only while the toast
#   IS the foreground HWND (never yank a third app the user already switched to).
#   SetWindowPos(..., SWP_NOACTIVATE) is only for z-order raise, not Form style.
#   2026-07-18h: Add-Type must stay C#5-safe (no `out _` discards) — PS 5.1
#   CodeDom rejects them → "Cannot add type" → toast-exit code 1 crash-loop.
#   2026-07-18i: Share-toast respawn storm — do not silent-close after a prompt
#   was shown (empty polls must dismiss the hub hold); only set actionSent after
#   successful POST; avoid sync Yield on Activated (can race ShowDialog).
#   2026-07-18j: 10s timer — after paint, still honor deadline/expiresAt on empty
#   GETs (hub already cleared); sustained empty after paint closes orphan UI.
#   2026-07-20: Waiting give-up must POST dismiss — silent exit left hub hold and
#   prompt-host respawned frozen "Waiting for clipboard prompt..." forever after standby.
#   2026-07-20b: ShowDialog steals keyboard again — deferred BeginInvoke yield on
#   Shown/Activated; Yield only if toast owns foreground;
#   RaiseTopMost without SWP_SHOWWINDOW (avoids re-activate side effects).
#   2026-07-20c: Node-owned toast — no Neutralino UI. Waiting empty polls must NOT
#   POST dismiss (race killed hub holds). Remove per-tick focus yield (broke clicks).
#   Failed dismiss must not block Close / spam crash log forever.
#   Loopback HTTP via HttpWebRequest Proxy=$null (Invoke-RestMethod hung on desk proxy).
# Invariant: Loopback HTTP to Node control only. No Neutralino window process.

param(
    [Parameter(Mandatory = $true)]
    [int]$ControlPort,

    [Parameter(Mandatory = $true)]
    [string]$ControlKey
)

# WHY: prefer Continue during UI build — a single font miss must not kill the toast.
$ErrorActionPreference = "Continue"
$script:crashLog = Join-Path $env:TEMP "cwsp-clipboard-prompt-toast.log"

function Write-ToastCrash {
    param([string]$Message)
    try {
        $line = "{0:o} {1}" -f (Get-Date).ToUniversalTime(), $Message
        Add-Content -LiteralPath $script:crashLog -Value $line -ErrorAction SilentlyContinue
    } catch { }
}

trap {
    Write-ToastCrash ("TRAP: " + $_.Exception.Message)
    break
}

# WHY: before any WinForms handle — declare the process DPI-aware so 125%/150%/200%
# scaling does not blur the toast or leave tiny hit-targets on modern displays.
Add-Type @"
using System;
using System.Runtime.InteropServices;
public static class CwspDpi {
    [DllImport("user32.dll")]
    public static extern bool SetProcessDPIAware();
}
"@
try {
    [void][CwspDpi]::SetProcessDPIAware()
} catch {
    # Older hosts may already be per-monitor aware — ignore.
}

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# AI-READ: do NOT add a Form subclass with WS_EX_NOACTIVATE here — toast vanishes on desk.
# AI-READ: Add-Type body must be C#5-safe (PS 5.1 CodeDom) — no `out _`, no nameof, etc.
try {
Add-Type @"
using System;
using System.Runtime.InteropServices;

// WHY: raise z-order without Activate(), then optionally yield keyboard to the
// previously focused app. Visibility stays on a normal WinForms Form + ShowDialog.
public static class CwspToastWindow
{
    private static readonly IntPtr HWND_TOPMOST = new IntPtr(-1);
    private const uint SWP_NOSIZE = 0x0001;
    private const uint SWP_NOMOVE = 0x0002;
    private const uint SWP_NOACTIVATE = 0x0010;

    private static IntPtr previousForeground = IntPtr.Zero;

    [DllImport("user32.dll")]
    private static extern IntPtr GetForegroundWindow();

    [DllImport("user32.dll")]
    private static extern bool SetForegroundWindow(IntPtr hWnd);

    [DllImport("user32.dll")]
    private static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint lpdwProcessId);

    [DllImport("kernel32.dll")]
    private static extern uint GetCurrentThreadId();

    [DllImport("user32.dll")]
    private static extern bool AttachThreadInput(uint idAttach, uint idAttachTo, bool fAttach);

    [DllImport("user32.dll", SetLastError = true)]
    private static extern bool SetWindowPos(
        IntPtr hWnd,
        IntPtr hWndInsertAfter,
        int x,
        int y,
        int cx,
        int cy,
        uint flags);

    public static void CaptureForeground()
    {
        IntPtr hwnd = GetForegroundWindow();
        // WHY: never capture our own toast handle as "previous" (would yield to self).
        if (hwnd != IntPtr.Zero)
        {
            previousForeground = hwnd;
        }
    }

    public static void RememberForegroundUnless(IntPtr toastHandle)
    {
        IntPtr hwnd = GetForegroundWindow();
        if (hwnd != IntPtr.Zero && hwnd != toastHandle)
        {
            previousForeground = hwnd;
        }
    }

    public static bool IsForeground(IntPtr handle)
    {
        return handle != IntPtr.Zero && GetForegroundWindow() == handle;
    }

    // WHY: toast stays painted/TopMost; keyboard returns only when toast stole it.
    // INVARIANT: never SetForegroundWindow when a third app already owns focus
    // (old code yanked users off whatever they Alt-Tab'd to after ShowDialog).
    public static void YieldKeyboardFocus(IntPtr toastHandle)
    {
        if (toastHandle == IntPtr.Zero)
        {
            return;
        }

        IntPtr current = GetForegroundWindow();
        // Track the live non-toast foreground so yield target stays fresh.
        if (current != IntPtr.Zero && current != toastHandle)
        {
            previousForeground = current;
            return;
        }

        if (current != toastHandle)
        {
            return;
        }

        if (previousForeground == IntPtr.Zero || previousForeground == toastHandle)
        {
            return;
        }

        // COMPAT: PS 5.1 Add-Type is C#5 — use a named out var, not a discard.
        uint ignoredPid = 0;
        uint foreThread = GetWindowThreadProcessId(previousForeground, out ignoredPid);
        uint curThread = GetCurrentThreadId();
        bool attached = false;
        if (foreThread != 0 && foreThread != curThread)
        {
            attached = AttachThreadInput(curThread, foreThread, true);
        }

        try
        {
            SetForegroundWindow(previousForeground);
        }
        finally
        {
            if (attached)
            {
                AttachThreadInput(curThread, foreThread, false);
            }
        }
    }

    // WHY: no SWP_SHOWWINDOW — re-show flags can re-activate on some Windows builds.
    public static bool RaiseTopMostNoActivate(IntPtr handle)
    {
        return SetWindowPos(
            handle,
            HWND_TOPMOST,
            0,
            0,
            0,
            0,
            SWP_NOSIZE | SWP_NOMOVE | SWP_NOACTIVATE);
    }
}
"@
} catch {
    Write-ToastCrash ("Add-Type CwspToastWindow: " + $_.Exception.Message)
    throw
}

[System.Windows.Forms.Application]::EnableVisualStyles()
try {
    [System.Windows.Forms.Application]::SetCompatibleTextRenderingDefault($false)
} catch {
    # optional on some runtimes
}

$script:endpoint = "http://127.0.0.1:$ControlPort/service/clipboard-prompt"
$script:headers = @{ "X-API-Key" = $ControlKey }
$script:actionSent = $false
$script:closing = $false
# WHY: after Dismiss/timeout, ignore the same prompt fingerprint if hub flaps
# and re-publishes before this process exits (Ctrl+C toast reopen loop).
$script:dismissedFingerprint = ""
$script:stateWasVisible = $false
$script:emptyResponses = 0
$script:promptFingerprint = ""
$script:deadline = $null
$script:defaultDismissMs = 10000
$script:loadedThumbPath = ""
# WHY: while pointer is over toast, keep keyboard so Share/Dismiss clicks work.
$script:pointerOnToast = $false

# Probe DPI via a temporary Graphics context (96 = 100% scale).
$script:scale = 1.0
try {
    $probeForm = New-Object System.Windows.Forms.Form
    $g = $probeForm.CreateGraphics()
    if ($g.DpiX -gt 0) {
        $script:scale = [double]$g.DpiX / 96.0
    }
    $g.Dispose()
    $probeForm.Dispose()
} catch {
    $script:scale = 1.0
}
if ($script:scale -lt 1.0) { $script:scale = 1.0 }

function S {
    param([int]$Value)
    return [int][Math]::Round($Value * $script:scale)
}

# WHY: Invoke-RestMethod on desk often hangs on system HTTP proxy / stale keep-alive
# to loopback (dismiss timeout storm). Use HttpWebRequest with Proxy=$null.
function Invoke-ControlJson {
    param(
        [Parameter(Mandatory = $true)][string]$Method,
        [string]$BodyJson = ""
    )

    $req = [System.Net.HttpWebRequest]::Create($script:endpoint)
    $req.Method = $Method
    $req.Timeout = 1500
    $req.ReadWriteTimeout = 1500
    $req.Proxy = $null
    $req.KeepAlive = $false
    $req.ContentType = "application/json"
    $req.Headers.Add("X-API-Key", $ControlKey)
    if ($Method -eq "POST" -and -not [string]::IsNullOrEmpty($BodyJson)) {
        $bytes = [System.Text.Encoding]::UTF8.GetBytes($BodyJson)
        $req.ContentLength = $bytes.Length
        $stream = $req.GetRequestStream()
        try { $stream.Write($bytes, 0, $bytes.Length) } finally { $stream.Close() }
    }
    $resp = $null
    try {
        $resp = $req.GetResponse()
        $reader = New-Object System.IO.StreamReader($resp.GetResponseStream())
        try {
            $raw = $reader.ReadToEnd()
        } finally {
            $reader.Close()
        }
        if ([string]::IsNullOrWhiteSpace($raw)) {
            return [PSCustomObject]@{ Ok = $true; Data = $null }
        }
        return [PSCustomObject]@{ Ok = $true; Data = ($raw | ConvertFrom-Json) }
    } finally {
        if ($null -ne $resp) { $resp.Close() }
    }
}

function Get-PromptResponse {
    try {
        return Invoke-ControlJson -Method "GET"
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
        return $true
    }

    try {
        $body = @{ action = $Action } | ConvertTo-Json -Compress
        $null = Invoke-ControlJson -Method "POST" -BodyJson $body
        # WHY: only latch after success — failed POST must retry (else hub hold stays
        # and prompt-host respawns the same Share toast forever).
        $script:actionSent = $true
        return $true
    } catch {
        Write-ToastCrash ("Send-PromptAction $Action failed: " + $_.Exception.Message)
        return $false
    }
}

function Close-Toast {
    param([string]$Action = "")

    # WHY: if Share UI was shown, never exit without telling the hub — silent close
    # leaves promptHold active → host respawns → infinite Share blink.
    if (
        -not $Action -and
        $script:stateWasVisible -and
        -not $script:actionSent
    ) {
        $Action = "dismiss"
    }

    if ($Action) {
        if ($Action -eq "dismiss" -and -not [string]::IsNullOrWhiteSpace($script:promptFingerprint)) {
            $script:dismissedFingerprint = $script:promptFingerprint
        }
        $ok = Send-PromptAction $Action
        # WHY: control down → do not retry dismiss forever (crash log storm + frozen UI).
        if (-not $ok) {
            $script:actionSent = $true
        }
    }

    $script:closing = $true
    try { $form.Close() } catch { }
}

function Get-ShortPreview {
    param([object]$Value)

    if ($null -eq $Value) {
        return "Clipboard data is ready."
    }

    # WHY: preserve newlines for Share/Accept multi-line clipboard; only collapse
    # spaces/tabs within each line (hub already sends a capped textPreview).
    $text = [string]$Value
    $text = $text -replace "`r`n", "`n" -replace "`r", "`n"
    $lines = @(
        $text -split "`n" | ForEach-Object {
            (($_ -replace "[ \t]+", " ").TrimEnd())
        }
    )
    $text = ($lines -join "`n").Trim()

    if (!$text) {
        return "Clipboard data is ready."
    }

    if ($text.Length -gt 180) {
        $text = $text.Substring(0, 177) + "..."
    }

    # WinForms Label renders CRLF as line breaks reliably.
    return ($text -replace "`n", "`r`n")
}

function New-ToastFont {
    param(
        [string]$Family,
        # WHY: size is in points. Do NOT multiply by $script:scale — under
        # SetProcessDPIAware, GDI already converts pt to device pixels.
        [double]$SizePt
    )
    try {
        return New-Object System.Drawing.Font($Family, [float]$SizePt)
    } catch {
        try {
            return New-Object System.Drawing.Font("Segoe UI", [float]$SizePt)
        } catch {
            return New-Object System.Drawing.Font([System.Drawing.FontFamily]::GenericSansSerif, [float]$SizePt)
        }
    }
}

function Set-PrimaryAction {
    param([object]$State)

    $kind = ""
    $mode = ""
    if ($null -ne $State) {
        $kind = [string]$State.kind
        $mode = [string]$State.mode
    }
    $action = ""
    $caption = ""

    if ($kind -eq "inbound" -and $mode -eq "ask") {
        $action = "accept"
        $domain = ""
        try { $domain = [string]$State.domain } catch { $domain = "" }
        # WHY: files-ready + ask = manual copy-on-receive → Copy button.
        $caption = if ($domain -eq "files-ready") { "Copy" } else { "Accept" }
    } elseif ($kind -eq "outbound" -and $mode -eq "ask") {
        $action = "share"
        $caption = "Share"
    } elseif ($null -ne $State -and $kind -eq "inbound" -and [bool]$State.showUndo) {
        $action = "undo"
        $caption = "Undo"
    } elseif ($null -ne $State -and $kind -eq "outbound" -and [bool]$State.showErase) {
        $action = "erase"
        $caption = "Erase"
    }

    $btnY = S 152
    $btnH = S 30
    $gap = S 12
    $halfW = S 164
    $fullW = S 336

    if ($action) {
        $primaryButton.Tag = $action
        $primaryButton.Text = $caption
        $primaryButton.Visible = $true
        $primaryButton.Location = New-Object System.Drawing.Point($gap, $btnY)
        $primaryButton.Size = New-Object System.Drawing.Size($halfW, $btnH)

        $dismissButton.Location = New-Object System.Drawing.Point(($gap + $halfW + (S 8)), $btnY)
        $dismissButton.Size = New-Object System.Drawing.Size($halfW, $btnH)
        return
    }

    $primaryButton.Visible = $false
    $dismissButton.Location = New-Object System.Drawing.Point($gap, $btnY)
    $dismissButton.Size = New-Object System.Drawing.Size($fullW, $btnH)
}

function Clear-ThumbImage {
    if ($null -ne $imageBox.Image) {
        $old = $imageBox.Image
        $imageBox.Image = $null
        try { $old.Dispose() } catch { }
    }
    $script:loadedThumbPath = ""
}

function Set-ThumbFromState {
    param([object]$State)

    $hasImage = [bool]$State.hasImage
    if (-not $hasImage) {
        Clear-ThumbImage
        $imageBox.Visible = $false
        $messageLabel.Visible = $true
        return $false
    }

    $thumbPath = [string]$State.imageThumbPath
    $thumbDataUrl = [string]$State.imageThumbDataUrl

    # Prefer local PNG path (large images); fall back to inline data URL.
    if ($thumbPath -and (Test-Path -LiteralPath $thumbPath)) {
        if ($script:loadedThumbPath -ne $thumbPath) {
            Clear-ThumbImage
            try {
                # WHY: FromFile locks the path; clone into memory so hub can delete the temp PNG.
                $fromDisk = [System.Drawing.Image]::FromFile($thumbPath)
                $imageBox.Image = New-Object System.Drawing.Bitmap($fromDisk)
                $fromDisk.Dispose()
                $script:loadedThumbPath = $thumbPath
            } catch {
                Clear-ThumbImage
            }
        }
        if ($null -ne $imageBox.Image) {
            $imageBox.Visible = $true
            $messageLabel.Visible = $false
            return $true
        }
    }

    if ($thumbDataUrl) {
        try {
            $base64 = $null
            if ($thumbDataUrl -match "^data:image/[^;]+;base64,(.*)$") {
                $base64 = $matches[1]
            } elseif ($thumbDataUrl -match "^[A-Za-z0-9+/=]+$") {
                $base64 = $thumbDataUrl
            }
            if ($base64) {
                Clear-ThumbImage
                $bytes = [Convert]::FromBase64String($base64)
                $ms = New-Object System.IO.MemoryStream(, $bytes)
                $img = [System.Drawing.Image]::FromStream($ms)
                $imageBox.Image = New-Object System.Drawing.Bitmap($img)
                $img.Dispose()
                $ms.Dispose()
                $imageBox.Visible = $true
                $messageLabel.Visible = $false
                return $true
            }
        } catch {
            Clear-ThumbImage
        }
    }

    $imageBox.Visible = $false
    $messageLabel.Visible = $true
    $messageLabel.Text = "Clipboard image is ready."
    return $true
}

# INVARIANT: plain Form + ShowDialog — the only combo proven visible/clickable on desk.
$form = New-Object System.Windows.Forms.Form
$form.Text = "CWSP Clipboard"
$form.FormBorderStyle = [System.Windows.Forms.FormBorderStyle]::None
$form.ShowInTaskbar = $false
$form.TopMost = $true
$form.StartPosition = [System.Windows.Forms.FormStartPosition]::Manual
# WHY: taller body so 3–4 preview lines fit under Share/Accept without clipping.
$form.ClientSize = New-Object System.Drawing.Size((S 360), (S 196))
$form.BackColor = [System.Drawing.Color]::FromArgb(23, 25, 30)
$form.ForeColor = [System.Drawing.Color]::FromArgb(239, 241, 245)
# WHY: layout uses S(); fonts stay at design-time point sizes (no *scale).
$form.Font = New-ToastFont "Segoe UI" 9.0
# WHY: Escape after a deliberate click into the toast; arrows should not stay here.
$form.KeyPreview = $true
# WHY: we already scale layout via DpiX probe — avoid WinForms double-DPI resize.

$screen = [System.Windows.Forms.Screen]::FromPoint(
    [System.Windows.Forms.Cursor]::Position
)
$workArea = $screen.WorkingArea

$form.Location = New-Object System.Drawing.Point(
    [Math]::Max((S 12), $workArea.Right - $form.Width - (S 12)),
    [Math]::Max((S 12), $workArea.Bottom - $form.Height - (S 12))
)

$header = New-Object System.Windows.Forms.Panel
$header.Location = New-Object System.Drawing.Point(0, 0)
$header.Size = New-Object System.Drawing.Size((S 360), (S 36))
$header.BackColor = [System.Drawing.Color]::FromArgb(35, 39, 48)
$form.Controls.Add($header)

$titleLabel = New-Object System.Windows.Forms.Label
$titleLabel.Text = "Clipboard"
$titleLabel.Location = New-Object System.Drawing.Point((S 12), (S 9))
$titleLabel.Size = New-Object System.Drawing.Size((S 180), (S 18))
$titleLabel.Font = New-ToastFont "Segoe UI Semibold" 9.0
$titleLabel.ForeColor = [System.Drawing.Color]::FromArgb(239, 241, 245)
$header.Controls.Add($titleLabel)

$countdownLabel = New-Object System.Windows.Forms.Label
$countdownLabel.Location = New-Object System.Drawing.Point((S 252), (S 9))
$countdownLabel.Size = New-Object System.Drawing.Size((S 96), (S 18))
$countdownLabel.TextAlign = [System.Drawing.ContentAlignment]::MiddleRight
$countdownLabel.ForeColor = [System.Drawing.Color]::FromArgb(168, 174, 186)
$header.Controls.Add($countdownLabel)

$messageLabel = New-Object System.Windows.Forms.Label
$messageLabel.Location = New-Object System.Drawing.Point((S 12), (S 48))
$messageLabel.Size = New-Object System.Drawing.Size((S 336), (S 92))
$messageLabel.ForeColor = [System.Drawing.Color]::FromArgb(218, 222, 230)
# WHY: TopLeft + CRLF preview so multi-line Share/Accept text is readable.
$messageLabel.TextAlign = [System.Drawing.ContentAlignment]::TopLeft
$messageLabel.Text = "Waiting for clipboard prompt..."
$form.Controls.Add($messageLabel)

$imageBox = New-Object System.Windows.Forms.PictureBox
$imageBox.Location = New-Object System.Drawing.Point((S 12), (S 48))
$imageBox.Size = New-Object System.Drawing.Size((S 336), (S 92))
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
$primaryButton.Font = $form.Font
# WHY: TabStop false — arrow/tab must not land on toast buttons while it is topmost.
$primaryButton.TabStop = $false
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
$dismissButton.Font = $form.Font
$dismissButton.TabStop = $false
$dismissButton.Add_Click({
    Close-Toast "dismiss"
})
$form.Controls.Add($dismissButton)

Set-PrimaryAction $null

function Show-ToastTopMost {
    if ($null -eq $form -or -not $form.IsHandleCreated) {
        return
    }

    # WHY: z-order only — SWP_NOACTIVATE here is NOT the same as WS_EX_NOACTIVATE on Form.
    [void][CwspToastWindow]::RaiseTopMostNoActivate($form.Handle)
}

function Test-ToastPointerInteraction {
    if ($script:pointerOnToast) {
        return $true
    }
    if (
        [System.Windows.Forms.Control]::MouseButtons -ne
        [System.Windows.Forms.MouseButtons]::None
    ) {
        return $true
    }
    try {
        $pt = $form.PointToClient([System.Windows.Forms.Cursor]::Position)
        if ($form.ClientRectangle.Contains($pt)) {
            return $true
        }
    } catch { }
    return $false
}

function Yield-ToastKeyboardFocus {
    if ($null -eq $form -or -not $form.IsHandleCreated) {
        return
    }
    # WHY: yielding during a click/hover drops the button; leave focus while using toast.
    if (Test-ToastPointerInteraction) {
        return
    }
    [void][CwspToastWindow]::YieldKeyboardFocus($form.Handle)
}

# WHY: ShowDialog activates synchronously — yield on next message-pump turn so
# the dialog stays painted/clickable while keyboard returns to the prior app.
function Schedule-ToastKeyboardYield {
    if ($null -eq $form -or -not $form.IsHandleCreated) {
        return
    }
    try {
        # WHY: MethodInvoker is the WinForms-safe deferred callback on PS 5.1 STA.
        # Do NOT clear ActiveControl here — that broke button clicks on desk.
        $invoker = [System.Windows.Forms.MethodInvoker]{
            try {
                Show-ToastTopMost
                Yield-ToastKeyboardFocus
            } catch { }
        }
        [void]$form.BeginInvoke($invoker)
    } catch {
        # Handle not ready yet — one-shot Shown/Activated may retry via Activated.
    }
}

$form.Add_MouseEnter({ $script:pointerOnToast = $true })
$form.Add_MouseLeave({
    $script:pointerOnToast = $false
    Schedule-ToastKeyboardYield
})
# WHY: child controls receive enter/leave; keep pointer flag accurate for clicks.
foreach ($child in @($header, $titleLabel, $countdownLabel, $messageLabel, $imageBox, $primaryButton, $dismissButton)) {
    $child.Add_MouseEnter({ $script:pointerOnToast = $true })
    $child.Add_MouseLeave({
        # Leave may fire when moving between children — re-check client hit.
        try {
            $pt = $form.PointToClient([System.Windows.Forms.Cursor]::Position)
            $script:pointerOnToast = $form.ClientRectangle.Contains($pt)
        } catch {
            $script:pointerOnToast = $false
        }
        if (-not $script:pointerOnToast) {
            Schedule-ToastKeyboardYield
        }
    })
}

$form.Add_KeyDown({
    param($eventSource, $keyEvent)

    if ($keyEvent.KeyCode -eq [System.Windows.Forms.Keys]::Escape) {
        Close-Toast "dismiss"
        return
    }

    # WHY: if toast briefly owns keyboard, eat navigation keys so they do not feel "stolen"
    # into button focus — Yield-ToastKeyboardFocus still returns them to the prior app.
    $nav = @(
        [System.Windows.Forms.Keys]::Up,
        [System.Windows.Forms.Keys]::Down,
        [System.Windows.Forms.Keys]::Left,
        [System.Windows.Forms.Keys]::Right,
        [System.Windows.Forms.Keys]::Tab
    )
    if ($nav -contains $keyEvent.KeyCode) {
        $keyEvent.Handled = $true
        $keyEvent.SuppressKeyPress = $true
        Yield-ToastKeyboardFocus
    }
})

# WHY: deferred yield (not sync) — sync SetForegroundWindow during Activated
# raced ShowDialog and collapsed the toast on some desk hosts.
$form.Add_Activated({
    Show-ToastTopMost
    Schedule-ToastKeyboardYield
})

$form.Add_FormClosing({
    if (
        -not $script:closing -and
        -not $script:actionSent -and
        $script:stateWasVisible
    ) {
        [void](Send-PromptAction "dismiss")
    }
    Clear-ThumbImage
})

$timer = New-Object System.Windows.Forms.Timer
# WHY: first paint must poll quickly; slow to 750ms after first valid state.
$timer.Interval = 200

function Get-UnixTimeMs {
    $epoch = [DateTime]::SpecifyKind([DateTime]::Parse("1970-01-01"), [DateTimeKind]::Utc)
    return [int64]([DateTime]::UtcNow - $epoch).TotalMilliseconds
}

function Get-ToastRemainingMs {
    param([object]$State)

    # Prefer hub expiresAt so countdown matches the server 10s timer.
    if ($null -ne $State -and $null -ne $State.expiresAt) {
        try {
            $expiresAt = [int64]$State.expiresAt
            if ($expiresAt -gt 0) {
                return [Math]::Max(0, $expiresAt - (Get-UnixTimeMs))
            }
        } catch { }
    }

    if ($null -ne $script:deadline) {
        return [Math]::Max(0, ($script:deadline - (Get-Date)).TotalMilliseconds)
    }

    return [double]$script:defaultDismissMs
}

$timer.Add_Tick({
    # WHY: no per-tick Yield — it raced mouse-down and made Share/Dismiss dead.
    # Focus yield stays on Shown/Activated (deferred) + Leave/arrow keys only.

    $response = Get-PromptResponse
    $state = if ($response.Ok) { Get-PromptState $response.Data } else { $null }

    if ($null -eq $state -or [string]::IsNullOrWhiteSpace([string]$state.kind)) {
        if ($response.Ok) {
            $script:emptyResponses++
        } else {
            # Control down / auth miss — do not hang forever on "Waiting...".
            $script:emptyResponses++
            if ($script:emptyResponses -eq 1 -and -not $script:stateWasVisible) {
                $messageLabel.Text = "Waiting for clipboard prompt..."
            }
        }

        # WHY: local/hub 10s timer must still win after paint — previously we
        # ignored all empty GETs and the toast stayed forever when hub cleared.
        if ($script:stateWasVisible -and $null -ne $script:deadline) {
            $leftMs = ($script:deadline - (Get-Date)).TotalMilliseconds
            $countdownLabel.Text = ("{0:N0}s" -f ([Math]::Max(0, $leftMs) / 1000))
            if ($leftMs -le 0) {
                Close-Toast "dismiss"
                return
            }
        }

        # WHY: never painted — exit quietly WITHOUT POST dismiss.
        # Dismissing here raced hub setPrompt and killed real holds → crash-loop.
        if (-not $script:stateWasVisible -and $script:emptyResponses -ge 8) {
            $script:closing = $true
            try { $form.Close() } catch { }
            return
        }

        # WHY: hub already dismissed (wantRunning false) — close orphan UI after
        # a few empty OK polls (~3s). Does not respawn-storm.
        if ($script:stateWasVisible -and $response.Ok -and $script:emptyResponses -ge 4) {
            Close-Toast
        }

        return
    }

    if ($timer.Interval -lt 750) {
        $timer.Interval = 750
    }

    $script:emptyResponses = 0
    $script:stateWasVisible = $true

    $kind = [string]$state.kind
    $mode = [string]$state.mode
    $dismissMs = $script:defaultDismissMs

    if ($null -ne $state.dismissMs -and [int]$state.dismissMs -gt 0) {
        $dismissMs = [int]$state.dismissMs
    }

    $domainFp = ""
    try { $domainFp = [string]$state.domain } catch { $domainFp = "" }
    $idFp = ""
    try { $idFp = [string]$state.id } catch { $idFp = "" }
    if ([string]::IsNullOrWhiteSpace($idFp)) {
        try { $idFp = [string]$state.transferId } catch { $idFp = "" }
    }
    $fingerprint = "$kind|$mode|$dismissMs|$domainFp|$idFp|$($state.textPreview)|$($state.assetHash)|$($state.imageThumbPath)"

    # WHY: hub may briefly re-publish the same ask after dismiss — do not resurrect UI.
    if (
        -not [string]::IsNullOrWhiteSpace($script:dismissedFingerprint) -and
        $fingerprint -eq $script:dismissedFingerprint
    ) {
        Close-Toast
        return
    }

    if ($fingerprint -ne $script:promptFingerprint) {
        $script:promptFingerprint = $fingerprint
        # Align local deadline with hub expiresAt when present.
        if ($null -ne $state.expiresAt) {
            try {
                $expiresAt = [int64]$state.expiresAt
                $left = $expiresAt - (Get-UnixTimeMs)
                if ($left -gt 0) {
                    $script:deadline = (Get-Date).AddMilliseconds($left)
                } else {
                    $script:deadline = Get-Date
                }
            } catch {
                $script:deadline = (Get-Date).AddMilliseconds($dismissMs)
            }
        } else {
            $script:deadline = (Get-Date).AddMilliseconds($dismissMs)
        }
        Show-ToastTopMost
    }

    # WHY: Cap→desk files Ask merges into the same poll endpoint with domain=files.
    # domain=files-ready is the post-Accept "transfer complete" toast.
    $domain = ""
    try { $domain = [string]$state.domain } catch { $domain = "" }
    if ($domain -eq "files-ready" -and $kind -eq "inbound") {
        $verb = "Files ready"
    } elseif ($domain -eq "files" -and $kind -eq "inbound") {
        $verb = "Incoming files"
    } elseif ($kind -eq "inbound") {
        $verb = "Incoming clipboard"
    } else {
        $verb = "Outgoing clipboard"
    }
    $preview = Get-ShortPreview $state.textPreview

    $showedImage = Set-ThumbFromState $state
    if (-not $showedImage -or $messageLabel.Visible) {
        if (-not [bool]$state.hasImage) {
            $messageLabel.Text = $preview
        } elseif ([string]::IsNullOrWhiteSpace($messageLabel.Text) -or $messageLabel.Text -eq "Waiting for clipboard prompt...") {
            $messageLabel.Text = "Clipboard image is ready."
        }
    }

    $titleLabel.Text = $verb
    Set-PrimaryAction $state

    $remainingMs = Get-ToastRemainingMs $state
    $countdownLabel.Text = ("{0:N0}s" -f ($remainingMs / 1000))

    if ($remainingMs -le 0) {
        Close-Toast "dismiss"
    }
})

$form.Add_Shown({
    # WHY: raise z-order + deferred yield — keyboard returns without killing clicks.
    Show-ToastTopMost
    Schedule-ToastKeyboardYield
    $timer.Start()
})

$form.Add_FormClosed({
    $timer.Stop()
    $timer.Dispose()
    Clear-ThumbImage
})

try {
    [void][CwspToastWindow]::CaptureForeground()
    [void]$form.ShowDialog()
} catch {
    Write-ToastCrash ("ShowDialog: " + $_.Exception.Message)
    throw
}
