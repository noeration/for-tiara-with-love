Add-Type -AssemblyName System.Runtime.WindowsRuntime
$null = [Windows.Media.Ocr.OcrEngine, Windows.Foundation, ContentType=WindowsRuntime]
$null = [Windows.Graphics.Imaging.BitmapDecoder, Windows.Foundation, ContentType=WindowsRuntime]
$null = [Windows.Storage.StorageFile, Windows.Foundation, ContentType=WindowsRuntime]
$asTaskGeneric = ([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1' })[0]
function Await($t,$rt){$m=$asTaskGeneric.MakeGenericMethod($rt);$x=$m.Invoke($null,@($t));$x.Wait(-1)|Out-Null;$x.Result}
$e=[Windows.Media.Ocr.OcrEngine]::TryCreateFromUserProfileLanguages()
$path = "C:\Users\Vina\Documents\Default Project\carousel-final\check7.png"
$f=Await ([Windows.Storage.StorageFile]::GetFileFromPathAsync($path)) ([Windows.Storage.StorageFile])
$s=Await ($f.OpenAsync([Windows.Storage.FileAccessMode]::Read)) ([Windows.Storage.Streams.IRandomAccessStream])
$d=Await ([Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($s)) ([Windows.Graphics.Imaging.BitmapDecoder])
$b=Await ($d.GetSoftwareBitmapAsync()) ([Windows.Graphics.Imaging.SoftwareBitmap])
$r=Await ($e.RecognizeAsync($b)) ([Windows.Media.Ocr.OcrResult])
foreach($l in $r.Lines){
  $rects=@($l.Words|%{$_.BoundingRect})
  $x=($rects|Measure-Object -Property X -Minimum).Minimum
  $y=($rects|Measure-Object -Property Y -Minimum).Minimum
  $x2=($rects|%{$_.X+$_.Width}|Measure-Object -Maximum).Maximum
  $y2=($rects|%{$_.Y+$_.Height}|Measure-Object -Maximum).Maximum
  Write-Output ("{0,5:N0} {1,5:N0} {2,5:N0} {3,4:N0}  {4}" -f $x,$y,($x2-$x),($y2-$y),$l.Text)
}
$s.Dispose()

