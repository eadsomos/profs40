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
      <title>Relatorio de acompanahmento</title>
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
      <link rel="stylesheet" type="text/css" href="js/jquery.codemirror/lib/codemirror.css">
      <link rel="stylesheet" type="text/css" href="js/jquery.codemirror/theme/ambiance.css">
      <link rel="stylesheet" type="text/css" href="js/jquery.vectormaps/jquery-jvectormap-1.2.2.css"  media="screen"/>
      <link href="css/style.css" rel="stylesheet" />
   </head>
   <body class="animated">
      <div id="cl-wrapper">
      <input id='userid' name='userid' type="hidden" value='<?php echo $userid ?>'/>
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
                           <li class="active" ><a>Status da plataforma</a></li>
                           <li><a href= "datatable.php?userid=<?php echo $userid?>">Detalhamento</a></li>
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
      <!--/.nav-collapse animate-collapse -->
         
      </div>
      <div class="cl-mcont">
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
                  
                     <label for="perfil">Perfil</label>
                     <select id="perfil">
                        <option value="0">Selecione o tipo de perfil</option>
                        <option value="11">Aluno</option>
                        <option value="12">Professor</option>
                     </select>
                  
                     <label for="segmento">Segmento</label>
                     <select id="segmento">
                        <option value="0">Selecione o segmento</option>
                        <option value="Educaçao Infantil">Educação Infantil</option>
                        <option value="Ensino Fundamental 1">Ensino Fundamental 1</option>
                        <option value="Ensino Fundamental 2">Ensino Fundamental 2</option>
                        <option value="Ensino Medio">Ensino Médio</option>
                        <option value="Curso Tecnico">Curso Técnico</option>
                        <option value="EJA">EJA</option>
                        <option value="EJATEC">EJATEC</option>
                        <option value="Aprendiz">Aprendiz</option>
                        <option value="Graduacao">Graduação</option>
                        <option value="PosGraduacao">Pós-Graduação</option>
                     </select>
                  
            </div>
            <div class="col-md-12 spacer">
               <h2>Relatório de acompanhamento <b><span id="nomeEscola"></span></b></h2>
               <br>
            </div>
            <div class="col-md-3 col-sm-6">
               <div class="fd-tile detail clean tile-blue">
                  <div class="content">
                     <h1 class="text-left" id="inscritos"></h1>
                     <p>Inscritos</p>
                  </div>
                  <div class="icon"><i class="fa fa-users"></i></div>
                  <a class="details"></a>
               </div>
            </div>
            <div class="col-md-3 col-sm-6">
               <div class="fd-tile detail clean tile-blue">
                  <div class="content">
                     <h1 class="text-left" id="em_curso"></h1>
                     <p>Em curso</p>
                  </div>
                  <div class="icon"><i class="fa fa-laptop"></i></div>
                  <a class="details"></a>
               </div>
            </div>
            <div class="col-md-3 col-sm-6">
               <div class="fd-tile detail clean tile-green">
                  <div class="content">
                     <h1 class="text-left" id='concluidos'></h1>
                     <p>Concluíntes</p>
                  </div>
                  <div class="icon"><i class="fa fa-flag"></i></div>
                  <a class="details"></a>
               </div>
            </div>
            <div class="col-md-3 col-sm-6">
               <div class="fd-tile detail clean tile-red">
                  <div class="content">
                     <h1 class="text-left" id="risco"></h1>
                     <p>Em risco (ausente +14 dias)</p>
                  </div>
                  <div class="icon"><i class="fa fa-warning"></i></div>
                  <a class="details"></a>
               </div>
            </div>
         </div> 
         <div class="row">
            <div class="col-md-12" >
               <div class="block-flat">
                  <div class="header">
                     <h3>Disciplinas da instituição</h3>
                      <p>Selecione uma disciplina</p>
                              <select id="daCursos">
                              </select>
                  </div>
                  <div class="content overflow-hidden">
                     <!--<div class="col-md-8">
                        <div id="cursoGraph" style="height: 300px; padding: 0px; position: relative;">
                        </div>
                        <div id="chart3-legend" class="legend-container"></div>
                     </div>-->
                     <div class="col-md-4">
                        <h1>INSCRITOS <span id='chart_total'></span></h1>
                        <!--<table>
                            <tbody id="spc">
                                <tr>
                                    <th>Status</th>
                                    <th>|</th>
                                    <th>%</th>
                                </tr>
                            </tbody>
                        </table>-->
                     </div>
                     
                  </div>
               </div>
            </div>
         </div>
         <div class="row">
            <div class="col-md-12" >
               <div class="block-flat">
                  <div class="header">
                     <h3>Andamento</h3>
                  </div>
                  <div class="content overflow-hidden">
                    <div id="Andamento" style="min-height:260px" >
                    </div>
                  </div>
               </div>
            </div>
         </div>
         <div class="row">
            <div class="col-md-12">
               <div class="block-flat">
                  <div class="header">
                     <h3>Notas Por aula</h3>
                    
                  </div>
                  <div class="content">
                     <div id="notas" style="min-height:260px">
                     </div>
                  </div>
               </div>
            </div>
         </div>
         <div class="row">
            <div class="col-md-8" >
               <div class="block-flat">
                  <div class="header">
                     <h3>Progresso na disciplina</h3>
                  </div>
                  <div class="content overflow-hidden">
                     <div class="content" id="report">
                     </div>
                  </div>
               </div>
            </div>
            <div class="col-md-4" >
               <div class="block-flat">
                  <div class="header">
                     <h3>Status no curso</h3>
                  </div>
                  <div class="content overflow-hidden">
                   
                           <div id="categorias">
                           </div>
                        
                  </div>
               </div>
            </div>
         </div>
      </div>
      <!-- Right Chat-->
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
      <script type="text/javascript" src="js/jquery.easypiechart/jquery.easy-pie-chart.js"></script>
      <script type="text/javascript" src="js/jquery.flot/jquery.flot.js"></script>
      <script type="text/javascript" src="js/jquery.flot/jquery.flot.pie.js"></script>
      <script type="text/javascript" src="js/jquery.flot/jquery.flot.resize.js"></script>
      <script type="text/javascript" src="js/jquery.flot/jquery.flot.labels.js"></script>
      <script type="text/javascript">
         $(document).ready(function(){
			 var randomColorGenerator = function () { 
                    return '#' + (Math.random().toString(16) + '0000000').slice(2, 8); 
                };
             var escola = '';
             var perfil = 0;
             var segmento = 0;
             var userid = $('#userid').val();
             var pizza;
             $('.school').click(function(){
                 escola = $(this).text();
                 perfil = $('#perfil').find('option:selected').val();
                 segmento = $('#segmento').find('option:selected').val();
                 $('#nomeEscola').text(' - ' + escola);
                 inscritos(escola,perfil,segmento);
                 cursos(escola,perfil,segmento);
                 em_curso(escola,perfil,segmento);
                 concluidos(escola,perfil,segmento);
                 risco(escola,perfil,segmento);
                 //cursistas(escola);
                 daCursos(escola,perfil,segmento);
                 //daCategoria(escola);
                 
                 
             });
             
             $('#cursista').change(function(){
                 var cursista = $(this).find('option:selected').val();
                 //alert(cursista);
                 os_cursos(cursista);
             });
             $('#daCategoria').click(function(){
                 var categoria = $(this).find('option:selected').val();
                 //alert(categoria);
                 categorias(categoria);
             });
             $('#daCursos').change(function(){
                 var curso = $(this).find('option:selected').val();
                 if(curso == 0 || curso == '0'){
                     return;
                 }
                 notas(curso,perfil,segmento,escola);
                 os_cursos(curso,perfil,segmento,escola);
                 categorias(curso,perfil,segmento,escola);
                 dados_do_curso(curso);
                 andamento(curso,perfil,segmento,escola);
             });
             $('#perfil').change(function(){
                 perfil = $(this).find('option:selected').val();
                 segmento = $('#segmento').find('option:selected').val();
                 if(perfil == 0 || perfil == '0'){
                     return;
                 }
                 inscritos(escola,perfil,segmento);
                /* em_curso(escola,perfil,segmento);
                 concluidos(escola,perfil,segmento);
                 risco(escola,perfil,segmento);
                 cursos(escola,perfil,segmento);*/
                 daCursos(escola,perfil,segmento);
                 
                
             });
             $('#segmento').change(function(){
                 segmento = $(this).find('option:selected').val();
                 perfil = $('#perfil').find('option:selected').val();
                 if(segmento == 0 || segmento == '0'){
                     return;
                 }
               
                 inscritos(escola,perfil,segmento);
                 em_curso(escola,perfil,segmento);
                 concluidos(escola,perfil,segmento);
                 risco(escola,perfil,segmento);
                 daCursos(escola,perfil,segmento);
                 cursos(escola,perfil,segmento);
                
             });
             function inscritos(escola,perfil,segmento){
                 $.ajax({
                     method: "POST",
                     url: "statistics.php",
                     dataType: "html",
                     data: { func: "inscritos", escola : escola, perfil:perfil,segmento:segmento }
                         })
                     .done(function(data){
                         $('#inscritos').text(data);
                     });     
             }
             function cursos(escola,perfil,segmento){
                 $.ajax({
                     method: "POST",
                     url: "statistics.php",
                     dataType: "json",
                     data: { func: "cursos", escola : escola, perfil:perfil,segmento:segmento }
                         })
                     .done(function(data){
                       /*  pizza = $.plot('#cursoGraph', data, {
                             series: {
                             pie: {
                                 show: true,
                                 innerRadius: 0.27,
                                 shadow:{
                                 top: 5,
                                 left: 15,
                                 alpha:0.3
                                 },
                                 stroke:{
                                 width:0
                                 },
                                 label: {
                                              show: false,
                                                formatter: function (label, series) {
                                                    return '<div style="font-size:12px;text-align:center;padding:2px;color:#333;">' + label + '</div>';

                                                }
                                         
                                         },
                                 highlight:{
                                 opacity: 0.08
                                 }
                             }
                             },
                             grid: {
                             hoverable: true,
                             clickable: true
                             },
                             colors: ["#5793f3", "#dd4d79", "#bd3b47","#dd4444","#fd9c35","#fec42c","#d4df5a","#5578c2"],
							 
							
                             legend: {
								 maxHeight: 200,
								 show: true, container: '#chart3-legend', placement: 'outsideGrid',
								 position:"sw",
                             }
                             
                         });*/
                       //  console.log(JSON.parse(pizza.getData()));   
                     }); 
                 
                   
                  
             }
             function em_curso(escola,perfil,segmento){
                 $.ajax({
                     method: "POST",
                     url: "statistics.php",
                     dataType: "html",
                     data: { func: "em_curso", escola : escola, perfil:perfil,segmento:segmento }
                         })
                     .done(function(data){
                         $('#em_curso').text(data);
                     });  
             }
             function concluidos(escola,perfil,segmento){
                 $.ajax({
                     method: "POST",
                     url: "statistics.php",
                     dataType: "html",
                     data: { func: "concluidos", escola : escola, perfil:perfil,segmento:segmento }
                         })
                     .done(function(data){
                         $('#concluidos').text(data);
                     }); 
             }
             function risco(escola,perfil,segmento){
               
                 $.ajax({
                     method: "POST",
                     url: "statistics.php",
                     dataType: "html",
                     data: { func: "risco", escola : escola, perfil:perfil,segmento:segmento }
                         })
                     .done(function(data){
                         $('#risco').text(data);
                     }); 
             }
             function cursistas(value){
                 $.ajax({
                     method: "POST",
                     url: "statistics.php",
                     dataType: "html",
                     data: { func: "cursistas", value : value }
                         })
                     .done(function(data){
                         //alert(data);
                         $('#cursista').empty();
                         $('#cursista').append(data);
                     }); 
             }
             function os_cursos(curso,perfil,segmento,escola){
                 $.ajax({
                     method: "POST",
                     url: "statistics.php",
                     dataType: "html",
                     data: { func: "os_cursos", curso : curso, perfil:perfil,segmento:segmento,escola:escola }
                         })
                     .done(function(data){
                         $('#report').html(data);
                     }); 
             }
             function daCursos(escola,perfil,segmento){
                 $.ajax({
                     method: "POST",
                     url: "statistics.php",
                     dataType: "html",
                     data: { func: "daCursos", escola : escola, perfil:perfil,segmento:segmento }
                         })
                     .done(function(data){
                         $('#daCursos').empty();
                         $('#daCursos').append('<option value=0>Selecione o Curso</option>'+data);
                     }); 
             }
             function daCategoria(value){
                 $.ajax({
                     method: "POST",
                     url: "statistics.php",
                     dataType: "html",
                     data: { func: "daCategoria", value : value }
                         })
                     .done(function(data){
                         //alert(data);
                         $('#daCategoria').html();
                         $('#daCategoria').append(data);
                     }); 
             }
             function categorias(curso,perfil,segmento,escola){
                 $.ajax({
                     method: "POST",
                     url: "statistics.php",
                     dataType: "html",
                     data: { func: "categorias", curso : curso, perfil:perfil,segmento:segmento,escola:escola}
                         })
                     .done(function(data){
                         //alert(data);
                         $('#categorias').empty();
                         $('#categorias').append(data);
                     }); 
             }
             function notas(curso,perfil,segmento,escola){
                 $.ajax({
                     method: "POST",
                     url: "statistics.php",
                     dataType: "html",
                     data: { func: "notas", curso : curso, perfil:perfil,segmento:segmento,escola:escola }
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
                         //console.log(values);
                         var plot_statistics2 = $.plot($("#notas"), [{
                                                data: values,
                                                label: "Média"
                                            }
                                            ], {
                                                series: {
                                                bars: {
                                                    show: true,
                                                    barWidth: 0.6,
                                                    lineWidth: 0,
                                                    fill: true,
                                                    hoverable: true,
                                                    fillColor: {
                                                    colors: [{
                                                        opacity: 1
                                                    }, {
                                                        opacity: 1
                                                    }
                                                    ]
                                                    } 
                                                },
                                                shadowSize: 2
                                                },
                                                legend:{
                                                show: false
                                                },
                                                grid: {
                                                labelMargin: 10,
                                                axisMargin: 500,
                                                hoverable: true,
                                                clickable: true,
                                                tickColor: "rgba(0,0,0,0.15)",
                                                borderWidth: 0
                                                },
                                                colors: ["#FD6A5E", "#FFFFFF", "#52e136"],
                                                xaxis: {
                                                ticks: cont,
                                                tickDecimals: 0
                                                },
                                                yaxis: {
                                                ticks: 6,
                                                tickDecimals: 0,
                                                min: 0,
                                                max:10
                                                }
                                            });
                     }); 
             }
             $('#cursoGraph').bind("plotclick", function (event, pos, item) {
                if (item) {
                    // item.series.label - nome da parte do gráfico clicada
                   // dados_do_curso(item.series.label);
                }
            });
             function andamento(curso,perfil,segmento,escola){
                 $.ajax({
                     method: "POST",
                     url: "statistics.php",
                     dataType: "html",
                     data: { func: "andamento", curso : curso, perfil:perfil,segmento:segmento,escola:escola }
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
                         //console.log(values);
                          var plot_statistics = $.plot($("#Andamento"), [{
                                                    data: values,
                                                    label: "Etapa"
                                                }
                                                ], {
                                                    series: {
                                                    lines: {
                                                        show: true,
                                                        lineWidth: 2, 
                                                        fill: true,
                                                        fillColor: {
                                                        colors: [{
                                                            opacity: 0.25
                                                        }, {
                                                            opacity: 0.25
                                                        }
                                                        ]
                                                        } 
                                                    },
                                                    points: {
                                                        show: true
                                                    },
                                                    shadowSize: 2
                                                    },
                                                    legend:{
                                                    show: false
                                                    },
                                                    grid: {
                                                    labelMargin: 10,
                                                    axisMargin: 500,
                                                    hoverable: true,
                                                    clickable: true,
                                                    tickColor: "rgba(0,0,0,0.15)",
                                                    borderWidth: 0
                                                    },
                                                    colors: ["#50ACFE", "#4A8CF7", "#52e136"],
                                                    xaxis: {
                                                    ticks: cont,
                                                    tickDecimals: 0
                                                    },
                                                    yaxis: {
                                                    ticks: 5,
                                                    tickDecimals: 0
                                                    }
                                                });
                     }); 
             }
            function dados_do_curso(curso){
	                var perfil = $('#perfil').find('option:selected').val();
                    var segmento = $('#segmento').find('option:selected').val(); 
                    $('#spc').html('<tr><th>Status</th><th>|</th><th>%</th></tr>');
                    inscritos_do_curso(curso,escola,segmento,perfil);
                   // curso_em_curso(curso,escola,segmento,perfil);
                   // concluido_em_curso(curso,escola,segmento,perfil);
                   // risco_em_curso(curso,escola,segmento,perfil);
            }
            function inscritos_do_curso(curso,escola,segmento,perfil){
                     //alert(perfil)
                     $.ajax({
                     method: "POST",
                     url: "statistics.php",
                     dataType: "html",
                     data: { func: "inscritos_do_curso", curso : curso, perfil:perfil,segmento:segmento,escola:escola}
                         })
                     .done(function(data){
                         //alert(data);
                         $('#chart_total').text(data);
                     }); 
            }
            function curso_em_curso(curso,escola,segmento,perfil){
                    
                     $.ajax({
                     method: "POST",
                     url: "statistics.php",
                     dataType: "html",
                     data: { func: "curso_em_curso", curso : curso, perfil:perfil,segmento:segmento,escola:escola}
                         })
                     .done(function(data){
                         //alert(data);
                         $('#spc').append(data);
                     }); 
            }
            function concluido_em_curso(curso,escola,segmento,perfil){
                    
                     $.ajax({
                     method: "POST",
                     url: "statistics.php",
                     dataType: "html",
                     data: { func: "concluido_em_curso", curso : curso, perfil:perfil,segmento:segmento,escola:escola}
                         })
                     .done(function(data){
                         //alert(data);
                         $('#spc').append(data);
                     }); 
            }
            function risco_em_curso(curso,escola,segmento,perfil){
                    
                     $.ajax({
                     method: "POST",
                     url: "statistics.php",
                     dataType: "html",
                     data: { func: "risco_em_curso", curso : curso, perfil:perfil,segmento:segmento,escola:escola}
                         })
                     .done(function(data){
                         //alert(data);
                         $('#spc').append(data);
                     }); 
            }
         });
      </script>
   </body>
</html>