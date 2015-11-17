<?php

$number = $_POST["number"];

if (is_numeric($number)){
	$locationJSON = $_SERVER['DOUCMENT_ROOT']."/N2C/N2Cv3/JSON/"
	$locationGMT = $_SERVER['DOUCMENT_ROOT']."/N2C/N2Cv3/GMT/".
	switch ($number) { 
		case 0:
			//KK Direct
			$JSON= json_decode(file_get_contents($locationJSON . "KK_Direct.json"), true);
			$GMT= json_decode(file_get_contents($locationGMT . "KEA_GMT.json"), true);
			
			break;
		case 1:
			//KK Substrate
			$JSON= json_decode(file_get_contents($locationJSON . "SimilarSubstrateKK.json"), true);
			$GMT= json_decode(file_get_contents($locationGMT . "KEA_GMT.json"), true);
			break;

	}

	
?>