<?php 
   require_once(__DIR__ . '/../../config.php');
   require_once(__DIR__ . '/../../login/lib.php');
   require_once('variables.php');
   global $USER,$DB;
   
   $userid = required_param('userid', PARAM_INT);
   if (!isloggedin()) {
       header("location:../../index.php");
   }
   $idScholls = $DB->get_records_sql('SELECT DISTINCT data FROM {user_info_data} WHERE fieldid = 5 AND data > 0');
   $arr= array();
   foreach($idScholls as $iscool){
       $arr[] = $iscool->data;
   }
   
   $allSchools = $DB->get_records_sql('SELECT id, desc_nome FROM {escola} WHERE id IN ('.implode(",",$arr).')');
   
   $nomesEscolas = $DB->get_records_sql('SELECT DISTINCT data FROM {user_info_data} WHERE fieldid = '.$_SESSION['FIELDIDS']['faculdade'].' ORDER BY data ASC',array());
   $schoolsFinal = array();
   foreach($nomesEscolas as $esc){
       foreach($allSchools as $sco){
           if($esc->data == $sco->desc_nome){
               $schoolsFinal[] = array('id'=>$sco->id,'nome'=>$sco->desc_nome);
           }
       }
   }
   //echo '<h1>'.count($schoolsFinal).'</h1>';
   $segmentos = $DB->get_records_sql('SELECT DISTINCT data FROM mdl_user_info_data WHERE fieldid ='.$_SESSION['FIELDIDS']['segmento'],array());
?>

<!DOCTYPE html>
<html>
<head>
<!-- Meta, title, CSS, favicons, etc. -->
<meta charset="utf-8">
<title>Fusion - A Responsive HTML5 Admin UI Template Theme</title>
<meta name="keywords" content="HTML5 Bootstrap 3 Admin Template UI Theme" />
<meta name="description" content="Fusion - A Responsive HTML5 Admin UI Template Theme">
<meta name="author" content="AdminDesigns">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- Font CSS (Via CDN) -->
<link rel='stylesheet' type='text/css' href='http://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700,800'>

<!-- Bootstrap CSS -->
<link rel="stylesheet" type="text/css" href="vendor/bootstrap/css/bootstrap.min.css">

<!-- Required Plugin CSS 
<link rel="stylesheet" type="text/css" href="vendor/plugins/morris/morris.css">
<link rel="stylesheet" type="text/css" href="vendor/plugins/datatables/css/datatables.min.css">
-->

<!-- Theme CSS -->
<link rel="stylesheet" type="text/css" href="css/vendor.css">
<link rel="stylesheet" type="text/css" href="css/theme.css">
<link rel="stylesheet" type="text/css" href="css/utility.css">
<link rel="stylesheet" type="text/css" href="css/custom.css">

<!-- Favicon -->
<link rel="shortcut icon" href="img/favicon.ico">

<!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
<!--[if lt IE 9]>
  <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
  <script src="https://oss.maxcdn.com/libs/respond.js/1.3.0/respond.min.js"></script>
<![endif]-->

</head>
<body class="dashboard-page">
<script> var boxtest = localStorage.getItem('boxed'); if (boxtest === 'true') {document.body.className+=' boxed-layout';} </script> 
<!-- Start: Theme Preview Pane -->


<!-- Start: Header -->
<header class="navbar navbar-fixed-top">
  <div class="navbar-branding"> <span id="toggle_sidemenu_l" class="glyphicons glyphicons-show_lines"></span> <a class="navbar-brand" href="dashboard.html"><img src="img/logos/header-logo.png"></a> </div>
  <div class="navbar-left">
    <div class="navbar-divider"></div>
    
  </div>
  <div class="navbar-right">
    
    
  </div>
</header>

<!-- Start: Main -->
<div id="main"> 
  
  <!-- Start: Sidebar -->
  <aside id="sidebar_left">
    <div class="user-info">
      <div class="media"> <a class="pull-left" href="#">
        <div class="media-object border border-purple br64 bw2 p2"> <img class="br64" src="img/avatars/5.jpg" alt="..."> </div>
        </a>
        <div class="mobile-link"> <span class="glyphicons glyphicons-show_big_thumbnails"></span> </div>
        <div class="media-body">
          <h5 class="media-heading mt5 mbn fw700 cursor"><?php echo $USER->username; ?><span class="caret ml5"></span></h5>
          
        </div>
      </div>
    </div>
    <div class="user-divider"></div>
    <div class="user-menu">
      <div class="row text-center mb15">
        <div class="col-xs-4"> <a href="dashboard.html"> <span class="glyphicons glyphicons-home fs22 text-blue2"></span>
          <h5 class="fs11">Home</h5>
          </a> </div>
        <div class="col-xs-4"> <a href="messages.html"> <span class="glyphicons glyphicons-inbox fs22 text-orange2"></span>
          <h5 class="fs11">Inbox</h5>
          </a> </div>
        <div class="col-xs-4"> <a href="tables.html"> <span class="glyphicons glyphicons-bell fs22 text-purple2"></span>
          <h5 class="fs11">Data</h5>
          </a> </div>
      </div>
      <div class="row text-center">
        <div class="col-xs-4 text-center"> <a href="timeline.html"> <span class="glyphicons glyphicons-imac fs22 text-grey3"></span>
          <h5 class="fs11">Views</h5>
          </a> </div>
        <div class="col-xs-4"> <a href="profile.html"> <span class="glyphicons glyphicons-settings fs22 text-green2"></span>
          <h5 class="fs11">Settings</h5>
          </a> </div>
        <div class="col-xs-4"> <a href="gallery.html"> <span class="glyphicons glyphicons-restart fs22 text-light6"></span>
          <h5 class="fs11">Images</h5>
          </a> </div>
      </div>
    </div>
    <div class="sidebar-menu">
      <ul class="nav">
        <li> <a href=<?php echo '"index.php?userid='.$USER->id.'"'; ?> class="ajax-disable"><span class="glyphicons glyphicons-eyedropper"></span> <span class="sidebar-title">Dashboard</span> <span class="sidebar-title-tray"> <span class="label label-xs bg-purple2">New</span> </span> </a> </li>
        <li> <a href=<?php echo '"datatable.php?userid='.$USER->id.'"'; ?> class="ajax-disable"><span class="glyphicons glyphicons-inbox"></span><span class="sidebar-title">Datatables</span></a> </li>
        
      </ul>
    </div>
  </aside>
  
  <!-- Start: Content -->
  <section id="content_wrapper">
    <div id="topbar">
      <div class="topbar-left">
        <ol class="breadcrumb">
          <li class="crumb-active">Escola <select id='school'><option value='0'>Selecione a escola</option><?php foreach ($schoolsFinal as $escola) { echo '<option value="'.$escola['nome'].'">'.$escola['nome'].'</option>';}      ?></select></li>
          <li class="crumb-link">Disciplina <select id="disciplina"><option value="0">Selecione a disciplina</option></select></li>
          <li class="crumb-link"><button class="btn btn-primary btn-xs" id="filtrar"> Filtrar </button></li>
        </ol>
      </div>
      <div class="topbar-right">
        <div class="dashboard-widget-tray">
          
        </div>
      </div>
    </div>
    <div id="content">
        <div class="modal fade bs-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" id="myModal">
            <div class="modal-dialog modal-sm" role="document">
                <div class="modal-content">
                    <h1>Buscando informações</h1>
                    <img src="http://www.smokexmirrors.com/skin/frontend/base/default/storelocator/images/loading/loading_big.gif"/>
                </div>
            </div>
        </div>  
      
      <div class="row">
        <div class='col-md-12'>
            <div class="panel" style="padding:15px">
                <div class="panel-headings">
                    <h1>Alunos da Escola</h1> 
                </div>   
                <div class="panel-body">
                    <div class="table-responsive">
                      <table class="table table-bordered" id="alunos_table" >
                        <thead>
                          <tr>
                            <th>Nome</th>
                          <th>Sobrenome</th>
                          <th>Email</th>
                          <th>Escola</th>
                                            <th>Curso</th>
                          <th>Segmento</th>
                                            <th>Último Acesso</th>
                                            <th>Status</th>
                        </tr>
                        </thead>
                        <tbody id='alunos'>
                            
                        </tbody>
                      </table>							
					          </div>
                </div>
            </div>
        </div>       
      </div>
    
      
      <div class="row">
        <div class='col-md-12'>
            <div class="panel" style="padding:15px">
                <div class="panel-headings">
                    <h1>Relação alunos/etapas</h1> 
                </div>   
                <div class="panel-body">
                    <div class="table-responsive" id="etapas">
                      						
					          </div>
                </div>
            </div>
        </div>       
      </div>
      <div class="row">
        <div class='col-md-12'>
            <div class="panel" style="padding:15px">
                <div class="panel-headings">
                    <h1>Relação alunos/notas</h1> 
                </div>   
                <div class="panel-body">
                    <div class="table-responsive" id="notas">
                      						
					          </div>
                </div>
            </div>
        </div>       
      </div>
    </div>
  </section>
  
  <!-- Start: Right Sidebar -->
  
</div>
<!-- End #Main --> 

<!-- Google Map API --> 
<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=true"></script> 

<!-- jQuery --> 
<script type="text/javascript" src="vendor/jquery/jquery-1.11.1.min.js"></script> 
<script type="text/javascript" src="vendor/jquery/jquery_ui/jquery-ui.min.js"></script> <!-- Bootstrap --> 
<script type="text/javascript" src="vendor/bootstrap/js/bootstrap.min.js"></script> 


<!-- Page Plugins --> 
<script type="text/javascript" src="vendor/plugins/raphael/raphael.js"></script> 


<!-- Flot Plugins --> 
<script type="text/javascript" src="vendor/plugins/jqueryflot/jquery.flot.min.js"></script> 
<script type="text/javascript" src="vendor/plugins/jqueryflot/jquery.flot.resize.min.js"></script> 
<script type="text/javascript" src="vendor/plugins/jqueryflot/jquery.flot.pie.min.js"></script> 
<script type="text/javascript" src="js/pages/charts.js"></script> 

<!-- Theme Javascript --> 
<script type="text/javascript" src="js/utility/spin.min.js"></script> 
<script type="text/javascript" src="js/utility/underscore-min.js"></script> 
<script type="text/javascript" src="js/main.js"></script> 
<script type="text/javascript" src="js/ajax.js"></script> 
<script type="text/javascript" src="js/custom.js"></script> 
<script type="text/javascript" src="vendor/plugins/datatables/js/jquery.dataTables.min.js"></script> 
<script type="text/javascript" src="vendor/plugins/datatables/js/datatables.js"></script>
<script type="text/javascript">
jQuery(document).ready(function () {
  "use strict";
  // Init Theme Core 	  
  Core.init();
  // Enable Ajax Loading 	  
  Ajax.init();
  var randomColorGenerator = function () { 
                    return '#' + (Math.random().toString(16) + '0000000').slice(2, 8); 
                };
             
             var escola = '';
             var userid = $('#userid').val();
             $('#school').change(function(){
                 /*alert(escola);
                 alert(segmento);
                 alert(perfil);*/
                 escola = $(this).find('option:selected').val();
                 if($(this).find('option:selected').val() == 0){
                     return;
                 }
                 disciplinas(escola);
                 updateUsersIds(escola);
             });
            
             
             $('#filtrar').click(function(){
                 filtrar();
             });
             function filtrar(){
                 alunosTable(escola);
                 etapasTable(escola);
                 notasTable(escola);
             }
             function alunosTable(escola){
                var disciplina =  $('#disciplina').find('option:selected').val()
                $('#myModal').modal({backdrop: false}); 
                $.ajax({
                     method: "POST",
                     url: "format_table.php",
                     dataType: "html",
                     data: { function: "alunosTable", escola : escola ,disciplina :disciplina}
                         })
                     .done(function(data){
                        //alert(data);
                        $('#alunos').html(data);
                        $('#alunos_table').dataTable();
                        $('#myModal').modal('hide');
                     });
             }
             function etapasTable(escola){
                var disciplina =  $('#disciplina').find('option:selected').val()
                $('#myModal').modal({backdrop: false}); 
                $.ajax({
                     method: "POST",
                     url: "format_table.php",
                     dataType: "html",
                     data: { function: "etapasTable", escola : escola ,disciplina :disciplina}
                         })
                     .done(function(data){
                        //alert(data);
                        $('#etapas').html(data);
                        $('#etapas_table').dataTable();
                        $('#myModal').modal('hide');
                     });
             }
             function notasTable(escola){
                var disciplina =  $('#disciplina').find('option:selected').val()
                $('#myModal').modal({backdrop: false}); 
                $.ajax({
                     method: "POST",
                     url: "format_table.php",
                     dataType: "html",
                     data: { function: "notasTable", escola : escola ,disciplina :disciplina}
                         })
                     .done(function(data){
                        //alert(data);
                        $('#notas').html(data);
                        $('#notas_table').dataTable();
                        $('#myModal').modal('hide');
                     });
             }
             function updateUsersIds(escola){
                $('#myModal').modal({backdrop: false}); 
                $.ajax({
                     method: "POST",
                     url: "format_table.php",
                     dataType: "json",
                     data: { function: "update", escola : escola }
                         })
                     .done(function(data){
                        //alert(data);
                        $('#myModal').modal('hide');
                     }); 
                 
                   
             }
             function disciplinas(escola){
                $('#myModal').modal({backdrop: false}); 
                $.ajax({
                     method: "POST",
                     url: "format_table.php",
                     dataType: "html",
                     data: { function: "disciplinas", escola : escola }
                         })
                     .done(function(data){
                        //alert(data);
                        $('#disciplina').html(data);
                        $('#myModal').modal('hide');
                     }); 
             }
            
                 
			       
             
            
        
	
	

	
});
</script>
</body>
</html>