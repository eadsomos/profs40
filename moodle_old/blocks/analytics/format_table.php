<?php 
    require_once(__DIR__ . '/../../config.php'); //Busca biblioteca do moodle
    require_once('variables.php'); // Traz variáveis de campos
    global $DB, $USER; // Declara variáveis globais do moodle

	// Sintaxes SQL
    $return = array();
    $sql = new stdClass();
    $sql->select = 'SELECT';
    $sql->defaultSelect = 'SELECT';
    $sql->from = 'FROM';
    $sql->defaultFrom = 'FROM';
    $sql->where = 'WHERE';
    $sql->defaultWhere = 'WHERE';

	// Lida com dados enviados pelo ajax
    switch($_REQUEST['function']){
       case 'update':
            $_SESSION['USERSIDS'] = set_users_ids($sql);
            echo json_encode($_SESSION['USERSIDS']);
            break;    
			
       case 'alunosTable':
            $escola = $_REQUEST['escola'];
            $disciplina = $_REQUEST['disciplina'];
			$semEscola = $_REQUEST['semEscola'];
			$querypart = '';
			$queryPartDisciplina = '';
			$todasDisciplinas = array();
			
			
			if ($escola != 1){
				$querypart = 'AND ui.data = "'.$escola.'"';
			}else{
				$querypart = '';
			}
			
			$total = $DB->get_records_sql('SELECT DISTINCT cs.* FROM {course} AS cs 
											INNER JOIN {enrol} AS en on cs.id = en.courseid 
											INNER JOIN {user_enrolments} AS ue on en.id = ue.enrolid 
											WHERE ue.userid ='.$USER->id.' ORDER BY cs.fullname ASC',array());
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
													'.$querypart.')',array());
				if($valor->total > 0){
					$todasDisciplinas[] = $curso->id;
				}
            }
			
			
			if ($disciplina != 1){
				$queryPartDisciplina = 'AND c.id = '.$disciplina.' AND cc.course = '.$disciplina.' AND g.courseid = '.$disciplina;
				$queryPartGrupo = 'c.id = '.$disciplina;
			}else{
				$queryPartDisciplina = 'AND c.id IN ('.implode(',',$todasDisciplinas).') AND cc.course IN ('.implode(',',$todasDisciplinas).') AND g.courseid IN ('.implode(',',$todasDisciplinas).')';
				$queryPartGrupo = 'c.id IN ('.implode(',',$todasDisciplinas).')';
			}
			
			
			$usersid = array();
			$uss = $DB->get_record_sql('SELECT * FROM {user} WHERE id ='.$USER->id);

			$groupsid = $DB->get_records_sql('SELECT DISTINCT groupid 
												FROM {groups_members} AS gm 
												JOIN {groups} AS g ON g.id = gm.groupid
												JOIN {course} AS c ON c.id = g.courseid
												WHERE userid ='.$USER->id.'
												AND '.$queryPartGrupo,array());
			
			foreach ($groupsid as $id) {
				$gids[] = $id->groupid;
			}
		   
			
			$u = $DB->get_records_sql('SELECT DISTINCT userid 
								  FROM {groups_members} AS gm
								  JOIN {groups} AS g ON g.id = gm.groupid
								  JOIN {course} AS c ON c.id = g.courseid
								  WHERE groupid IN ('.implode(',',$gids).')
								  AND '.$queryPartGrupo,array());
			
			foreach ($u as $person) {
			   $usersid[] = $person->userid;
			}
	 		
			
			
			if ($semEscola == "true"){
				
				$alunos = $DB->get_records_sql('SELECT @curRank := @curRank + 1 AS rank, g.name, u.firstname, u.lastname, u.email,DATE_FORMAT(FROM_UNIXTIME(u.lastaccess), "%d/%m/%Y") AS last, u.lastaccess, ui.data, c.fullname, cc.timecompleted, en.password AS cod_inscricao
				FROM (SELECT @curRank := 0) r, mdl_user AS u 
				JOIN mdl_user_info_data AS ui ON u.id = ui.userid
				JOIN mdl_user_enrolments AS ue ON ue.userid = u.id 
				JOIN mdl_enrol AS en ON en.id = ue.enrolid 
				JOIN mdl_course AS c ON en.courseid = c.id 
				JOIN mdl_course_completions AS cc ON cc.userid = u.id
				JOIN mdl_groups_members AS gm ON gm.userid = u.id
				JOIN mdl_groups AS g ON g.id = gm.groupid
				WHERE u.id IN (
					SELECT DISTINCT u.id
					FROM mdl_user AS u
					JOIN mdl_role_assignments AS ra ON ra.userid = u.id
					WHERE ra.roleid = 9
					AND ra.contextid = 1
				) 
				'.$queryPartDisciplina.'
				AND u.id IN ('.implode(",",$usersid).')
				AND ui.fieldid = 2
				GROUP BY ue.id',array());
				
				
				$alunosCC = $DB->get_records_sql('SELECT @curRank := @curRank + 1 AS rank, g.name, u.firstname, u.lastname, u.email,DATE_FORMAT(FROM_UNIXTIME(u.lastaccess), "%d/%m/%Y") AS last, u.lastaccess, ui.data, c.fullname, en.password AS cod_inscricao
				FROM (SELECT @curRank := 0) r, mdl_user AS u 
				JOIN mdl_user_info_data AS ui ON u.id = ui.userid
				JOIN mdl_user_enrolments AS ue ON ue.userid = u.id 
				JOIN mdl_enrol AS en ON en.id = ue.enrolid 
				JOIN mdl_course AS c ON en.courseid = c.id
				JOIN mdl_groups_members AS gm ON gm.userid = u.id
				JOIN mdl_groups AS g ON g.id = gm.groupid
				WHERE u.id IN (
					SELECT DISTINCT u.id
					FROM mdl_user AS u
					JOIN mdl_role_assignments AS ra ON ra.userid = u.id
					WHERE ra.roleid = 9
					AND ra.contextid = 1
				) 
				AND c.id = 113 AND g.courseid = 113
				AND u.id IN ('.implode(",",$usersid).')
				AND u.id NOT IN (SELECT u.id
				FROM mdl_user AS u 
				JOIN mdl_user_info_data AS ui ON u.id = ui.userid
				JOIN mdl_user_enrolments AS ue ON ue.userid = u.id 
				JOIN mdl_enrol AS en ON en.id = ue.enrolid 
				JOIN mdl_course AS c ON en.courseid = c.id 
				JOIN mdl_course_completions AS cc ON cc.userid = u.id
				JOIN mdl_groups_members AS gm ON gm.userid = u.id
				JOIN mdl_groups AS g ON g.id = gm.groupid
				WHERE u.id IN (
					SELECT DISTINCT u.id
					FROM mdl_user AS u
					JOIN mdl_role_assignments AS ra ON ra.userid = u.id
					WHERE ra.roleid = 9
					AND ra.contextid = 1
				) 
				AND c.id = 113 AND cc.course = 113 AND g.courseid = 113
				AND u.id IN ('.implode(",",$usersid).')
				AND ui.fieldid = 2
				GROUP BY ue.id)
				AND ui.fieldid = 2
				GROUP BY ue.id',array());
				
				
				$return = '<table class="table table-bordered" id="alunos_table" >
							<thead>
								<tr>
									<th>Código de Inscrição</th>
									<th>Grupo</th>
									<th>Nome</th>
									<th>Sobrenome</th>
									<th>Email</th>
									<th>Código MEC</th>
									<th>Escola</th>
									<th>Curso</th>
									<th>Status</th>
									<th>Último Acesso</th>
								</tr>
							</thead>
							<tbody>';

				foreach($alunos as $aluno){
					$return .= '<tr>
									<td>'.$aluno->cod_inscricao.'</td>
									<td>'.$aluno->name.'</td>
									<td>'.$aluno->firstname.'</td>
									<td>'.$aluno->lastname.'</td>
									<td>'.$aluno->email.'</td>
									<td>indisponível na consulta</td>
									<td>'.$aluno->data.'</td>
									<td>'.$aluno->fullname.'</td>';

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
					if($aluno->last == "31/12/1969"){
						$return .='	<td>Nunca Acessou</td>';
					}else{
						$return .='	<td>'.$aluno->last.'</td>';
					}
				}
				foreach($alunosCC as $alunoCC){
					$return .= '<tr>
									<td>'.$alunoCC->cod_inscricao.'</td>
									<td>'.$alunoCC->name.'</td>
									<td>'.$alunoCC->firstname.'</td>
									<td>'.$alunoCC->lastname.'</td>
									<td>'.$alunoCC->email.'</td>
									<td>indisponível na consulta</td>
									<td>'.$alunoCC->data.'</td>
									<td>'.$alunoCC->fullname.'</td>
									<td>Nunca Acessou</td>
									<td>Nunca Acessou</td>';
				}
				$return .='</tbody></table></tr>';
				echo $return;
				
			}else{
				
				$escolasGrupo = $DB->get_records_sql('SELECT DISTINCT ui.data, esco.desc_nome
													FROM mdl_user AS u
													JOIN mdl_role_assignments as ra ON ra.userid = u.id
													JOIN mdl_user_info_data AS ui ON ui.userid = u.id
														AND ui.fieldid = 5
													JOIN mdl_escola AS esco ON ui.data = esco.id
														WHERE u.id IN ('.implode(',',$usersid).')
													AND ra.roleid = 9
													ORDER BY esco.desc_nome ASC',array());
				$assID = array();
				foreach($escolasGrupo as $escolaGrup){
				   $assID[] = $escolaGrup->data;
				}
				
				
				if($escola != 1){
					$alunos = $DB->get_records_sql('SELECT @curRank := @curRank + 1 AS rank, g.name, u.firstname, u.lastname, u.email,DATE_FORMAT(FROM_UNIXTIME(u.lastaccess), "%d/%m/%Y") AS last, u.lastaccess, esco.desc_nome, c.fullname, cc.timecompleted, esco.cod_mec, en.password AS cod_inscricao
					FROM (SELECT @curRank := 0) r, mdl_user AS u 
					JOIN mdl_user_info_data AS ui ON u.id = ui.userid
					JOIN mdl_user_enrolments AS ue ON ue.userid = u.id 
					JOIN mdl_enrol AS en ON en.id = ue.enrolid 
					JOIN mdl_course AS c ON en.courseid = c.id 
					JOIN mdl_course_completions AS cc ON cc.userid = u.id
					JOIN mdl_escola AS esco ON esco.id = ui.data
							AND ui.fieldid = 5
					JOIN mdl_groups_members AS gm ON gm.userid = u.id
					JOIN mdl_groups AS g ON g.id = gm.groupid
					WHERE u.id IN (
						SELECT DISTINCT u.id
						FROM mdl_user AS u
						JOIN mdl_role_assignments AS ra ON ra.userid = u.id
						JOIN mdl_user_info_data AS ui ON ui.userid = u.id
										and ui.fieldid = 5
						WHERE ra.roleid = 9
						AND ra.contextid = 1
					) 
					'.$queryPartDisciplina.'
					AND esco.id = '.$escola.'
					AND u.id IN ('.implode(",",$usersid).')
					GROUP BY ue.id',array());
				}else{
					$alunos = $DB->get_records_sql('SELECT @curRank := @curRank + 1 AS rank, g.name, u.firstname, u.lastname, u.email,DATE_FORMAT(FROM_UNIXTIME(u.lastaccess), "%d/%m/%Y") AS last, u.lastaccess, esco.desc_nome, c.fullname, cc.timecompleted, esco.cod_mec, en.password AS cod_inscricao
					FROM (SELECT @curRank := 0) r, mdl_user AS u 
					JOIN mdl_user_info_data AS ui ON u.id = ui.userid
					JOIN mdl_user_enrolments AS ue ON ue.userid = u.id 
					JOIN mdl_enrol AS en ON en.id = ue.enrolid 
					JOIN mdl_course AS c ON en.courseid = c.id 
					JOIN mdl_course_completions AS cc ON cc.userid = u.id
					JOIN mdl_escola AS esco ON esco.id = ui.data
							AND ui.fieldid = 5
					JOIN mdl_groups_members AS gm ON gm.userid = u.id
					JOIN mdl_groups AS g ON g.id = gm.groupid
					WHERE u.id IN (
						SELECT DISTINCT u.id
						FROM mdl_user AS u
						JOIN mdl_role_assignments AS ra ON ra.userid = u.id
						JOIN mdl_user_info_data AS ui ON ui.userid = u.id
										and ui.fieldid = 5
						WHERE ra.roleid = 9
						AND ra.contextid = 1
					) 
					'.$queryPartDisciplina.'
					AND esco.id IN ('.implode(",",$assID).')
					AND u.id IN ('.implode(",",$usersid).')
					GROUP BY ue.id',array());
				}
			
				$return = '<table class="table table-bordered" id="alunos_table" >
							<thead>
								<tr>
									<th>Código de Inscrição</th>
									<th>Grupo</th>
									<th>Nome</th>
									<th>Sobrenome</th>
									<th>Email</th>
									<th>Código MEC</th>
									<th>Escola</th>
									<th>Curso</th>
									<th>Status</th>
									<th>Último Acesso</th>
								</tr>
							</thead>
							<tbody>';
				foreach($alunos as $aluno){
					$return .= '<tr>
									<td>'.$aluno->cod_inscricao.'</td>
									<td>'.$aluno->name.'</td>
									<td>'.$aluno->firstname.'</td>
									<td>'.$aluno->lastname.'</td>
									<td>'.$aluno->email.'</td>
									<td>'.$aluno->cod_mec.'</td>
									<td>'.$aluno->desc_nome.'</td>
									<td>'.$aluno->fullname.'</td>';

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
					if($aluno->last == "31/12/1969"){
						$return .='	<td>Nunca Acessou</td>';
					}else{
						$return .='	<td>'.$aluno->last.'</td>';
					}

				}
				$return .='</tbody></table></tr>';
				echo $return;
			}
			
            break;
			
			
			
			
		case 'alunosTableSchool':
            $escola = $_REQUEST['escola'];
            $disciplina = $_REQUEST['disciplina'];
			$semEscola = $_REQUEST['semEscola'];
			$querypart = '';
			$queryPartDisciplina = '';
			$todasDisciplinas = array();
			
			
			if ($escola != 1){
				$querypart = 'AND ui.data = "'.$escola.'"';
			}else{
				$querypart = '';
			}
			
			$total = $DB->get_records_sql('SELECT DISTINCT cs.* FROM {course} AS cs 
											INNER JOIN {enrol} AS en on cs.id = en.courseid 
											INNER JOIN {user_enrolments} AS ue on en.id = ue.enrolid 
											WHERE ue.userid ='.$USER->id.' ORDER BY cs.fullname ASC',array());
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
													'.$querypart.')',array());
				if($valor->total > 0){
					$todasDisciplinas[] = $curso->id;
				}
            }
			
			
			if ($disciplina != 1){
				$queryPartDisciplina = 'AND c.id = '.$disciplina.' AND cc.course = '.$disciplina.'';
				$queryPartGrupo = 'c.id = '.$disciplina;
			}else{
				$queryPartDisciplina = 'AND c.id IN ('.implode(',',$todasDisciplinas).') AND cc.course IN ('.implode(',',$todasDisciplinas).')';
				$queryPartGrupo = 'c.id IN ('.implode(',',$todasDisciplinas).')';
			}
			
			
			$usersid = array();
			$uss = $DB->get_record_sql('SELECT * FROM {user} WHERE id ='.$USER->id);
		   
			
			$u = $DB->get_records_sql('SELECT DISTINCT userid 
								  FROM {groups_members} AS gm
								  JOIN {groups} AS g ON g.id = gm.groupid
								  JOIN {course} AS c ON c.id = g.courseid
								  WHERE '.$queryPartGrupo,array());
			
			foreach ($u as $person) {
			   $usersid[] = $person->userid;
			}
			
			
			
			if ($semEscola == "true"){
				
				$alunos = $DB->get_records_sql('SELECT @curRank := @curRank + 1 AS rank, g.name, u.firstname, u.lastname, u.email,DATE_FORMAT(FROM_UNIXTIME(u.lastaccess), "%d/%m/%Y") AS last, u.lastaccess, ui.data, c.fullname, cc.timecompleted, en.password AS cod_inscricao
				FROM (SELECT @curRank := 0) r, mdl_user AS u 
				JOIN mdl_user_info_data AS ui ON u.id = ui.userid
				JOIN mdl_user_enrolments AS ue ON ue.userid = u.id 
				JOIN mdl_enrol AS en ON en.id = ue.enrolid 
				JOIN mdl_course AS c ON en.courseid = c.id 
				JOIN mdl_course_completions AS cc ON cc.userid = u.id]
				JOIN mdl_groups_members AS gm ON gm.userid = u.id
				JOIN mdl_groups AS g ON g.id = gm.groupid
				WHERE u.id IN (
					SELECT DISTINCT u.id
					FROM mdl_user AS u
					JOIN mdl_role_assignments AS ra ON ra.userid = u.id
					WHERE ra.roleid = 9
					AND ra.contextid = 1
				) 
				'.$queryPartDisciplina.'
				AND u.id IN ('.implode(",",$usersid).')
				AND ui.fieldid = 2
				GROUP BY ue.id',array());

				$return = '<table class="table table-bordered" id="alunos_table" >
							<thead>
								<tr>
									<th>Código de Inscrição</th>
									<th>Grupo</th>
									<th>Nome</th>
									<th>Sobrenome</th>
									<th>Email</th>
									<th>Código MEC</th>
									<th>Escola</th>
									<th>Curso</th>
									<th>Status</th>
									<th>Último Acesso</th>
								</tr>
							</thead>
							<tbody>';

				foreach($alunos as $aluno){
					$return .= '<tr>
									<td>'.$aluno->cod_inscricao.'</td>
									<td>'.$aluno->name.'</td>
									<td>'.$aluno->firstname.'</td>
									<td>'.$aluno->lastname.'</td>
									<td>'.$aluno->email.'</td>
									<td>indisponível na consulta</td>
									<td>'.$aluno->data.'</td>
									<td>'.$aluno->fullname.'</td>';

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
					if($aluno->last == "31/12/1969"){
						$return .='	<td>Nunca Acessou</td>';
					}else{
						$return .='	<td>'.$aluno->last.'</td>';
					}
				}
				$return .='</tbody></table></tr>';
				echo $return;
			}else{
				
				$escolasGrupo = $DB->get_records_sql('SELECT DISTINCT ui.data, esco.desc_nome
													FROM mdl_user AS u
													JOIN mdl_role_assignments as ra ON ra.userid = u.id
													JOIN mdl_user_info_data AS ui ON ui.userid = u.id
														AND ui.fieldid = 5
													JOIN mdl_escola AS esco ON ui.data = esco.id
														WHERE u.id IN ('.implode(',',$usersid).')
													AND ra.roleid = 9
													ORDER BY esco.desc_nome ASC',array());
				$assID = array();
				foreach($escolasGrupo as $escolaGrup){
				   $assID[] = $escolaGrup->data;
				}
				
				
				if($escola != 1){
					$alunos = $DB->get_records_sql('SELECT @curRank := @curRank + 1 AS rank, g.name, u.firstname, u.lastname, u.email,DATE_FORMAT(FROM_UNIXTIME(u.lastaccess), "%d/%m/%Y") AS last, u.lastaccess, esco.desc_nome, c.fullname, cc.timecompleted, esco.cod_mec, en.password AS cod_inscricao
					FROM (SELECT @curRank := 0) r, mdl_user AS u 
					JOIN mdl_user_info_data AS ui ON u.id = ui.userid
					JOIN mdl_user_enrolments AS ue ON ue.userid = u.id 
					JOIN mdl_enrol AS en ON en.id = ue.enrolid 
					JOIN mdl_course AS c ON en.courseid = c.id 
					JOIN mdl_course_completions AS cc ON cc.userid = u.id
					JOIN mdl_escola AS esco ON esco.id = ui.data
							AND ui.fieldid = 5
					JOIN mdl_groups_members AS gm ON gm.userid = u.id
					JOIN mdl_groups AS g ON g.id = gm.groupid
					WHERE u.id IN (
						SELECT DISTINCT u.id
						FROM mdl_user AS u
						JOIN mdl_role_assignments AS ra ON ra.userid = u.id
						JOIN mdl_user_info_data AS ui ON ui.userid = u.id
										and ui.fieldid = 5
						WHERE ra.roleid = 9
						AND ra.contextid = 1
					) 
					'.$queryPartDisciplina.'
					AND esco.id = '.$escola.'
					AND u.id IN ('.implode(",",$usersid).')
					GROUP BY ue.id',array());
				}else{
					$alunos = $DB->get_records_sql('SELECT @curRank := @curRank + 1 AS rank, g.name, u.firstname, u.lastname, u.email,DATE_FORMAT(FROM_UNIXTIME(u.lastaccess), "%d/%m/%Y") AS last, u.lastaccess, esco.desc_nome, c.fullname, cc.timecompleted, esco.cod_mec, en.password AS cod_inscricao
					FROM (SELECT @curRank := 0) r, mdl_user AS u 
					JOIN mdl_user_info_data AS ui ON u.id = ui.userid
					JOIN mdl_user_enrolments AS ue ON ue.userid = u.id 
					JOIN mdl_enrol AS en ON en.id = ue.enrolid 
					JOIN mdl_course AS c ON en.courseid = c.id 
					JOIN mdl_course_completions AS cc ON cc.userid = u.id
					JOIN mdl_escola AS esco ON esco.id = ui.data
							AND ui.fieldid = 5
					JOIN mdl_groups_members AS gm ON gm.userid = u.id
					JOIN mdl_groups AS g ON g.id = gm.groupid
					WHERE u.id IN (
						SELECT DISTINCT u.id
						FROM mdl_user AS u
						JOIN mdl_role_assignments AS ra ON ra.userid = u.id
						JOIN mdl_user_info_data AS ui ON ui.userid = u.id
										and ui.fieldid = 5
						WHERE ra.roleid = 9
						AND ra.contextid = 1
					) 
					'.$queryPartDisciplina.'
					AND esco.id IN ('.implode(",",$assID).')
					AND u.id IN ('.implode(",",$usersid).')
					GROUP BY ue.id',array());
				}
			
				$return = '<table class="table table-bordered" id="alunos_table" >
							<thead>
								<tr>
									<th>Código de Inscrição</th>
									<th>Grupo</th>
									<th>Nome</th>
									<th>Sobrenome</th>
									<th>Email</th>
									<th>Código MEC</th>
									<th>Escola</th>
									<th>Curso</th>
									<th>Status</th>
									<th>Último Acesso</th>
								</tr>
							</thead>
							<tbody>';
				foreach($alunos as $aluno){
					$return .= '<tr>
									<td>'.$aluno->cod_inscricao.'</td>
									<td>'.$aluno->name.'</td>
									<td>'.$aluno->firstname.'</td>
									<td>'.$aluno->lastname.'</td>
									<td>'.$aluno->email.'</td>
									<td>'.$aluno->cod_mec.'</td>
									<td>'.$aluno->desc_nome.'</td>
									<td>'.$aluno->fullname.'</td>';

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
					if($aluno->last == "31/12/1969"){
						$return .='	<td>Nunca Acessou</td>';
					}else{
						$return .='	<td>'.$aluno->last.'</td>';
					}

				}
				$return .='</tbody></table></tr>';
				echo $return;
			}
			
            break;

       case 'etapasTable':
            $escola = $_REQUEST['escola'];
            $disciplina = $_REQUEST['disciplina'];
            $return = array();
			
			
			
            $idQuiz = $DB->get_records_sql('SELECT id FROM {quiz} WHERE course = '.$disciplina,array());
            foreach($idQuiz as $id){
                $return[] = +$id->id;
            }
			
			$quizTotal = count($return);
			
			if ($idQuiz == false){
				$idQuiz = $DB->get_records_sql('SELECT id FROM {assign} WHERE course = '.$disciplina,array());
				foreach($idQuiz as $id){
					$return[] = $id->id;
				}
				
				$quizTotal = count($return);
				$quizes = $DB->get_records_sql('SELECT @curRank := @curRank + 1 AS rank, u.id ,ag.grade,ag.assignment,u.firstname, u.lastname, u.email,DATE_FORMAT(FROM_UNIXTIME(u.lastaccess), "%d/%m/%Y") AS last 
				FROM(SELECT @curRank := 0) r, mdl_assign_grades AS ag 
				JOIN mdl_user AS u ON ag.userid = u.id
				WHERE u.id IN('.implode(",",$_SESSION['USERSIDS']).') 
				AND ag.assignment IN ('.implode(",",$return).')',array());
			
			}else{
				$quizes = $DB->get_records_sql('SELECT @curRank := @curRank + 1 AS rank, u.id ,qg.grade,qg.quiz,u.firstname, u.lastname, u.email,DATE_FORMAT(FROM_UNIXTIME(u.lastaccess), "%d/%m/%Y") AS last 
				FROM(SELECT @curRank := 0) r, mdl_quiz_grades AS qg 
				JOIN mdl_user AS u ON qg.userid = u.id 
				JOIN mdl_user_info_data AS ui ON ui.userid = u.id
				WHERE u.id IN(
				SELECT DISTINCT u.id
					FROM mdl_user AS u
					JOIN mdl_role_assignments AS ra ON ra.userid = u.id
					JOIN mdl_user_info_data AS ui ON ui.userid = u.id
									and ui.fieldid = 2
					WHERE ra.roleid = 9
					AND ra.contextid = 1
				) 
				AND ui.data = "'.$escola.'"
				AND qg.quiz IN ('.implode(",",$return).')',array());
			}
			
			
			
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
            
			
			for($i = 1; $i <= $quizTotal ; $i++){
                $return .= '<th>Etapa '.$i.'</th>';
            }
			
            $return .= '</thead><tbody>';
            foreach ($quizes as $quiz) {
                $return .= '<tr>';
                $return .= '<td>'.$quiz[0]['firstname'].'</td><td>'.$quiz[0]['lastname'].'</td><td>'.$quiz[0]['email'].'</td><td>'.$quiz[0]['last'].'</td>';
                $cont = $maximum;
				
                for($i = 1; $i <= $quizTotal; $i++){
					
                    if($cont <= count($quiz) && $cont != 0){
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
            $escola = $_REQUEST['escola'];
            $disciplina = $_REQUEST['disciplina'];
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
				$quizes = $DB->get_records_sql('SELECT @curRank := @curRank + 1 AS rank, u.id ,ag.grade,ag.assignment,u.firstname, u.lastname, u.email,DATE_FORMAT(FROM_UNIXTIME(u.lastaccess), "%d/%m/%Y") AS last 
				FROM(SELECT @curRank := 0) r, mdl_assign_grades AS ag 
				JOIN mdl_user AS u ON ag.userid = u.id
				WHERE u.id IN(SELECT DISTINCT u.id
													FROM mdl_user AS u
													JOIN mdl_role_assignments AS ra ON ra.userid = u.id
													JOIN mdl_user_info_data AS ui ON ui.userid = u.id
																	and ui.fieldid = 5
													WHERE ra.roleid = 9
													AND ui.data = "'.$escola.'") 
				AND ag.assignment IN ('.implode(",",$return).')',array());
			} else {
				
				$quizes = $DB->get_records_sql('SELECT @curRank := @curRank + 1 AS rank, u.id ,qg.grade,qg.quiz,
                u.firstname, u.lastname, u.email,DATE_FORMAT(FROM_UNIXTIME(u.lastaccess), "%d/%m/%Y") AS last 
                FROM(SELECT @curRank := 0) r, {quiz_grades} AS qg 
                JOIN {user} AS u ON qg.userid = u.id 
                WHERE u.id IN(SELECT DISTINCT u.id
													FROM mdl_user AS u
													JOIN mdl_role_assignments AS ra ON ra.userid = u.id
													JOIN mdl_user_info_data AS ui ON ui.userid = u.id
																	and ui.fieldid = 5
													WHERE ra.roleid = 9
													AND ui.data = "'.$escola.'") 
                AND qg.quiz IN ('.implode(",",$return).')',array());
				
			}
			
			
			
			
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
		
            $return = array();
			$escola = $_REQUEST['escola'];
			$querypart = '';
			
			if ($escola != 1){
				$querypart = 'AND ui.data = "'.$escola.'"';
			}else{
				$querypart = '';
			}
			
			$total = $DB->get_records_sql('SELECT DISTINCT cs.* FROM {course} AS cs 
											INNER JOIN {enrol} AS en on cs.id = en.courseid 
											INNER JOIN {user_enrolments} AS ue on en.id = ue.enrolid 
											WHERE ue.userid ='.$_REQUEST['userid'].' ORDER BY cs.fullname ASC',array());
			
			
            $return = '';
			//$return .= '<option value="1">Todas</option>';
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
													'.$querypart.')',array());
				if($valor->total > 0){
					
                	$return .= '<option value="'.$curso->id.'">'.$curso->fullname.'</option>';
				}
            }
            echo $return;
            break;
			
			
       case 'disciplinasSchool' :
		
            $return = array();
			$escola = $_REQUEST['escola'];
			$querypart = '';
			
			if ($escola != 1){
				$querypart = 'AND ui.data = "'.$escola.'"';
			}else{
				$querypart = '';
			}
			
			$total = $DB->get_records_sql('SELECT DISTINCT cs.* FROM {course} AS cs 
											INNER JOIN {enrol} AS en on cs.id = en.courseid 
											INNER JOIN {user_enrolments} AS ue on en.id = ue.enrolid
											ORDER BY cs.fullname ASC',array());
			
			
            $return = '';
			//$return .= '<option value="1">Todas</option>';
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
													'.$querypart.')',array());
				if($valor->total > 0){
					
                	$return .= '<option value="'.$curso->id.'">'.$curso->fullname.'</option>';
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
            $args = func_REQUEST_args();
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
    if(isset($_REQUEST['perfil']) && $_REQUEST['perfil'] != 0){
        $sql->from .= ' INNER JOIN {role_assignments} AS ra ON ui.userid = ra.userid ';
        $sql->where .= ' ui.fieldid = '.$_SESSION['FIELDIDS']['faculdade'].' AND ui.data = "'.$_REQUEST['escola'].'" AND ra.contextid = 1 AND ra.roleid = '.$_REQUEST['perfil'].' ';
    }else{
        $sql->where .= ' ui.fieldid = '.$_SESSION['FIELDIDS']['faculdade'].' AND ui.data = "'.$_REQUEST['escola'].'" ';
    }
    //return $sql->select.$sql->from.$sql->where;
    $userids = $DB->get_records_sql($sql->select.$sql->from.$sql->where,array());
    if(!$userids){
        return 0;
    }
    if(isset($_REQUEST['segmento']) && $_REQUEST['segmento'] != "0"){
        foreach($userids as $id){
            $return[] = $id->userid;
        }
        $sql->select = $sql->defaultSelect.' userid ';
        $sql->from = $sql->defaultFrom.' {user_info_data} ';
        $sql->where = $sql->defaultWhere.' fieldid = '.$_SESSION['FIELDIDS']['segmento'].' AND userid IN ('.implode(",",$return).') AND data ="'.$_REQUEST['segmento'].'" ';
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


