<?php
    // MDL_ENROL =! meta
    require_once('../../../config.php');
    global $DB;
    $email = '';
    $courseid='0';
    $key = '';
    if(isset($_GET['email'])){
      $email = $_GET['email'];
    }
    if(isset($_GET['curso'])){
       $courseid = $_GET['curso'];
    }
    if(isset($_GET['key'])){
       $key = $_GET['key'];
    }
    $estados = $DB->get_records_sql('SELECT id,uf FROM {estado}' , array());
    $cursos = $DB->get_records_sql('SELECT DISTINCT * FROM {course} INNER JOIN {enrol} ON {course}.id = {enrol}.courseid WHERE {enrol}.enrol != "meta" GROUP BY mdl_course.shortname ORDER BY mdl_course.shortname', array());
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
       /* echo "<pre>";
        print_r($userOldEntry);*/
        $cpfdata = $DB->get_record('user_info_data',array('userid'=>$userOldEntry->id,'fieldid'=>1));
		$bairrodata = $DB->get_record('user_info_data',array('userid'=>$userOldEntry->id,'fieldid'=>4));
		$escoladata = $DB->get_record('user_info_data',array('userid'=>$userOldEntry->id,'fieldid'=>2));
		$ufdata = $DB->get_record('user_info_data',array('userid'=>$userOldEntry->id,'fieldid'=>3));
        $segmentodata = $DB->get_record('user_info_data',array('userid'=>$userOldEntry->id,'fieldid'=>7));
		$coursesEnrol = enrol_get_all_users_courses($userOldEntry->id,true);
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

?>


<div class="form-group">
    
    <label for="cpf">CPF</label>
    <div class="outputcpf"></div>
    <input type="text" name="cpf" class="form-control" id="cpf" <?php if($hasEntry){echo 'value="'.$cpfdata->data.'"';} ?> >
    
    <label for="segmento">Segmento</label>
    <select class="form-control" id="segmento" name="segmento">
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
    
    <label for="estado">Estado</label>
    <select class="form-control" id="estado" name="estado" <?php if ($hasEntry) {echo 'readonly';}?>>
        <?php
                foreach($estados as $estado)
                {
                 echo '<option value="'.$estado->uf.'">'.$estado->uf.'</option>';
                }
                if($hasEntry)
                {
                    echo '<option selected="selected" value="'.$estado->data.'">'.$ufdata->data.'</option>';
                }

         ?>
    </select>
    
    <div class="ui-widget">
        <label for="cidade">Cidade em que leciona</label>
        <input type="text" class="form-control" id="cidade" name="cidade" <?php if($hasEntry){echo 'value="'.$userOldEntry->city.'"';} ?> >
        <div class="outputcity"></div>
    </div>
    
    
    <label for="escola">Escola em que atua</label>
    <input type="text" id="escola"  class="form-control" name="escola" <?php if($hasEntry){echo 'value="'.$escoladata->data.'"';} ?>>
    <div class="outputschool"></div>
    <div id="outputendereco"></div>
</div>

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
		   //alert($(this).find('option:selected').text());
		   uf = $(this).find('option:selected').text();
		   $.ajax({
				method: "POST",
				url: "async.php",
				dataType: "json",
				data: { method: "estado", value : $(this).find('option:selected').text() }
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
					.autocomplete({
						source: data,
						appendTo: 'outputcity',
						delay: 500

					})
			 });

		});

		$('#cidade').focusout(function(){
			 var city = $(this).val();
			 $.ajax({
				method: "POST",
				url: "async.php",
				dataType: "json",
				data: { method: "bairro", value : city}
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
		$('#bairro').focusout(function(){
			var bairro = $(this).val();
			 $.ajax({
				method: "POST",
				url: "async.php",
				dataType: "json",
				data: { method: "escola", value : bairro}
					})
			.done(function( data ) {
				var dataEscola = [];
				for (var escola in data){
					dataEscola.push(data[escola].desc_nome);
					dataEnd.push(data[escola].desc_nome);
					dataEnd[data[escola].desc_nome] = data[escola].endereco;
				}
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
					.autocomplete({
						source: dataEscola,
						appendTo: 'outputschool',
						select: function( event, ui ) {
							$('#outputendereco').empty();
							$('#outputendereco').attr('class','alert alert-success');
							if(dataEnd[$('#escola').val()] == 'undefined' || typeof dataEnd[$('#escola').val()]  == 'undefined'){
								$('#outputendereco').text('Endereço não informado');
							}else{
								$('#outputendereco').text('Endereço da escola :' + dataEnd[$('#escola').val()]);
							}
						},
						delay: 500

					})
			 });
		});
		 $('#codigo').focusout(function(){
			var codigo = $(this).val();
			var course = $('#curso').val();
			$.ajax({
				method: "POST",
				url: "async.php",
				dataType: "text",
				data: { method: "codigo", value : codigo , courseid : course}
					})
			.done(function( data ) {
				if(data === 'ok'){
					$('#outputcodigo').empty();
					$('#outputcodigo').attr('class','alert alert-success');
					$('#outputcodigo').text('Código Válido');
					$('#go').removeAttr('readonly');
				}else{
					$('#outputcodigo').empty();
					$('#outputcodigo').attr('class','alert alert-error');
					$('#outputcodigo').text(data + '. Entre em contato com o assessor pedagógico para obter o Código de Inscrição.');
					$('#go').attr('readonly','readonly');
				}

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

			if($(this).is('[readonly=true]') || $(this).is('[readonly]')){
				alert('É necessário ter um código de inscrição válido!');
				event.preventDefault();
			}
			if(cpfValido == false){
				alert('É necessário ter um CPF válido!');
				event.preventDefault();
			}
		});
		$('#daForm').validate({
			rules: {
				senha: {
					required: true,
					minlength: 5
				},
				csenha: {
					equalTo: "#senha",
					required: true,
					minlength: 5

				},
				cpf :{
					required: true
				},
				nome :{
					required: true
				},
				sobrenome :{
					required: true
				},
				cidade :{
					required: true
				},
				bairro :{
				  required: true
				},
				codigo :{
					required: true
				}

			},
			messages:{
				senha: {
						required:"É necessário colocar um valor"

					},
				csenha: {
						equalTo: "Os campos devem ser iguais",
						required:"É necessário colocar um valor"
				},
				cpf: {
						required:"É necessário colocar um valor"
				},
				nome: {
						required:"É necessário colocar um valor"

					},
				sobrenome: {
						required:"É necessário colocar um valor"

					},
				cidade: {
						required:"É necessário colocar um valor"

					},
				codigo: {
						required:"É necessário colocar um valor"

					},
				bairro: {
						required:"É necessário colocar um valor"

					}

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