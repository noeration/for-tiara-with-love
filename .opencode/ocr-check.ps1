Add-Type -AssemblyName System.Runtime.WindowsRuntime
$null = [Windows.Media.Ocr.OcrEngine, Windows.Foundation, ContentType=WindowsRuntime]
$null = [Windows.Graphics.Imaging.BitmapDecoder, Windows.Foundation, ContentType=WindowsRuntime]
$null = [Windows.Storage.StorageFile, Windows.Foundation, ContentType=WindowsRuntime]
$asTaskGeneric = ([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1' })[0]
function Await($t,$rt){$m=$asTaskGeneric.MakeGenericMethod($rt);$x=$m.Invoke($null,@($t));$x.Wait(-1)|Out-Null;$x.Result}
$e=[Windows.Media.Ocr.OcrEngine]::TryCreateFromUserProfileLanguages()
foreach ($n in @('01-hook.png','02-problem.png')) {
 Write-Output "`n=== $n"
 $f=Await ([Windows.Storage.StorageFile]::GetFileFromPathAsync("C:\Users\Vina\Documents\Default Project\carousel-proposal\wireframes-single\$n")) ([Windows.Storage.StorageFile])
 $s=Await ($f.OpenAsync([Windows.Storage.FileAccessMode]::Read)) ([Windows.Storage.Streams.IRandomAccessStream])
 $d=Await ([Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($s)) ([Windows.Graphics.Imaging.BitmapDecoder])
 $b=Await ($d.GetSoftwareBitmapAsync()) ([Windows.Graphics.Imaging.SoftwareBitmap])
 $r=Await ($e.RecognizeAsync($b)) ([Windows.Media.Ocr.OcrResult])
 foreach($l in $r.Lines){ Write-Output $l.Text }
 $s.Dispose()
}
