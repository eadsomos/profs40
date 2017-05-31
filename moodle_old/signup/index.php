<?php 

require_once('../login/lib.php');
require_once('../config.php');
require_once($CFG->dirroot .'/course/lib.php');
require_once($CFG->libdir .'/filelib.php');
if (isloggedin()) {
    header("location:../index.php");
} 
$PAGE->set_context(context_system::instance());
$PAGE->set_url('/signup/index.php');
echo $OUTPUT->header();
?>
<!-- Email validator -->
<script src="../signup/js/verifyemail.jquery.js" type="text/javascript"></script>
<!-- Cpf validator -->
<script src="../signup/js/jquery.maskedinput.js" type="text/javascript"></script>
<!-- Autocomplete API    -->
<script src="//code.jquery.com/ui/1.11.4/jquery-ui.js"></script>
<!-- Validate     -->
<script src="../signup/js/jquery.validate.js"></script>
<?php 
$plusdata = '';
if(isset($_GET['curso'])){
    $plusdata = ',curso:'.$_GET['curso'];
}
if(isset($_GET['key'])){
    $plusdata .= ', key:'.$_GET['key'].'';
}
if(isset($_GET['uf'])){
    $plusdata .= ', uf:'.$_GET['uf'].'';
}
if(isset($_GET['cidade'])){
    $plusdata .= ', cidade:'.$_GET['cidade'].'';
}
if(isset($_GET['bairro'])){
    $plusdata .= ', bairro:'.$_GET['bairro'].'';
}
if(isset($_GET['escola'])){
    $plusdata .= ', escola:'.$_GET['escola'].'';
}
?>
        <div class="col-md-offset-4 col-md-4" id="main-content">
            <div class="panel panel-success">
                <div class="panel-heading">
                    
                </div>
               
                <div class="panel-footer">
                <h3 class="panel-title">Inscrição no curso</h3>
                <p>Olá Professor!</p>
                <p>Seja bem-vindo! ao NEaD!</p>
                <p>Para iniciar sua inscrição, digite seu e-mail de uso frequente. Esta informação é necessária, pois o seu login na plataforma será este e-mail e também será nosso canal de comunicação com você para o recebimento de informações sobre o curso.</p>
                  <p>E-mail: <span class="label"></span></p>
                    <div class="form-group">
                      <input type="email" required class="form-control"  id="email" placeholder="seuemail@provedor.com">
                    </div>
                    <button type="button"  id="advance">Avançar</button>
                    <button type="button" id="accept" >O e-mail está correto!</button><br>
                    <div class="alert alert-warning" role="alert" id="aviso"><strong>Professor!</strong> Se o e-mail estiver realmente correto, basta clicar no botão acima para continuar a preencher o formulário. Esta verificação é necessária para evitar problemas futuros pelo não recebimento de informações do ambiente.</div>
                    <p>Em caso de dúvida, entre em contato através do email ead@somoseducacao.com.br</p>
                </div>
            </div>
        </div>
                <script type="text/javascript">
                    $(document).ready(function(){
                        $('#accept').hide();
						$('#aviso').hide();
                        $('#advance').click(function(){
                            var verimail = new Comfirm.AlphaMail.Verimail()
                            var email = $('#email').val();
                            verimail.verify(email,function(status,message,suggestion){
                            if(status < 0){
                                    // Incorrect syntax!
                                    $('#message').remove();
                                    $('.label').after('<span class ="label label-danger" id="message">Por favor, use um e-mail válido</span>');
                                
                            }else{
                                    // Syntax looks great!
                                    if(suggestion){
                                        $('#message').remove();
										$('#advance').hide();
                                        $('#accept').show();
										$('#aviso').show();        
                                        // But we're guessing that you misspelled something
                                        $('.label').after('<span class ="label label-warning" id="message">Você não quis dizer:<b> '+suggestion+'</b>?</span>');
                                        
                                        
                                    }else{
                                    $("#main-content").empty();
                                    $.ajax({
                                            url: "<?php echo $CFG->wwwroot.'/signup/signup_form.php'; ?>",
                                            method: "GET",
                                            data: { email : email <?php echo $plusdata;?>}
                                        })
                                        .done(function( data ) {
                                            $("#main-content").append(data);
                                                
                                        });
                                    }
                            }
                            });
                        });
                        $('#accept').on('click',function(){
                            var email = $('#email').val();
                            $("#main-content").empty();
                                    $.ajax({
                                            url: "<?php echo $CFG->wwwroot.'/signup/signup_form.php'; ?>",
                                            method: "GET",
                                            data: { email : email <?php echo $plusdata;?>}
                                        })
                                        .done(function( data ) {
                                            $("#main-content").append(data);
                                                
                                        });
                                    
                        });
                    });
                </script>      
        <?php echo $OUTPUT->footer(); ?>
  