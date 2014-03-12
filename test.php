<?php 

$uber = file_get_contents('https://www.uber.com/');
$domain = "https://www.uber.com";
$uber = preg_replace("/(href|src)\=\"([^(http)])(\/)?/", "$1=\"$domain$2", $uber);

echo $uber;

?>