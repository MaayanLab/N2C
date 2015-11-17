<?php
	$dbh=mysql_connect ("localhost", "maaya0_php", "phpscript") or die('Cannot connect to the database because: ' . mysql_error());
	mysql_select_db ("maaya0_D2N");
	$res = array();
	$mysql_res = query($_POST["prop"]);
	if($mysql_res != FALSE && mysql_num_rows($mysql_res) > 0)
	{
		while ($row = mysql_fetch_assoc($mysql_res)) 
			$res[]=$row["drug"];
		echo json_encode($res);
	}
	else
	{
		$mysql_res = query(str_replace("Atc-", "", $_POST["prop"])); //atc prefix is listed in browse but set name doesn't include prefix
		if($mysql_res != FALSE && mysql_num_rows($mysql_res) > 0)
		{
			while ($row = mysql_fetch_assoc($mysql_res)) 
				$res[]=$row["drug"];
			echo json_encode($res);
		}
		echo "";
	}
	mysql_close();
		
	//---------------------------------
	//       FUNCTIONS
	//---------------------------------
	function query ($p)
	{
		
		$query = "SELECT DISTINCT(drug) FROM `GMT` WHERE `set` = \"". mysql_real_escape_string($p) . "\";";

		$result = mysql_query($query);
		if (!$result) 
		{
			echo('Invalid query: ' . mysql_error());
		}		
		return $result;
	}

?>
