<?php 
    require_once('../../../../config.php');
    global $DB;
    $email = $_GET['email'];
    if($userOldEntry = $DB->get_record('user',array('email'=> $email))){
       ?>
       <div class="panel panel-success">
         <div class="panel-heading">
            <h3 class="panel-title">Inscrição no curso</h3>
         </div>
         <div class="panel-body">
            Por favor, confirme sua senha antes de continuar!
         </div>
         <div class="panel-footer">
            <span class="label label-success" style="margin-right:10em">Senha</span>
            <div class="form-group">
                <input type="password" required class="form-control" id="senha">
            </div>
            <button type="button" class="btn btn-success">Avançar</button><br>
            Em caso de dúvida, entre em contato com o Apoio Digital
         </div>
        </div>
        <script type="text/javascript">
            $(document).ready(function(){
                 $('.btn').click(function(){
                     var senha = $('#senha').val();
                     var csenha = '<?php echo $userOldEntry->password;?>';
                     $.ajax({
                        url: "<?php echo $CFG->wwwroot.'/signup/async.php'; ?>",
                        method: "POST",
                        data: { senha : senha , method : 'senha', old : csenha}
                     })
                     .done(function( data ) {
                        $("#main-content").append(data);
                     });
                 });
            });
        </script>
       <?php
    }else{
        
    }
?>