<?php 
   require_once(__DIR__ . '/../../config.php');
   require_once(__DIR__ . '/../../login/lib.php');
   global $USER,$DB;
   $userid = required_param('userid', PARAM_INT);
   if (!isloggedin()) {
       header("location:../../index.php");
   }
   //$context = context::instance_by_id(1);
   // $roles = get_user_roles($context, $userid, false);
   $usersid = array();
   $groupsid = $DB->get_records_sql('SELECT groupid FROM {groups_members} WHERE userid ='.$userid,array());
   foreach ($groupsid as $id) {
       $u = $DB->get_records_sql('SELECT userid FROM {groups_members} WHERE groupid ='.$id->groupid,array());
       foreach ($u as $person) {
           $usersid[] = $person->userid;
       }
   }
   $nomesEscolas = $DB->get_records_sql('SELECT DISTINCT data FROM {user_info_data} WHERE userid IN ('.implode(",",$usersid).') AND fieldid = 10 ',array());
   // A partir do papel trazer coisas diferentes
   //$grupo = groups_get_user_groups(1, $userid);
   /*$alunos = groups_get_members($groupid, $fields='u.*', $sort='lastname ASC');
   $ids = array();
   foreach ($alunos as $aluno) {
       $ids += $aluno->id;
   }
   $escolas = $DB->get_records_sql('SELECT id, data FROM {user_info_data} WHERE fieldid IN (:ids)',array($ids));
   ROLE ID = 9
   CONTEXT = 1
   mdl_role_assignments
   
   */
   
   
   ?>
<!DOCTYPE html>
<html lang="en">


<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="description" content="">
	<meta name="author" content="">
	<link rel="shortcut icon" href="images/icon.png">

	<title>Painel de acompanhamento</title>
	<link href='http://fonts.googleapis.com/css?family=Open+Sans:400,300,600,400italic,700,800' rel='stylesheet' type='text/css'>
	<link href='http://fonts.googleapis.com/css?family=Raleway:300,200,100' rel='stylesheet' type='text/css'>

	<!-- Bootstrap core CSS -->
	<link href="js/bootstrap/dist/css/bootstrap.css" rel="stylesheet">
	<link rel="stylesheet" type="text/css" href="js/jquery.gritter/css/jquery.gritter.css" />
	<link rel="stylesheet" href="fonts/font-awesome-4/css/font-awesome.min.css">

	<!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
	<!--[if lt IE 9]>
	  <script src="../../assets/js/html5shiv.js"></script>
	  <script src="../../assets/js/respond.min.js"></script>
	<![endif]-->
	<link rel="stylesheet" type="text/css" href="js/jquery.nanoscroller/nanoscroller.css" />

  	<link rel="stylesheet" type="text/css" href="js/jquery.datatables/bootstrap-adapter/css/datatables.css" />
  
	<link href="css/style.css" rel="stylesheet" />	
    
</head>
<body class="animated">

<div id="cl-wrapper">

   <div class="cl-sidebar">
         <div class="cl-toggle"><i class="fa fa-bars"></i></div>
         <div class="cl-navblock">
            <div class="menu-space">
               <div class="content">
                  <div class="side-user">
                    
                     <h2 style="color:white width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"><?php echo $USER->username; ?></h2>
                  </div>
                  <ul class="cl-vnavigation">
                     <li>
                        <a href="#"><i class="fa fa-home"></i><span>Painel de acompanhamento</span></a>
                        <ul class="sub-menu">
                           <li><a  href= "general.php?userid=<?php echo $userid; ?>" >Status da plataforma</a></li>
                           <li  class="active"><a href= "datatable.php?userid=<?php echo $userid; ?>">Detalhamento</a></li>
                        </ul>
                     </li>
                  </ul>
                  <!--<li>
                     <a href="#"><i class="fa fa-desktop"></i><span>Layouts</span></a>
                     <ul class="sub-menu">
                        <li><a href="layout-boxed.html"><span class="label label-primary pull-right">New</span>Boxed Layout</a></li>
                        <li><a href="layout-topbar.html"><span class="label label-primary pull-right">New</span>Top Menu</a></li>
                     </ul>
                     </li>
                     <li>
                     <a href="#"><i class="fa fa-smile-o"></i><span>UI Elements</span></a>
                     <ul class="sub-menu">
                        <li  ><a href="ui-elements.html">General</a></li>
                        <li  ><a href="ui-alerts.html">Alerts</a></li>
                        <li  ><a href="ui-porlets.html"><span class="label label-primary pull-right">New</span>Porlets</a></li>
                        <li  ><a href="ui-buttons.html">Buttons</a></li>
                        <li  ><a href="ui-modals.html">Modals</a></li>
                        <li  ><a href="ui-notifications.html">Notifications</a></li>
                        <li  ><a href="ui-tiles.html"><span class="label label-primary pull-right">New</span>Tiles</a></li>
                        <li  ><a href="ui-progress.html">Progress Bars</a></li>
                        <li  ><a href="ui-icons.html">Icons</a></li>
                        <li  ><a href="ui-grid.html">Grid</a></li>
                        <li  ><a href="ui-tabs-accordions.html">Tabs & Accordions</a></li>
                        <li  ><a href="ui-nestable-lists.html">Nestable Lists</a></li>
                        <li  ><a href="ui-treeview.html">Tree View</a></li>
                        <li  ><a href="ui-calendar.html"><span class="label label-primary pull-right">New</span>Calendar</a></li>
                     </ul>
                     </li>
                     <li>
                     <a href="#"><i class="fa fa-list-alt"></i><span>Forms</span></a>
                     <ul class="sub-menu">
                        <li  ><a href="form-elements.html">Components</a></li>
                        <li  ><a href="form-multiselect.html"><span class="label label-primary pull-right">New</span>Multiselect</a></li>
                        <li  ><a href="form-validation.html">Validation</a></li>
                        <li  ><a href="form-wizard.html">Wizard</a></li>
                        <li  ><a href="form-masks.html">Input Masks</a></li>
                        <li  ><a href="form-wysiwyg.html">WYSIWYG Editor</a></li>
                        <li  ><a href="form-upload.html">Multi Upload</a></li>
                     </ul>
                     </li>
                     <li>
                     <a href="#"><i class="fa fa-table"></i><span>Tables</span></a>
                     <ul class="sub-menu">
                        <li  ><a href="tables-general.html">General</a></li>
                        <li  ><a href="tables-datatables.html"><span class="label label-primary pull-right">New</span>Data Tables</a></li>
                        <li  ><a href="tables-xeditable.html"><span class="label label-primary pull-right">New</span>X-Editable</a></li>
                     </ul>
                     </li>
                     <li>
                     <a href="#"><i class="fa fa-map-marker nav-icon"></i><span>Maps</span></a>
                     <ul class="sub-menu">
                        <li  ><a href="maps.html">Maps</a></li>
                        <li  ><a href="vector-maps.html">Vector Maps</a></li>
                     </ul>
                     </li>
                     <li>
                     <a href="#"><i class="fa fa-envelope nav-icon"></i><span>Email</span></a>
                     <ul class="sub-menu">
                        <li  ><a href="email-inbox.html">Inbox</a></li>
                        <li  ><a href="email-read.html">Email Detail</a></li>
                        <li  ><a href="email-compose.html"><span class="label label-primary pull-right">New</span>Email Compose</a></li>
                     </ul>
                     </li>
                     <li  ><a href="typography.html"><i class="fa fa-text-height"></i><span>Typography</span></a></li>
                     <li  ><a href="charts.html"><i class="fa fa-bar-chart-o"></i><span>Charts</span></a></li>
                     <li>
                     <a href="#"><i class="fa fa-file"></i><span>Pages</span></a>
                     <ul class="sub-menu">
                        <li  ><a href="pages-blank.html">Blank Page</a></li>
                        <li  ><a href="pages-blank-header.html">Blank Page Header</a></li>
                        <li  ><a href="pages-blank-aside.html">Blank Page Aside</a></li>
                        <li  ><a href="pages-blank-aside-header.html"><span class="label label-primary pull-right">New</span>Blank Page Aside Header</a></li>
                        <li  ><a href="pages-profile.html"><span class="label label-primary pull-right">New</span>Profile</a></li>
                        <li><a href="pages-login.html">Login</a></li>
                        <li><a href="pages-sign-up.html"><span class="label label-primary pull-right">New</span>Sign Up</a></li>
                        <li><a href="pages-forgot.html"><span class="label label-primary pull-right">New</span>Forgot Password</a></li>
                        <li><a href="pages-404.html">404 Page</a></li>
                        <li><a href="pages-500.html">500 Page</a></li>
                        <li  ><a href="pages-tour.html"><span class="label label-primary pull-right">New</span>Tour Guide</a></li>
                        <li  ><a href="pages-gallery.html">Gallery</a></li>
                        <li  ><a href="pages-search.html"><span class="label label-primary pull-right">New</span>Search</a></li>
                        <li  ><a href="pages-timeline.html">Timeline</a></li>
                        <li  ><a href="pages-code-editor.html">Code Editor</a></li>
                     </ul>
                     </li>
                     </ul> -->
               </div>
            </div>
         </div>
      </div>
	<div class="container-fluid" id="pcont">
   <!-- TOP NAVBAR -->
   
    
	
       <div class="row">
            <div class="col-md-12">
                 <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                     Escolas
                     <span class="caret"></span>
                     </button>
                     <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
                        <?php
                           foreach ($nomesEscolas as $escola) {
                               echo '<li><a class="school">'.$escola->data.'</a></li>';
                           }
                           ?>
                     </ul>
                 <label for="cursosMain">Curso</label>
                     <select id="cursosMain">
                        <option value="0">Selecione o tipo de perfil</option>
                     </select>    
            </div>
        </div>             	
			<div class="row">
				<div class="col-md-12">
					<div class="block-flat">
						<div class="header">							
							<h3>Alunos da Escola<span id="nomeEscola"></span></h3>
						</div>
						<div class="content">
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
				<div class="col-md-12">
					<div class="block-flat">
						<div class="header">							
							<h3>Relação alunos/etapas</h3>
                            <!--<select id="cursos">
                                <option value = 0>Selecione o curso</option>
                            </select> -->
						</div>
						<div class="content">
							<div class="table-responsive" id='etapas' style="max-width: 700px">
								
									
															
							</div>
						</div>
					</div>				
				</div>
			</div>
            <div class="row">
				<div class="col-md-12">
					<div class="block-flat">
						<div class="header">							
							<h3>Relação alunos/notas</h3>
                            <!--<select id="cursosN">
                                <option value = 0>Selecione o curso</option>
                            </select>-->
						</div>
						<div class="content">
							<div class="table-responsive" id='notas'>
								
									
															
							</div>
						</div>
					</div>				
				</div>
			</div>
					
			
	
</div>

  
	<script src="js/jquery.js"></script>
	<script src="js/jquery.cookie/jquery.cookie.js"></script>
    <script src="js/jquery.pushmenu/js/jPushMenu.js"></script>
	<script type="text/javascript" src="js/jquery.nanoscroller/jquery.nanoscroller.js"></script>
	<script type="text/javascript" src="js/jquery.sparkline/jquery.sparkline.min.js"></script>
    <script type="text/javascript" src="js/jquery.ui/jquery-ui.js" ></script>
	<script type="text/javascript" src="js/jquery.gritter/js/jquery.gritter.js"></script>
	<script type="text/javascript" src="js/behaviour/core.js"></script>

<!-- Bootstrap core JavaScript
================================================== -->
<!-- Placed at the end of the document so the pages load faster -->
    <script src="js/bootstrap/dist/js/bootstrap.min.js"></script>
    
 
    <script type="text/javascript" src="js/jquery.ui/jquery-ui.js"></script>
    <script type="text/javascript" src="js/jquery.jeditable/jquery.jeditable.mini.js"></script>
    <script type="text/javascript" src="js/jquery.datatables/jquery.datatables.min.js"></script>
    <script type="text/javascript" src="js/jquery.datatables/bootstrap-adapter/js/datatables.js"></script>
    <script type="text/javascript">
      //Add dataTable Functions
      var functions = $('<div class="btn-group"><button class="btn btn-default btn-xs" type="button">Actions</button><button data-toggle="dropdown" class="btn btn-xs btn-primary dropdown-toggle" type="button"><span class="caret"></span><span class="sr-only">Toggle Dropdown</span></button><ul role="menu" class="dropdown-menu"><li><a href="#">Edit</a></li><li><a href="#">Copy</a></li><li><a href="#">Details</a></li><li class="divider"></li><li><a href="#">Remove</a></li></ul></div>');
      $("#datatable tbody tr td:last-child").each(function(){
        $(this).html("");
        functions.clone().appendTo(this);
      });
    
    $(document).ready(function(){
      //initialize the javascript
      //Basic Instance
      var escola = '';      

      //insert values in table
      $('.school').click(function(){
          escola = $(this).text();
          $('#nomeEscola').text(" " + escola);
          cursos(escola);
      });
    /*  $('#cursos').change(function(){
          var curso = $(this).find('option:selected').val();
          if(curso == 0 || curso == '0'){
              return;
          }
          etapas(curso,escola);
      });
      $('#cursosN').change(function(){
          var curso = $(this).find('option:selected').val();
          if(curso == 0 || curso == '0'){
              return;
          }
          notas(curso,escola);
      });*/
      $('#cursosMain').change(function(){
          var curso = $(this).find('option:selected').val();
          if(curso == 0 || curso == '0'){
              return;
          }
          alunos(curso,escola);
          etapas(curso,escola);
          notas(curso,escola);
      });
      function alunos(curso,escola){
          $.ajax({
            method: "POST",
            url: "format_table.php",
            dataType: "html",
            data: { func: "alunos", escola : escola, curso: curso }
            })
            .done(function(data){
                $('#alunos').empty();
                $('#alunos').append(data);
                $('#alunos_table').dataTable();
          });
      }
      function cursos(escola){
          $.ajax({
            method: "POST",
            url: "format_table.php",
            dataType: "html",
            data: { func: "cursos", escola : escola }
            })
            .done(function(data){
               // $('#cursos').empty();
               // $('#cursosN').empty();
                $('#cursosMain').empty();
                $('#cursosMain').append('<option value = 0>Selecione o curso</option>' + data)
               // $('#cursosN').append('<option value = 0>Selecione o curso</option>' + data);
                //$('#cursos').append('<option value = 0>Selecione o curso</option>' + data);
          });
      }
      function etapas(curso,escola){
          $.ajax({
            method: "POST",
            url: "format_table.php",
            dataType: "html",
            data: { func: "etapas", curso : curso, escola : escola }
            })
            .done(function(data){
                $('#etapas_table').empty();
                $('#etapas').empty();
                $('#etapas').append(data);
                setTimeout($('#etapas_table').dataTable({"paging": false}),3000);
                
          });
      }
      function notas(curso,escola){
          $.ajax({
            method: "POST",
            url: "format_table.php",
            dataType: "html",
            data: { func: "notas", curso : curso, escola : escola }
            })
            .done(function(data){
                $('#notas_table').empty();
                $('#notas').empty();
                $('#notas').append(data);
                setTimeout($('#notas_table').dataTable(),3000);
                
          });
      }
    });
</script>
  
  
<script type="text/javascript" src="js/jquery.flot/jquery.flot.js"></script>
<script type="text/javascript" src="js/jquery.flot/jquery.flot.pie.js"></script>
<script type="text/javascript" src="js/jquery.flot/jquery.flot.resize.js"></script>
<script type="text/javascript" src="js/jquery.flot/jquery.flot.labels.js"></script>
</body>


</html>
