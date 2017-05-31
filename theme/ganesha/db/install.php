<?php
	defined('MOODLE_INTERNAL') || die();
	 
	function xmldb_theme_ganesha_install() {

	    /* Frontpage */
		set_config('frontpagesidebar','','theme_ganesha');
		set_config('featuredcourses','','theme_ganesha');
		set_config('showfeaturedcourses','0','theme_ganesha');
		set_config('courseName','fullname','theme_ganesha');

	    return true;
	}
?>