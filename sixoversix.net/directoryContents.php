<?php 

// acceptable parameters
$acceptableParams = array("articles");

$param = $_GET['dir'];
$ok = false;
foreach($acceptableParams as $current) {
	if(strtolower($param) == $current) {
		$ok = true;
		break;
	}
}

// invalid request
if($ok != true) {
	return;
}

// open this directory 
$dir = opendir($param);
$first = true;

$result = array();

// get each entry
while($file = readdir($dir)) {
    if (substr($file, 0, 1) != '.') {
		array_push($result, "$file");
    }
}

// close directory
closedir($dir);

echo json_encode ($result);

?>