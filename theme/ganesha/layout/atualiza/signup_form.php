    
    <script src="https://code.jquery.com/jquery-2.2.4.min.js" integrity="sha256-BbhdlvQf/xTY9gja0Dq3HiwQF8LaCRTXxZKRutelT44=" crossorigin="anonymous"></script>
    <script src="<?php echo $CFG->wwwroot;?>/theme/ganesha/javascript/jquery-ui.min.js" ></script>
   	<link rel="stylesheet" href="<?php echo $CFG->wwwroot;?>/theme/ganesha/css/homenova.css" media="screen" charset="utf-8">
   	<link rel="stylesheet" href="<?php echo $CFG->wwwroot;?>/theme/ganesha/style/theme.css" media="screen" charset="utf-8">
   	<link rel="stylesheet" href="<?php echo $CFG->wwwroot;?>/theme/ganesha/layout/atualiza/css/bootstrap-responsive.css" media="screen" charset="utf-8">
   	<link rel="stylesheet" href="<?php echo $CFG->wwwroot;?>/theme/ganesha/layout/atualiza/css/bootstrap.min.css" media="screen" charset="utf-8">
    <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">
    <script src="<?php echo $CFG->wwwroot;?>/theme/ganesha/javascript/jquery.fancybox.js"></script>
	<script src="<?php echo $CFG->wwwroot;?>/theme/ganesha/layout/atualiza/js/jquery.maskedinput.js"></script> 
	<script src="<?php echo $CFG->wwwroot;?>/theme/ganesha/layout/atualiza/js/jquery.validate.js"></script> 
 	<script src="<?php echo $CFG->wwwroot;?>/theme/ganesha/layout/atualiza/js/bootstrap.min.js"></script>
 	<link href="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/css/select2.min.css" rel="stylesheet" />
	<script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/js/select2.min.js"></script>
 	<script src="<?php echo $CFG->wwwroot;?>/theme/ganesha/layout/atualiza/js/pt-BR.js"></script>

<?php
    // MDL_ENROL =! meta
    require_once('../../../../config.php');
    global $DB;
    $email = '';
    $courseid='0';
    $key = '';
	$ufurl = '';
	$cidadeurl = '';
	$bairrourl = '';
	$escolaurl = '';
    if(isset($_GET['email'])){
      $email = $_GET['email'];
    }
    if(isset($_GET['curso'])){
       $courseid = $_GET['curso'];
    }
    if(isset($_GET['key'])){
       $key = $_GET['key'];
    }

	if(isset($_GET['uf'])){
       $ufurl = $_GET['uf'];
    }

	if(isset($_GET['cidade'])){
       $cidadeurl = $_GET['cidade'];
    }
	if(isset($_GET['bairro'])){
       $bairrourl = $_GET['bairro'];
	}
	if(isset($_GET['escola'])){
       $escolaurl = $_GET['escola'];
    }

    $estados = $DB->get_records_sql('SELECT id,uf FROM {estado}' , array());
	$cursosMeta = $DB->get_records_sql('SELECT DISTINCT {course}.id 
										FROM {course} 
										INNER JOIN {enrol} ON {course}.id = {enrol}.courseid 
										WHERE {enrol}.enrol = "meta"');


	foreach($cursosMeta as $meta){
		$metaID[] = $meta->id;
	}

	
    $cursos = $DB->get_records_sql('SELECT DISTINCT * 
									FROM {course} 
									INNER JOIN {enrol} ON {course}.id = {enrol}.courseid 
									WHERE {course}.id NOT IN ('.implode(",",$metaID).')
									GROUP BY mdl_course.id
                                    ORDER BY {course}.fullname ASC', array());
    $segmentos = $DB->get_record_sql('SELECT param1 FROM {user_info_field} WHERE {user_info_field}.id = 7' , array());
    //$segmentostring = implode("", $segmentos);
    $segmentoarray = explode(PHP_EOL, $segmentos->param1);
    $cpfdata;
	$bairrodata;
	$cidadedata;
	$escoladata;
	$ufdata;


    if($userOldEntry = $DB->get_record('user',array('email'=> $email))){
        $hasEntry = true;
        $cpfdata = $DB->get_record('user_info_data',array('userid'=>$userOldEntry->id,'fieldid'=>1));
		$bairrodata = $DB->get_record('user_info_data',array('userid'=>$userOldEntry->id,'fieldid'=>4));
		$escoladata = $DB->get_record('user_info_data',array('userid'=>$userOldEntry->id,'fieldid'=>2));
		$ufdata = $DB->get_record('user_info_data',array('userid'=>$userOldEntry->id,'fieldid'=>3));
        $segmentodata = $DB->get_record('user_info_data',array('userid'=>$userOldEntry->id,'fieldid'=>7));
		$coursesEnrol = enrol_get_all_users_courses($userOldEntry->id,true);
		
		if(isset($coursesEnrol)){
			?>
			<div class="alert alert-success">
				<p>Você já está inscrito em:</p>
				<?php
				foreach($coursesEnrol as $enrolleds){
					echo($enrolleds->fullname);
					echo "<br>";
				}
				?>
			</div>
			<?php
		}
		$cursoInscrito = array();
        foreach($cursos as $curso){
            foreach($coursesEnrol as $enrolled){
                if($curso->shortname == $enrolled->shortname){
                    unset($cursos[array_keys($cursos,$curso)[0]]);
                    break;
                }
            }
        }

    }else{
        $hasEntry = false;
    }

	$cidadedata = $userOldEntry->city;
	$bairroCerto = $bairrodata->data;
	$escolaCerta = $escoladata->data;
	$ufCerto = $ufdata->data;
	

	if($ufCerto and $cidadedata and $bairroCerto and $escolaCerta){
		
		
		$escolaCorreta = $DB->get_records_sql('SELECT id 
												FROM {escola} 
												WHERE municipio = "'.$cidadedata.'"
												AND endereco_bairro = "'.$bairroCerto.'"
												AND uf = "'.$ufCerto.'"
												AND desc_nome = "'.$escolaCerta.'"',array());
		
		
		if($escolaCorreta){
			$escolaSelecionada = true;
		}
	}
?>
	

    <style>
        .ui-autocomplete {
            max-height: 100px;
            overflow-y: auto;
            /* prevent horizontal scrollbar */
            overflow-x: hidden;
               background-color: #dedede;
        }
        .error {
            color:red;
        }

		select{width:100%;}
		select[disabled] *{
			background: #eee!important;
   			cursor: no-drop!important;
		}
		input{width:100%;}
		button{width: 100%;margin-top: 30px;height: 50px;font-size: 22px;}
		.checkbox {}
        /* IE 6 doesn't support max-height
        * we use height instead, but this forces the menu to always be this tall
        */
        * html .ui-autocomplete {
            height: 100px;
        }
        #cidade {
            text-transform: uppercase!important;
        }
        #bairro {
            text-transform: uppercase!important;
        }
		.checkbox input[type="checkbox"] {
		float:none!important;
		}

        #escola{
            text-transform: uppercase!important;
        }
		.select2-container--default.select2-container--disabled .select2-selection--single {
			cursor: no-drop!important;
		}
		.select2-container--default .select2-selection--single {
			border: 1px solid #ccc!important;
			border-radius: 0!important;
		}
		.select2-container .select2-selection--single {
			box-sizing: border-box!important;
			cursor: pointer!important;
			display: block!important;
			height: 43px!important;
			user-select: none!important;
			-webkit-user-select: none!important;
			width: 101%!important;
		}
		.select2-container--default .select2-selection--single .select2-selection__rendered {
			color: #444!important;
			line-height: 41px!important;
		}
		
		.select2-container--default .select2-selection--single .select2-selection__arrow {
			height: 41px!important;
		}
    </style>
    <form action="/new_user.php" method="POST" id="daForm">
    <input type="hidden" name="update" value="<?php if($hasEntry){echo '1';}else{echo '0';} ?>">
		<div class="form-group">	
			<div class="container">
				<div class="row-fluid">
					<div class="span12">
						<label for="cpf">CPF</label>
						<div class="outputcpf"></div>
						<input type="text" name="cpf" class="form-control" id="cpf" <?php if(!$cpfdata == ''){echo 'value="'.$cpfdata->data.'" readonly';} ?> >
					</div>
				</div>
				<div class="row-fluid">
					<div class="span12">
						<label for="segmento">Segmento</label>
						<select class="form-control" id="segmento" name="segmento" >
							<option selected="selected" value="0">Selecione</option>
							<?php
								foreach($segmentoarray as $segmento)
								{
									echo '<option value="'.$segmento.'">'.$segmento.'</option>';
								}
								if($hasEntry)
								{
									echo '<option selected="selected" value="'.$segmento.'">'.$segmento.'</option>';
								}
							 ?>
						</select>
					</div>
				</div>
				<div class="row-fluid">
					<div class="span2">
						<label for="estado">Estado</label>
						<select class="form-control" id="estado" name="estado">
							<?php
							
								if ($ufurl){
									echo '<option value="'.$ufurl.'">'.$ufurl.'</option>';
								}else{
									
									if($hasEntry){
										if($escolaSelecionada){
											echo '<option selected="selected" value="'.$ufdata->data.'">'.$ufdata->data.'</option>';
										}
									}
									
									
									echo '<option>Selecione seu Estado</option>';
									foreach($estados as $estado){
										echo '<option value="'.$estado->uf.'">'.$estado->uf.'</option>';
									}
									
								}
								
							 ?>
						</select>
					</div>
					<div class="span6">
						<div class="ui-widget">
							<label for="cidade">Cidade em que leciona</label>
							<select class="form-control" id="cidade" name="cidade" style="height:40px!important;width:100%;">
								<?php 
								if ($cidadeurl){
									echo '<option value="'.$cidadeurl.'">'.$cidadeurl.'</option>';
								}
								
								if($hasEntry){ 
									if($escolaSelecionada){
										echo '<option value="'.$userOldEntry->city.'">'.$userOldEntry->city.'</option>';
									}
								} 
								?>
							</select>
						</div>
					</div>
					<div class="span4">
						<div class="ui-widget">
							<label for="Bairro">Bairro</label>
							<select class="form-control" id="bairro" name="bairro" style="height:40px!important;width:100%;" <?php if(!$bairrourl == ''){echo 'readonly';} ?>>
								<?php 
								if ($bairrourl){
									echo '<option value="'.$bairrourl.'">'.$bairrourl.'</option>';
								}
								
								if($hasEntry){ 
									if($escolaSelecionada){
										echo '<option value="'.$bairrodata->data.'">'.$bairrodata->data.'</option>';
									}
								} ?>
							</select>
						</div>
					</div>
				</div>
				<div class="row-fluid">
					<div class="span12">
						<div class="ui-widget">
							<label for="escola">Escola</label>
							<select class="form-control" id="escola" name="escola" style="height:40px!important;width:100%;" <?php if(!$escolaurl == ''){echo 'readonly';} ?>>
								<?php 
								if ($escolaurl){
									echo '<option value="'.$escolaurl.'">'.$escolaurl.'</option>';
								}
								if($hasEntry){ 
									if($escolaSelecionada){
										echo '<option value="'.$escoladata->data.'">'.$escoladata->data.'</option>';
									}
								} ?>
							</select>
						</div>						
					</div>
				</div>
				<div class="row-fluid">
					<div class="span12">
						<button type="submit" id="go" readonly>Atualizar</button>
					</div>
				</div>
			</div>
		</div>
	</form>
    
    <script type="text/javascript">
        $(document).ready(function(){
            if($('#key').val() == '1'){
                $('#go').removeAttr('readonly');
              //   alert('has key');
            }
            var uf = "";
            var dataEnd = [];
            var cidades;
            var cpfvalido = false;
            $('#curso').val("<?php echo $courseid; ?>");
            $("#cpf").mask("999.999.999-99");
            $('#estado').change(function(){
               uf = $(this).find('option:selected').text();
               $.ajax({
                    method: "POST",
                    url: "async.php",
                    dataType: "json",
                    data: { method: "estado", value : $(this).find('option:selected').text() },
				   	success: function(data) {
					   var select = $("#cidade"), options = '';
					   select.empty(); 
						options += "<option>Comece a digitar</option>";
					   for(var i=0;i<data.length; i++){
						options += "<option value='"+ data[i].name +"'>"+ data[i].name +"</option>";
					   }
					   select.append(options);
					}
               })
                .done(function( data ) {
                     $('#cidade')
                        .bind( "keyup", function( event ) {
                            var mapaAcentosHex 	= {
                                a : /[\xE0-\xE6]/g,
                                e : /[\xE8-\xEB]/g,
                                i : /[\xEC-\xEF]/g,
                                o : /[\xF2-\xF6]/g,
                                u : /[\xF9-\xFC]/g,
                                c : /\xE7/g,
                                n : /\xF1/g
                            };
                            var $this = $( this );
                            var valor =$this.val();

                            for ( var letra in mapaAcentosHex ) {
                                var expressaoRegular = mapaAcentosHex[letra];
                                valor = valor.replace( expressaoRegular, letra );

                            }
                            $this.val( valor );
						 

                        })
                 });

            });

            $('#cidade').change(function(){
                 var city = $(this).val();
                 $.ajax({
                    method: "POST",
                    url: "async.php",
                    dataType: "json",
                    data: { method: "bairro", value : city},
					success: function(data) {
					   var selectBairro = $("#bairro"), optionsBairro = '';
					   selectBairro.empty();      
						optionsBairro += "<option>Comece a digitar</option>";
					   for(var i=0;i<data.length; i++)
					   {
						optionsBairro += "<option value='"+data[i].bairroNome+"'>"+ data[i].bairroNome +"</option>";              
					   }
					   selectBairro.append(optionsBairro);
					}
				 })
                .done(function( data ) {
                    //alert(data);
                    $( "#bairro" )
                        .bind( "keyup", function( event ) {
                            var mapaAcentosHex 	= {
                                a : /[\xE0-\xE6]/g,
                                e : /[\xE8-\xEB]/g,
                                i : /[\xEC-\xEF]/g,
                                o : /[\xF2-\xF6]/g,
                                u : /[\xF9-\xFC]/g,
                                c : /\xE7/g,
                                n : /\xF1/g
                            };
                            var $this = $( this );
                            var valor =$this.val();

                            for ( var letra in mapaAcentosHex ) {
                                var expressaoRegular = mapaAcentosHex[letra];
                                valor = valor.replace( expressaoRegular, letra );

                            }
                            $this.val( valor );

                        })
                        .autocomplete({
                            source: data,
                            appendTo: 'outputbairro',
                            delay: 500

                        })
                 });
            });
            
			$('#bairro').change(function(){
                var bairro = $(this).val();
				var municipio = $('#cidade').val();
                 $.ajax({
                    method: "POST",
                    url: "async.php",
                    dataType: "json",
                    data: { method: "escola", value : bairro, municipio:municipio },
					success: function(data) {
					   var selectEscola = $("#escola"), optionsEscola = '';
					   selectEscola.empty();      
						optionsEscola += "<option>Comece a digitar</option>";
					   for(var i=0;i<data.length; i++)
					   {
						optionsEscola += "<option value='"+data[i].nomeEscola+"'>"+ data[i].nomeEscola +"</option>";              
					   }

					   selectEscola.append(optionsEscola);
					}
                 })
                .done(function( data ) {
                    
                    $( "#escola" )
                         .bind( "keyup", function( event ) {
                            var mapaAcentosHex 	= {
                                a : /[\xE0-\xE6]/g,
                                e : /[\xE8-\xEB]/g,
                                i : /[\xEC-\xEF]/g,
                                o : /[\xF2-\xF6]/g,
                                u : /[\xF9-\xFC]/g,
                                c : /\xE7/g,
                                n : /\xF1/g
                            };
                            var $this = $( this );
                            var valor =$this.val();

                            for ( var letra in mapaAcentosHex ) {
                                var expressaoRegular = mapaAcentosHex[letra];
                                valor = valor.replace( expressaoRegular, letra );

                            }
                            $this.val( valor );

                        })
                 });
            });

			
            $('#cpf').focusout(function(){
               if(validarCPF($(this).val())){
                    cpfValido = true;
                    $('#cpfmessage').remove();
                }else{
                    cpfValido = false;
                    $('#cpfmessage').remove();
                    $(this).after('<span class ="label label-error" id="cpfmessage">Por favor, use um cpf válido</span>');
                }
            });


            $('#go').click(function(event){
                if(cpfValido == false){
                    alert('É necessário ter um CPF válido!');
                    event.preventDefault();
                }
            });

            $('#daForm').validate({
                rules: {
                    cidade :{
                        required: true
                    },
                    bairro :{
                      required: true
                    }

                },
                messages:{
                    cpf: {required:"É necessário colocar um valor"},
                    cidade: {required:"É necessário colocar um valor"},
                    bairro: {required:"É necessário colocar um valor"}
                }
            });
        });

        function validarCPF(cpf) {
            cpf = cpf.replace(/[^\d]+/g,'');
            if(cpf == '') return false;
            // Elimina CPFs invalidos conhecidos
            if (cpf.length != 11 ||
                cpf == "00000000000" ||
                cpf == "11111111111" ||
                cpf == "22222222222" ||
                cpf == "33333333333" ||
                cpf == "44444444444" ||
                cpf == "55555555555" ||
                cpf == "66666666666" ||
                cpf == "77777777777" ||
                cpf == "88888888888" ||
                cpf == "99999999999")
                    return false;
            // Valida 1o digito
            add = 0;
            for (i=0; i < 9; i ++)
                add += parseInt(cpf.charAt(i)) * (10 - i);
                rev = 11 - (add % 11);
                if (rev == 10 || rev == 11)
                    rev = 0;
                if (rev != parseInt(cpf.charAt(9)))
                    return false;
            // Valida 2o digito
            add = 0;
            for (i = 0; i < 10; i ++)
                add += parseInt(cpf.charAt(i)) * (11 - i);
            rev = 11 - (add % 11);
            if (rev == 10 || rev == 11)
                rev = 0;
            if (rev != parseInt(cpf.charAt(10)))
                return false;
            return true;
        }
    </script>
    
	<script type="text/javascript">
	
		$('#segmento').select2({
			placeholder: 'selecione seu segmento de atuação'
		});
		$('#estado').select2({
			placeholder: 'selecione seu estado'
		});
		$('#cidade').select2({
			placeholder: 'selecione sua cidade'
		});
		$('#bairro').select2({
			placeholder: 'selecione sua escola',
			minimumInputLength: 2,
			language: "pt-BR"
		});
		$('#escola').select2({
			placeholder: 'selecione sua escola',
			minimumInputLength: 2,
			language: "pt-BR",
			tags: true,
			createTag: function (params) {
				return {
				  id: "noschool",
				  text: params.term,
				  newOption: true
				}
			  },
			  templateResult: function (data) {
				var $result = $("<span></span>");
			
				$result.text(data.text);
			
				if (data.newOption) {
				  $result.append(" <em>(Clique aqui caso não tenha encontrado sua escola)</em>");
				}
			
				return $result;
			  }
		});
		
	</script>

	<?php if(!$segmentodata == ''){ ?>
		<script type="text/javascript">
			$('#segmento').select2('enable', false);
		</script>
	<?php } ?>

	<?php if(!$ufdata == '' || !$ufurl == ''){ ?>
		<script type="text/javascript">
			$('#estado').select2('enable', false);
			$('#cidade').select2('enable', false);
			$('#bairro').select2('enable', false);
			$('#escola').select2('enable', false);
		</script>
	<?php } ?>	

	<?php if(!$escoladata == '' || !$escolaurl == ''){ ?>
		<script type="text/javascript">
			$('#escola').select2('enable', false);
		</script>
	<?php } ?>	