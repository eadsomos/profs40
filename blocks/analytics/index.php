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
   

   $uss = $DB->get_record_sql('SELECT * FROM {user} WHERE id ='.$userid);
   
   $groupsid = $DB->get_records_sql('SELECT DISTINCT groupid FROM {groups_members} WHERE userid ='.$userid,array());
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

	$assID = array();
	foreach($escolasGrupo as $escolaGrup){
	   $assID[] = array('nome'=>$escolaGrup->desc_nome, 'id'=>$escolaGrup->id);
	}

?>

<!DOCTYPE html>
<html><head>
<!-- Meta, title, CSS, favicons, etc. -->
<meta charset="utf-8">
<title>Relatórios</title>
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

<!-- data table buttons -->
<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.10.12/css/jquery.dataTables.min.css">
<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/buttons/1.2.2/css/buttons.dataTables.min.css">


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
    <div id="topbar">
      <div class="topbar-left">
        <ol class="breadcrumb">
         
          <li class="crumb-active">Escola 
          	<select id='school'>
          		<option value='0'>Selecione a Escola</option>
          		<!-- <option value='1'>Todas</option> -->
          		<?php foreach ($assID as $as) { 
				echo '<option value="'.$as['id'].'">'.$as['nome'].'</option>';
				}?>
         	</select>
          </li>
          
          <!-- <li class="crumb-icon">Segmento 
				<select id='segmento'>
					<option value='0'>Selecione o segmento</option>
					<option value="1">Todos</option>
					<option value="Ensino Fundamental anos finais">Ensino Fundamental anos finais</option>
					<option value="Ensino Fundamental e Médio">Ensino Fundamental e Médio</option>
					<option value="Ensino Médio">Ensino Médio</option>
					<option value="Ensino Fundamental anos iniciais">Ensino Fundamental anos iniciais</option><option value="Educação Infantil">Educação Infantil</option>
				</select>
		  </li> -->
         
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
                    <img src="images/loader.gif" width="100%" />
                </div>
            </div>
        </div>  
      <div id="widget-dropdown" class="row">
        <div class="col-sm-6">
          <div class="panel panel-overflow mb10">
            <div class="panel-body pn pl20" style="overflow:hidden!important;">
              <div class="icon-bg"><i class="glyphicon glyphicon-star-empty text-orange2"></i></div>
              <h2 class="mt15 lh15 text-grey2"><b id="gInscritos"> 0</b></h2>
              <h5 class="text-muted">Inscritos</h5>
            </div>
          </div>
        </div>
        <div class="col-sm-6">
          <div class="panel panel-overflow mb10">
            <div class="panel-body pn pl20" style="overflow:hidden!important;">
              <div class="icon-bg"><i class="glyphicon glyphicon-send text-blue2"></i></div>
              <h2 class="mt15 lh15 text-teal2" ><b id="gEmCurso"> 0</b></h2>
              <h5 class="text-muted">Em curso</h5>
            </div>
          </div>
        </div>
        
      </div>
      <div class="row">
        <div class="col-md-8">
          <div class="panel" style="padding:15px; overflow-y: hidden!important;">
            <div class="panel-headings">
              <h1>Cursos da instituição</h1>
            </div>
            <div class="panel-body pn">
              <p>Selecione um curso <select id="disciplinas"><option value = '0'>Nome do curso</option></select></p>
              <div class="chart-disciplina" style="height: 300px; width: 100%;"></div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="panel" style="padding:15px">
            <div class="panel-headings">
              <h1>Dados do curso</h1>
            </div>
            <div class="panel-body pn">
              <div class="panel">
                <div class="panel-heading"> <span class="panel-title"> Inscritos</span> 
                  <div class="panel-header-menu pull-right mr10"> <span class="badge" id="cInscritos"></span> </div>
                </div>  
              </div>
              <div class="panel">
                <div class="panel-heading bg-blue2"> <span class="panel-title">Em curso </span></span> 
                  <div class="panel-header-menu pull-right mr10"> <span class="badge" id="cEmCurso"></div>
                </div>  
              </div>
              <div class="panel">
                <div class="panel-heading bg-green2"> <span class="panel-title"> Concluidos</span></span> 
                  <div class="panel-header-menu pull-right mr10"> <span class="badge" id="cConcluidos"></div>
                </div>  
              </div>
              <div class="panel">
                <div class="panel-heading bg-red2"> <span class="panel-title">Em Risco</span></span> 
                  <div class="panel-header-menu pull-right mr10"> <span class="badge" id="cEmRisco"></span> </div>
                </div>  
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <div class="panel" style="padding:15px">
            <div class="panel-headings">
              <h1>Andamento do curso</h1>
            </div>
            <div class="panel-body pn">
                <div class="chart-andamento" style="height: 300px; width: 100%;"></div>
            </div>
          </div>
         </div> 
      </div>
      <div class="row">
        <div class="col-md-12">
          <div class="panel" style="padding:15px">
            <div class="panel-headings">
              <h1>Notas por aula</h1>
            </div>
            <div class="panel-body pn">
              <div class="chart-notas" style="height: 300px; width: 100%;"></div>
            </div>
          </div>
         </div> 
      </div>
      <div class="row">
        <div class="col-md-12">
          <div class="panel" style="padding:15px">
            <div class="panel-headings">
              <h1>Progresso dos cursistas</h1>
            </div>
            <div class="panel-body pn" style="overflow: hidden;">
              <div class="content" id="progresso" style="overflow-y: scroll">
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
  $('#school').select2();
</script>

<script type="text/javascript">
jQuery(document).ready(function () {
  "use strict";
  function dataCreate(num, dev) {
			var dataPlots = [];
			for (var i = 0; i < num; i++) {
				if (i === 0) {
					dataPlots.push([(i + 1), 0]);
				} else {
					dataPlots.push([(i + 1), 0]);
				}
			}
			return (dataPlots);
		}
  // Init Theme Core 	  
  Core.init();
  // Enable Ajax Loading 	  
  Ajax.init();
  var randomColorGenerator = function () { 
                    return '#' + (Math.random().toString(16) + '0000000').slice(2, 8); 
                };
             var optionsPie = {
                    series: {
                        pie: {
                            show: true,
                            highlight: {
                                opacity: 0.1
                            },
                            radius: 1,
                            stroke: {
                                width: 2
                            },
                            startAngle: 2,
                            border: 30 //darken the main color with 30
                        }
                    },
                    legend: {
                        show: true,
                        labelFormatter: function (label, series) {
                            // series is the series object for the label
                            return '<a href="#' + label + '">' + label + '</a>';
                        },
                        margin: 50,
                        width: 20,
                        padding: 1
                    },
                    grid: {
                        hoverable: true,
                        clickable: true
                    },
                    colors: ["#5793f3", "#dd4d79", "#bd3b47","#dd4444","#fd9c35","#fec42c","#d4df5a","#5578c2"],
                    tooltip: true,
                    //activate tooltip
                    tooltipOpts: {
                        content: "%s : %p.0" + "%",
                        shifts: {
                            x: -30,
                            y: -50
                        },
                        defaultTheme: false
                    }
                };
             var dataPie = [{
                    label: "Nenhum",
                    data: 100,
                    color: randomColorGenerator()
                }];   
             $.plot($(".chart-disciplina"), dataPie, optionsPie);

             var d1 = [];
                for (var i = 0; i <= 10; i += 1)
                    d1.push([i, 0]);
                
                var dataBar = new Array();
                dataBar.push({
                    label: "Sem Dados",
                    data: d1,
                    bars: {
                        order: 1
                    }
                });
                
             var optionsBar = {
                    bars: {
                        show: true,
                        barWidth: 0.2,
                        fill: 1
                    },
                    grid: {
                        show: true,
                        aboveData: false,
                        color: "#3f3f3f",
                        labelMargin: 5,
                        axisMargin: 0,
                        borderWidth: 0,
                        borderColor: null,
                        minBorderMargin: 5,
                        clickable: true,
                        hoverable: true,
                        autoHighlight: false,
                        mouseActiveRadius: 20
                    },
                    colors: [randomColorGenerator()],
                    tooltip: true,
                    //activate tooltip
                    tooltipOpts: {
                        content: "Data&nbsp;" + "%x.0 : %y.0",
                        shifts: {
                            x: -30,
                            y: -50
                        }
                    }
                };
             
             var optionsLine = {
                grid: {
                    show: true,
                    aboveData: true,
                    color: "#3f3f3f",
                    labelMargin: 5,
                    axisMargin: 0,
                    borderWidth: 0,
                    borderColor: null,
                    minBorderMargin: 5,
                    clickable: true,
                    hoverable: true,
                    autoHighlight: true,
                    mouseActiveRadius: 20
                },
                series: {
                    lines: {
                        show: true,
                        fill: 0.5,
                        lineWidth: 2,
                        steps: false
                    },
                    points: {
                        show: false
                    }
                },
                yaxis: {
                    min: 0
                },
                xaxis: {
                    ticks: 11,
                    tickDecimals: 0
                },
                colors: [randomColorGenerator()],
                shadowSize: 1,
                tooltip: true,
                //activate tooltip
                tooltipOpts: {
                    content: "%s : %y.0",
                    shifts: {
                        x: -30,
                        y: -50
                    },
                    defaultTheme: false
                }
            };
            $.plot($(".chart-andamento"), [{
                label: "Sem dados",
                data: dataCreate(18, 1),
                lines: {
                    fillColor: "#f3faff"
                }
            },], optionsLine);
             $.plot($(".chart-notas"), dataBar, optionsBar);
             var assessor = '';
			 var escola = '';
             var segmento = '';
             var userid = $('#userid').val();
	
	
            /*
			Retorna o assessor escolhido (antigo)
			$('#assessor').change(function(){
                 assessor = $(this).find('option:selected').val();
                 if($(this).find('option:selected').val() == 0){
                     return;
                 }
                 
                 if(assessor == ''){
                     return;
                 }
                 
				 escolasAssessor(assessor);
             }); */
	
	
			$('#school').change(function(){
                 escola = $(this).find('option:selected').val();
                 if($(this).find('option:selected').val() == 0){
                     return;
                 }
                 
                 /*if(segmento == ''){
                     return;
                 }*/
				 passaEscola(escola);
                 updateUsersIds(segmento);
             });
             /*$('#segmento').change(function(){
                 segmento = $(this).find('option:selected').val();
                 if($(this).find('option:selected').val() == 0){
                     return;
                 }
                 if(escola == ''){
                     return;
                 }
                
                 updateUsersIds(escola, segmento);
             });*/
            
             $('#disciplinas').change(function(){
                var disciplina = $(this).find('option:selected').val();
                if(disciplina == 0){
                   return;
                }
                infoDisciplina(disciplina);
                andamentoCurso(disciplina,escola);
                notasDisciplina(disciplina,escola);
                progressoCursistas(disciplina,escola);
                statusCurso(disciplina);
             });
	
			 function passaEscola(escola){
				$('#myModal').modal({backdrop: false}); 
				$.ajax({
					 method: "POST",
					 url: "statistics.php",
					 dataType: "html",
                     error: function(XMLHttpRequest, textStatus, errorThrown){
                                //alert("Erro! -- função passaEscola");
                            },
					 data: { function: "inscritosTotais", escola : escola }
						 })
					
					 .done(function(data){
						if(data == 0){
							 $('#filtrar').prop('disabled',true);
							 alert('Ops, Parece que não existem alunos nessa escola');
						 }else{
							 $('#filtrar').prop('disabled',false);
						 }
						$('#school').append(data);
						$('#myModal').modal('hide');
					 }); 
			 }
	
             function infoDisciplina(disciplina){
                 inscritosDisciplina(disciplina, escola);
                 emCursoDisciplina(disciplina, escola);
                 concluidosDisciplina(disciplina, escola);
                 emRiscoDisciplina(disciplina, escola);
             }
             function andamentoCurso(disciplina,escola){
                $('#myModal').modal({backdrop: false}); 
                $.ajax({
                     method: "POST",
                     url: "statistics.php",
                     dataType: "html",
                     error: function(XMLHttpRequest, textStatus, errorThrown){
                                //alert("Erro! -- função andamentoCurso");
                            },
                     data: { function: "andamentoCurso", disciplina:disciplina, escola:escola }
                         })
                     .done(function(data){
                        //alert(data);
                        var parsed = JSON.parse(data);
                        var values = [];
                        var cont = 0;
                        for(var x in parsed){
                            cont++;
                            values.push([cont,parsed[x]]);
                        }
                        $.plot($(".chart-andamento"), [{
                            label: "Notas",
                            data: values,
                            lines: {
                                fillColor: "#f3faff"
                            }
                        }], optionsLine);
                        $('#myModal').modal('hide');
                     }); 
             }
             function statusCurso(disciplina){
                 $('#myModal').modal({backdrop: false}); 
                 $.ajax({
                     method: "POST",
                     url: "statistics.php",
                     dataType: "html",
                     error: function(XMLHttpRequest, textStatus, errorThrown){
                                //alert("Erro! -- função statusCurso");
                            },
                     data: { function: "statusCurso", disciplina:disciplina }
                         })
                     .done(function(data){
                        //alert(data);
                        $('#status').html(data);
                        $('#myModal').modal('hide');
                     }); 
             }
             function progressoCursistas(disciplina,escola){
                $('#myModal').modal({backdrop: false}); 
                $.ajax({
                     method: "POST",
                     url: "statistics.php",
                     dataType: "html",
                     error: function(XMLHttpRequest, textStatus, errorThrown){
                                //alert("Erro! -- função progressoCursistas");
                            },
                     data: { function: "progressoCursistas", disciplina:disciplina , escola:escola}
                         })
                     .done(function(data){
                        //alert(data);
                        $('#progresso').html(data);
                        $('#myModal').modal('hide');
                     }); 
             }
             function inscritosDisciplina(disciplina,escola){
                 $('#myModal').modal({backdrop: false}); 
                 $.ajax({
                     method: "POST",
                     url: "statistics.php",
                     dataType: "json",
                     error: function(XMLHttpRequest, textStatus, errorThrown){
                               //alert("Erro! -- função inscritosDisciplina");
                            },
                     data: { function: "inscritosDisciplina", disciplina:disciplina, escola:escola }
                         })
                     .done(function(data){
                        //alert(data);
                        $('#cInscritos').text(data);
                        $('#myModal').modal('hide');
                     }); 
             }
             function emCursoDisciplina(disciplina,escola){
                 $('#myModal').modal({backdrop: false}); 
                 $.ajax({
                     method: "POST",
                     url: "statistics.php",
                     dataType: "json",
                     error: function(XMLHttpRequest, textStatus, errorThrown){
                                //alert("Erro! -- função emCursoDisciplina");
                            },
                     data: { function: "emCursoDisciplina", disciplina:disciplina, escola:escola }
                         })
                     .done(function(data){
                        //alert(data);
                        $('#cEmCurso').text(data);
                        $('#myModal').modal('hide');
                     }); 
             }
			 function escolasAssessor(assessor){
				$('#myModal').modal({backdrop: false}); 
				$.ajax({
					 method: "POST",
					 url: "statistics.php",
					 dataType: "html",
                     error: function(XMLHttpRequest, textStatus, errorThrown){
                                //alert("Erro! -- função escolasAssessor");
                            },
					 data: { function: "assessores", assessor : assessor }
						 })
					 .done(function(data){
						//alert(data);
						 if(data == 0){
							   $('#filtrar').prop('disabled',true);
							 alert('Ops, Parece que não existem escolas para esse assessor');
						 }
						$('#school').append(data);
						$('#myModal').modal('hide');
					 }); 
			 }
             function notasDisciplina(disciplina,escola){
                $('#myModal').modal({backdrop: false}); 
                 $.ajax({
                     method: "POST",
                     url: "statistics.php",
                     dataType: "html",
                     error: function(XMLHttpRequest, textStatus, errorThrown){
                                //alert("Erro! -- função notasDisciplina");
                            },
                     data: { function: "notasDisciplina", disciplina : disciplina, escola : escola }
                         })
                     .done(function(data){
                        
                        var parsed = JSON.parse(data);
                        var values = [];
                        var cont = 0;
                        for(var x in parsed){
                            cont++;
                            values.push([cont,parsed[x]]);
                        }
                        var send = [];
                        send.push({
                            label: "Notas",
                            data: values,
                            bars: {
                                order: 1
                            }
                        });
                        //console.log(values);
                        $.plot($(".chart-notas"), send, optionsBar);  
                        $('#myModal').modal('hide');
                     }); 
             }
             function concluidosDisciplina(disciplina,escola){
                 $('#myModal').modal({backdrop: false}); 
                 $.ajax({
                     method: "POST",
                     url: "statistics.php",
                     dataType: "json",
                     error: function(XMLHttpRequest, textStatus, errorThrown){
                                //alert("Erro! -- função concluidosDisciplina");
                            },
                     data: { function: "concluidosDisciplina", disciplina : disciplina, escola:escola }
                         })
                     .done(function(data){
                        //alert(data);
                        $('#cConcluidos').text(data);
                        $('#myModal').modal('hide');
                     }); 
             }
             function emRiscoDisciplina(disciplina,escola){
                 $('#myModal').modal({backdrop: false}); 
                 $.ajax({
                     method: "POST",
                     url: "statistics.php",
                     dataType: "json",
                     error: function(XMLHttpRequest, textStatus, errorThrown){
                                //alert("Erro! -- emRiscoDisciplina");
                            },
                     data: { function: "emRiscoDisciplina", disciplina : disciplina, escola:escola }
                         })
                     .done(function(data){
                        //alert(data);
                        $('#cEmRisco').text(data);
                        $('#myModal').modal('hide');
                     }); 
             }
             function updateUsersIds(escola){
                $('#myModal').modal({backdrop: false}); 
                $.ajax({
                     method: "POST",
                     url: "statistics.php",
                     dataType: "json",
                     error: function(XMLHttpRequest, textStatus, errorThrown){
                                //alert("Erro! -- função updateUsersIds");
                            },
                     data: { function: "update", escola : escola }
                         })
                     .done(function(data){
                        //alert(data);
                         if(data == 0){
                               $('#filtrar').prop('disabled',true);
                             alert('Ops, Parece que não existem usuários');
                         }else{
                                $('#filtrar').removeAttr('disabled');
                         }
                        $('#myModal').modal('hide');
                     }); 
             }
             $('#filtrar').click(function(){
                 filtrar();
             });
             function filtrar(){
                 inscritosTotais(escola);
                 concluidosTotais(escola);
                 emCursoTotais(escola);
                 emRiscoTotais(escola);
                 disciplinas(escola);
                 graficoDisciplinas(escola);
             }
             function inscritosTotais(escola){
                $('#myModal').modal({backdrop: false}); 
                $.ajax({
                     method: "POST",
                     url: "statistics.php",
                     dataType: "json",
                     error: function(XMLHttpRequest, textStatus, errorThrown){
                                //alert("Erro! -- função inscritosTotais");
                            },
                     data: { function: "inscritosTotais", escola : escola }
                         })
                     .done(function(data){
                        //alert(data);
                        $('#gInscritos').text(data);
                        $('#myModal').modal('hide');
                     }); 
             }
             function concluidosTotais(escola){
                $('#myModal').modal({backdrop: false}); 
                $.ajax({
                     method: "POST",
                     url: "statistics.php",
                     dataType: "json",
                     error: function(XMLHttpRequest, textStatus, errorThrown){
                                //alert("Erro! -- função concluidosTotais");
                            },
                     data: { function: "concluidosTotais", escola : escola }
                         })
                     .done(function(data){
                        //alert(data);
                        $('#gConcluidos').text(data);
                        $('#myModal').modal('hide');
                     }); 
             }
             function emCursoTotais(escola){
                $('#myModal').modal({backdrop: false}); 
                $.ajax({
                     method: "POST",
                     url: "statistics.php",
                     dataType: "json",
                     error: function(XMLHttpRequest, textStatus, errorThrown){
                               // alert("Erro! -- função emCursoTotais");
                            },
                     data: { function: "emCursoTotais", escola : escola }
                         })
                     .done(function(data){
                       // alert(data);
                        $('#gEmCurso').text(data);
                        $('#myModal').modal('hide');
                     }); 
             }
             function emRiscoTotais(escola){
                $('#myModal').modal({backdrop: false}); 
                $.ajax({
                     method: "POST",
                     url: "statistics.php",
                     dataType: "json",
                     error: function(XMLHttpRequest, textStatus, errorThrown){
                                //alert("Erro! -- função emRiscoTotais");
                            },
                     data: { function: "emRiscoTotais", escola : escola }
                         })
                     .done(function(data){
                        //alert(data);
                        $('#gEmRisco').text(data);
                        $('#myModal').modal('hide');
                     }); 
             }
             function disciplinas(){
                $('#myModal').modal({backdrop: false});
                var userid = $('#userid').val() 
                $.ajax({
                     method: "POST",
                     url: "statistics.php",
                     dataType: "html",
                     error: function(XMLHttpRequest, textStatus, errorThrown){
                               // alert("Erro! -- função disciplinas");
                            },
                     data: { function: "disciplinas", userid: userid, escola:escola }
                         })
                     .done(function(data){
                        //alert(data);
                        $('#disciplinas').empty();
                        $('#disciplinas').append('<option value = "0">Nome da disciplina</option>'+data);
                        $('#myModal').modal('hide');
                     }); 
             }
             function graficoDisciplinas(escola){
                $('#myModal').modal({backdrop: false}); 
                var userid = $('#userid').val()
                $.ajax({
                     method: "POST",
                     url: "statistics.php",
                     dataType: "html",
                     error: function(XMLHttpRequest, textStatus, errorThrown){
                               // alert("Erro! -- função graficoDisciplinas");
                            },
                     data: { function: "graficoDisciplinas", userid : userid , escola : escola}
                         })
                     .done(function(data){
                        //alert(data);
                        $.plot($(".chart-disciplina"), JSON.parse(data), optionsPie);
                        $('#myModal').modal('hide');
                     }); 
             }
	
});
</script>
</body>
</html>