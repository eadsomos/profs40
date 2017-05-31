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
        <li> <a href=<?php echo '"master.php?userid='.$USER->id.'"'; ?> class="ajax-disable"><span class="glyphicons glyphicons-eyedropper"></span> <span class="sidebar-title">Dashboard</span> <span class="sidebar-title-tray"> <span class="label label-xs bg-purple2">New</span> </span> </a> </li>
        <li> <a href=<?php echo '"datatableMaster.php?userid='.$USER->id.'"'; ?> class="ajax-disable"><span class="glyphicons glyphicons-inbox"></span><span class="sidebar-title">Datatables</span></a> </li>
        
      </ul>
    </div>
  </aside>
  
  <!-- Start: Content -->
  <section id="content_wrapper">
    <div id="topbar">
      <div class="topbar-left">
        <ol class="breadcrumb">
          <li class="crumb-active">Escola <select id='school'><option value='0'>Selecione a escola</option><?php foreach ($schoolsFinal as $escola) { echo '<option value="'.$escola['nome'].'">'.$escola['nome'].'</option>';}      ?></select></li>
          <li class="crumb-icon">Segmento <select id='segmento'><option value='0'>Selecione o segmento</option><?php foreach ($segmentos as $segmento) { echo '<option value="'.$segmento->data.'">'.$segmento->data.'</option>';}      ?></select></li>
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
      <div id="widget-dropdown" class="row">
        <div class="col-sm-3">
          <div class="panel panel-overflow mb10">
            <div class="panel-body pn pl20">
              <div class="icon-bg"><i class="fa fa-envelope text-grey"></i></div>
              <h2 class="mt15 lh15 text-grey2"><b id="gInscritos"> 0</b></h2>
              <h5 class="text-muted">Inscritos</h5>
            </div>
          </div>
        </div>
        <div class="col-sm-3">
          <div class="panel panel-overflow mb10">
            <div class="panel-body pn pl20">
              <div class="icon-bg"><i class="fa fa-bar-chart-o text-teal"></i></div>
              <h2 class="mt15 lh15 text-teal2" ><b id="gEmCurso"> 0</b></h2>
              <h5 class="text-muted">Em curso</h5>
            </div>
          </div>
        </div>
        <div class="col-sm-3">
          <div class="panel panel-overflow mb10">
            <div class="panel-body pn pl20">
              <div class="icon-bg"><i class="fa fa-comments-o text-blue"></i></div>
              <h2 class="mt15 lh15 text-blue2"><b id="gConcluidos"> 0</b></h2>
              <h5 class="text-muted">Concluídos</h5>
            </div>
          </div>
        </div>
        <div class="col-sm-3">
          <div class="panel panel-overflow mb10">
            <div class="panel-body pn pl20">
              <div class="icon-bg"><i class="fa fa-twitter text-purple"></i></div>
              <h2 class="mt15 lh15 text-purple2"><b id="gEmRisco"> 0</b></h2>
              <h5 class="text-muted">Em risco</h5>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-8">
          <div class="panel" style="padding:15px">
            <div class="panel-headings">
              <h1>Disciplinas da instituição</h1>
            </div>
            <div class="panel-body pn">
              <p>Selecione o uma disciplina <select id="disciplinas"><option value = '0'>Nome da disciplina</option></select></p>
              <div class="chart-disciplina" style="height: 300px; width: 100%;"></div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="panel" style="padding:15px">
            <div class="panel-headings">
              <h1>Dados da disciplina</h1>
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
        <!--<div class="col-md-6">
          <div class="panel" style="padding:15px">
            <div class="panel-headings">
              <h1>Status no curso</h1>
            </div>
            <div class="panel-body pn" style="overflow: hidden;">
              <div class="content" id="status" style="overflow-y: scroll">
              </div>  
            </div>
          </div>
        </div> --> 
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
             var escola = '';
             var segmento = '';
             var userid = $('#userid').val();
             $('#school').change(function(){
                 /*alert(escola);
                 alert(segmento);
                 alert(perfil);*/
                 escola = $(this).find('option:selected').val();
                 if($(this).find('option:selected').val() == 0){
                     return;
                 }
                 
                 if(segmento == ''){
                     return;
                 }
                 
                 updateUsersIds(  segmento);
             });
             $('#segmento').change(function(){
                 segmento = $(this).find('option:selected').val();
                 if($(this).find('option:selected').val() == 0){
                     return;
                 }
                 if(escola == ''){
                     return;
                 }
                
                 updateUsersIds(escola, segmento);
             });
            
             $('#disciplinas').change(function(){
                var disciplina = $(this).find('option:selected').val();
                if(disciplina == 0){
                   return;
                }
                infoDisciplina(disciplina);
                andamentoCurso(disciplina);
                notasDisciplina(disciplina);
                progressoCursistas(disciplina);
                statusCurso(disciplina);
             });
             function infoDisciplina(disciplina){
                 inscritosDisciplina(disciplina);
                 emCursoDisciplina(disciplina);
                 concluidosDisciplina(disciplina);
                 emRiscoDisciplina(disciplina);
             }
             function andamentoCurso(disciplina){
                $('#myModal').modal({backdrop: false}); 
                $.ajax({
                     method: "POST",
                     url: "statistics.php",
                     dataType: "html",
                     data: { function: "andamentoCurso", disciplina:disciplina }
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
                     data: { function: "statusCurso", disciplina:disciplina }
                         })
                     .done(function(data){
                        //alert(data);
                        $('#status').html(data);
                        $('#myModal').modal('hide');
                     }); 
             }
             function progressoCursistas(disciplina){
                $('#myModal').modal({backdrop: false}); 
                $.ajax({
                     method: "POST",
                     url: "statistics.php",
                     dataType: "html",
                     data: { function: "progressoCursistas", disciplina:disciplina }
                         })
                     .done(function(data){
                        //alert(data);
                        $('#progresso').html(data);
                        $('#myModal').modal('hide');
                     }); 
             }
             function inscritosDisciplina(disciplina){
                 $('#myModal').modal({backdrop: false}); 
                 $.ajax({
                     method: "POST",
                     url: "statistics.php",
                     dataType: "json",
                     data: { function: "inscritosDisciplina", disciplina : disciplina }
                         })
                     .done(function(data){
                        //alert(data);
                        $('#cInscritos').text(data);
                        $('#myModal').modal('hide');
                     }); 
             }
             function emCursoDisciplina(disciplina){
                 $('#myModal').modal({backdrop: false}); 
                 $.ajax({
                     method: "POST",
                     url: "statistics.php",
                     dataType: "json",
                     data: { function: "emCursoDisciplina", disciplina : disciplina }
                         })
                     .done(function(data){
                        //alert(data);
                        $('#cEmCurso').text(data);
                        $('#myModal').modal('hide');
                     }); 
             }
             function notasDisciplina(disciplina){
                $('#myModal').modal({backdrop: false}); 
                 $.ajax({
                     method: "POST",
                     url: "statistics.php",
                     dataType: "html",
                     data: { function: "notasDisciplina", disciplina : disciplina }
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
             function concluidosDisciplina(disciplina){
                 $('#myModal').modal({backdrop: false}); 
                 $.ajax({
                     method: "POST",
                     url: "statistics.php",
                     dataType: "json",
                     data: { function: "concluidosDisciplina", disciplina : disciplina }
                         })
                     .done(function(data){
                        //alert(data);
                        $('#cConcluidos').text(data);
                        $('#myModal').modal('hide');
                     }); 
             }
             function emRiscoDisciplina(disciplina){
                 $('#myModal').modal({backdrop: false}); 
                 $.ajax({
                     method: "POST",
                     url: "statistics.php",
                     dataType: "json",
                     data: { function: "emRiscoDisciplina", disciplina : disciplina }
                         })
                     .done(function(data){
                        //alert(data);
                        $('#cEmRisco').text(data);
                        $('#myModal').modal('hide');
                     }); 
             }
             function updateUsersIds(escola,segmento){
                $('#myModal').modal({backdrop: false}); 
                $.ajax({
                     method: "POST",
                     url: "statistics.php",
                     dataType: "json",
                     data: { function: "update", escola : escola,  segmento:segmento }
                         })
                     .done(function(data){
                        //alert(data);
                         if(data == 0){
                               $('#filtrar').prop('disabled',true);
                             alert('Ops, Parece que não existem usuários nesse segmento');
                             
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
                 inscritosTotais(escola,  segmento);
                 concluidosTotais(escola,  segmento);
                 emCursoTotais(escola,  segmento);
                 emRiscoTotais(escola,  segmento);
                 disciplinas(escola,  segmento);
                 graficoDisciplinas(escola,  segmento);
             }
             function inscritosTotais(escola,  segmento){
                $('#myModal').modal({backdrop: false}); 
                $.ajax({
                     method: "POST",
                     url: "statistics.php",
                     dataType: "json",
                     data: { function: "inscritosTotais", escola : escola,  segmento:segmento }
                         })
                     .done(function(data){
                        //alert(data);
                        $('#gInscritos').text(data);
                        $('#myModal').modal('hide');
                     }); 
             }
             function concluidosTotais(escola,  segmento){
                $('#myModal').modal({backdrop: false}); 
                $.ajax({
                     method: "POST",
                     url: "statistics.php",
                     dataType: "json",
                     data: { function: "concluidosTotais", escola : escola,  segmento:segmento }
                         })
                     .done(function(data){
                        //alert(data);
                        $('#gConcluidos').text(data);
                        $('#myModal').modal('hide');
                     }); 
             }
             function emCursoTotais(escola,  segmento){
                $('#myModal').modal({backdrop: false}); 
                $.ajax({
                     method: "POST",
                     url: "statistics.php",
                     dataType: "json",
                     data: { function: "emCursoTotais", escola : escola,  segmento:segmento }
                         })
                     .done(function(data){
                       // alert(data);
                        $('#gEmCurso').text(data);
                        $('#myModal').modal('hide');
                     }); 
             }
             function emRiscoTotais(escola,  segmento){
                $('#myModal').modal({backdrop: false}); 
                $.ajax({
                     method: "POST",
                     url: "statistics.php",
                     dataType: "json",
                     data: { function: "emRiscoTotais", escola : escola,  segmento:segmento }
                         })
                     .done(function(data){
                        //alert(data);
                        $('#gEmRisco').text(data);
                        $('#myModal').modal('hide');
                     }); 
             }
             function disciplinas(escola,  segmento){
                $('#myModal').modal({backdrop: false}); 
                $.ajax({
                     method: "POST",
                     url: "statistics.php",
                     dataType: "html",
                     data: { function: "disciplinas", escola : escola,  segmento:segmento }
                         })
                     .done(function(data){
                        //alert(data);
                        $('#disciplinas').empty();
                        $('#disciplinas').append('<option value = "0">Nome da disciplina</option>'+data);
                        $('#myModal').modal('hide');
                     }); 
             }
             function graficoDisciplinas(escola,  segmento){
                $('#myModal').modal({backdrop: false}); 
                $.ajax({
                     method: "POST",
                     url: "statistics.php",
                     dataType: "html",
                     data: { function: "graficoDisciplinas", escola : escola,  segmento:segmento }
                         })
                     .done(function(data){
                        //alert(data);
                        $.plot($(".chart-disciplina"), JSON.parse(data), optionsPie);
                        $('#myModal').modal('hide');
                     }); 
             }
                 
			       
             
            
        
	
	

	
});
</script>
<script type="text/javascript">
        
      </script>
</body>
</html>
   