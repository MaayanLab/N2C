<?php
	ob_start('ob_gzhandler');
	//$number = @mysql_real_escape_string($_GET["number"]);
	$json = "";
	
	$dbh=@mysql_connect ("localhost", "maaya0_php", "phpscript") or die('Cannot connect to the database because: ' . mysql_error());
	mysql_select_db("maaya0_N2C") or die('Cannot connect to the database because: ' . mysql_error());;

	$q = "SELECT * FROM `JSON` WHERE id = '". @mysql_real_escape_string($_GET["number"]) ."';";
	$mysql_res = mysql_query($q);

	if (!$mysql_res) 
	{
		echo('Invalid query: ' . mysql_error());
	}		
	else
	{
		if(mysql_num_rows($mysql_res) > 0)
		{
			//add edges to dictionary
			while ($row = mysql_fetch_assoc($mysql_res)) 
			{
				$json .= $row["json"];
			}
		}
	}
	mysql_close($dbh);
	
	
	
	//header('Content-type: application/json');
	echo $json
	
?>