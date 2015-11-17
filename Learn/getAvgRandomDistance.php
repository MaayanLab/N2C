<?php

$sel = $_GET["sel"];
$width = $_GET["width"];

if (is_numeric($width)){
	$locationDistribution = $_SERVER['DOCUMENT_ROOT']."/N2C/N2Cv3/Distributions/distribution(" . $width . ")_dict.json";
	$distribution = json_decode(file_get_contents($locationDistribution));
	$dict = $distribution -> $sel;
	echo $dict[0];
}
	
?>