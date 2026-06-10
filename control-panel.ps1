# control-panel.ps1
# Panel de control interactivo para iniciar/apagar servicios de SI-2

$services = @(
    @{
        Name = "Backend Logistica (Puerto 3000)"
        Path = "backend"
        Cmd = "npm.cmd"
        Args = "run start:dev"
        Process = $null
        Running = $false
    },
    @{
        Name = "Backend Compras (Puerto 4000)"
        Path = "..\si2-backend\purchasing_module"
        Cmd = "npm.cmd"
        Args = "run start:dev"
        Process = $null
        Running = $false
    },
    @{
        Name = "Frontend Next (Puerto 3001)"
        Path = "frontend-next"
        Cmd = "npm.cmd"
        Args = "run dev"
        Process = $null
        Running = $false
    },
    @{
        Name = "Frontend Original (Puerto 3002)"
        Path = "frontend"
        Cmd = "npm.cmd"
        Args = "run dev"
        Process = $null
        Running = $false
    }
)

function Start-ServiceInstance($index) {
    $svc = $services[$index]
    if ($svc.Running) {
        return
    }

    Write-Host "Iniciando $($svc.Name)..." -ForegroundColor Cyan
    
    # Abrir en nueva ventana Powershell para ver los logs
    $argList = "-NoExit", "-Command", "cd '$($svc.Path)'; $($svc.Cmd) $($svc.Args)"
    $proc = Start-Process powershell -ArgumentList $argList -PassThru -WindowStyle Normal
    
    $services[$index].Process = $proc
    $services[$index].Running = $true
}

function Stop-ServiceInstance($index) {
    $svc = $services[$index]
    if (-not $svc.Running) {
        return
    }

    Write-Host "Deteniendo $($svc.Name)..." -ForegroundColor Red
    
    if ($svc.Process) {
        try {
            # Usar taskkill /f /t para matar el proceso de Powershell y todos sus hijos (node.exe)
            taskkill /f /t /pid $svc.Process.Id | Out-Null
        } catch {
            Write-Host "Error al detener el proceso." -ForegroundColor Yellow
        }
    }
    
    $services[$index].Process = $null
    $services[$index].Running = $false
}

# Inicializar todos los servicios
Write-Host "=== INICIANDO TODOS LOS SERVICIOS DE SI-2 ===" -ForegroundColor Yellow
for ($i = 0; $i -lt $services.Count; $i++) {
    Start-ServiceInstance $i
}

# Loop del Menú
while ($true) {
    Clear-Host
    Write-Host "==================================================" -ForegroundColor Yellow
    Write-Host "      SI-2 PANEL DE CONTROL INTERACTIVO           " -ForegroundColor Yellow
    Write-Host "==================================================" -ForegroundColor Yellow
    Write-Host ""
    
    for ($i = 0; $i -lt $services.Count; $i++) {
        $svc = $services[$i]
        $status = if ($svc.Running) { "ENCENDIDO (PID: $($svc.Process.Id))" } else { "APAGADO" }
        $color = if ($svc.Running) { "Green" } else { "Red" }
        
        Write-Host "  $($i + 1). " -NoNewline
        Write-Host "$($svc.Name.PadRight(35)) -> " -NoNewline
        Write-Host $status -ForegroundColor $color
    }
    
    Write-Host "  5. APAGAR TODO Y SALIR" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "==================================================" -ForegroundColor Yellow
    Write-Host "Presiona el numero del servicio (1-4) para encenderlo o apagarlo,"
    Write-Host "o presiona 5 para apagar todo y salir..." -ForegroundColor Gray
    Write-Host ""
    Write-Host "Tu seleccion: " -NoNewline
    
    $key = [System.Console]::ReadKey($true)
    $char = $key.KeyChar
    
    if ($char -eq '5') {
        Write-Host "Cerrando todos los servicios..." -ForegroundColor Yellow
        for ($i = 0; $i -lt $services.Count; $i++) {
            Stop-ServiceInstance $i
        }
        break
    }
    
    if ($char -match '^[1-4]$') {
        $idx = [int][string]$char - 1
        if ($services[$idx].Running) {
            Stop-ServiceInstance $idx
        } else {
            Start-ServiceInstance $idx
        }
        Start-Sleep -Milliseconds 500
    }
}
