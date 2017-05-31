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
 * The two column layout.
 *
 * @package   theme_ganesha
 * @copyright 2015 Nephzat Dev Team,nephzat.com
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

// Get the HTML for the settings bits.
$html = theme_ganesha_get_html_for_settings($OUTPUT, $PAGE);
$actual_link = "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
$root_site = "http://$_SERVER[HTTP_HOST]/";
$left = (!right_to_left());  // To know if to add 'pull-right' and 'desktop-first-column' classes in the layout for LTR.
echo $OUTPUT->doctype() ?>
<html <?php echo $OUTPUT->htmlattributes(); ?>>
<head>
    <title><?php echo $OUTPUT->page_title(); ?></title>
    <link rel="shortcut icon" href="<?php echo $OUTPUT->pix_url('favicon', 'theme'); ?>" />
    <?php echo $OUTPUT->standard_head_html() ?>
    <script src="<?php echo $CFG->wwwroot;?>/theme/ganesha/javascript/accordion.js"></script>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="<?php echo $CFG->wwwroot;?>/theme/ganesha/css/homenova.css" media="screen" charset="utf-8">
    <?php if(strpos($actual_link,$CFG->wwwroot.'/mod') !== false or $actual_link == $root_site){ ?>
      <link rel="stylesheet" href="<?php echo $CFG->wwwroot;?>/theme/ganesha/css/curso.css" media="screen" charset="utf-8">
    <?php } ?>
</head>

<body <?php echo $OUTPUT->body_attributes('two-column'); ?>>

<?php echo $OUTPUT->standard_top_of_body_html() ?>


<?php
if(strpos($actual_link,$CFG->wwwroot.'/course') !== false or $actual_link == $root_site){
  $container = "container-fluid";
}else if(strpos($actual_link,$CFG->wwwroot.'/theme/ganesha/') !== false or $actual_link == $root_site){
  $container = "container-fluid";
}else{
  $container = "container";
}
?>



<?php  require_once(dirname(__FILE__) . '/includes/header.php');  ?>

<div id="page" class=<?php echo $container; ?>>

    <div id="page-content" class="row-fluid">
       <?php
        $classextra = '';
        if ($left) {
            $classextra = ' desktop-first-column';
        }
        echo $OUTPUT->blocks('side-pre', 'span3'.$classextra);
        ?>
        
        <section id="region-main" class="span9<?php if ($left) { echo ' pull-left'; } ?>" style="padding: 10px 40px 10px 105px;">
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
            <div class="breadcrumb-button"><?php echo $OUTPUT->page_heading_button(); ?></div>
        </div>
        <div id="course-header">
            <?php echo $OUTPUT->course_header(); ?>
        </div>
    </header>
</div>

<?php  require_once(dirname(__FILE__) . '/includes/footer.php');  ?>


</body>
</html>
