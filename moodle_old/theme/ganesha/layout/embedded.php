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
 * The embedded layout.
 *
 * @package   theme_ganesha
 * @copyright 2015 Nephzat Dev Team,nephzat.com
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

echo $OUTPUT->doctype() ?>
<html <?php echo $OUTPUT->htmlattributes(); ?>>
<head>
    <title><?php echo $OUTPUT->page_title(); ?></title>
    <link rel="shortcut icon" href="<?php echo $OUTPUT->pix_url('favicon', 'theme'); ?>" />
    <?php echo $OUTPUT->standard_head_html() ?>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<body <?php echo $OUTPUT->body_attributes(); ?>>
<?php echo $OUTPUT->standard_top_of_body_html() ?>
<div id="page">
    <div id="page-content" class="clearfix">
    
        <?php 
		$actual_link = "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
		$root_site = "http://$_SERVER[HTTP_HOST]/";
		if(strpos($actual_link,$CFG->wwwroot.'/my') !== false or $actual_link == $root_site){
			echo '<ul id="og-grid" class="og-grid">';
			echo $OUTPUT->mycourses($CFG, $COURSE);
			echo '</ul>';
		}

		echo $OUTPUT->main_content(); ?>
    </div>
</div>
<?php echo $OUTPUT->standard_end_of_body_html() ?>
</body>
</html>