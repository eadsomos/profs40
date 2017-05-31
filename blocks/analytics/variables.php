<?php 
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
        $_SESSION['USERSIDS'] = array();
       
    }
     $_SESSION['FIELDIDS'] = array('segmento'=>7,'faculdade'=>2,'rolealuno'=>9,
     'roletutor'=>13,'roleescola'=>11,'secretaria'=>12,'idEscola'=>5);
    

?>