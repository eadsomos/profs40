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
 * Newblock block caps.
 *
 * @package    block_andamento
 * @copyright  Daniel Neis <danielneis@gmail.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

class block_andamento extends block_base {
    function init() {
        $this->title = get_string('pluginname', 'block_andamento');
    }

    function get_content() {
		global $USER, $COURSE, $DB, $CFG, $OUTPUT, $PAGE;

		//Procura na base pelo andamento de conclusão
		$table1 = $CFG->prefix.'course_modules';
		$table2 = 'course_modules_completion';
		$where2 = 'userid = '.$USER->id.' AND completionstate > 0 AND coursemoduleid IN (SELECT id FROM '.$table1.' WHERE course = '.$COURSE->id.')';
		$completions = $DB->count_records_select($table2, $where2);
		$table3 = 'course_modules';
		$where3 = 'course = '.$COURSE->id.' AND completion > 0';
		$totalcompletions = $DB->count_records_select($table3, $where3);
		$percentagecompletions = 0;
		$porcentagemredonda = 0;
		
        if ($this->content !== null) {
            return $this->content;
        }

        if (empty($this->instance)) {
            $this->content = '';
            return $this->content;
        }
		
		//se o andamento for maior que 0, faz a conta de porcentagem
		if ($totalcompletions > 0) {
			$percentagecompletions = $completions/$totalcompletions*100;
			$porcentagemredonda = number_format((float)$percentagecompletions, 0, '.', '');
		}
		
		if ($porcentagemredonda <= 40){
			$classecor = "inicio";
		}elseif ($porcentagemredonda > 40 && $porcentagemredonda <= 80){
			$classecor = "meio";
		}else{
			$classecor = "concluido";
			}

        $this->content = new stdClass();
		$this->content->text = html_writer::tag('div','', array('id' => 'orangecircle', 'class' => 'small '.$classecor.' percircle animate','data-percent' => $porcentagemredonda));
		$this->content->text .= html_writer::div('Andamento do Curso', 'legenda-andamento');
        // user/index.php expect course context, so get one if page has module context.
        $currentcontext = $this->page->context->get_course_context(true);
		$PAGE->requires->js(new moodle_url($CFG->wwwroot.'/blocks/andamento/js/acao.js'));
		
		
		// Contagem de tempo
		$logmanager = get_log_manager();
		$readers = $logmanager->get_readers();
		$enabledreaders = get_config('tool_log', 'enabled_stores');
		$enabledreaders = explode(',', $enabledreaders);
		$courseid = $COURSE->id;
	
		// Go through all the readers until we find one that we can use.
		foreach ($enabledreaders as $enabledreader) {
			$reader = $readers[$enabledreader];
			if ($reader instanceof \logstore_legacy\log\store) {
				$logtable = 'log';
				$coursefield = 'course';
				$timefield = 'time';
				break;
			} else if ($reader instanceof \core\log\sql_internal_table_reader) {
				$logtable = $reader->get_internal_log_table_name();
				$coursefield = 'courseid';
				$timefield = 'timecreated';
				break;
			}
		}
	
		// If we didn't find a reader then return 0.
		if (!isset($logtable)) {
			return 0;
		}
	
		$sql = "SELECT id, $timefield
				  FROM {{$logtable}}
				 WHERE userid = :userid
				   AND $coursefield = :courseid
			  ORDER BY $timefield ASC";
		$params = array('userid' => $USER->id, 'courseid' => $courseid);

		$totaltime = 0;
		if ($logs = $DB->get_recordset_sql($sql, $params)) {
			foreach ($logs as $log) {
				if (!isset($login)) {
					// For the first time $login is not set so the first log is also the first login
					$login = $log->$timefield;
					$lasthit = $log->$timefield;
					$totaltime = 0;
				}
				$delay = $log->$timefield - $lasthit;
				if ($delay > ($CFG->sessiontimeout * 60)) {
					// The difference between the last log and the current log is more than
					// the timeout Register session value so that we have found a session!
					$login = $log->$timefield;
				} else {
					$totaltime += $delay;
				}
				// Now the actual log became the previous log for the next cycle
				$lasthit = $log->$timefield;
			}
			$tempoconvertido = gmdate("H:i:s", $totaltime);
			$this->content->text .= html_writer::div($tempoconvertido, 'legenda-andamento');
		}		
        return $this->content;
    }

    // my moodle can only have SITEID and it's redundant here, so take it away
    public function applicable_formats() {
        return array('all' => false,
                     'site' => false,
                     'site-index' => false,
                     'course-view' => true, 
                     'course-view-social' => true,
                     'mod' => true, 
                     'mod-quiz' => true);
    }

    public function instance_allow_multiple() {
          return true;
    }

    function has_config() {return true;}
}
