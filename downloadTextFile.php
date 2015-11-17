<?php

$fileName = $_GET["q"];

if (is_numeric($fileName)){
	header('Content-disposition: attachment; filename=analysis_results.txt');
	header('Content-type: application/download');
	header("Content-length: " . filesize($_SERVER['DOCUMENT_ROOT'] . "/N2C/PMZEA/pvalue/" . $fileName));
	$fp = fopen($_SERVER['DOCUMENT_ROOT'] . "/N2C/PMZEA/pvalue/" . $fileName, "r");
	fpassthru($fp);
	}

	
?>