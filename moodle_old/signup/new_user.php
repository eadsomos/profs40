<?php 
    require_once('../config.php');
    
    global $DB;
    switch($_POST['update']){
        case "1":
            $validacase = FALSE;
            $email = $_POST['email'];
            $estado = $_POST['estado'];
            $bairro = $_POST['bairro'];
            $cidade = $_POST['cidade'];
            $escola = $_POST['escola'];
            $curso = $_POST['curso'];
            $segmento = $_POST['segmento'];
            $cpf = $_POST['cpf'];
            $codigo = $_POST['codigo'];
            $id = $DB->get_record_sql('SELECT id FROM {user} WHERE email = ?',array($email));
            $user = new stdClass();
            $user->id = $id->id;
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
            if(isset($_POST['noschool'])){
               $escola = ' '; 
            }
            $escoladata->data = $escola;
            $escoladata->dataformat = 0;
            $hasScholl = $DB->get_record('user_info_data',array('fieldid'=>2,'userid'=>$user->id));
            if($hasScholl){
                $escoladata->id = $hasScholl->id;
                $scsuccess = $DB->update_record('user_info_data',$escoladata);    
            }else{
                $escoladataid = $DB->insert_record('user_info_data',$escoladata);
            }
			
			
			if ($escola != "noschool"){
				$idescoladb = $DB->get_record_sql('SELECT @curRank := @curRank + 1 AS rank, id FROM (SELECT @curRank := 0) r, {escola} WHERE desc_nome = ? AND endereco_bairro = "'.$bairro.'"',array($escoladata->data));
	
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
			}
			
            $cpfdata = new stdClass();
            $cpfdata->userid = $user->id;
            $cpfdata->fieldid = 1;
            $cpfdata->data = $cpf;
            $cpfdata->dataformat = 0;
            $hasCpf = $DB->get_record('user_info_data',array('fieldid'=>1,'userid'=>$user->id));
            if($hasCpf){
                $cpfdata->id = $hasCpf->id;
                $cpfsuccess = $DB->update_record('user_info_data',$cpfdata);    
            }else{
                 $cpfdataid = $DB->insert_record('user_info_data',$cpfdata);
            }
            $bairrodata = new stdClass();
            $bairrodata->userid = $user->id;
            $bairrodata->fieldid = 4;
            $bairrodata->data = $bairro;
            $bairrodata->dataformat = 0;
            $hasbairrodata = $DB->get_record('user_info_data',array('fieldid'=>4,'userid'=>$user->id));
            if($hasbairrodata){
                $bairrodata->id = $hasbairrodata->id;
                $bairrosuccess = $DB->update_record('user_info_data',$bairrodata);    
            }else{
                 $bairrodataid = $DB->insert_record('user_info_data',$bairrodata);
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
            
            $userid = $user->id;
            $grupo = $DB->get_record('groups',array('courseid'=>$curso,'enrolmentkey'=>$codigo));
            $usergroup = new stdClass();
            $usergroup->groupid = $grupo->id;
            $usergroup->userid =$userid;
            $usergroup->itemid = 0;
            $usergroup->timeadded = time();
            $ingroup = $DB->insert_record('groups_members',$usergroup);
            $course = $curso;
            $enrolData = $DB->get_record('enrol', array('enrol'=>'self', 'courseid'=>$course,'password'=>$codigo));
            //$enrolData->customint2 = $enrolData->customint2 +1;
            $enrolSuccess = $DB->update_record('enrol', $enrolData);     
            $user_enrolment = new stdClass();                                                              
            $user_enrolment->enrolid = $enrolData->id;                                                 
            $user_enrolment->status = '0';                                                             
            $user_enrolment->userid = $userid;                                                         
            $user_enrolment->timestart = time();                                                       
            $user_enrolment->timeend =  '0';                                                           
            $user_enrolment->modifierid = 0;                                                   
            //Modifierid in this table is userid who enrolled this user manually
            $user_enrolment->timecreated = time();                                                     
            $user_enrolment->timemodified = time();                                                    
            $insertId = $DB->insert_record('user_enrolments', $user_enrolment);                            
            //addto log                                                                                    
            $context = $DB->get_record('context', array('contextlevel'=>50, 'instanceid'=>$course));          
            $role = new stdClass();                                                                        
            $role->roleid = 5;                                                                         
            $role->contextid = $context->id;                                                           
            $role->userid = $userid;                                                                   
            $role->component = '';                                                                     
            $role->itemid = 0;                                                                         
            $role->timemodified = time();                                                              
            $role->modifierid = 0;                                                             
            $insertId2 = $DB->insert_record('role_assignments', $role);
            $courseIdMail = $course;
            
            if($enrolData->customint4){
                email_welcome_message($codigo, $userid, $courseIdMail);
            }
            break;
            
        case "0":
            $validacase = TRUE;
            $nome = $_POST['nome'];
            $sobrenome = $_POST['sobrenome'];
            $cpf = $_POST['cpf'];
            $email = $_POST['email'];
            $senha = $_POST['senha'];
            $estado = $_POST['estado'];
            $cidade = $_POST['cidade'];
            $escola = $_POST['escola'];
            $bairro = $_POST['bairro'];
            $segmento = $_POST['segmento'];
            $curso = $_POST['curso'];
            $codigo = $_POST['codigo'];
            $user = new stdClass();
            $user->auth = 'manual';
            $user->confirmed = 1;
            $user->mnethostid = 1;
            $user->username = $email;
            $user->password = md5($senha);
            $user->country = 'BR';
            $user->firstname = $nome;
            $user->lastname = $sobrenome;
            $user->email = $email;
            $user->city = $cidade;
			$user->lang = 'pt_br';
            $user->id = $DB->insert_record('user', $user);
            $cpfdata = new stdClass();
            $cpfdata->userid = $user->id;
            $cpfdata->fieldid = 1;
            $cpfdata->data = $cpf;
            $cpfdata->dataformat = 0;
            $cpfdataid = $DB->insert_record('user_info_data',$cpfdata);
            
			
			$escoladata = new stdClass();
            $escoladata->fieldid = 2;
            $escoladata->userid = $user->id;
            if(isset($_POST['noschool'])){
               $escola = ' '; 
            }
            $escoladata->data = $escola;
            $escoladata->dataformat = 0;
            
            
			if ($escola != "noschool"){
				$escoladataid = $DB->insert_record('user_info_data',$escoladata);
				$idescoladb = $DB->get_record_sql('SELECT @curRank := @curRank + 1 AS rank, id FROM (SELECT @curRank := 0) r, {escola} WHERE desc_nome = ? AND endereco_bairro = "'.$bairro.'"',array($escoladata->data));
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
			}
			
			
			$bairrodata = new stdClass();
            $bairrodata->userid = $user->id;
            $bairrodata->fieldid = 4;
            $bairrodata->data = $bairro;
            $bairrodata->dataformat = 0;
            $bairrodataid = $DB->insert_record('user_info_data',$bairrodata);
            $ufdata = new stdClass();
            $ufdata->userid = $user->id;
            $ufdata->fieldid = 3;
            $ufdata->data = $estado;
            $ufdata->dataformat = 0;
            $ufdataid = $DB->insert_record('user_info_data',$ufdata);
            $segmentodata = new stdClass();
            $segmentodata->userid = $user->id;
            $segmentodata->fieldid = 7;
            $segmentodata->data = $segmento;
            $segmentodata->dataformat = 0;
            $segmentodataid = $DB->insert_record('user_info_data',$segmentodata);
            $userid = $user->id;
            $grupo = $DB->get_record('groups',array('courseid'=>$curso,'enrolmentkey'=>$codigo));
            $usergroup = new stdClass();
            $usergroup->groupid = $grupo->id;
            $usergroup->userid =$userid;
            $usergroup->itemid = 0;
            $usergroup->timeadded = time();
            $ingroup = $DB->insert_record('groups_members',$usergroup);
            $course = $curso;
            $enrolData = $DB->get_record('enrol', array('enrol'=>'self', 'courseid'=>$course,'password'=>$codigo));
            //$enrolData->customint2 = $enrolData->customint2 +1;
            $enrolSuccess = $DB->update_record('enrol', $enrolData);
            $enrolData->customtext1 = $enrolData->customtext1;          
            $user_enrolment = new stdClass();                                                              
            $user_enrolment->enrolid = $enrolData->id;                                                 
            $user_enrolment->status = '0';                                                             
            $user_enrolment->userid = $userid;                                                         
            $user_enrolment->timestart = time();                                                       
            $user_enrolment->timeend =  '0';                                                           
            $user_enrolment->modifierid = 0;                                                   
            //Modifierid in this table is userid who enrolled this user manually
            $user_enrolment->timecreated = time();                                                     
            $user_enrolment->timemodified = time();                                                    
            $insertId = $DB->insert_record('user_enrolments', $user_enrolment);

            $roleprof = new stdClass();                                                                        
            $roleprof->roleid = 9;                                                                         
            $roleprof->contextid = 1;                                                           
            $roleprof->userid = $userid;                                                                   
            $roleprof->component = '';                                                                     
            $roleprof->itemid = 0;                                                                         
            $roleprof->timemodified = time();                                                              
            $roleprof->modifierid = 0;                                                             
            $insertId3 = $DB->insert_record('role_assignments', $roleprof);       
            //addto log                                                                                    
            $context = $DB->get_record('context', array('contextlevel'=>50, 'instanceid'=>$course));       
            $role = new stdClass();                                                                        
            $role->roleid = 5;                                                                         
            $role->contextid = $context->id;                                                           
            $role->userid = $userid;                                                                   
            $role->component = '';                                                                     
            $role->itemid = 0;                                                                         
            $role->timemodified = time();                                                              
            $role->modifierid = 0;                                                             
            $insertId2 = $DB->insert_record('role_assignments', $role);  

            $courseIdMail = $course;
            
            if($enrolData->customint4){
                email_welcome_message($codigo, $userid, $courseIdMail);
            }
             
            
            break;
    }

    
    function enroll_user($userid, $course, $modifier, $curso) {                                                

        if ($validacase == TRUE) {
            //add_to_log($course, '', $modifierid, 'automated');                
            return array('user_enrolment'=>$insertId, 'role_assignment'=>$insertId2, 'role_assignmentt'=>$insertId3);
        } else {
            //add_to_log($course, '', $modifierid, 'automated');                
            return array('user_enrolment'=>$insertId, 'role_assignment'=>$insertId2);
        }                                                
                              
    }

        /**
     * Send welcome email to specified user.
     *
     * @param $codigo
     * @param stdClass $user user record
     * @param courseid
     * @return void
     */
    function email_welcome_message($codigo, $userid, $courseIdMail) {
        global $CFG, $DB, $PAGE;

        $PAGE->set_context(context_course::instance($courseIdMail));

        $enrolData = $DB->get_record('enrol', array('enrol'=>'self', 'courseid'=>$courseIdMail,'password'=>$codigo));
        $userInfo = $DB->get_record('user', array('id'=>$userid));

        $course = $DB->get_record('course', array('id'=>$courseIdMail), '*', MUST_EXIST);
        $context = context_course::instance($courseIdMail);

        $a = new stdClass();
        $a->coursename = format_string($course->fullname, true, array('context'=>$context));
        $a->profileurl = "$CFG->wwwroot/user/view.php?id=$userInfo->id&course=$course->id";

        if (trim($enrolData->customtext1) !== '') {
            $message = $enrolData->customtext1;
            $key = array('{$a->coursename}', '{$a->profileurl}', '{$a->fullname}', '{$a->email}');
            $value = array($a->coursename, $a->profileurl, fullname($userInfo), $userInfo->email);
            $message = str_replace($key, $value, $message);
            if (strpos($message, '<') === false) {
                // Plain text only.
                $messagetext = $message;
                $messagehtml = text_to_html($messagetext, null, false, true);
            } else {
                // This is most probably the tag/newline soup known as FORMAT_MOODLE.
                $messagehtml = format_text($message, FORMAT_MOODLE, array('context'=>$context, 'para'=>false, 'newlines'=>true, 'filter'=>true));
                $messagetext = html_to_text($messagehtml);
            }
        } else {
            $messagetext = get_string('welcometocoursetext', 'enrol_self', $a);
            $messagehtml = text_to_html($messagetext, null, false, true);
        }

        $subject = get_string('welcometocourse', 'enrol_self', format_string($course->fullname, true, array('context'=>$context)));

        $rusers = array();
        if (!empty($CFG->coursecontact)) {
            $croles = explode(',', $CFG->coursecontact);
            list($sort, $sortparams) = users_order_by_sql('u');
            // We only use the first user.
            $i = 0;
            do {
                $rusers = get_role_users($croles[$i], $context, true, '',
                    'r.sortorder ASC, ' . $sort, null, '', '', '', '', $sortparams);
                $i++;
            } while (empty($rusers) && !empty($croles[$i]));
        }
        if ($rusers) {
            $contact = reset($rusers);
        } else {
            $contact = core_user::get_support_user();
        }

        // Directly emailing welcome message rather than using messaging.
        email_to_user($userInfo, $contact, $subject, $messagetext, $messagehtml);

        header("location:success.php");
    }
?>