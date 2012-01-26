<?php
//call the passed in function
//Allowing crosss-domain API request
header('Access-Control-Allow-Origin: *');
if(isset($_GET['method']) && !empty($_GET['method']))
{
	if(function_exists($_GET['method']))
	{
		$_GET['method']();
	}
}

//connect to db
function connect()
{
	//demonstrating the localhost connection
	$con=mysql_connect("<username>","<password>","") or die(mysql_error());
	//selecting the db
	$db=mysql_select_db("<your dbname>",$con);
	return $con;
}


//executing the query and returning the result
function executeQuery($query,$mid_flag)
{
	$con=connect();
	$data=mysql_query($query,$con);
	$result=array();
	$count = 0;
	while($row=mysql_fetch_row($data))
	{
		$result[]=$row;
	}
	mysql_close($con);
	return $result;
}

function executeQuery1($query,$ids,$mids)
{
	$con=connect();
	$data=mysql_query($query,$con);
	$result=array();
	$count = 0;
	//Loop until the count of localstorage ids
	while($count < count($ids) && $row=mysql_fetch_row($data))
	{
		$databaseid = $row[1];
		$messageid = $row[0];
		//echo $messageid." ".$mids[$count]." ".$ids[$count]." ".$databaseid."<br>";
		if(strcmp($messageid,$mids[$count])==0 && strcmp($ids[$count],$databaseid)<0)
		{
			$result[]=$row;
		}
		$count++;
	}
	//For new data ...not in local storage..put everything into result
	while($row=mysql_fetch_row($data))
	{
		$result[]=$row;
		$count++;
	}
	mysql_close($con);
	return $result;
}

//methods
function getMajorUpdates()
{
	$updates=executeQuery("select updates from majorupdate",0);
	$key=array("updates");
	$result=customize_json_encode($updates,$key);
	echo json_encode($result);
}

function customize_json_encode($array,$keyArray)
{
	$resultArray=array();
	$result=array();
	for($i=0;$i<count($array);$i++)
	{
		for($j=0;$j<count($array[$i]);$j++)
		{
			$result[$keyArray[$j]]=$array[$i][$j];
		}
		$resultArray[$i]=$result;
	}
	return $resultArray;
}

function getGuestLectures()
{
	$lectures=executeQuery("select url,description from image_text",0);
	$key=array("url","description");
	$result=customize_json_encode($lectures,$key);
	echo json_encode($result);
}

function getLatestUpdates()
{
	$updateId = $_GET['updateid'];
	$mids=$_GET['messageid'];
	if(isset($_GET['updateid']))
	{
		$updateId = $_GET['updateid'];
		if(isset($_GET['messageid']))
			$mids=$_GET['messageid'];
		else
			$updateId=-1;
	}
	if($updateId != -1)
	{
		//just allowing valid format to be processed in API request
		if(!(preg_match_all("/[0-9_]/",$updateId,$out)==strlen($updateId) && preg_match_all("/[0-9_]/",$mids,$out)==strlen($mids)))
		$updates=executeQuery("select mid,updateversion,updateheading,updates,link from latestupdates",1);
		else
		{
			$ids = explode("_",$updateId);
			$mids=explode("_",$mids);
			$updates=executeQuery1("select mid,updateversion,updateheading,updates,link from latestupdates order by mid asc",$ids,$mids);
		}
	}
	else 
	{
		$updates=executeQuery("select mid,updateversion,updateheading,updates,link from latestupdates",1);
	}
	$key=array("messageid","id","heading","update","url");
	$result=customize_json_encode($updates,$key);
	echo json_encode($result);
}

?>
