Add-Type -AssemblyName System.Runtime.WindowsRuntime
$null = [Windows.Media.Ocr.OcrEngine, Windows.Foundation, ContentType=WindowsRuntime]
$null = [Windows.Graphics.Imaging.BitmapDecoder, Windows.Foundation, ContentType=WindowsRuntime]
$null = [Windows.Storage.StorageFile, Windows.Foundation, ContentType=WindowsRuntime]
$asTaskGeneric = ([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1' })[0]
function Await($WinRtTask, $ResultType) { $asTask=$asTaskGeneric.MakeGenericMethod($ResultType); $t=$asTask.Invoke($null,@($WinRtTask)); $t.Wait(-1)|Out-Null; $t.Result }
$engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromUserProfileLanguages()
$files = Get-ChildItem 'C:\Users\Vina\Downloads\project carousel\references' -File
foreach ($f in $files) {
  Write-Output "`n=== $($f.Name)"
  $file = Await ([Windows.Storage.StorageFile]::GetFileFromPathAsync($f.FullName)) ([Windows.Storage.StorageFile])
  $stream = Await ($file.OpenAsync([Windows.Storage.FileAccessMode]::Read)) ([Windows.Storage.Streams.IRandomAccessStream])
  $decoder = Await ([Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream)) ([Windows.Graphics.Imaging.BitmapDecoder])
  $bitmap = Await ($decoder.GetSoftwareBitmapAsync()) ([Windows.Graphics.Imaging.SoftwareBitmap])
  $result = Await ($engine.RecognizeAsync($bitmap)) ([Windows.Media.Ocr.OcrResult])
  foreach ($line in $result.Lines) {
    $r = $line.Words[0].BoundingRect
    $maxH = ($line.Words | ForEach-Object { $_.BoundingRect.Height } | Measure-Object -Maximum).Maximum
    Write-Output ("{0,5:N0},{1,5:N0}  h={2,3:N0}  {3}" -f $r.X, $r.Y, $maxH, $line.Text)
  }
  $stream.Dispose()
}
