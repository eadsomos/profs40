<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Moodle's ganesha theme, an example of how to make a Bootstrap theme
 *
 * DO NOT MODIFY THIS THEME!
 * COPY IT FIRST, THEN RENAME THE COPY AND MODIFY IT INSTEAD.
 *
 * For full information about creating Moodle themes, see:
 * http://docs.moodle.org/dev/Themes_2.0
 * * @package   theme_ganesha
 * @copyright 2016 Somos Educação
 * @license   uso interno
 */

// Get the HTML for the settings bits.
$html = theme_ganesha_get_html_for_settings($OUTPUT, $PAGE);

if (right_to_left()) {
    $regionbsid = 'region-bs-main-and-post';
} else {
    $regionbsid = 'region-bs-main-and-pre';
}

echo $OUTPUT->doctype() ?>
<html <?php echo $OUTPUT->htmlattributes(); ?>>
<head>
  <title><?php echo $OUTPUT->page_title(); ?></title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="shortcut icon" href="<?php echo $OUTPUT->pix_url('favicon', 'theme'); ?>" />
  <?php echo $OUTPUT->standard_head_html() ?>
  <!--<link rel="stylesheet" href="css/bootstrap.min.css" media="screen" charset="utf-8">
  <link rel="stylesheet" href="css/bootstrap-responsive.min.css" media="screen" charset="utf-8">-->
  <link rel="stylesheet" href="<?php echo $CFG->wwwroot;?>/theme/ganesha/css/homenova.css" media="screen" charset="utf-8">
  <link rel="stylesheet" href="<?php echo $CFG->wwwroot;?>/theme/ganesha/css/easy-responsive-tabs.css" media="screen" charset="utf-8">
  <script src="<?php echo $CFG->wwwroot;?>/theme/ganesha/javascript/modernizr.custom.js"></script>
</head>

<body <?php echo $OUTPUT->body_attributes(); ?>>

<?php echo $OUTPUT->standard_top_of_body_html() ?>

<?php  require_once(dirname(__FILE__) . '/includes/header.php');  ?>
<?php
	$PAGE->requires->js('/theme/ganesha/javascript/bootstrap-carousel.js');
	$PAGE->requires->js('/theme/ganesha/javascript/bootstrap-transition.js');
?>


<!-------------------------------------------------- Slider Principal -------------------------------------------------->
<section id="myCarousel" class="carousel slide">
  <!-- Indicadores -->
  <ol class="carousel-indicators">
      <li data-target="#myCarousel" data-slide-to="0" class="active"></li>
      <li data-target="#myCarousel" data-slide-to="1"></li>
      <li data-target="#myCarousel" data-slide-to="2"></li>
  </ol>

  <!-- Caixa Slides -->
  <div class="carousel-inner">
      <div class="item active">
          <!-- 1º BG CSS -->
          <div class="fill" style="background-image:url('<?php echo $CFG->wwwroot;?>/theme/ganesha/pix/1banner.jpg');"></div>
      </div>
  </div>

  <!-- Controles
  <a class="left carousel-control" href="#myCarousel" data-slide="prev">
      <span class="icon-prev"></span>
  </a>
  <a class="right carousel-control" href="#myCarousel" data-slide="next">
      <span class="icon-next"></span>
  </a>-->
</section>


<!-------------------------------------------------- FIM Slider Principal -------------------------------------------------->


<!-------------------------------------------------- CURSOS -------------------------------------------------->
  <div class="container-fluid">
    <div class="row-fluid">
      <div class="span6">
        <h3 class="titulo-pag">CURSOS EM DESTAQUE</h3>
      </div>
      <div class="span6">
        <div class="controles-thumb">

        </div>
      </div>
    </div>
  </div>

  <div class="container-fluid">
    <div class=" row-fluid">
      <ul class="thumbnails">
      <?php echo $OUTPUT->featuredcourses($CFG); ?>
      </ul>
    </div>
  </div>


<!-------------------------------------------------- FINAL CURSOS -------------------------------------------------->

<!-------------------------------------------------- COMO FUNCIONA -------------------------------------------------->
<div class="container-fluid funciona">
  <div class="row-fluid">
    <section class="como-funciona">
      <h3 class="titulo-pag-branco">METODOLOGIA</h3>
      <!--Vertical Tab-->
      <div id="parentVerticalTab">
          <ul class="resp-tabs-list hor_1">
            <li><h4><img src="<?php echo $CFG->wwwroot;?>/theme/ganesha/pix/1.png" alt="1">Material</h4><p>A SOMOS disponibiliza na plataforma uma série de recursos e materiais que apoiam o professor no desenvolvimento de novas habilidades e tratam os temas de forma prática, direta e não deixando de lado os referenciais teóricos que embasam nossa metodologia.</p></li>
              <li><h4><img src="<?php echo $CFG->wwwroot;?>/theme/ganesha/pix/2.png" alt="2">Recursos exclusivos da SOMOS</h4><p>São apresentadas técnicas, exemplos e contraexemplos de atitudes e situações de sala de aula para aprimoramento da atividade docente. Situações gravadas com os professores da rede de escolas da SOMOS em situações reais de sala de aula. E Contraexemplos elaborados com especialistas para mostrar situações que devem ser evitadas.</p></li>
              <li><h4><img src="<?php echo $CFG->wwwroot;?>/theme/ganesha/pix/3.png" alt="3">Coaching do professor cursista</h4><p>O professor conta com uma tutoria especializada a sua disposição para tirar dúvidas do material, bem como para os feedbacks das atividades enviadas do curso. Nossa tutoria segue um padrão de coaching que ajuda o professor no seu desenvolvimento profissional.</p></li>
          </ul>
          <div class="resp-tabs-container hor_1">
              <div>
                  <div class="img-funciona">
                    <img src="<?php echo $CFG->wwwroot;?>/theme/ganesha/pix/banner1.png" alt="passo 1" />
                  </div>
              </div>
              <div>
                  <div class="img-funciona">
                    <img src="<?php echo $CFG->wwwroot;?>/theme/ganesha/pix/banner2.png" alt="passo 2" style="margin-bottom:45px;" />
                  </div>
              </div>
              <div>
                  <div class="img-funciona">
                    <img src="<?php echo $CFG->wwwroot;?>/theme/ganesha/pix/banner3.png" alt="passo 3" style="margin-bottom:10px;"/>
                  </div>
              </div>
          </div>
      </div>
    </section>
  </div>
</div>
<!-------------------------------------------------- FIM COMO FUNCIONA -------------------------------------------------->
<div class="container-fluid" style="display:none;">
  <div class="row-fluid">
    <div class="span6">
      <h3 class="titulo-pag">NOVIDADES</h3>
    </div>
    <div class="span6">
      <div class="controles-thumb">

      </div>
    </div>
  </div>
  <div class="row-fluid">
    <div class="span12">
     <?php  echo $OUTPUT->main_content(); ?>
    </div>
  </div>
</div>

<?php  require_once(dirname(__FILE__) . '/includes/footer.php');  ?>

</body>
</html>
