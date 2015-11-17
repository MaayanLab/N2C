<?php
	$name = $_POST["name"];
	$points = $_POST["score"];
	ob_start('ob_gzhandler');
	$json = array();
	
	$dbh=@mysql_connect ("localhost", "maaya0_score", "phpscript") or die('Cannot connect to the database because: ' . mysql_error());
	mysql_select_db("maaya0_N2C") or die('Cannot connect to the database because: ' . mysql_error());;

	$q = "INSERT INTO Scoreboard VALUES ('$name', $points)";	
	$mysql_res = mysql_query($q);

	$q = "SELECT * FROM Scoreboard ORDER BY score desc LIMIT 10";
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
				$json[] = array($row["name"], $row["score"]);
			}
		}
	}



	$q = "TRUNCATE userRanks";
	$mysql_res = mysql_query($q);
	
	if (!$mysql_res) 
	{
		echo('Invalid query: ' . mysql_error());
	}	

	$q = "INSERT INTO userRanks (user, points) SELECT * FROM Scoreboard ORDER BY score DESC";

	mysql_query($q);

	$q = "SELECT rank FROM userRanks WHERE user = '$name' AND points = $points";
	$mysql_res = mysql_query($q);
	

	if (!$mysql_res) 
	{
		echo('Invalid query: ' . mysql_error());
	}		
	else
	{
		while ($row = mysql_fetch_assoc($mysql_res))
		{
			$id = $row["rank"];
		}
	}

	$json[] =  $id;
	mysql_close($dbh);
	
	
	header('Content-type: application/json');
	echo json_encode($json);

?>