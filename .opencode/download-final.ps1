$dir = "C:\Users\Vina\Documents\Default Project\carousel-final"
$urls = @(
"https://export-download.canva.com/6ZY7Q/DAHaHO6ZY7Q/-1/0/0001-2534921989819381262.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAQYCGKMUH4R7NKVBA%2F20261106%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20261106T034312Z&X-Amz-Expires=14307&X-Amz-Signature=1ddf6a1a57f6c4f8dfe5e0137318b4fb920e50b9fb0d0571c5444fcb2a9dc511&X-Amz-SignedHeaders=host%3Bx-amz-expected-bucket-owner&response-expires=Fri%2C%2006%20Nov%202026%2007%3A41%3A39%20GMT",
"https://export-download.canva.com/6ZY7Q/DAHaHO6ZY7Q/-1/0/0002-2534921989819381262.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAQYCGKMUH4R7NKVBA%2F20261105%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20261105T183801Z&X-Amz-Expires=46278&X-Amz-Signature=a2db328e00bfcc51033fae27649f92f77bcdd633b2f9f5ad4923d5a2514ab9ba&X-Amz-SignedHeaders=host%3Bx-amz-expected-bucket-owner&response-expires=Fri%2C%2006%20Nov%202026%2007%3A29%3A19%20GMT",
"https://export-download.canva.com/6ZY7Q/DAHaHO6ZY7Q/-1/0/0003-2534921989819381262.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAQYCGKMUH4R7NKVBA%2F20261105%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20261105T062640Z&X-Amz-Expires=90761&X-Amz-Signature=0b35223a542fd28b04d65bb3ce8cb6935d88b42841d2540f27684c925c81fa1b&X-Amz-SignedHeaders=host%3Bx-amz-expected-bucket-owner&response-expires=Fri%2C%2006%20Nov%202026%2007%3A39%3A21%20GMT",
"https://export-download.canva.com/6ZY7Q/DAHaHO6ZY7Q/-1/0/0004-2534921989819381262.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAQYCGKMUH4R7NKVBA%2F20261105%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20261105T184544Z&X-Amz-Expires=45600&X-Amz-Signature=0e350bc71b77341956de483dd33451c7566829aee915335f8e3879fc54b8945c&X-Amz-SignedHeaders=host%3Bx-amz-expected-bucket-owner&response-expires=Fri%2C%2006%20Nov%202026%2007%3A25%3A44%20GMT",
"https://export-download.canva.com/6ZY7Q/DAHaHO6ZY7Q/-1/0/0005-2534921989819381262.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAQYCGKMUH4R7NKVBA%2F20261106%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20261106T014749Z&X-Amz-Expires=20453&X-Amz-Signature=8314ffe276c60609abc0ce36260cc09ff56e6e000d26c2837c15691af5cdca40&X-Amz-SignedHeaders=host%3Bx-amz-expected-bucket-owner&response-expires=Fri%2C%2006%20Nov%202026%2007%3A28%3A42%20GMT",
"https://export-download.canva.com/6ZY7Q/DAHaHO6ZY7Q/-1/0/0006-2534921989819381262.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAQYCGKMUH4R7NKVBA%2F20261105%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20261105T235425Z&X-Amz-Expires=28062&X-Amz-Signature=7a2a2e17135b81706129a74eef6abdc9a50bf9c2fc08e731d1c098b20bde6763&X-Amz-SignedHeaders=host%3Bx-amz-expected-bucket-owner&response-expires=Fri%2C%2006%20Nov%202026%2007%3A42%3A07%20GMT"
)
$names = @("01-hook.png","02-problem.png","03-mind-reading.png","04-solution.png","05-result.png","06-cta.png")
for ($i=0; $i -lt 6; $i++) {
  $tmp = "$dir\tmp-$($names[$i])"
  $ok = $false; $len = 0
  for ($try=0; $try -lt 3 -and -not $ok; $try++) {
    curl.exe -s -o $tmp $urls[$i]
    if (Test-Path $tmp) {
      $len = (Get-Item $tmp).Length
      $bytes = [System.IO.File]::ReadAllBytes($tmp)
      if ($len -gt 100000 -and $bytes[0] -eq 137 -and $bytes[1] -eq 80) { $ok = $true }
    }
    if (-not $ok) { Start-Sleep -Seconds 2 }
  }
  if ($ok) { Move-Item -Force $tmp "$dir\$($names[$i])"; Write-Output "OK   $($names[$i]) $len" }
  else { Write-Output "FAIL $($names[$i]) $len" }
}
