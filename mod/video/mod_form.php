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
 * video configuration form
 *
 * @package mod_video
 * @copyright  2009 Petr Skoda (http://skodak.org)
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die;

require_once($CFG->dirroot.'/course/moodleform_mod.php');
require_once($CFG->dirroot.'/mod/video/locallib.php');
require_once($CFG->libdir.'/filelib.php');

class mod_video_mod_form extends moodleform_mod {
    function definition() {
        global $CFG, $DB;
        $insert = false;
        $xml = $DB->get_record_sql('SELECT path FROM {contents_xml} WHERE course_id = ? AND section = ?', array($_GET['course'],$_GET['section']));
         if(!$xml){
            unset($xml);
            $insert = true;
            $xml = new stdClass();
            $xml->course_id = $_GET['course'];
            $xml->section = $_GET['section'];
            $xml->path = $CFG->wwwroot.'/cursos/'.$DB->get_record('course',array('id'=>$_GET['course']))->shortname;
            //$lastXmlId = $DB->insert_record('contents_xml',$xml,false);
        }
        $mform = $this->_form;

        $config = get_config('video');

        //-------------------------------------------------------
       if($insert){
           /* $mform->addElement('hidden','course_id','courseId');
            $mform->getElement('course_id')->setValue($xml->course_id);
            $mform->addElement('hidden','mod_name','modName');
            $mform->getElement('mod_name')->setValue($xml->mod_name); 
            $mform->addElement('hidden','section','section');
            $mform->getElement('section')->setValue($xml->section);*/ 
            $mform->addElement('hidden','path','sendPath','');
            $mform->getElement('path')->setValue($xml->path);  
            $mform->setType('path', PARAM_RAW);  
        }
        $mform->addElement('header', 'general', get_string('general', 'form'));
        $mform->addElement('text', 'name', get_string('name'), array('size'=>'48'));
        if (!empty($CFG->formatstringstriptags)) {
            $mform->setType('name', PARAM_TEXT);
        } else {
            $mform->setType('name', PARAM_CLEANHTML);
        }
        $mform->addRule('name', null, 'required', null, 'client');
        $mform->addRule('name', get_string('maximumchars', '', 255), 'maxlength', 255, 'client');
        $this->standard_intro_elements();

        //-------------------------------------------------------
        $mform->addElement('header', 'contentsection', get_string('contentheader', 'video'));
        $mform->addElement('editor', 'video', get_string('content', 'video'), null, video_get_editor_options($this->context))->setValue( array('text' => '<div class="get-me" id="'.$xml->path.'" data-section="'.$_GET['section'].'"></div>  
                          <script type="text/javascript" src="'.$CFG->wwwroot.'/xml_js/js/carrega-xml.js"></script>
                          <div class="video"></div>') );
        $mform->addRule('video', get_string('required'), 'required', null, 'client');

        //-------------------------------------------------------
        $mform->addElement('header', 'appearancehdr', get_string('appearance'));

        if ($this->current->instance) {
            $options = resourcelib_get_displayoptions(explode(',', $config->displayoptions), $this->current->display);
        } else {
            $options = resourcelib_get_displayoptions(explode(',', $config->displayoptions));
        }
        if (count($options) == 1) {
            $mform->addElement('hidden', 'display');
            $mform->setType('display', PARAM_INT);
            reset($options);
            $mform->setDefault('display', key($options));
        } else {
            $mform->addElement('select', 'display', get_string('displayselect', 'video'), $options);
            $mform->setDefault('display', $config->display);
        }

        if (array_key_exists(RESOURCELIB_DISPLAY_POPUP, $options)) {
            $mform->addElement('text', 'popupwidth', get_string('popupwidth', 'video'), array('size'=>3));
            if (count($options) > 1) {
                $mform->disabledIf('popupwidth', 'display', 'noteq', RESOURCELIB_DISPLAY_POPUP);
            }
            $mform->setType('popupwidth', PARAM_INT);
            $mform->setDefault('popupwidth', $config->popupwidth);

            $mform->addElement('text', 'popupheight', get_string('popupheight', 'video'), array('size'=>3));
            if (count($options) > 1) {
                $mform->disabledIf('popupheight', 'display', 'noteq', RESOURCELIB_DISPLAY_POPUP);
            }
            $mform->setType('popupheight', PARAM_INT);
            $mform->setDefault('popupheight', $config->popupheight);
        }

        $mform->addElement('advcheckbox', 'printheading', get_string('printheading', 'video'));
        $mform->setDefault('printheading', $config->printheading);
        $mform->addElement('advcheckbox', 'printintro', get_string('printintro', 'video'));
        $mform->setDefault('printintro', $config->printintro);

        // add legacy files flag only if used
        if (isset($this->current->legacyfiles) and $this->current->legacyfiles != RESOURCELIB_LEGACYFILES_NO) {
            $options = array(RESOURCELIB_LEGACYFILES_DONE   => get_string('legacyfilesdone', 'video'),
                             RESOURCELIB_LEGACYFILES_ACTIVE => get_string('legacyfilesactive', 'video'));
            $mform->addElement('select', 'legacyfiles', get_string('legacyfiles', 'video'), $options);
            $mform->setAdvanced('legacyfiles', 1);
        }

        //-------------------------------------------------------
        $this->standard_coursemodule_elements();

        //-------------------------------------------------------
        $this->add_action_buttons();

        //-------------------------------------------------------
        $mform->addElement('hidden', 'revision');
        $mform->setType('revision', PARAM_INT);
        $mform->setDefault('revision', 1);
    }

    function data_preprocessing(&$default_values) {
        if ($this->current->instance) {
            $draftitemid = file_get_submitted_draft_itemid('video');
            $default_values['video']['format'] = $default_values['contentformat'];
            $default_values['video']['text']   = file_prepare_draft_area($draftitemid, $this->context->id, 'mod_video', 'content', 0, video_get_editor_options($this->context), $default_values['content']);
            $default_values['video']['itemid'] = $draftitemid;
        }
        if (!empty($default_values['displayoptions'])) {
            $displayoptions = unserialize($default_values['displayoptions']);
            if (isset($displayoptions['printintro'])) {
                $default_values['printintro'] = $displayoptions['printintro'];
            }
            if (isset($displayoptions['printheading'])) {
                $default_values['printheading'] = $displayoptions['printheading'];
            }
            if (!empty($displayoptions['popupwidth'])) {
                $default_values['popupwidth'] = $displayoptions['popupwidth'];
            }
            if (!empty($displayoptions['popupheight'])) {
                $default_values['popupheight'] = $displayoptions['popupheight'];
            }
        }
    }
}

