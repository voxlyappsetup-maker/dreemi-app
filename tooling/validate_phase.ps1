param(
  [switch]$StrictScope,
  [switch]$SkipBuild
)

$ErrorActionPreference = "Continue"
Set-StrictMode -Version Latest
$script:StepResults = @{}

function Write-Section([string]$Title) {
  Write-Host ""
  Write-Host "=== $Title ==="
}

function Run-Step {
  param(
    [string]$Name,
    [string]$Key,
    [scriptblock]$Command
  )

  Write-Section $Name
  $exitCode = 0
  try {
    & $Command
    $exitCode = if ($null -ne $LASTEXITCODE) { [int]$LASTEXITCODE } else { 0 }
  } catch {
    Write-Host "Step error: $($_.Exception.Message)"
    $exitCode = 1
  }
  if ($null -eq $exitCode) { $exitCode = 0 }
  $script:StepResults[$Key] = [int]$exitCode
  Write-Host "$Key exit code: $exitCode"
}

function Get-ChangedFiles {
  $changedFiles = @(git diff --name-only)
  $untrackedFiles = @(git ls-files --others --exclude-standard)
  $allChangedFiles = @($changedFiles) + @($untrackedFiles)
  $allChangedFiles = $allChangedFiles | Where-Object { $_ -and (Test-Path $_) } | Select-Object -Unique
  return ,$allChangedFiles
}

function Run-ChangedFileScan {
  param(
    [string[]]$Paths,
    [string]$Label,
    [string[]]$Patterns,
    [switch]$SimpleMatch
  )

  Write-Section $Label
  if ($Paths.Count -eq 0) {
    Write-Host "$Label skipped: no changed files"
    Write-Host "$Label exit code: 0"
    return 0
  }

  if ($SimpleMatch) {
    Select-String -Path $Paths -Pattern $Patterns -SimpleMatch
  } else {
    Select-String -Path $Paths -Pattern $Patterns -SimpleMatch:$false
  }
  $exitCode = $LASTEXITCODE
  if ($null -eq $exitCode) { $exitCode = 0 }
  Write-Host "$Label exit code: $exitCode"
  return [int]$exitCode
}

function Write-Summary {
  param(
    [bool]$StrictScopeFailure
  )

  Write-Section "Validation Summary"
  $hasFailure = $false
  foreach ($k in @("diff", "api-test", "test", "lint", "build")) {
    if ($script:StepResults.ContainsKey($k)) {
      if ($script:StepResults[$k] -is [array]) {
        Write-Host "internal validation error: StepResults[$k] is array"
        $hasFailure = $true
        continue
      }
      $v = [int]$script:StepResults[$k]
      Write-Host "$k exit code: $v"
      if ($v -ne 0) { $hasFailure = $true }
    }
  }

  if ($StrictScope) {
    if ($StrictScopeFailure) {
      Write-Host "strict scope result: FAILED"
      $hasFailure = $true
    } else {
      Write-Host "strict scope result: PASS"
    }
  } else {
    Write-Host "strict scope result: not enabled"
  }

  if ($hasFailure) {
    Write-Host "final result: FAILED"
    exit 1
  }

  Write-Host "final result: PASS"
  exit 0
}

$scriptPath = $MyInvocation.MyCommand.Path
$repoRoot = Resolve-Path (Join-Path (Split-Path -Parent $scriptPath) "..")
Set-Location $repoRoot

Write-Host "D3M Local Phase Validation Helper"
Write-Host "repository root: $repoRoot"
Write-Host "strict scope: $StrictScope"
Write-Host "skip build: $SkipBuild"

Write-Section "Repository Snapshot"
git status --short --branch --untracked-files=all
git log --oneline -8

Run-Step -Name "git diff --check" -Key "diff" -Command { git diff --check }
Write-Host "diff check exit code: $($script:StepResults["diff"])"

Run-Step -Name "pnpm --filter @dreemi/api test" -Key "api-test" -Command { pnpm.cmd --filter @dreemi/api test }
Write-Host "api test exit code: $($script:StepResults["api-test"])"

Run-Step -Name "pnpm test" -Key "test" -Command { pnpm.cmd test }
Write-Host "test exit code: $($script:StepResults["test"])"

Run-Step -Name "pnpm lint" -Key "lint" -Command { pnpm.cmd lint }
Write-Host "lint exit code: $($script:StepResults["lint"])"

if ($SkipBuild) {
  $script:StepResults["build"] = 0
  Write-Host "build skipped by -SkipBuild"
  Write-Host "build exit code: 0"
} else {
  Run-Step -Name "pnpm build" -Key "build" -Command { pnpm.cmd build }
  Write-Host "build exit code: $($script:StepResults["build"])"
}

Write-Section "No-Touch Scan (sensitive paths)"
$sensitiveDiff = @(git diff --name-only -- services apps prisma package.json pnpm-lock.yaml .env .env.local .env.example)
$sensitiveUntracked = @(git ls-files --others --exclude-standard -- services apps prisma package.json pnpm-lock.yaml .env .env.local .env.example)
Write-Host "sensitive diff paths:"
if ($sensitiveDiff.Count -gt 0) { $sensitiveDiff } else { Write-Host "(none)" }
Write-Host "sensitive untracked paths:"
if ($sensitiveUntracked.Count -gt 0) { $sensitiveUntracked } else { Write-Host "(none)" }

$strictScopeFailure = $false
if ($StrictScope) {
  $strictScopeFailure = ($sensitiveDiff.Count -gt 0) -or ($sensitiveUntracked.Count -gt 0)
}

$allChanged = Get-ChangedFiles
Write-Section "Changed files"
if ($allChanged.Count -gt 0) {
  $allChanged
} else {
  Write-Host "(none)"
}

# Exclude env files from scans.
$scanPaths = @($allChanged | Where-Object {
  $_ -notmatch '(^|[\\/])\.env($|[.])' -and
  $_ -ne ".env" -and
  $_ -ne ".env.local" -and
  $_ -ne ".env.example"
})

$mojibakePatterns = @(
  ([char]0xFFFD).ToString(), # replacement character
  ([char]0x00C3).ToString(), # latin-1 lead byte marker
  ([char]0x00C2).ToString(), # latin-1 continuation marker
  ([char]0x00E2).ToString()  # smart-quote lead marker
)
[void](Run-ChangedFileScan -Paths $scanPaths -Label "mojibake scan" -Patterns $mojibakePatterns -SimpleMatch)

$secretPatterns = @(
  'SUPABASE_SERVICE_ROLE_KEY=',
  'DATABASE_URL=',
  'DIRECT_URL=',
  'LEMON_SQUEEZY_API_KEY=',
  'PRIVATE_KEY=',
  '-----BEGIN',
  'actual secret',
  'API key value',
  'sk_live',
  'pk_live',
  'whsec_',
  'Bearer '
)
[void](Run-ChangedFileScan -Paths $scanPaths -Label "secret scan" -Patterns $secretPatterns -SimpleMatch)

Write-Summary -StrictScopeFailure:$strictScopeFailure
