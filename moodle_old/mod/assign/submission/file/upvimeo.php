<?php
    require_once('../../../../config.php');
    require("Exceptions/ExceptionInterface.php");
    require("Exceptions/VimeoRequestException.php");
    require("Exceptions/VimeoUploadException.php");
    require_once("Vimeo.php");
    global $CFG,$DB;
    error_reporting(E_ALL);
    ini_set('display_errors', 'on');
    $uploaddir = 'videos/';
    $uploadfile = $uploaddir . $_POST['usuario_id'].'__'.$_POST['id_atividade'].'__'. basename($_FILES['file']['name']);
    
    if (move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile)) {
        $videorecord = new stdClass();
        $user = $DB->get_record('user',array('id'=>$_POST['usuario_id']));
        $assign = $DB->get_record('assign',array('id'=>$_POST['id_atividade']));
        $course = $DB->get_record('course',array('id'=>$assign->course));
        $vimeo = new \Vimeo\Vimeo('aa36091278c67d6fa753658b2cd8f9a34f762bd8', 'qBwCT5K3tJPp2WoZLhKWNh0eGPIvQNdQaWoxNTW4oc2yCClzP33lpcj5crE6AsCF4XLT1YocEIlRPJjQaVJ3BgzBJ1ZoEACeBIPXJSv7+A4BUX02Bj2zcGt0lY//HrbX', '4f480af3ef2605266e8dc9b9de059947');
        $nomearquivo = 'atividade_'.$_POST['id_atividade'].'_'.$course->shortname.'_'.$user->firstname.$user->lastname; //.id_da_atividade.'_'.$currentgroupname ;
        $uri = $vimeo->upload($uploadfile);
        $response = $vimeo->request($uri, array('name' =>$nomearquivo,'description' => 'none'  , 'privacy.view' =>'users' , 'privacy.add' => true), 'PATCH');
        $vimeo->request('/albums/3833271'.$uri,array(),'PUT');
      //  unlink($uploadfile); 
        $videorecord->assign =  $_POST['id_atividade'];
        $videorecord->author = $user->username;
        $videorecord->link = $uri;  
        $videorecord->embed = $response['body']['embed']['html'];
        $oldvideo = $DB->get_record('assign_vimeo', array('assign'=>$_POST['id_atividade'],'author'=>$user->username));
        if($oldvideo){
            $oldvideo->link = $uri;
            $oldvideo->embed = $response['body']['embed']['html'];
            $lastid = $DB->update_record('assign_vimeo',$oldvideo);
            $oldassign = $DB->get_record('assign_submission',array('assignment'=>$_POST['id_atividade'],'userid'=>$user->id));
            $oldassign->status = 'submitted';
            $date = new DateTime();
            $oldassign->timemodified = $date->getTimestamp();
            $lastAssign = $DB->update_record('assign_submission',$oldassign);
        }else{
            $lastid = $DB->insert_record('assign_vimeo',$videorecord);
            $assignSub = new stdClass();
            $assignSub->assignment = $assign->id;
            $assignSub->userid = $user->id;
            $date = new DateTime();
            $assignSub->timemodified = $date->getTimestamp();
            $assignSub->timecreated = $date->getTimestamp();
            $assignSub->status = 'submitted';
            $assignSub->groupid = 0;
            $assignSub->attemptnumber = 0;
            $assignSub->latest = 1;
            $lastAssignSub = $DB->insert_record('assign_submission',$assignSub);
            $assignFile = new stdClass();
            $assignFile->assignment = $assign->id;
            $assignFile->submission = $lastAssignSub;
            $assignFile->numfiles = 1;
            $lastAssignFile = $DB->insert_record('assignsubmission_file',$assignFile);
        }          
        echo "Arquivo válido e enviado com sucesso.\n";
    } else {
       
    }
   

    
    
    

?>