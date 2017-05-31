<?php 
	require_once('../../../../config.php');
    
    global $DB, $USER;
	
	$user = $DB->get_record('user', array('id' => $USER->id));
	$validacase = FALSE;
	$email = $user->email;
	$estado = $_POST['estado'];
	$cidade = $_POST['cidade'];
	$escola = $_POST['escola'];
	$segmento = $_POST['segmento'];
	$cpf = $_POST['cpf'];
	$user->auth = 'manual';
	$user->confirmed = 1;
	$user->mnethostid = 1;
	$user->username = $email;
	$user->country = 'BR';
	$user->city = $cidade;
	$success = $DB->update_record('user', $user);
	
	
	$escoladata = new stdClass();
	$escoladata->fieldid = 2;
	$escoladata->userid = $user->id;
	$escoladata->data = $escola;
	$escoladata->dataformat = 0;
	$hasScholl = $DB->get_record('user_info_data',array('fieldid'=>2,'userid'=>$user->id));
	if($hasScholl){
		$escoladata->id = $hasScholl->id;
		$scsuccess = $DB->update_record('user_info_data',$escoladata);    
	}else{
		$escoladataid = $DB->insert_record('user_info_data',$escoladata);
	}


	$idescoladb = $DB->get_record_sql("SELECT @curRank := @curRank + 1 AS rank, id FROM (SELECT @curRank := 0) r, {escola} WHERE desc_nome = ? ",array($escoladata->data));


	$escolaid = new stdClass();
	$escolaid->fieldid = 5;
	$escolaid->userid = $user->id;
	$escolaid->data = $idescoladb->id;
	$escolaid->dataformat = 0;
	
	$hasIdScholl = $DB->get_record('user_info_data',array('fieldid'=>5,'userid'=>$user->id));
	if($hasIdScholl){
		$escolaid->id = $hasIdScholl->id;
		$scsuccess = $DB->update_record('user_info_data',$escolaid);    
	}else{
		$escoladataid = $DB->insert_record('user_info_data',$escolaid);
	}




	$cpfdata = new stdClass();
	$cpfdata->userid = $user->id;
	$cpfdata->fieldid = 1;
	$cpfdata->data = $cpf;
	$cpfdata->dataformat = 0;
	echo '<pre>';
	$hasCpf = $DB->get_record('user_info_data',array('fieldid'=>1,'userid'=>$user->id));
	if($hasCpf){
		$cpfdata->id = $hasCpf->id;
		$cpfsuccess = $DB->update_record('user_info_data',$cpfdata);    
	}else{
		 $cpfdataid = $DB->insert_record('user_info_data',$cpfdata);
	}
	

	$ufdata = new stdClass();
	$ufdata->userid = $user->id;
	$ufdata->fieldid = 3;
	$ufdata->data = $estado;
	$ufdata->dataformat = 0;
	$hasufdata = $DB->get_record('user_info_data',array('fieldid'=>3,'userid'=>$user->id));
	if($hasufdata){
		$ufdata->id = $hasufdata->id;
		$ufsuccess = $DB->update_record('user_info_data',$ufdata);    
	}else{
		 $ufdataid = $DB->insert_record('user_info_data',$ufdata);
	}

	$segmentodata = new stdClass();
	$segmentodata->userid = $user->id;
	$segmentodata->fieldid = 7;
	$segmentodata->data = $segmento;
	$segmentodata->dataformat = 0;
	 $hassegmentodata = $DB->get_record('user_info_data',array('fieldid'=>7,'userid'=>$user->id));
	if($hassegmentodata){
		$segmentodata->id = $hassegmentodata->id;
		$segmentosuccess = $DB->update_record('user_info_data',$segmentodata);    
	}else{
		 $segmentodataid = $DB->insert_record('user_info_data',$segmentodata);
	}

	header("location:sucess.php"); 
            
  

?>