<?php

$fileContents = $_POST["string"];
$fileName = $_POST["random"];

$fh = fopen($_SERVER['DOCUMENT_ROOT'] . "/N2C/PMZEA/pvalue/" . $fileName, "w") or die("Cannot open file.");
fwrite($fh, $fileContents);
fclose($fh)

?>