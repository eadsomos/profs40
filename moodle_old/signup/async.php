<?php 
    require_once('../config.php');
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
			$municipio = $_REQUEST['municipio'];
			
              $escolas = $DB->get_records_sql('SELECT DISTINCT desc_nome,id 
			  									FROM {escola} 
												WHERE endereco_bairro = ? 
												AND municipio = "'.$municipio.'"',array($_POST['value']));
			
				foreach($escolas as $escola){
					$esc[] = array(
					  'nomeEscola' => $escola->desc_nome,
					  'idEscola' => $escola->id
					);
				  }
              	echo json_encode($esc);
              break;
			
        case 'codigo':
             if(!$_POST['value']){
                 echo 'Coloque um valor válido';
                 break;
             }
             $enrol = $DB->get_record('enrol',array('password'=>$_POST['value'],'courseid'=>$_POST['courseid']));
             $count = $DB->count_records('user_enrolments',array('enrolid'=>$enrol->id));
             if(!$enrol){
                 echo 'Código Inválido';
                 break;
             }
            
             if ($enrol->enrolstartdate != 0 and $enrol->enrolstartdate > time()) {
                 echo 'Vagas ainda não disponíveis';
                 break;
             }

             if ($enrol->enrolenddate != 0 and $enrol->enrolenddate < time()) {
                 echo 'Vagas Encerradas';
                 break;
             }

             if (!$enrol->customint6) {
                echo 'Não permitido';
                break;
             }
             if ($enrol->customint3 == $count) {
                echo 'Vagas encerradas';
                break;
             }
             
             echo 'ok';
             break;
			
        case 'bairro':
            $bairros = $DB->get_records_sql('SELECT DISTINCT endereco_bairro FROM {escola} WHERE municipio = ?', array($_POST['value']));
            
			foreach($bairros as $bairro){
				$bair[] = array(
				  'bairroNome' => $bairro->endereco_bairro
				);
              }
              echo json_encode($bair);
			
            break;
			
        case 'senha':
            break;       
             
    }
    
     

?>