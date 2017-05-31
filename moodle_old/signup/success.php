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
        <div class="col-md-offset-4 col-md-4" id="main-content">
            <div class="panel panel-success">
                <div class="panel-heading">
                   
                </div>
                <div class="panel-body">
                    
                </div>
                <div class="panel-footer">
                 <h3 class="panel-title">Cadastro realizado com sucesso!</h3>
                    <p>Hoje começa uma nova etapa no seu desenvolvimento profissional!</p>
                    <p>Seu curso já está disponível na sua área logada do ambiente. Basta acessar a plataforma e clicar no curso para dar inicio aos estudos.</p>
                    <p>Não se esqueça de verificar as regras do curso na aba início do curso e, em caso de duvidas, entre em contato com o time de EaD.</p>
                    <p>Bom curso!</p><br />
                   
                    <button type="button" id="advance">Para começar agora, clique aqui!</button>
                    
                    
                </div>
            </div>
        </div>
                <script type="text/javascript">
                    $(document).ready(function(){
                        
                        $('#advance').click(function(){
                           location.href= "../login/index.php";
                        });
                       
                    });
                </script>      
        <?php echo $OUTPUT->footer(); ?>