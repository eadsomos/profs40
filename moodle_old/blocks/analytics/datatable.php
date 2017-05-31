<?php 
   require_once(__DIR__ . '/../../config.php');
   require_once(__DIR__ . '/../../login/lib.php');
   require_once('variables.php');
   global $USER,$DB;
   
   $userid = required_param('userid', PARAM_INT);
   if (!isloggedin()) {
       header("location:../../index.php");
   }
   $usersid = array();
   // XTREME DISTINCT HORSE
   $uss = $DB->get_record_sql('SELECT * FROM {user} WHERE id ='.$userid);
   
   $groupsid = $DB->get_records_sql('SELECT groupid FROM {groups_members} WHERE userid ='.$userid,array());
   foreach ($groupsid as $id) {
       $u = $DB->get_records_sql('SELECT DISTINCT userid FROM {groups_members} WHERE groupid ='.$id->groupid,array());
       foreach ($u as $person) {
           $usersid[] = $person->userid;
       }
   }


   $escolasGrupo = $DB->get_records_sql('SELECT DISTINCT ui.data, esco.desc_nome, esco.id
											FROM mdl_user AS u
											JOIN mdl_role_assignments as ra ON ra.userid = u.id
											JOIN mdl_user_info_data AS ui ON ui.userid = u.id
												AND ui.fieldid = 5
											JOIN mdl_escola AS esco ON ui.data = esco.id
											WHERE u.id IN ('.implode(',',$usersid).')
											AND ra.roleid = 9
											ORDER BY esco.desc_nome ASC',array());



	$schoolsFinal = array();
	foreach($escolasGrupo as $escolaGrup){
	   $schoolsFinal[] = array('nome'=>$escolaGrup->desc_nome,'id'=>$escolaGrup->id);
	}
?>

<!DOCTYPE html>
<html>
<head>
<!-- Meta, title, CSS, favicons, etc. -->
<meta charset="utf-8">
<title>Relatório</title>
<meta name="author" content="AdminDesigns">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- Font CSS (Via CDN) -->
<link rel='stylesheet' type='text/css' href='http://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700,800'>

<!-- Bootstrap CSS -->
<link rel="stylesheet" type="text/css" href="vendor/bootstrap/css/bootstrap.min.css">

<!-- data table buttons -->
<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.10.12/css/jquery.dataTables.min.css">
<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/buttons/1.2.2/css/buttons.dataTables.min.css">

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
<input type="hidden" id="userid" value=<?php echo $userid ?> />
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
      <div class="media">
        <div class="mobile-link"> <span class="glyphicons glyphicons-show_big_thumbnails"></span> </div>
        <div class="media-body">
          <h5 class="media-heading mt5 mbn fw700 cursor"><?php echo $USER->username; ?><span class="caret ml5"></span></h5>
          
        </div>
      </div>
    </div>
    <div class="user-divider"></div>
    <div class="sidebar-menu">
      <ul class="nav">
        <li> <a href=<?php echo '"index.php?userid='.$USER->id.'"'; ?> class="ajax-disable"><span class="glyphicon glyphicon-stats"></span> <span class="sidebar-title">Dados Gerais</span> <span class="sidebar-title-tray"></span> </a> </li>
        <li> <a href=<?php echo '"datatable.php?userid='.$USER->id.'"'; ?> class="ajax-disable"><span class="glyphicon glyphicon-th"></span><span class="sidebar-title">Detalhamento</span></a> </li>
      </ul>
    </div>
  </aside>
  
  <!-- Start: Content -->
  <section id="content_wrapper">
		<div id="content">
		<div class="row">
			<div class="col-md-12">
			  <div class="panel">
				<div class="panel-body">
				  
				  <div class="col-md-1">
				  	<label>Gerais</label>
				  	<div class="switch switch-red switch-md switch-inline" style="display: block!important;">
					  <input id="semescola" type="checkbox">
					  <label for="semescola"></label>
					</div>
				  
				  </div>
				  
				  <div class="col-md-5">
				  	<label for="school">Escola</label>
				  	<select id='school'>
						<option value='0'>Selecione a escola</option>
						<option value='1'>Todas</option>
						<?php foreach ($schoolsFinal as $escola) { 
						echo '<option value="'.$escola['id'].'">'.$escola['nome'].'</option>';}      
						?>
					</select>
				  </div>
				  
				  <div class="col-md-5">
				  	<label for="disciplina">Curso</label>
				  	<select id="disciplina">
						<option value="0">Selecione a disciplina</option>
						<!--<option value="1">Todas</option>-->
					</select>
				  </div>
				  
				  <div class="col-md-1">
				  	<label for="filtrar"></label>
				  	<button type="button" class="btn bg-blue3" id="filtrar"><i class="glyphicons glyphicons-filter"></i> Filtrar</button>
				  </div>
				</div>
			  </div>
			</div>
		</div>
       
        <div class="modal fade bs-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" id="myModal">
            <div class="modal-dialog modal-sm" role="document">
                <div class="modal-content">
                    <h1>Buscando informações</h1>
                    <img src="images/loader.gif" width="100%" />
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
                    <div class="table-responsive" id='alunos'>
                      							
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
<script type="text/javascript" src="http://code.jquery.com/jquery-1.12.3.js"></script> 
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
<script type="text/javascript" src="https://cdn.datatables.net/1.10.12/js/jquery.dataTables.min.js"></script> 
<script type="text/javascript" src="vendor/plugins/datatables/js/datatables.js"></script>
<script type="text/javascript" src="https://cdn.datatables.net/buttons/1.2.2/js/dataTables.buttons.min.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jszip/2.5.0/jszip.min.js"></script>
<script type="text/javascript" src="https://cdn.rawgit.com/bpampuch/pdfmake/0.1.18/build/pdfmake.min.js"></script>
<script type="text/javascript" src="https://cdn.rawgit.com/bpampuch/pdfmake/0.1.18/build/vfs_fonts.js"></script>
<script type="text/javascript" src="https://cdn.datatables.net/buttons/1.2.2/js/buttons.html5.min.js"></script>
<link href="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/css/select2.min.css" rel="stylesheet" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/js/select2.min.js"></script>

<script type="text/javascript">
  $('#school').select2({ width: '100%' });
  $('#disciplina').select2({ width: '100%' });
</script>


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
	
			 $('#semescola').click(function(){
				if ($('#semescola').prop('checked')){
				  $('#school').select2('val', '1');
				  $('#school').select2('enable', false);
				} else {
				  $('#school').select2('enable');
				}
			 });
	
	
	
             function filtrar(){
                 alunosTable(escola);
                 etapasTable(escola);
                 notasTable(escola);
             }
             function alunosTable(escola){
                var disciplina =  $('#disciplina').find('option:selected').val();
				var semEscola = $('#semescola').prop('checked');
				
				 
                $('#myModal').modal({backdrop: false}); 
                $.ajax({
                     method: "POST",
                     url: "format_table.php",
                     dataType: "html",
                     error: function(XMLHttpRequest, textStatus, errorThrown){
                                //alert("Erro! -- função alunosTable");
                            },
                     data: { function: "alunosTable", escola : escola, disciplina : disciplina, semEscola : semEscola }
                         })
                     .done(function(data){
                        //alert(data);
                        $('#alunos').html(data);
                        $('#alunos_table').dataTable({
								dom: 'Bfrtip',
								buttons: ['excel'],
								language: {"url": "//cdn.datatables.net/plug-ins/1.10.13/i18n/Portuguese-Brasil.json"}
							});
                        $('#myModal').modal('hide');
                     });
             }
             function etapasTable(escola){
                var disciplina =  $('#disciplina').find('option:selected').val();
                $('#etapas').html();
                $('#myModal').modal({backdrop: false}); 
                if(disciplina == 1 || escola == 1){
                    //alert('hue');
                    $('#etapas').html('<h1>Os dados não podem ser exibidos com esse tipo de filtro</h1>');
                    return;
                }
                $.ajax({
                     method: "POST",
                     url: "format_table.php",
                     dataType: "html",
                     error: function(XMLHttpRequest, textStatus, errorThrown){
                                //alert("Erro! -- função etapasTable");
                            },
                     data: { function: "etapasTable", escola : escola ,disciplina :disciplina}
                         })
                     .done(function(data){
                        //alert(data);
                        $('#etapas').html(data);
                        $('#etapas_table').dataTable({
								dom: 'Bfrtip',
								buttons: ['excel'],
								language: {"url": "//cdn.datatables.net/plug-ins/1.10.13/i18n/Portuguese-Brasil.json"}
							});
                        $('#myModal').modal('hide');
                     });
             }
             function notasTable(escola){
                var disciplina =  $('#disciplina').find('option:selected').val();
                $('#notas').html();
				 
                $('#myModal').modal({backdrop: false});
                if(disciplina == 1 || escola == 1){
                    //alert('hue');
                    $('#notas').html('<h1>Os dados não podem ser exibidos com esse tipo de filtro</h1>');
                    return;
                } 
                $.ajax({
                     method: "POST",
                     url: "format_table.php",
                     dataType: "html",
                     error: function(XMLHttpRequest, textStatus, errorThrown){
                                //alert("Erro! -- função notasTable");
                            },
                     data: { function: "notasTable", escola : escola ,disciplina :disciplina}
                         })
                     .done(function(data){
                        //alert(data);
                        $('#notas').html(data);
                        $('#notas_table').dataTable({
								dom: 'Bfrtip',
								buttons: ['excel'],
								language: {"url": "//cdn.datatables.net/plug-ins/1.10.13/i18n/Portuguese-Brasil.json"}
							});
                        $('#myModal').modal('hide');
                     });
             }
             function updateUsersIds(escola){
                $('#myModal').modal({backdrop: false}); 
                $.ajax({
                     method: "POST",
                     url: "format_table.php",
                     dataType: "json",
                     error: function(XMLHttpRequest, textStatus, errorThrown){
                                //alert("Erro! -- função updateUsersIds");
                            },
                     data: { function: "update", escola : escola }
                         })
                     .done(function(data){
                        //alert(data);
                        $('#myModal').modal('hide');
                     }); 
                 
                   
             }
             function disciplinas(escola){
                $('#myModal').modal({backdrop: false}); 
                var userid = $('#userid').val();
                $.ajax({
                     method: "POST",
                     url: "format_table.php",
                     dataType: "html",
                     error: function(XMLHttpRequest, textStatus, errorThrown){
                                //alert("Erro! -- função disciplinas");
                            },
                     data: { function: "disciplinas", userid : userid, escola : escola }
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