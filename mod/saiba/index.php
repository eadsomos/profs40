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
 * List of all saibas in course
 *
 * @package mod_saiba
 * @copyright  1999 onwards Martin Dougiamas (http://dougiamas.com)
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

require('../../config.php');

$id = required_param('id', PARAM_INT); // course id

$course = $DB->get_record('course', array('id'=>$id), '*', MUST_EXIST);

require_course_login($course, true);
$saiba->set_saibalayout('incourse');

// Trigger instances list viewed event.
$event = \mod_saiba\event\course_module_instance_list_viewed::create(array('context' => context_course::instance($course->id)));
$event->add_record_snapshot('course', $course);
$event->trigger();

$strsaiba         = get_string('modulename', 'saiba');
$strsaibas        = get_string('modulenameplural', 'saiba');
$strname         = get_string('name');
$strintro        = get_string('moduleintro');
$strlastmodified = get_string('lastmodified');

$saiba->set_url('/mod/saiba/index.php', array('id' => $course->id));
$saiba->set_title($course->shortname.': '.$strsaibas);
$saiba->set_heading($course->fullname);
$saiba->navbar->add($strsaibas);
echo $OUTPUT->header();
echo $OUTPUT->heading($strsaibas);
if (!$saibas = get_all_instances_in_course('saiba', $course)) {
    notice(get_string('thereareno', 'moodle', $strsaibas), "$CFG->wwwroot/course/view.php?id=$course->id");
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
foreach ($saibas as $saiba) {
    $cm = $modinfo->cms[$saiba->coursemodule];
    if ($usesections) {
        $printsection = '';
        if ($saiba->section !== $currentsection) {
            if ($saiba->section) {
                $printsection = get_section_name($course, $saiba->section);
            }
            if ($currentsection !== '') {
                $table->data[] = 'hr';
            }
            $currentsection = $saiba->section;
        }
    } else {
        $printsection = '<span class="smallinfo">'.userdate($saiba->timemodified)."</span>";
    }

    $class = $saiba->visible ? '' : 'class="dimmed"'; // hidden modules are dimmed

    $table->data[] = array (
        $printsection,
        "<a $class href=\"view.php?id=$cm->id\">".format_string($saiba->name)."</a>",
        format_module_intro('saiba', $saiba, $cm->id));
}

echo html_writer::table($table);

echo $OUTPUT->footer();
