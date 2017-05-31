<?php 
    require_once('../../../../config.php');
    global $DB;
    $estado = $DB->get_record('estado',array('uf'=>$_POST['value']));
    $escolas = $DB->get_records_sql("SELECT desc_nome FROM {escola} WHERE uf = ? ",array($estado->uf));
    $return = array();
    foreach($escolas as $escola){
        $return[] = $escola->desc_nome;
    }
    echo json_encode($return);
              
    
    
?>