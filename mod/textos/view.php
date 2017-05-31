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
 * Page module version information
 *
 * @package mod_textos
 * @copyright  2009 Petr Skoda (http://skodak.org)
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

require('../../config.php');
require_once($CFG->dirroot.'/mod/textos/lib.php');
require_once($CFG->dirroot.'/mod/textos/locallib.php');
require_once($CFG->libdir.'/completionlib.php');

$id      = optional_param('id', 0, PARAM_INT); // Course Module ID
$p       = optional_param('p', 0, PARAM_INT);  // Page instance ID
$inpopup = optional_param('inpopup', 0, PARAM_BOOL);

if ($p) {
    if (!$textos = $DB->get_record('textos', array('id'=>$p))) {
        print_error('invalidaccessparameter');
    }
    $cm = get_coursemodule_from_instance('textos', $textos->id, $textos->course, false, MUST_EXIST);

} else {
    if (!$cm = get_coursemodule_from_id('textos', $id)) {
        print_error('invalidcoursemodule');
    }
    $textos = $DB->get_record('textos', array('id'=>$cm->instance), '*', MUST_EXIST);
}

$course = $DB->get_record('course', array('id'=>$cm->course), '*', MUST_EXIST);

require_course_login($course, true, $cm);
$context = context_module::instance($cm->id);
require_capability('mod/textos:view', $context);

// Completion and trigger events.
textos_view($textos, $course, $cm, $context);

$PAGE->set_url('/mod/textos/view.php', array('id' => $cm->id));

$options = empty($textos->displayoptions) ? array() : unserialize($textos->displayoptions);

if ($inpopup and $textos->display == RESOURCELIB_DISPLAY_POPUP) {
    $PAGE->set_textoslayout('popup');
    $PAGE->set_title($course->shortname.': '.$textos->name);
    $PAGE->set_heading($course->fullname);
} else {
    $PAGE->set_title($course->shortname.': '.$textos->name);
    $PAGE->set_heading($course->fullname);
    $PAGE->set_activity_record($textos);
}
echo $OUTPUT->header();
if (!isset($options['printheading']) || !empty($options['printheading'])) {
    echo $OUTPUT->heading(format_string($textos->name), 2);
}

if (!empty($options['printintro'])) {
    if (trim(strip_tags($textos->intro))) {
        echo $OUTPUT->box_start('mod_introbox', 'textosintro');
        echo format_module_intro('textos', $textos, $cm->id);
        echo $OUTPUT->box_end();
    }
}

$content = file_rewrite_pluginfile_urls($textos->content, 'pluginfile.php', $context->id, 'mod_textos', 'content', $textos->revision);
$formatoptions = new stdClass;
$formatoptions->noclean = true;
$formatoptions->overflowdiv = true;
$formatoptions->context = $context;
$content = format_text($content, $textos->contentformat, $formatoptions);
echo $OUTPUT->box($content, "generalbox center clearfix");

$strlastmodified = get_string("lastmodified");
echo "<div class=\"modified\">$strlastmodified: ".userdate($textos->timemodified)."</div>";

echo $OUTPUT->footer();
