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
 * analytics block caps.
 *
 * @package    block_analytics
 * @copyright  Daniel Neis <danielneis@gmail.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

class block_analytics extends block_base {

    function init() {
        $this->title = get_string('pluginname', 'block_analytics');
    }

    function get_content() {
        global $CFG, $OUTPUT,$USER;

        $this->content = new stdClass();
        $this->content->items = array();
        $this->content->icons = array();
        $this->content->text = '';
        $context = context::instance_by_id(1);
        $roles = get_user_roles($context, $USER->id, false);
        foreach ($roles as $role) {
            // Master
            if($role->roleid == 15){
                $this->content->footer = '<a href="'.$CFG->wwwroot.'/blocks/analytics/master.php?userid='.$USER->id.'"><img src="'.$CFG->wwwroot.'/blocks/analytics/images/btn.png"></a>';
            }
            // Escola
            if($role->roleid == 11){
                $this->content->footer = '<a href="'.$CFG->wwwroot.'/blocks/analytics/school.php?userid='.$USER->id.'"><img src="'.$CFG->wwwroot.'/blocks/analytics/images/btn.png"></a>';
            }
            // Secretaria
            if($role->roleid == 12){
                $this->content->footer = '<a href="'.$CFG->wwwroot.'/blocks/analytics/secretaria.php?userid='.$USER->id.'"><img src="'.$CFG->wwwroot.'/blocks/analytics/images/btn.png"></a>';
            }
            // Assessor
            if($role->roleid == 13){
                $this->content->footer = '<a href="'.$CFG->wwwroot.'/blocks/analytics/index.php?userid='.$USER->id.'"><img src="'.$CFG->wwwroot.'/blocks/analytics/images/btn.png"></a>';
            }

        }


        // user/index.php expect course context, so get one if page has module context.
        $currentcontext = $this->page->context->get_course_context(false);

        if (! empty($this->config->text)) {
            $this->content->text = $this->config->text;
        }

        if ($this->page->course->id == SITEID) {
            $this->content->text .= "";
        }

        if (! empty($this->config->text)) {
            $this->content->text .= $this->config->text;
        }

        return $this->content;
    }

    // my moodle can only have SITEID and it's redundant here, so take it away
    public function applicable_formats() {
        return array('all' => false,
                     'site' => false,
                     'user' => true,
                     'site-index' => false,
                     'course-view' => false,
                     'course-view-social' => false,
                     'mod' => false,
                     'my'=>true,
                     'mod-quiz' => false);
    }

    public function instance_allow_multiple() {
          return false;
    }

    function has_config() {
        return true;
    }

    public function cron() {
            mtrace( "Hey, my cron script is running" );

                 // do something

                      return true;
    }
}
