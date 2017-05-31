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
 * List of all estudos in course
 *
 * @package mod_estudo
 * @copyright  1999 onwards Martin Dougiamas (http://dougiamas.com)
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

require('../../config.php');

$id = required_param('id', PARAM_INT); // course id

$course = $DB->get_record('course', array('id'=>$id), '*', MUST_EXIST);

require_course_login($course, true);
$estudo->set_estudolayout('incourse');

// Trigger instances list viewed event.
$event = \mod_estudo\event\course_module_instance_list_viewed::create(array('context' => context_course::instance($course->id)));
$event->add_record_snapshot('course', $course);
$event->trigger();

$strestudo         = get_string('modulename', 'estudo');
$strestudos        = get_string('modulenameplural', 'estudo');
$strname         = get_string('name');
$strintro        = get_string('moduleintro');
$strlastmodified = get_string('lastmodified');

$estudo->set_url('/mod/estudo/index.php', array('id' => $course->id));
$estudo->set_title($course->shortname.': '.$strestudos);
$estudo->set_heading($course->fullname);
$estudo->navbar->add($strestudos);
echo $OUTPUT->header();
echo $OUTPUT->heading($strestudos);
if (!$estudos = get_all_instances_in_course('estudo', $course)) {
    notice(get_string('thereareno', 'moodle', $strestudos), "$CFG->wwwroot/course/view.php?id=$course->id");
    exit;
}

$usesections = course_format_uses_sections($course->format);

$table = new html_table();
$table->attributes['class'] = 'generaltable mod_index';

if ($usesections) {
    $strsectionname = get_string('sectionname', 'format_'.$course->format);
    $table->head  = array ($strsectionname, $strname, $strintro);
    $table->align = array ('center', 'left', 'left');
} else {
    $table->head  = array ($strlastmodified, $strname, $strintro);
    $table->align = array ('left', 'left', 'left');
}

$modinfo = get_fast_modinfo($course);
$currentsection = '';
foreach ($estudos as $estudo) {
    $cm = $modinfo->cms[$estudo->coursemodule];
    if ($usesections) {
        $printsection = '';
        if ($estudo->section !== $currentsection) {
            if ($estudo->section) {
                $printsection = get_section_name($course, $estudo->section);
            }
            if ($currentsection !== '') {
                $table->data[] = 'hr';
            }
            $currentsection = $estudo->section;
        }
    } else {
        $printsection = '<span class="smallinfo">'.userdate($estudo->timemodified)."</span>";
    }

    $class = $estudo->visible ? '' : 'class="dimmed"'; // hidden modules are dimmed

    $table->data[] = array (
        $printsection,
        "<a $class href=\"view.php?id=$cm->id\">".format_string($estudo->name)."</a>",
        format_module_intro('estudo', $estudo, $cm->id));
}

echo html_writer::table($table);

echo $OUTPUT->footer();
