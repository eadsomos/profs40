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
 * Block XP level settings.
 *
 * @package    block_xp
 * @copyright  2014 Frédéric Massart
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

require(__DIR__ . '/../../config.php');
require_once($CFG->libdir . '/tablelib.php');
global $DB;
$atividades = $DB->get_records('atividadeead_vimeo',array());
$courseid = required_param('courseid', PARAM_INT);

require_login($courseid);

// Some stuff.
$url = new moodle_url('/blocks/vimeo_libary/general.php', array('courseid' => $courseid));


// Page info.
//$PAGE->set_context($context);
$PAGE->set_pagelayout('course');
$PAGE->set_title('VIMEO VIDEOS');
$PAGE->set_heading($COURSE->fullname);
$PAGE->set_url($url);

echo $OUTPUT->header();

$table = new flexible_table('xpinfos');
$table->define_baseurl($url);
$table->define_columns(array('autor', 'curso', 'nome da atividade','link'));
$table->define_headers(array('Autor', 'Curso', 'Nome da atividade','Link'));
$table->setup();
foreach($atividades as $atividade){
    $atv = $DB->get_record('atividadeead',array('id'=>$atividade->id));
    $curso = $DB->get_record('course',array('id'=>$atv->course));
    $table->add_data(array($atividade->author,$curso->fullname,$atv->name,'<a href="http://vimeo.com'.$atividade->link.'"><i class="icon-film"></i>Ir para o vídeo</a>'));
}


$table->finish_output();


echo $OUTPUT->footer();
