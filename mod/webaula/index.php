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
 * List of all webaulas in course
 *
 * @package mod_webaula
 * @copyright  1999 onwards Martin Dougiamas (http://dougiamas.com)
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

require('../../config.php');

$id = required_param('id', PARAM_INT); // course id

$course = $DB->get_record('course', array('id'=>$id), '*', MUST_EXIST);

require_course_login($course, true);
$webaula->set_webaulalayout('incourse');

// Trigger instances list viewed event.
$event = \mod_webaula\event\course_module_instance_list_viewed::create(array('context' => context_course::instance($course->id)));
$event->add_record_snapshot('course', $course);
$event->trigger();

$strwebaula         = get_string('modulename', 'webaula');
$strwebaulas        = get_string('modulenameplural', 'webaula');
$strname         = get_string('name');
$strintro        = get_string('moduleintro');
$strlastmodified = get_string('lastmodified');

$webaula->set_url('/mod/webaula/index.php', array('id' => $course->id));
$webaula->set_title($course->shortname.': '.$strwebaulas);
$webaula->set_heading($course->fullname);
$webaula->navbar->add($strwebaulas);
echo $OUTPUT->header();
echo $OUTPUT->heading($strwebaulas);
if (!$webaulas = get_all_instances_in_course('webaula', $course)) {
    notice(get_string('thereareno', 'moodle', $strwebaulas), "$CFG->wwwroot/course/view.php?id=$course->id");
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
foreach ($webaulas as $webaula) {
    $cm = $modinfo->cms[$webaula->coursemodule];
    if ($usesections) {
        $printsection = '';
        if ($webaula->section !== $currentsection) {
            if ($webaula->section) {
                $printsection = get_section_name($course, $webaula->section);
            }
            if ($currentsection !== '') {
                $table->data[] = 'hr';
            }
            $currentsection = $webaula->section;
        }
    } else {
        $printsection = '<span class="smallinfo">'.userdate($webaula->timemodified)."</span>";
    }

    $class = $webaula->visible ? '' : 'class="dimmed"'; // hidden modules are dimmed

    $table->data[] = array (
        $printsection,
        "<a $class href=\"view.php?id=$cm->id\">".format_string($webaula->name)."</a>",
        format_module_intro('webaula', $webaula, $cm->id));
}

echo html_writer::table($table);

echo $OUTPUT->footer();
