# Verificação ponta a ponta — Preservando as Memórias
# Roda contra o servidor de dev em http://localhost:3001

$ErrorActionPreference = "Continue"
$base = "http://localhost:3001"
$ok = 0; $falhou = 0

function Test-Caso($nome, $esperado, $bloco) {
  try {
    $real = & $bloco
    if ($real -eq $esperado) {
      Write-Host ("  [OK]    {0,-52} {1}" -f $nome, $real) -ForegroundColor Green
      $script:ok++
    } else {
      Write-Host ("  [FALHA] {0,-52} esperado={1} real={2}" -f $nome, $esperado, $real) -ForegroundColor Red
      $script:falhou++
    }
  } catch {
    Write-Host ("  [ERRO]  {0,-52} {1}" -f $nome, $_.Exception.Message.Substring(0,[Math]::Min(60,$_.Exception.Message.Length))) -ForegroundColor Red
    $script:falhou++
  }
}

function Get-Status($url, $sessao = $null) {
  try {
    $p = @{ Uri = "$base$url"; MaximumRedirection = 0; TimeoutSec = 90; ErrorAction = "Stop" }
    if ($sessao) { $p.WebSession = $sessao }
    (Invoke-WebRequest @p).StatusCode
  } catch {
    $s = $_.Exception.Response.StatusCode.value__
    if ($s) { $s } else { throw }
  }
}

function New-Sessao($url, $corpo) {
  $s = New-Object Microsoft.PowerShell.Commands.WebRequestSession
  Invoke-WebRequest -Uri "$base$url" -Method POST -Body ($corpo | ConvertTo-Json) `
    -ContentType "application/json" -WebSession $s -TimeoutSec 120 | Out-Null
  $s
}

Write-Host "`n=== 1. PAGINAS PUBLICAS ===" -ForegroundColor Cyan
foreach ($r in @("/", "/login", "/cadastro", "/criar-memorial", "/planos", "/sobre", "/faq", "/contato", "/funeraria/login", "/funeraria/cadastro")) {
  Test-Caso "GET $r" 200 { Get-Status $r }
}

Write-Host "`n=== 2. SEGURANCA: rotas protegidas sem sessao ===" -ForegroundColor Cyan
Test-Caso "offer-links anonimo bloqueado"        401 { Get-Status "/api/admin/offer-links" }
Test-Caso "painel do dono redireciona"           307 { Get-Status "/painel" }
Test-Caso "dashboard da funeraria redireciona"   307 { Get-Status "/funeraria/dashboard" }
Test-Caso "dashboard do familiar redireciona"    307 { Get-Status "/dashboard" }

Write-Host "`n=== 3. SEGURANCA: cookie de funeraria forjado ===" -ForegroundColor Cyan
Test-Caso "sessao forjada rejeitada" 401 {
  $json = '{"funeralHomeId":"7c160672-ea70-4eb2-912c-92689b79d840","email":"contato@saojorge.exemplo.com","name":"x"}'
  $s = New-Object Microsoft.PowerShell.Commands.WebRequestSession
  $s.Cookies.Add((New-Object System.Net.Cookie("funeral_session", [System.Uri]::EscapeDataString($json), "/", "localhost")))
  Get-Status "/api/funeral-auth/me" $s
}

Write-Host "`n=== 4. FAMILIAR: cadastro -> login ===" -ForegroundColor Cyan
$emailNovo = "e2e.familiar+$(Get-Random)@exemplo.com"
Test-Caso "cadastro cria conta" 201 {
  $s = New-Object Microsoft.PowerShell.Commands.WebRequestSession
  (Invoke-WebRequest -Uri "$base/api/auth/register" -Method POST -WebSession $s -TimeoutSec 120 `
    -Body (@{ name="E2E Teste"; email=$emailNovo; password="SenhaTeste123!" } | ConvertTo-Json) `
    -ContentType "application/json").StatusCode
}
Test-Caso "login logo apos o cadastro" 200 {
  (New-Sessao "/api/auth/login" @{ email=$emailNovo; password="SenhaTeste123!" }) | Out-Null
  200
}
Test-Caso "senha errada rejeitada" 401 {
  try {
    Invoke-WebRequest -Uri "$base/api/auth/login" -Method POST -TimeoutSec 120 -ErrorAction Stop `
      -Body (@{ email=$emailNovo; password="ErradaTotal999" } | ConvertTo-Json) -ContentType "application/json" | Out-Null
    200
  } catch { $_.Exception.Response.StatusCode.value__ }
}

Write-Host "`n=== 5. FAMILIAR: criar memorial persiste ===" -ForegroundColor Cyan
$sFam = New-Sessao "/api/auth/login" @{ email=$emailNovo; password="SenhaTeste123!" }

# Fora do Test-Caso: passar o id entre scriptblocks aninhados é frágil.
$respCriacao = Invoke-WebRequest -Uri "$base/api/memorials" -Method POST -WebSession $sFam -TimeoutSec 180 `
  -Body (@{ name="Ana Rodrigues"; biography="Professora por 35 anos na rede publica."; city="Santos"; epitaph="Ensinou geracoes." } | ConvertTo-Json) `
  -ContentType "application/json"
$memorialId = ($respCriacao.Content | ConvertFrom-Json).memorial.id

Test-Caso "POST /api/memorials" 201 { $respCriacao.StatusCode }
Test-Caso "memorial aparece na listagem do dono dele" $true {
  $lista = (Invoke-WebRequest -Uri "$base/api/memorials" -WebSession $sFam -TimeoutSec 120).Content |
    ConvertFrom-Json
  [bool]($lista.memorials | Where-Object { $_.id -eq $memorialId })
}
Test-Caso "outro familiar NAO ve esse memorial" $true {
  $sOutro = New-Sessao "/api/auth/login" @{ email="teste.familiar+1518160414@exemplo.com"; password="SenhaTeste123!" }
  $lista = (Invoke-WebRequest -Uri "$base/api/memorials" -WebSession $sOutro -TimeoutSec 120).Content |
    ConvertFrom-Json
  -not ($lista.memorials | Where-Object { $_.id -eq $memorialId })
}

Write-Host "`n=== 6. FUNERARIA ===" -ForegroundColor Cyan
$sFun = $null
Test-Caso "login da funeraria" 200 {
  $script:sFun = New-Sessao "/api/funeral-auth/login" @{ email="contato@saojorge.exemplo.com"; password="SenhaFuneraria123!" }
  200
}
Test-Caso "GET /api/funeral-auth/me com sessao real" 200 { Get-Status "/api/funeral-auth/me" $script:sFun }

Write-Host "`n=== 7. DONO ===" -ForegroundColor Cyan
$sDono = New-Sessao "/api/auth/login" @{ email="dono.teste@exemplo.com"; password="SenhaDono123!" }
Test-Caso "dono altera preco"            200 {
  (Invoke-WebRequest -Uri "$base/api/platform-config" -Method PATCH -WebSession $sDono -TimeoutSec 120 `
    -Body (@{ target="prices"; familyMemorialPriceCents=13900; funeralHomeMemorialPriceCents=5900 } | ConvertTo-Json) `
    -ContentType "application/json").StatusCode
}
Test-Caso "dono le offer-links"          200 { Get-Status "/api/admin/offer-links" $sDono }
Test-Caso "familiar NAO altera preco"    403 {
  try {
    Invoke-WebRequest -Uri "$base/api/platform-config" -Method PATCH -WebSession $sFam -TimeoutSec 120 -ErrorAction Stop `
      -Body (@{ target="prices"; familyMemorialPriceCents=100 } | ConvertTo-Json) -ContentType "application/json" | Out-Null
    200
  } catch { $_.Exception.Response.StatusCode.value__ }
}

Write-Host "`n=== 8. MEMORIAL PUBLICO ===" -ForegroundColor Cyan
Test-Caso "pagina do memorial abre" 200 { Get-Status "/memorial-publico?memorial=$memorialId" }

# Memorial ainda não pago não pode ser lido por anônimo — 404 é o correto aqui.
Test-Caso "memorial nao pago invisivel para anonimo" 404 { Get-Status "/api/memorials/$memorialId" }

# Já o memorial ativo é público, mas sem o endereço residencial da família.
$ativo = "2771cc02-e7d4-4470-bda7-11501722b9f4"
Test-Caso "memorial ativo e publico" 200 { Get-Status "/api/memorials/$ativo" }
Test-Caso "endereco de entrega NAO vaza no publico" $true {
  $r = (Invoke-WebRequest -Uri "$base/api/memorials/$ativo" -TimeoutSec 120).Content | ConvertFrom-Json
  $null -eq $r.memorial.deliveryAddress
}

Write-Host "`n──────────────────────────────────────────────" -ForegroundColor Cyan
Write-Host ("  PASSOU: {0}   FALHOU: {1}" -f $ok, $falhou) -ForegroundColor $(if ($falhou -eq 0) { "Green" } else { "Red" })
Write-Host "──────────────────────────────────────────────`n" -ForegroundColor Cyan
if ($memorialId) { Write-Host "memorial de teste: $memorialId" }
