# Download sample images from Unsplash into assets/img
# Run from repository root: powershell -ExecutionPolicy Bypass -File .\scripts\download-images.ps1

$images = @{
  'assets/img/hero.jpg' = 'https://source.unsplash.com/1600x900/?cctv,security';
  'assets/img/work-1.jpg' = 'https://source.unsplash.com/600x400/?security-camera,installation';
  'assets/img/work-2.jpg' = 'https://source.unsplash.com/600x400/?network,server-room';
  'assets/img/work-3.jpg' = 'https://source.unsplash.com/600x400/?tv,mounting';
}

foreach($pair in $images.GetEnumerator()){
  $dest = $pair.Key
  $url = $pair.Value
  try{
    # Some hosts (e.g. Unsplash) reject requests without a browser User-Agent. Send a common UA header.
    Invoke-WebRequest -Uri $url -OutFile $dest -Headers @{ 'User-Agent' = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } -ErrorAction Stop
    Write-Host "Downloaded $url -> $dest"
  }catch{
    Write-Host "Failed to download $url -> $dest : $_" -ForegroundColor Yellow
    # Fallback: try picsum.photos which serves placeholder images and usually allows programmatic downloads
    $fallback = switch ($dest) {
      'assets/img/hero.jpg' { 'https://picsum.photos/1600/900' }
      'assets/img/work-1.jpg' { 'https://picsum.photos/600/400?random=1' }
      'assets/img/work-2.jpg' { 'https://picsum.photos/600/400?random=2' }
      'assets/img/work-3.jpg' { 'https://picsum.photos/600/400?random=3' }
      default { 'https://picsum.photos/600/400' }
    }
    try{
      Invoke-WebRequest -Uri $fallback -OutFile $dest -Headers @{ 'User-Agent' = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } -ErrorAction Stop
      Write-Host "Downloaded fallback $fallback -> $dest"
    }catch{
      Write-Host "Fallback also failed for $dest : $_" -ForegroundColor Red
    }
  }
}

Write-Host "Done. Replace or resize images in assets/img/ as needed."