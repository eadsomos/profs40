<?php

require_once('../../config.php');
require_once('settings.php');
require_once('lib.php');


$PAGE->set_context(context_system::instance());
$PAGE->set_title("Curso");
$PAGE->set_heading("Curso");

$idcriado = theme_ganesha_get_setting('idcurso');
$idcriado2 = theme_ganesha_get_setting('idcurso2');
$idcriado3 = theme_ganesha_get_setting('idcurso3');
$idcriado4 = theme_ganesha_get_setting('idcurso4');

if (isset($_GET['id'])) {
    $idpagina = $_GET['id'];
    if ($idpagina == $idcriado) {
      $urlbanner = theme_ganesha_get_setting('bannercurso');
      $textocurso = theme_ganesha_get_setting('sobrecurso');
      $publicocurso = theme_ganesha_get_setting('publicoalvo');
      $duracaocurso = theme_ganesha_get_setting('duracao');
      $escolha1curso = theme_ganesha_get_setting('escolha1');
      $texto1curso = theme_ganesha_get_setting('texto1');
      $escolha2curso = theme_ganesha_get_setting('escolha2');
      $texto2curso = theme_ganesha_get_setting('texto2');
      $escolha3curso = theme_ganesha_get_setting('escolha3');
      $texto3curso = theme_ganesha_get_setting('texto3');
	  $escolha4curso = theme_ganesha_get_setting('escolha4');
      $texto4curso = theme_ganesha_get_setting('texto4');
      $modulo = theme_ganesha_get_setting('modulo');
	  $filearea = "bannercurso";
    }elseif($idpagina == $idcriado2){
      $urlbanner = theme_ganesha_get_setting('bannercurso2');
      $textocurso = theme_ganesha_get_setting('sobrecurso2');
      $publicocurso = theme_ganesha_get_setting('publicoalvo2');
      $duracaocurso = theme_ganesha_get_setting('duracao2');
      $escolha1curso = theme_ganesha_get_setting('escolha12');
      $texto1curso = theme_ganesha_get_setting('texto12');
      $escolha2curso = theme_ganesha_get_setting('escolha22');
      $texto2curso = theme_ganesha_get_setting('texto22');
      $escolha3curso = theme_ganesha_get_setting('escolha32');
      $texto3curso = theme_ganesha_get_setting('texto32');
	  $escolha4curso = theme_ganesha_get_setting('escolha42');
      $texto4curso = theme_ganesha_get_setting('texto42');
      $modulo = theme_ganesha_get_setting('modulo2');
	  $filearea = "bannercurso2";
    }elseif($idpagina == $idcriado3){
      $urlbanner = theme_ganesha_get_setting('bannercurso3');
      $textocurso = theme_ganesha_get_setting('sobrecurso3');
      $publicocurso = theme_ganesha_get_setting('publicoalvo3');
      $duracaocurso = theme_ganesha_get_setting('duracao3');
      $escolha1curso = theme_ganesha_get_setting('escolha13');
      $texto1curso = theme_ganesha_get_setting('texto13');
      $escolha2curso = theme_ganesha_get_setting('escolha23');
      $texto2curso = theme_ganesha_get_setting('texto23');
      $escolha3curso = theme_ganesha_get_setting('escolha33');
      $texto3curso = theme_ganesha_get_setting('texto33');
	  $escolha4curso = theme_ganesha_get_setting('escolha43');
      $texto4curso = theme_ganesha_get_setting('texto43');
      $modulo = theme_ganesha_get_setting('modulo3');
	  $filearea = "bannercurso3";
    }elseif($idpagina == $idcriado4){
      $urlbanner = theme_ganesha_get_setting('bannercurso4');
      $textocurso = theme_ganesha_get_setting('sobrecurso4');
      $publicocurso = theme_ganesha_get_setting('publicoalvo4');
      $duracaocurso = theme_ganesha_get_setting('duracao4');
      $escolha1curso = theme_ganesha_get_setting('escolha14');
      $texto1curso = theme_ganesha_get_setting('texto14');
      $escolha2curso = theme_ganesha_get_setting('escolha24');
      $texto2curso = theme_ganesha_get_setting('texto24');
      $escolha3curso = theme_ganesha_get_setting('escolha34');
      $texto3curso = theme_ganesha_get_setting('texto34');
	  $escolha4curso = theme_ganesha_get_setting('escolha44');
      $texto4curso = theme_ganesha_get_setting('texto44');
      $modulo = theme_ganesha_get_setting('modulo4');
	  $filearea = "bannercurso4";
    }
	
	$urlimagem = moodle_url::make_pluginfile_url('1', 'theme_ganesha', $filearea, '0', '', $urlbanner);	
    ?>
    <link rel="stylesheet" href="<?php echo $CFG->wwwroot;?>/theme/ganesha/css/easy-responsive-tabs.css" media="screen" charset="utf-8">
    <script src="<?php echo $CFG->wwwroot;?>/theme/ganesha/javascript/modernizr.custom.js"></script>
    <style type="text/css">
      #page{ padding:0!important;}
      #page-header{ display: none!important;}
      .performanceinfo, .pageinfo{display: none!important;}
      #page-content {
          margin-top: 0!important;
      }
    </style>
    <?php echo $OUTPUT->header(); ?>
  </div>
  
    <section id="myCarousel" class="carousel slide" style="margin-bottom:0!important;">

      <!-- Caixa Slides -->
      <div class="carousel-inner">
        <div class="item active">
          <div class="guarda-conteudo">
            <div class="row">
              <div class="span4 centro">
                <a href="#conteudo">
                  <div class="conteudo-icon">
                    <img src="pix/conteudoicon.png" alt="conteudo" />
                    <h3>CONTEÚDO</h3>
                  </div>
                </a>
              </div>
              <div class="span4 centro">
                <a href="#recursos">
                  <div class="conteudo-icon">
                    <img src="pix/recursosicon.png" alt="recursos" />
                    <h3>RECURSOS</h3>
                  </div>
                </a>
              </div>
              <div class="span4 centro">
                <a href="#ementa">
                  <div class="conteudo-icon">
                    <img src="pix/ementaicon.png" alt="ementa" />
                    <h3>EMENTA</h3>
                  </div>
                </a>
              </div>
            </div>
          </div>
            <!-- 1º BG CSS -->
            <div class="fill" style="background-image:url(<?php echo $urlimagem; ?>);">
            </div>
        </div>
      </div>
    </section>


    <div class="container-fluid funciona">
      <div class="row-fluid">
        <section class="como-funciona" id="conteudo">
          <h3 class="titulo-pag-branco">CONTEÚDO</h3>
          <!--Vertical Tab-->
          <div id="parentVerticalTab">
              <ul class="resp-tabs-list hor_1 incursotab">
                <li class="cursoinli"><h4 class="cursoin"><img src="pix/1.png" alt="1">Sobre o Curso</h4></li>
                <li class="cursoinli"><h4 class="cursoin"><img src="pix/2.png" alt="2">Público Alvo</h4></li>
                <li class="cursoinli"><h4 class="cursoin"><img src="pix/3.png" alt="3">Duração</h4></li>
              </ul>
              <div class="resp-tabs-container hor_1 cursotab">
                  <div>
                      <div class="txt-cursointerno">
                        <p><?php echo $textocurso; ?></p>
                      </div>
                  </div>
                  <div>
                      <div class="txt-cursointerno">
                        <p><?php echo $publicocurso; ?></p>
                      </div>
                  </div>
                  <div>
                      <div class="txt-cursointerno">
                        <p><?php echo $duracaocurso; ?></p>
                      </div>
                  </div>
              </div>
          </div>
        </section>
      </div>
    </div>

    <div class="container-fluid recursos">
      <div class="row-fluid">
        <section class="como-funciona" id="recursos">
          <h3 class="titulo-pag-branco">RECURSOS</h3>
          <!--Vertical Tab-->
          <div id="parentVerticalTab2">
              <ul class="resp-tabs-list hor_2 incursotab">
                <?php

                  if ($escolha1curso == 0) {
                    }elseif ($escolha1curso == 1) {
                      echo '<li class="cursoinli"><h4 class="cursoin"><img src="pix/video.png" alt="3">Vídeo Instrucional</h4></li>';
                    }elseif ($escolha1curso == 2) {
                      echo '<li class="cursoinli"><h4 class="cursoin"><img src="pix/exemplo.png" alt="2">Exemplo</h4></li>';
                    }elseif ($escolha1curso == 3) {
                      echo '<li class="cursoinli"><h4 class="cursoin"><img src="pix/contra-exemplo.png" alt="3">Contraexemplo</h4></li>';
                  	}elseif ($escolha1curso == 4) {
                      echo '<li class="cursoinli"><h4 class="cursoin"><img src="pix/video.png" alt="4">Texto</h4></li>';
                  }

                  if ($escolha2curso == 0) {
                    }elseif ($escolha2curso == 1) {
                      echo '<li class="cursoinli"><h4 class="cursoin"><img src="pix/video.png" alt="3">Vídeo Instrucional</h4></li>';
                    }elseif ($escolha2curso == 2) {
                      echo '<li class="cursoinli"><h4 class="cursoin"><img src="pix/exemplo.png" alt="2">Exemplo</h4></li>';
                    }elseif ($escolha2curso == 3) {
                      echo '<li class="cursoinli"><h4 class="cursoin"><img src="pix/contra-exemplo.png" alt="3">Contraexemplo</h4></li>';
                  	}elseif ($escolha2curso == 4) {
                      echo '<li class="cursoinli"><h4 class="cursoin"><img src="pix/video.png" alt="4">Texto</h4></li>';
                  }

                  if ($escolha3curso == 0) {
                    }elseif ($escolha3curso == 1) {
                      echo '<li class="cursoinli"><h4 class="cursoin"><img src="pix/video.png" alt="3">Vídeo Instrucional</h4></li>';
                    }elseif ($escolha3curso == 2) {
                      echo '<li class="cursoinli"><h4 class="cursoin"><img src="pix/exemplo.png" alt="2">Exemplo</h4></li>';
                    }elseif ($escolha3curso == 3) {
                      echo '<li class="cursoinli"><h4 class="cursoin"><img src="pix/contra-exemplo.png" alt="3">Contraexemplo</h4></li>';
                  	}elseif ($escolha3curso == 4) {
                      echo '<li class="cursoinli"><h4 class="cursoin"><img src="pix/video.png" alt="4">Texto</h4></li>';
                  }
				  
				  if ($escolha4curso == 0) {
                    }elseif ($escolha4curso == 1) {
                      echo '<li class="cursoinli"><h4 class="cursoin"><img src="pix/video.png" alt="3">Vídeo Instrucional</h4></li>';
                    }elseif ($escolha4curso == 2) {
                      echo '<li class="cursoinli"><h4 class="cursoin"><img src="pix/exemplo.png" alt="2">Exemplo</h4></li>';
                    }elseif ($escolha4curso == 3) {
                      echo '<li class="cursoinli"><h4 class="cursoin"><img src="pix/contra-exemplo.png" alt="3">Contraexemplo</h4></li>';
                  	}elseif ($escolha4curso == 4) {
                      echo '<li class="cursoinli"><h4 class="cursoin"><img src="pix/video.png" alt="4">Texto</h4></li>';
                  }

                ?>
              </ul>

              <div class="resp-tabs-container hor_2 cursotab">
                  <div>
                      <div class="txt-cursointerno">
                        <p><?php echo $texto1curso; ?></p>
                      </div>
                  </div>
                  <div>
                      <div class="txt-cursointerno">
                        <p><?php echo $texto2curso; ?></p>
                      </div>
                  </div>
                  <div>
                      <div class="txt-cursointerno">
                        <p><?php echo $texto3curso; ?></p>
                      </div>
                  </div>
              </div>
          </div>
        </section>
      </div>
    </div>

    <div class="container-fluid ementa">
      <div class="row-fluid">
        <section class="como-funciona" id="ementa">
          <h3 class="titulo-pag-branco">EMENTA</h3>
          <!--Vertical Tab-->
          <div id="parentVerticalTab3">
              <ul class="resp-tabs-list hor_3 incursotab">
                <li class="cursoinli"><h4 class="cursoin"><img src="pix/1.png" alt="1">Ementa</h4></li>
              </ul>
              <div class="resp-tabs-container hor_3 cursotab">
                  <div>
                      <div class="txt-cursointerno">
                        <p><?php echo $modulo; ?></p>
                      </div>
                  </div>
              </div>
          </div>
        </section>
      </div>
    </div>

    <?php
    }else{
      echo 'fallback';
    }

echo $OUTPUT->footer();
?>
