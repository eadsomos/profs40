<?php 
    require_once('../../../../config.php');
    global $DB;
    switch($_POST['method']){
        case 'estado':
              $estado = $DB->get_record('estado',array('uf'=>$_POST['value']));
              $cidades = $DB->get_records_sql("SELECT id, nome FROM {cidade} WHERE estado = ? ",array($estado->id));
              foreach($cidades as $cidade){
				$cid[] = array(
				  'name' => $cidade->nome,
				  'id' => $cidade->id
				);
              }
              echo json_encode($cid);
              break;
              
        case 'escola':
              $escolas = $DB->get_records_sql("SELECT @curRank := @curRank + 1 AS rank, desc_nome, id FROM (SELECT @curRank := 0) r, {escola} WHERE municipio = ? ",array($_POST['value']));
              
				foreach($escolas as $escola){
					$esc[] = array(
					  'nomeEscola' => $escola->desc_nome,
					  'idEscola' => $escola->id
					);
				  }

			
			  echo json_encode($esc);
			
              break; 
    }
    
     

?>