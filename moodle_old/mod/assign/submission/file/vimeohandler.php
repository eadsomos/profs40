<?php 

	require_once('../../../../config.php');
 	error_reporting(E_ALL);
   	ini_set('display_errors', 'on');
	header("Access-Control-Allow-Origin: *");
	$assign = $_REQUEST['idAssign'];
        $userid = $_REQUEST['idUser'];
	$lastupload = $DB->get_record('assign_vimeo',array('assign'=> $assign,'author'=>$DB->get_record('user',array('id'=>$userid))->username));
	if($lastupload){
		echo $lastupload->embed;
	}else{
		echo 'Não há registro desse usuário';
		die('error');	
	}
?>
