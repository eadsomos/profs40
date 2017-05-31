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
 *
 * @package   theme_ganesha
 * @copyright 2015 Nephzat Dev Team,nephzat.com
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

// Get the HTML for the settings bits.
$html = theme_ganesha_get_html_for_settings($OUTPUT, $PAGE);
$right = (right_to_left());
$actual_link = "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
$root_site = "http://$_SERVER[HTTP_HOST]/";

echo $OUTPUT->doctype() ?>
<html <?php echo $OUTPUT->htmlattributes(); ?>>
<head>
    <title><?php echo $OUTPUT->page_title(); ?></title>
    <link rel="shortcut icon" href="<?php echo $OUTPUT->pix_url('favicon', 'theme'); ?>" />
    <?php echo $OUTPUT->standard_head_html() ?>
	<script src="<?php echo $CFG->wwwroot;?>/theme/ganesha/javascript/modernizr.custom.js"></script>
    <script src="<?php echo $CFG->wwwroot;?>/theme/ganesha/javascript/accordion.js"></script>
   
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="<?php echo $CFG->wwwroot;?>/theme/ganesha/css/homenova.css" media="screen" charset="utf-8">
    <link rel="stylesheet" type="text/css" href="<?php echo $CFG->wwwroot;?>/theme/ganesha/css/tooltipster.bundle.min.css" />
    <link rel="stylesheet" href="<?php echo $CFG->wwwroot;?>/theme/ganesha/style/jquery.fancybox.css"></script>
    <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">

    <?php if(strpos($actual_link,$CFG->wwwroot.'/course') !== false or $actual_link == $root_site){ ?>
      <link rel="stylesheet" href="<?php echo $CFG->wwwroot;?>/theme/ganesha/css/curso.css" media="screen" charset="utf-8">
    <?php } ?>
    <?php if(strpos($actual_link,$CFG->wwwroot.'/mod') !== false or $actual_link == $root_site){ ?>
      <link rel="stylesheet" href="<?php echo $CFG->wwwroot;?>/theme/ganesha/css/curso.css" media="screen" charset="utf-8">
    <?php } ?>
    
    
</head>

<body <?php echo $OUTPUT->body_attributes('two-column'); ?>>


<?php echo $OUTPUT->standard_top_of_body_html() ?>
<script src="<?php echo $CFG->wwwroot;?>/theme/ganesha/javascript/percircle.js"></script>
<script type="text/javascript" src="<?php echo $CFG->wwwroot;?>/theme/ganesha/javascript/tooltipster.bundle.min.js"></script>


<?php  require_once(dirname(__FILE__) . '/includes/header.php');  ?>
<?php
if(strpos($actual_link,$CFG->wwwroot.'/course') !== false or $actual_link == $root_site){
  $container = "container-fluid";
}else if(strpos($actual_link,$CFG->wwwroot.'/theme/ganesha/') !== false or $actual_link == $root_site){
  $container = "container-fluid";
}else if(strpos($actual_link,$CFG->wwwroot.'/mod') !== false or $actual_link == $root_site){
  $container = "container-fluid";
}else{
  $container = "container";
}
?>

<div id="page" class="container">
    <div id="page-content" class="row-fluid">
       <?php
			$classextra = '';
			if ($right) {
				$classextra = 'desktop-first-column';
			}
			echo $OUTPUT->blocks('side-pre', 'span3'.$classextra);
        ?>
        <section id="region-main" class="span9<?php if ($right) { echo ' pull-left'; } ?>">
          <?php
			if(strpos($actual_link,$CFG->wwwroot.'/my') !== false or $actual_link == $root_site){
				echo '<ul class="thumbnails">';
				echo $OUTPUT->mycourses($CFG, $COURSE);
				echo '</ul>';
			}
			echo $OUTPUT->course_content_header();
			echo $OUTPUT->main_content();
			echo $OUTPUT->course_content_footer();
          ?>
      	</section>
      	
    </div>
    

    <header id="page-header" class="clearfix">
        <?php echo $html->heading; ?>
        <div id="page-navbar" class="clearfix">
			<?php if (is_siteadmin()){?>	
				<div class="breadcrumb-button"><?php echo $OUTPUT->page_heading_button(); ?></div>
            <?php } ?>
        </div>
        <div id="course-header">
            <?php echo $OUTPUT->course_header(); ?>
        </div>
    </header>
</div>
<?php  require_once(dirname(__FILE__) . '/includes/footer.php');  ?>
<script src="<?php echo $CFG->wwwroot;?>/theme/ganesha/javascript/jquery.fancybox.js"></script>

<?php 
	require_once($CFG->dirroot.'/user/profile/lib.php');
	$user = $DB->get_record('user', array('id' => $USER->id));
	profile_load_custom_fields($user);
	$campoCpf = $user->profile["CPF"];
	$campoEscolaId = $user->profile["idescola"];
	$campoUf = $user->profile["estado"];
	$campoSegmento = $user->profile["segmento"];

?>
<!--
<?php if($campoCpf == null || $campoEscolaId == null || $campoUf == null){
?>
	  <script type="text/javascript">
		$(document).ready(function(){
			$.fancybox({
					type: 'iframe',
					href: '<?php echo $CFG->wwwroot;?>/theme/ganesha/layout/atualiza/signup_form.php',
					maxWidth: 350,
					width: '80%',
				});
		});
	</script>
<?php  }else{ echo " "; } ?>
-->

<script>
$(document).ready(function() {
	$('.tooltip').tooltipster();
});
</script>

</body>
</html>
