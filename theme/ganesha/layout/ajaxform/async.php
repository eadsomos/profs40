<?php 
    require_once('../config.php');
    global $DB;
    switch($_POST['method']){
        case 'estado':
              $estado = $DB->get_record('estado',array('uf'=>$_POST['value']));
              $cidades = $DB->get_records_sql("SELECT nome FROM {cidade} WHERE estado = ? ",array($estado->id));
              $return = array();
              foreach($cidades as $cidade){
                  $return[] = $cidade->nome;
              }
              echo json_encode($return);
              break;
              
        case 'escola':
              $escolas = $DB->get_records_sql("SELECT DISTINCT desc_nome,endereco FROM {escola} WHERE endereco_bairro = ? ",array($_POST['value']));
              
              echo json_encode($escolas);
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
            $return = array();
            foreach($bairros as $bairro){
                $return[] = $bairro->endereco_bairro;
            }
            echo json_encode($return);
            break;
        case 'senha':
            break;       
             
    }
    
     

?>