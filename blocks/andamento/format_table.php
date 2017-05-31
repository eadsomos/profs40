<?php 
    require_once(__DIR__ . '/../../config.php');
    require_once('variables.php');
    global $DB;
    $return = array();
    $sql = new stdClass();
    $sql->select = 'SELECT';
    $sql->defaultSelect = 'SELECT';
    $sql->from = 'FROM';
    $sql->defaultFrom = 'FROM';
    $sql->where = 'WHERE';
    $sql->defaultWhere = 'WHERE';
    switch($_POST['function']){
        case 'update':
            $_SESSION['USERSIDS'] = set_users_ids($sql);
            echo json_encode($_SESSION['USERSIDS']);
            break;    
       case 'alunosTable':
            $escola = $_POST['escola'];
            $disciplina = $_POST['disciplina'];
            $alunos = $DB->get_records_sql('SELECT @curRank := @curRank + 1 AS rank, u.firstname, u.lastname, u.email,DATE_FORMAT(FROM_UNIXTIME(u.lastaccess), "%d/%m/%Y") AS last, u.lastaccess, ui.data, c.fullname, cc.timecompleted FROM (SELECT @curRank := 0) r, {user} AS u INNER JOIN {user_info_data} AS ui ON u.id = ui.userid INNER JOIN {user_enrolments} AS ue ON ue.userid = u.id INNER JOIN {enrol} AS en ON en.id = ue.enrolid INNER JOIN {course} AS c ON en.courseid = c.id INNER JOIN {course_completions} AS cc ON cc.userid = u.id WHERE u.id IN ('.implode(",",$_SESSION['USERSIDS']).') AND ui.fieldid = '.$_SESSION['FIELDIDS']['segmento'].' AND c.id = '.$disciplina.' AND cc.course = '.$disciplina.'',array());
            $return = '';
            foreach($alunos as $aluno){
                $return .= '<tr><td>'.$aluno->firstname.'</td><td>'.$aluno->lastname.'</td><td>'.$aluno->email.'</td><td>'.$escola.'</td><td>'.$aluno->fullname.'</td><td>'.$aluno->data.'</td><td>'.$aluno->last.'</td>';
                if(!empty($aluno->timecompleted)){
                    $return .= '<td>Concluído</td>';
                }else{
                    if($aluno->lastaccess < strtotime("-14 day")){
                        $return .= '<td>Em Risco</td>';
                    }
                    if($aluno->lastaccess >= strtotime("-14 day")){
                        $return.= '<td>Em Curso</td>';
                    } 
                }
                $return .='</tr>';
                        
            }
            echo $return;
            break;

       case 'etapasTable':
            $escola = $_POST['escola'];
            $disciplina = $_POST['disciplina'];
            $return = array();
            $idQuiz = $DB->get_records_sql('SELECT id FROM {quiz} WHERE course = '.$disciplina,array());
            foreach($idQuiz as $id){
                $return[] = $id->id;
            }
            $quizTotal = count($return);
            $quizes = $DB->get_records_sql('SELECT @curRank := @curRank + 1 AS rank, u.id ,qg.grade,qg.quiz,u.firstname, u.lastname, u.email,DATE_FORMAT(FROM_UNIXTIME(u.lastaccess), "%d/%m/%Y") AS last FROM(SELECT @curRank := 0) r, {quiz_grades} AS qg JOIN {user} AS u ON qg.userid = u.id WHERE u.id IN('.implode(",",$_SESSION['USERSIDS']).') AND qg.quiz IN ('.implode(",",$return).')',array());
            $quizes = json_encode($quizes);
            $quizes = json_decode($quizes,true);
            $quizes = array_group_by($quizes,'id');
            /*echo '<pre>';
            print_r($quizes);
            exit(0);*/
            $maximum = 0;
            foreach($quizes as $quiz){
                if(count($quiz) > $maximum){
                    $maximum = count($quiz);
                }
            }
            $return = '<table class="table-responsive" id="etapas_table"><thead><th>Nome</th><th>Sobrenome</th><th>Email</th><th>Último Acesso</th>';
            for($i = 1; $i <= $maximum ; $i++){
                $return .= '<th>Etapa '.$i.'</th>';
            }
            $return .= '</thead><tbody>';
            foreach ($quizes as $quiz) {
                $return .= '<tr>';
                $return .= '<td>'.$quiz[0]['firstname'].'</td><td>'.$quiz[0]['lastname'].'</td><td>'.$quiz[0]['email'].'</td><td>'.$quiz[0]['last'].'</td>';
                $cont = $maximum;
                for($i = 1; $i <= $maximum; $i++){
                    if($cont > count($quiz)){
                        $return .= '<td>Concluído</td>';
                        $cont--;
                    }else{
                        $return .= '<td>Não Concluído</td>';
                    }
                    
                }
                $return .= '</tr>';
            }
            $return .= '</tbody></table>';
            echo $return;
           
            break;
        case 'notasTable':
            $escola = $_POST['escola'];
            $disciplina = $_POST['disciplina'];
            $return = array();
            $idQuiz = $DB->get_records_sql('SELECT id FROM {quiz} WHERE course = '.$disciplina,array());
            foreach($idQuiz as $id){
                $return[] = $id->id;
            }
            $quizTotal = count($return);
            $quizes = $DB->get_records_sql('SELECT @curRank := @curRank + 1 AS rank, u.id ,qg.grade,qg.quiz,u.firstname, u.lastname, u.email,DATE_FORMAT(FROM_UNIXTIME(u.lastaccess), "%d/%m/%Y") AS last FROM(SELECT @curRank := 0) r, {quiz_grades} AS qg JOIN {user} AS u ON qg.userid = u.id WHERE u.id IN('.implode(",",$_SESSION['USERSIDS']).') AND qg.quiz IN ('.implode(",",$return).')',array());
            $quizes = json_encode($quizes);
            $quizes = json_decode($quizes,true);
            $quizes = array_group_by($quizes,'id');
            
            $maximum = 0;
            foreach($quizes as $quiz){
                if(count($quiz) > $maximum){
                    $maximum = count($quiz);
                }
            }
            $return = '<table class="table-responsive" id="notas_table"><thead><th>Nome</th><th>Sobrenome</th><th>Email</th><th>Último Acesso</th>';
            for($i = 1; $i <= $maximum ; $i++){
                $return .= '<th>Etapa '.$i.'</th>';
            }
            $return .= '</thead><tbody>';
            $contador = 0;
            foreach ($quizes as $quiz) {
                $return .= '<tr>';
                $return .= '<td>'.$quiz[$contador]['firstname'].'</td><td>'.$quiz[$contador]['lastname'].'</td><td>'.$quiz[$contador]['email'].'</td><td>'.$quiz[$contador]['last'].'</td>';
                foreach($quiz as $q){
                     $return .= '<td>'.round($q['grade'],2).'</td>';
                }
                if(count($quiz) < $maximum){
                    $cont = $maximum;
                    while($cont >count($quiz)){
                        $return .= '<td>N/A</td>';
                        $cont--;
                    }
                    
                }
                $return .= '</tr>';
               
            }
            $return .= '</tbody></table>';
            echo $return;
           
            break;     
       case 'disciplinas' :
            $escola = $_POST['escola'];
            $return = array();
            $userids = $DB->get_records_sql('SELECT userid FROM {user_info_data} WHERE fieldid = '.$_SESSION['FIELDIDS']['faculdade'].' AND data ="'.$escola.'"',array());
            foreach ($userids as $id) {
                $return[] = $id->userid;
            }
            $perfilEscola = $DB->get_record_sql('SELECT u.* FROM {user} AS u INNER JOIN {role_assignments} AS ra ON u.id = ra.userid where ra.userid IN ('.implode(",",$_SESSION['USERSIDS']).') AND ra.roleid = 9 AND ra.contextid = 1 ',array());
            $total = $DB->get_records_sql('SELECT DISTINCT cs.* FROM {course} AS cs INNER JOIN {enrol} AS en on cs.id = en.courseid INNER JOIN {user_enrolments} AS ue on en.id = ue.enrolid WHERE ue.userid = '.$perfilEscola->id,array());
            $return = '';
            foreach ($total as $curso) {
                $return .= '<option value="'.$curso->id.'">'.$curso->fullname.'</option>';
            }
            echo $return;
            break;          
    }
    /**
    * Groups an array by a given key. Any additional keys will be used for grouping
    * the next set of sub-arrays.
    *
    * @author Jake Zatecky
    *
    * @param array $arr The array to have grouping performed on.
    * @param mixed $key The key to group or split by.
    *
    * @return array
    */
    function array_group_by($arr, $key)
    {
        if (!is_array($arr)) {
            trigger_error('array_group_by(): The first argument should be an array', E_USER_ERROR);
        }
        if (!is_string($key) && !is_int($key) && !is_float($key)) {
            trigger_error('array_group_by(): The key should be a string or an integer', E_USER_ERROR);
        }
        // Load the new array, splitting by the target key
        $grouped = [];
        foreach ($arr as $value) {
            $grouped[$value[$key]][] = $value;
        }
        // Recursively build a nested grouping if more parameters are supplied
        // Each grouped array value is grouped according to the next sequential key
        if (func_num_args() > 2) {
            $args = func_POST_args();
            foreach ($grouped as $key => $value) {
                $parms = array_merge([$value], array_slice($args, 2, func_num_args()));
                $grouped[$key] = call_user_func_array('array_group_by', $parms);
            }
        }
        return $grouped;
    }
    function set_users_ids($sql){
    global $DB;
    $return = array();
    $sql->select .= ' ui.userid ';
    $sql->from .= ' {user_info_data} AS ui ';
    if(isset($_POST['perfil']) && $_POST['perfil'] != 0){
        $sql->from .= ' INNER JOIN {role_assignments} AS ra ON ui.userid = ra.userid ';
        $sql->where .= ' ui.fieldid = '.$_SESSION['FIELDIDS']['faculdade'].' AND ui.data = "'.$_POST['escola'].'" AND ra.contextid = 1 AND ra.roleid = '.$_POST['perfil'].' ';
    }else{
        $sql->where .= ' ui.fieldid = '.$_SESSION['FIELDIDS']['faculdade'].' AND ui.data = "'.$_POST['escola'].'" ';
    }
    //return $sql->select.$sql->from.$sql->where;
    $userids = $DB->get_records_sql($sql->select.$sql->from.$sql->where,array());
    if(!$userids){
        return 0;
    }
    if(isset($_POST['segmento']) && $_POST['segmento'] != "0"){
        foreach($userids as $id){
            $return[] = $id->userid;
        }
        $sql->select = $sql->defaultSelect.' userid ';
        $sql->from = $sql->defaultFrom.' {user_info_data} ';
        $sql->where = $sql->defaultWhere.' fieldid = '.$_SESSION['FIELDIDS']['segmento'].' AND userid IN ('.implode(",",$return).') AND data ="'.$_POST['segmento'].'" ';
        $return = array();
        $userids =  $DB->get_records_sql($sql->select.$sql->from.$sql->where,array());  
    }
    if(!empty($userids)){
        foreach ($userids as $id) {
            $return[] = $id->userid;
        }
       
        return $return;
    }
    return $sql->select.$sql->from.$sql->where;
    return 0;

}              
                    
                    
?>


