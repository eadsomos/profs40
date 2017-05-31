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
    switch($_REQUEST['function']){
        case 'update':
            $_SESSION['USERSIDS'] = set_users_ids($sql);
            //echo json_encode($_SESSION['USERSIDS']);
            echo implode($_SESSION['USERSIDS']);
			break;
		case 'assessores':
			$esco = '';
			$idAssessor = $_REQUEST['assessor'];
			
			$groupsid = $DB->get_records_sql('SELECT DISTINCT groupid FROM {groups_members} WHERE userid ='.$idAssessor,array());
	
		   foreach ($groupsid as $id) {
			   $u = $DB->get_records_sql('SELECT DISTINCT userid FROM {groups_members} WHERE groupid ='.$id->groupid,array());
			   foreach ($u as $person) {
				   $usersid[] = $person->userid;
			   }
		   }
		   $nomesEscolas = $DB->get_records_sql('SELECT DISTINCT ui.data
												FROM mdl_user_info_data AS ui
												JOIN mdl_escola AS esco ON esco.desc_nome = ui.data 
													and ui.fieldid = '.$_SESSION['FIELDIDS']['faculdade'].'
												WHERE userid IN ('.implode(",",$usersid).')
												AND fieldid = '.$_SESSION['FIELDIDS']['faculdade'].'
												AND userid IN (
													SELECT DISTINCT u.id
													FROM mdl_user AS u
													JOIN mdl_role_assignments AS ra ON ra.userid = u.id
													JOIN mdl_user_info_data AS ui ON ui.userid = u.id
															and ui.fieldid = '.$_SESSION['FIELDIDS']['faculdade'].'
													WHERE ra.roleid = 11
												) ORDER BY ui.data ASC',array());
			
			foreach ($nomesEscolas as $escola) {
                $esco .= '<option value="'.$escola->data.'">'.$escola->data.'</option>';
            }
			
			echo $esco;
			
			break;
        case 'inscritosTotais':
			$escola = $_REQUEST['escola'];
            $ids = $DB->get_records_sql('SELECT DISTINCT ue.userid as uid 
										FROM mdl_user_enrolments as ue 
										INNER JOIN mdl_enrol as en ON ue.enrolid = en.id 
										INNER JOIN mdl_user as u ON u.id = ue.userid
										INNER JOIN mdl_user_info_data as ui ON ui.userid = u.id
													and ui.fieldid = 5
										AND ui.data = "'.$escola.'"
										AND u.id IN (
											SELECT DISTINCT u.id
											FROM mdl_user AS u
											JOIN mdl_role_assignments AS ra ON ra.userid = u.id
											JOIN mdl_user_info_data AS ui ON ui.userid = u.id
															and ui.fieldid = 2
											WHERE ra.roleid = 9
											AND ra.contextid = 1
										)',array());
            $values = array();
            foreach ($ids as $id) {
                $values[] = $id->uid;
            }
			
            echo count($values);
			
            break;
        case 'emCursoTotais':
			$escola = $_REQUEST['escola'];
            $idsEmcurso = $DB->get_records_sql('SELECT DISTINCT ue.userid as uid
											FROM mdl_user_enrolments as ue 
											INNER JOIN mdl_enrol as en ON ue.enrolid = en.id 
											INNER JOIN mdl_user as u ON u.id = ue.userid
											INNER JOIN mdl_course_completions AS cc ON cc.userid = u.id
											INNER JOIN mdl_user_info_data as ui ON ui.userid = u.id
														and ui.fieldid = 5
											AND ui.data = "'.$escola.'"
											AND cc.timecompleted IS NULL 
											AND  u.lastaccess > UNIX_TIMESTAMP(DATE_SUB(NOW(),INTERVAL 14 DAY)) 
											AND u.deleted = 0
											AND u.id IN (
												SELECT DISTINCT u.id
												FROM mdl_user AS u
												JOIN mdl_role_assignments AS ra ON ra.userid = u.id
												JOIN mdl_user_info_data AS ui ON ui.userid = u.id
																and ui.fieldid = '.$_SESSION['FIELDIDS']['faculdade'].'
												WHERE ra.roleid = 9
												AND ra.contextid = 1
												)',array());
            $valuesC = array();
            foreach ($idsEmcurso as $idC) {
                $valuesC[] = $idC->uid;
            }
            echo count($idsEmcurso);
            break;
			
        case 'disciplinas':
            $return = array();
			$escola =$_REQUEST['escola'];
			$total = $DB->get_records_sql('SELECT DISTINCT cs.* FROM {course} AS cs 
											INNER JOIN {enrol} AS en on cs.id = en.courseid 
											INNER JOIN {user_enrolments} AS ue on en.id = ue.enrolid 
											WHERE ue.userid ='.$_REQUEST['userid'].' ORDER BY cs.fullname ASC',array());
			
			
            $return = '';
            foreach ($total as $curso) {
				$valor = $DB->get_record_sql('SELECT COUNT(*) as total FROM {user_enrolments} as ue 
											  INNER JOIN {enrol} as en ON ue.enrolid = en.id 
											  WHERE en.courseid = '.$curso->id.' 
											  AND ue.userid IN (
												  SELECT DISTINCT u.id
													FROM mdl_user AS u
													JOIN mdl_role_assignments AS ra ON ra.userid = u.id
													JOIN mdl_user_info_data AS ui ON ui.userid = u.id
																	and ui.fieldid = 5
													WHERE ra.roleid = 9
													AND ra.contextid = 1
													AND ui.data = "'.$escola.'")',array());
				if($valor->total > 0){
                	$return .= '<option value="'.$curso->id.'">'.$curso->fullname.'</option>';
				}
            }
            echo $return;
            break;
			
			
		
			
		
		
		case 'disciplinasSchool':
            $return = array();
			$escola =$_REQUEST['escola'];
			$total = $DB->get_records_sql('SELECT DISTINCT cs.* FROM {course} AS cs 
											INNER JOIN {enrol} AS en on cs.id = en.courseid 
											INNER JOIN {user_enrolments} AS ue on en.id = ue.enrolid
											ORDER BY cs.fullname ASC',array());
			
			
            $return = '';
            foreach ($total as $curso) {
				$valor = $DB->get_record_sql('SELECT COUNT(*) as total FROM {user_enrolments} as ue 
											  INNER JOIN {enrol} as en ON ue.enrolid = en.id 
											  WHERE en.courseid = '.$curso->id.' 
											  AND ue.userid IN (
												  SELECT DISTINCT u.id
													FROM mdl_user AS u
													JOIN mdl_role_assignments AS ra ON ra.userid = u.id
													JOIN mdl_user_info_data AS ui ON ui.userid = u.id
																	and ui.fieldid = 5
													WHERE ra.roleid = 9
													AND ra.contextid = 1
													AND ui.data = "'.$escola.'")',array());
				if($valor->total > 0){
                	$return .= '<option value="'.$curso->id.'">'.$curso->fullname.'</option>';
				}
            }
            echo $return;
            break;	
			
			
        case 'graficoDisciplinas':
			$escola = $_REQUEST['escola'];
            $total = $DB->get_records_sql('SELECT DISTINCT cs.* FROM {course} AS cs INNER JOIN {enrol} AS en on cs.id = en.courseid INNER JOIN {user_enrolments} AS ue on en.id = ue.enrolid WHERE ue.userid = '.$_REQUEST['userid'].'',array());    
            $return = array();
            
			
			foreach ($total as $curso) {
                $valor = $DB->get_record_sql('SELECT COUNT(*) as total FROM {user_enrolments} as ue 
											  INNER JOIN {enrol} as en ON ue.enrolid = en.id 
											  WHERE en.courseid = '.$curso->id.' 
											  AND ue.userid IN (
												  SELECT DISTINCT u.id
													FROM mdl_user AS u
													JOIN mdl_role_assignments AS ra ON ra.userid = u.id
													JOIN mdl_user_info_data AS ui ON ui.userid = u.id
																	and ui.fieldid = 5
													WHERE ra.roleid = 9
													AND ra.contextid = 1
													AND ui.data = "'.$escola.'")',array());
				if($valor->total > 0){
					$return[] = array('label'=>$curso->fullname ,'data' => $valor->total,'color' => random_color());
				}
                
            }
			
            echo json_encode($return);
            break;
			
			
			
		case 'graficoDisciplinasSchool':
			$escola = $_REQUEST['escola'];
            $total = $DB->get_records_sql('SELECT DISTINCT cs.* FROM {course} AS cs INNER JOIN {enrol} AS en on cs.id = en.courseid INNER JOIN {user_enrolments} AS ue on en.id = ue.enrolid',array());    
            $return = array();
            
			
			foreach ($total as $curso) {
                $valor = $DB->get_record_sql('SELECT COUNT(*) as total FROM {user_enrolments} as ue 
											  INNER JOIN {enrol} as en ON ue.enrolid = en.id 
											  WHERE en.courseid = '.$curso->id.' 
											  AND ue.userid IN (
												  SELECT DISTINCT u.id
													FROM mdl_user AS u
													JOIN mdl_role_assignments AS ra ON ra.userid = u.id
													JOIN mdl_user_info_data AS ui ON ui.userid = u.id
																	and ui.fieldid = 5
													WHERE ra.roleid = 9
													AND ra.contextid = 1
													AND ui.data = "'.$escola.'")',array());
				if($valor->total > 0){
					$return[] = array('label'=>$curso->fullname ,'data' => $valor->total,'color' => random_color());
				}
                
            }
			
            echo json_encode($return);
            break;	
			
			
		
        case 'inscritosDisciplina':
            $disciplina = $_POST['disciplina'];
			$escola = $_REQUEST['escola'];
			
            $ids = $DB->get_records_sql('SELECT DISTINCT ue.userid as uid 
										FROM mdl_user_enrolments as ue 
										INNER JOIN mdl_enrol as en ON ue.enrolid = en.id 
										INNER JOIN mdl_user as u ON u.id = ue.userid
										INNER JOIN mdl_user_info_data as ui ON ui.userid = u.id
													and ui.fieldid = 5
										WHERE en.courseid = '.$disciplina.'
										AND ui.data = "'.$escola.'"
										AND u.id IN (
											SELECT DISTINCT u.id
											FROM mdl_user AS u
											JOIN mdl_role_assignments AS ra ON ra.userid = u.id
											JOIN mdl_user_info_data AS ui ON ui.userid = u.id
															and ui.fieldid = 2
											WHERE ra.roleid = 9
											AND ra.contextid = 1
										)',array());
            $values = array();
            foreach ($ids as $id) {
                $values[] = $id->uid;
            }
            echo count($values);
            break;
			
        case 'emCursoDisciplina':
            $disciplina = $_POST['disciplina'];
			$escola = $_REQUEST['escola'];
			$ids = $DB->get_records_sql('SELECT DISTINCT ue.userid as uid 
										FROM mdl_user_enrolments as ue 
										INNER JOIN mdl_enrol as en ON ue.enrolid = en.id 
										INNER JOIN mdl_user as u ON u.id = ue.userid
										INNER JOIN mdl_course_completions AS cc ON cc.userid = u.id
										INNER JOIN mdl_user_info_data as ui ON ui.userid = u.id
													and ui.fieldid = 5
										WHERE en.courseid = '.$disciplina.'
										AND ui.data = "'.$escola.'"
										AND cc.timecompleted IS NOT NULL 
										AND u.deleted = 0
										AND cc.course = "'.$disciplina.'"
										AND u.id IN (

											SELECT DISTINCT u.id
											FROM mdl_user AS u
											JOIN mdl_role_assignments AS ra ON ra.userid = u.id
											JOIN mdl_user_info_data AS ui ON ui.userid = u.id
															and ui.fieldid = 2
											WHERE ra.roleid = 9
											AND ra.contextid = 1
											)',array());
            $valuesO = array();
            foreach ($ids as $id) {
                $valuesO[] = $id->uid;
            }

            $ids = $DB->get_records_sql('SELECT DISTINCT ue.userid as uid 
										FROM mdl_user_enrolments as ue 
										INNER JOIN mdl_enrol as en ON ue.enrolid = en.id 
										INNER JOIN mdl_user as u ON u.id = ue.userid
										INNER JOIN mdl_course_completions AS cc ON cc.userid = u.id
										INNER JOIN mdl_user_info_data as ui ON ui.userid = u.id
													and ui.fieldid = 5
										WHERE en.courseid = '.$disciplina.'
										AND ui.data = "'.$escola.'"
										AND cc.timecompleted IS NULL
										AND cc.course = '.$disciplina.'
										AND  u.lastaccess > UNIX_TIMESTAMP(DATE_SUB(NOW(),INTERVAL 14 DAY)) 
										AND u.deleted = 0
										AND u.id IN (

											SELECT DISTINCT u.id
											FROM mdl_user AS u
											JOIN mdl_role_assignments AS ra ON ra.userid = u.id
											JOIN mdl_user_info_data AS ui ON ui.userid = u.id
															and ui.fieldid = 2
											WHERE ra.roleid = 9
											AND ra.contextid = 1
											)',array());
            $values = array();
            foreach ($ids as $id) {
                $values[] = $id->uid;
            }
			
			
            if(count($values) < 1){
				echo count($values);
				break;
			}
			
            echo count($values);
            break;
        case 'concluidosDisciplina':
            $disciplina = $_POST['disciplina'];
			$escola = $_REQUEST['escola'];
			
            $ids = $DB->get_records_sql('SELECT DISTINCT ue.userid as uid 
										FROM mdl_user_enrolments as ue 
										INNER JOIN mdl_enrol as en ON ue.enrolid = en.id 
										INNER JOIN mdl_user as u ON u.id = ue.userid
										INNER JOIN mdl_course_completions AS cc ON cc.userid = u.id
										INNER JOIN mdl_user_info_data as ui ON ui.userid = u.id
													and ui.fieldid = 5
										WHERE en.courseid = '.$disciplina.'
										AND ui.data = "'.$escola.'"
										AND cc.timecompleted IS NOT NULL 
										AND u.deleted = 0
										AND cc.course = "'.$disciplina.'"
										AND u.id IN (

											SELECT DISTINCT u.id
											FROM mdl_user AS u
											JOIN mdl_role_assignments AS ra ON ra.userid = u.id
											JOIN mdl_user_info_data AS ui ON ui.userid = u.id
															and ui.fieldid = 2
											WHERE ra.roleid = 9
											AND ra.contextid = 1
											)',array());
            $values = array();
            foreach ($ids as $id) {
                $values[] = $id->uid;
            }
            
            echo count($values);
            break;
        case 'emRiscoDisciplina':
			$disciplina = $_POST['disciplina'];
			$escola = $_REQUEST['escola'];
			
			
			$idTotalInscritos = $DB->get_records_sql('SELECT DISTINCT ue.userid as uid 
										FROM mdl_user_enrolments as ue 
										INNER JOIN mdl_enrol as en ON ue.enrolid = en.id 
										INNER JOIN mdl_user as u ON u.id = ue.userid
										INNER JOIN mdl_user_info_data as ui ON ui.userid = u.id
													and ui.fieldid = 5
										WHERE en.courseid = '.$disciplina.'
										AND ui.data = "'.$escola.'"
										AND u.id IN (
											SELECT DISTINCT u.id
											FROM mdl_user AS u
											JOIN mdl_role_assignments AS ra ON ra.userid = u.id
											JOIN mdl_user_info_data AS ui ON ui.userid = u.id
															and ui.fieldid = 2
											WHERE ra.roleid = 9
											AND ra.contextid = 1
										)',array());
            $valuesTotal = array();
            foreach ($idTotalInscritos as $idTi) {
                $valuesTotal[] = $idTi->uid;
            }
            $inscritosTotais = count($valuesTotal);
			
			
            $ids = $DB->get_records_sql('SELECT DISTINCT ue.userid as uid 
										FROM mdl_user_enrolments as ue 
										INNER JOIN mdl_enrol as en ON ue.enrolid = en.id 
										INNER JOIN mdl_user as u ON u.id = ue.userid
										INNER JOIN mdl_course_completions AS cc ON cc.userid = u.id
										INNER JOIN mdl_user_info_data as ui ON ui.userid = u.id
													and ui.fieldid = 5
										WHERE en.courseid = '.$disciplina.'
										AND ui.data = "'.$escola.'"
										AND cc.timecompleted IS NULL
										AND cc.course = "'.$disciplina.'" 
										AND  u.lastaccess > UNIX_TIMESTAMP(DATE_SUB(NOW(),INTERVAL 14 DAY)) 
										AND u.deleted = 0
										AND u.id IN (
											SELECT DISTINCT u.id
											FROM mdl_user AS u
											JOIN mdl_role_assignments AS ra ON ra.userid = u.id
											JOIN mdl_user_info_data AS ui ON ui.userid = u.id
															and ui.fieldid = 2
											WHERE ra.roleid = 9
											)',array());
            $values = array();
            foreach ($ids as $id) {
                $values[] = $id->uid;
            }

            $emCurso = count($values);
			
			
			
			
			
			$idsConc = $DB->get_records_sql('SELECT DISTINCT ue.userid as uid 
										FROM mdl_user_enrolments as ue 
										INNER JOIN mdl_enrol as en ON ue.enrolid = en.id 
										INNER JOIN mdl_user as u ON u.id = ue.userid
										INNER JOIN mdl_course_completions AS cc ON cc.userid = u.id
										INNER JOIN mdl_user_info_data as ui ON ui.userid = u.id
													and ui.fieldid = 5
										WHERE en.courseid = '.$disciplina.'
										AND ui.data = "'.$escola.'"
										AND cc.timecompleted IS NOT NULL 
										AND u.deleted = 0
										AND cc.course = "'.$disciplina.'"
										AND u.id IN (

											SELECT DISTINCT u.id
											FROM mdl_user AS u
											JOIN mdl_role_assignments AS ra ON ra.userid = u.id
											JOIN mdl_user_info_data AS ui ON ui.userid = u.id
															and ui.fieldid = 2
											WHERE ra.roleid = 9
											AND ra.contextid = 1
											)',array());
            $valuesConc = array();
            foreach ($idsConc as $idConc) {
                $valuesConc[] = $idConc->uid;
            }
			
			$concluidos = count($valuesConc);
			
			
			
			$valor1 = $inscritosTotais - $concluidos;
			$valorFinal = $valor1 - $emCurso;
			
			echo $valorFinal;
            break;
			
         case 'andamentoCurso':
            $disciplina = $_POST['disciplina'];
			$escola = $_REQUEST['escola']; 
            $return = array();
            $idQuiz = $DB->get_records_sql('SELECT id FROM {quiz} WHERE course = '.$disciplina,array());
            foreach($idQuiz as $id){
                $return[] = $id->id;
            }
			
            $quizTotal = count($return);
            
			
			if ($idQuiz == false){
				$idQuiz = $DB->get_records_sql('SELECT id FROM {assign} WHERE course = '.$disciplina,array());
				foreach($idQuiz as $id){
					$return[] = $id->id;
				}
				
				$quizTotal = count($return);
				$quizes = $DB->get_records_sql('SELECT @curRank := @curRank + 1 AS rank, u.id ,ag.grade,
												ag.assignment,u.firstname, u.lastname, u.email,
												DATE_FORMAT(FROM_UNIXTIME(u.lastaccess), "%d/%m/%Y") AS last 
												FROM(SELECT @curRank := 0) r, mdl_assign_grades AS ag 
												JOIN mdl_user AS u ON ag.userid = u.id
												WHERE u.id IN(
													SELECT DISTINCT u.id
													FROM mdl_user AS u
													JOIN mdl_role_assignments AS ra ON ra.userid = u.id
													JOIN mdl_user_info_data AS ui ON ui.userid = u.id
																	and ui.fieldid = 5
													WHERE ra.roleid = 9
													AND ui.data = "'.$escola.'") 
												AND ag.assignment IN ('.implode(",",$return).')',array());
			} else {
				
				$quizes = $DB->get_records_sql('SELECT @curRank := @curRank + 1 AS rank, u.id ,qg.grade,
												qg.quiz,u.firstname, u.lastname, u.email,
												DATE_FORMAT(FROM_UNIXTIME(u.lastaccess), "%d/%m/%Y") AS last 
												FROM(SELECT @curRank := 0) r, {quiz_grades} AS qg 
												JOIN {user} AS u ON qg.userid = u.id 
												WHERE u.id IN(
													SELECT DISTINCT u.id
													FROM mdl_user AS u
													JOIN mdl_role_assignments AS ra ON ra.userid = u.id
													JOIN mdl_user_info_data AS ui ON ui.userid = u.id
																	and ui.fieldid = 5
													WHERE ra.roleid = 9
													AND ui.data = "'.$escola.'") 
												AND qg.quiz IN ('.implode(",",$return).')',array());
											
				$quizes = json_encode($quizes);
				$quizes = json_decode($quizes,true);
				$quizes = array_group_by($quizes,'id');
			}

            $return = array();
            $return  = array_fill(1,$quizTotal,0);
            foreach ($quizes as $quiz) {
                 $contador = 1;
                 foreach ($quiz as $q) {
                    $return[$contador]++ ;
                    $contador++;
                }
                
            }
            echo json_encode($return);
            break;
             
         case 'notasDisciplina':
            $disciplina = $_POST['disciplina'];
			$escola = $_REQUEST['escola'];
            $return = array();
			
			
			
            $idQuiz = $DB->get_records_sql('SELECT id FROM {quiz} WHERE course = '.$disciplina ,array());
            foreach($idQuiz as $id){
                $return[] = $id->id;
            }
			
			if ($idQuiz == false){
				$idQuiz = $DB->get_records_sql('SELECT id FROM {assign} WHERE course = '.$disciplina ,array());
				foreach($idQuiz as $id){
					$return[] = $id->id;
				}
				
				$quizTotal = count($return);
				$quizes = $DB->get_records_sql('SELECT id, grade, assignment FROM {assign_grades} WHERE assignment 
												IN('.implode(",",$return).') 
												AND userid IN ('.implode(",",$_SESSION['USERSIDS']).')',array());
				$quizes = json_encode($quizes);
				$quizes = json_decode($quizes,true);
				$quizes = array_group_by($quizes,'assignment');
				$media = array();
				
			} else {
				$quizTotal = count($return);
				$quizes = $DB->get_records_sql('SELECT id, grade, quiz FROM {quiz_grades} WHERE quiz 
												IN('.implode(",",$return).') 
												AND userid IN (
													SELECT DISTINCT u.id
													FROM mdl_user AS u
													JOIN mdl_role_assignments AS ra ON ra.userid = u.id
													JOIN mdl_user_info_data AS ui ON ui.userid = u.id
																	and ui.fieldid = 5
													WHERE ra.roleid = 9
													AND ui.data = "'.$escola.'")',array());
				$quizes = json_encode($quizes);
				$quizes = json_decode($quizes,true);
				$quizes = array_group_by($quizes,'quiz');
				$media = array();
			}
			
            foreach($quizes as $quiz){
                $count = 0;
                $total = 0 ;
                foreach($quiz as $q){
                    $total += $q['grade'];
                    $count++;
                }
                $media[] = $total/$count;

            }
            $return = array();
            $cont = 0;
            foreach($media as $md){
                $cont++;
                $return += array($cont=>$md);

            }
            if($cont < $quizTotal){
                $quizTotal = $quizTotal - $cont;
                for($i = 0; $i < $quizTotal; $i++){
                    $return += array($cont+$i+1=>0);
                }
            }
            echo json_encode($return);
            break;
        case 'progressoCursistas':
            $disciplina = $_REQUEST['disciplina'];
			$escola = $_REQUEST['escola'];
            $total = $DB->get_records_sql('SELECT @curRank := @curRank + 1 AS rank, gg.finalgrade, gg.itemid,
											u.firstname, u.lastname, gg.userid 
											FROM (SELECT @curRank := 0) r, {grade_grades} AS gg 
											JOIN {grade_items} AS gi ON gg.itemid=gi.id 
											LEFT JOIN {user} AS u ON gg.userid = u.id 
											WHERE gi.courseid='.$disciplina.' 
											AND gi.itemtype="mod" 
											AND gg.userid IN(
													SELECT DISTINCT u.id
													FROM mdl_user AS u
													JOIN mdl_role_assignments AS ra ON ra.userid = u.id
													JOIN mdl_user_info_data AS ui ON ui.userid = u.id
																	and ui.fieldid = 5
													WHERE ra.roleid = 9
													AND ui.data = "'.$escola.'")',array());
            $diff = array();
			foreach($total as $tot){
				$diff[] = $tot->userid;
			}
			
			$diff = (array_unique($diff));
			if(empty($diff)){
				$diff = '';	
			}else{
				$diff = 'AND u.id NOT IN ('.implode(',',$diff).')';
			}
													
            $users = $DB->get_records_sql('SELECT DISTINCT ue.userid as uid,u.firstname,u.lastname  
										FROM mdl_user_enrolments as ue 
										INNER JOIN mdl_enrol as en ON ue.enrolid = en.id 
										INNER JOIN mdl_user as u ON u.id = ue.userid
										INNER JOIN mdl_user_info_data as ui ON ui.userid = u.id
													and ui.fieldid = 5
										WHERE en.courseid = '.$disciplina.'
										AND ui.data = "'.$escola.'"
										AND u.id IN (
											SELECT DISTINCT u.id
											FROM mdl_user AS u
											JOIN mdl_role_assignments AS ra ON ra.userid = u.id
											JOIN mdl_user_info_data AS ui ON ui.userid = u.id
															and ui.fieldid = 2
											WHERE ra.roleid = 9
											AND ra.contextid = 1
											)'.$diff,array());
										
			
			$insc = array();	
			$total = json_encode($total);
            $total = json_decode($total, true);
            $total = array_group_by($total,'userid');
			foreach($users as $us){
				$insc[$us->uid] = array(array('rank' => 0, 'finalgrade' => 0, 'itemid' => 0, 'firstname' => $us->firstname,'lastname'=>$us->lastname,'userid'=>$us->uid)); 
			}
			
			$saida = array_merge($total,$insc);
			
            $return = '';
            foreach($saida as $aluno){
                    $feito = 0;
                    $nomeCompleto= '';
                    foreach ($aluno as $atividade) {
                        $nomeCompleto = $atividade['firstname'].' '.$atividade['lastname'];
                        if(!empty($atividade['finalgrade'])){
                            $feito++;
                        }

                    }
                    $max = count($aluno);
                    $percentage = floor(($feito/$max) * 100);
					if ($feito <= 0){
						$return .= '<p>'.$nomeCompleto.' [Não Iniciado]'.'</p><div class="progress"><div class="progress-bar progress-bar-danger" style="width: '.$percentage.'%">'.$percentage.'%</div></div>';
					}
                    if ($percentage >= 1 and $percentage <= 10){
                        $return.= '<p>'.$nomeCompleto.' ['.$feito.'/'.$max.']'.'</p><div class="progress"><div class="progress-bar progress-bar-danger" style="width: '.$percentage.'%">'.$percentage.'%</div></div>';
                    }
                    elseif($percentage > 10 and $percentage <= 40){
                        $return.= '<p>'.$nomeCompleto.' ['.$feito.'/'.$max.']'.'</p><div class="progress"><div class="progress-bar progress-bar progress-bar-warning" style="width: '.$percentage.'%">'.$percentage.'%</div></div>';
                    }
                    elseif($percentage > 40 and $percentage <= 80){
                        $return.= '<p>'.$nomeCompleto.' ['.$feito.'/'.$max.']'.'</p><div class="progress"><div class="progress-bar progress-bar progress-bar-info" style="width: '.$percentage.'%">'.$percentage.'%</div></div>';
                    }
                    elseif($percentage > 80 and $percentage <= 100){
                        $return.= '<p>'.$nomeCompleto.' ['.$feito.'/'.$max.']'.'</p><div class="progress"><div class="progress-bar progress-bar-success" style="width: '.$percentage.'%">'.$percentage.'%</div></div>';
                    }
            }
            echo $return;
            break;
			
			
         case 'statusCurso':
            $disciplina = $_POST['disciplina'];
            $max = $DB->get_record_sql('SELECT COUNT(id) AS total FROM {grade_items} WHERE courseid IN (SELECT id FROM {course} WHERE category = (SELECT category FROM {course} WHERE id = '.$disciplina.') AND itemtype = "mod")', array());
            $max = $max->total + 0;
            $total = $DB->get_records_sql('SELECT @curRank := @curRank + 1 AS rank, gg.finalgrade, gg.itemid, u.firstname, u.lastname, gg.userid FROM (SELECT @curRank := 0) r, {grade_grades} AS gg JOIN {grade_items} AS gi ON gg.itemid=gi.id LEFT JOIN {user} AS u ON gg.userid = u.id WHERE gi.courseid IN (SELECT id FROM {course} WHERE category = (SELECT category FROM {course} WHERE id = '.$disciplina.')) AND gi.itemtype="mod" AND gg.userid IN ('.implode(",",$_SESSION['USERSIDS']).')',array());
            $total = json_encode($total);
            $total = json_decode($total, true);
            $total = array_group_by($total,'userid');
            $return = '';
            foreach($total as $aluno){
                $feito = 0;
                $nomeCompleto= '';
                foreach ($aluno as $atividade) {
                    $nomeCompleto = $atividade['firstname'].' '.$atividade['lastname'];
                    if(!empty($atividade['finalgrade'])){
                        $feito++;
                    }

                }
                $percentage = floor(($feito/$max) * 100);
				if ($feito <= 0){
					$return .= '<p>'.$nomeCompleto.' [Nenhum feito]'.'</p><div class="progress"><div class="progress-bar progress-bar-danger" style="width: '.$percentage.'%">'.$percentage.'%</div></div>';
				}
                if ($percentage >= 1 and $percentage <= 10){
                    $return.= '<p>'.$nomeCompleto.' ['.$feito.'/'.$max.']'.'</p><div class="progress"><div class="progress-bar progress-bar-danger" style="width: '.$percentage.'%">'.$percentage.'%</div></div>';
                }
                elseif($percentage > 10 and $percentage <= 40){
                    $return.= '<p>'.$nomeCompleto.' ['.$feito.'/'.$max.']'.'</p><div class="progress"><div class="progress-bar progress-bar progress-bar-warning" style="width: '.$percentage.'%">'.$percentage.'%</div></div>';
                }
                elseif($percentage > 40 and $percentage <= 80){
                    $return.= '<p>'.$nomeCompleto.' ['.$feito.'/'.$max.']'.'</p><div class="progress"><div class="progress-bar progress-bar progress-bar-info" style="width: '.$percentage.'%">'.$percentage.'%</div></div>';
                }
                elseif($percentage > 80 and $percentage <= 100){
                    $return.= '<p>'.$nomeCompleto.' ['.$feito.'/'.$max.']'.'</p><div class="progress"><div class="progress-bar progress-bar-success" style="width: '.$percentage.'%">'.$percentage.'%</div></div>';
                }
				
				
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
		$args = func_get_args();
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
		
		
			if(isset($_POST['segmento']) && $_POST['segmento'] == "1"){
				$sql->where = $sql->defaultWhere.' fieldid = '.$_SESSION['FIELDIDS']['segmento'].' AND userid IN ('.implode(",",$return).')';
			}else{
				$sql->where = $sql->defaultWhere.' fieldid = '.$_SESSION['FIELDIDS']['segmento'].' AND userid IN ('.implode(",",$return).') AND data ="'.$_POST['segmento'].'" ';
			}
		
			$return = array();
			$userids =  $DB->get_records_sql($sql->select.$sql->from.$sql->where,array()); 
		
    }
    if(!empty($userids)){
        foreach ($userids as $id) {
            $return[] = $id->userid;
        }
       
        return $return;
    }
    //return $sql->select.$sql->from.$sql->where;
    return 0;

}
function random_color(){
    return '#' . str_pad(dechex(mt_rand(0, 0xFFFFFF)), 6, '0', STR_PAD_LEFT); 
}


?>
