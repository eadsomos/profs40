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
 * webaula external API
 *
 * @package    mod_webaula
 * @category   external
 * @copyright  2015 Juan Leyva <juan@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @since      Moodle 3.0
 */

defined('MOODLE_INTERNAL') || die;

require_once("$CFG->libdir/externallib.php");

/**
 * webaula external functions
 *
 * @package    mod_webaula
 * @category   external
 * @copyright  2015 Juan Leyva <juan@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @since      Moodle 3.0
 */
class mod_webaula_external extends external_api {

    /**
     * Returns description of method parameters
     *
     * @return external_function_parameters
     * @since Moodle 3.0
     */
    public static function view_webaula_parameters() {
        return new external_function_parameters(
            array(
                'webaulaid' => new external_value(PARAM_INT, 'webaula instance id')
            )
        );
    }

    /**
     * Simulate the webaula/view.php web interface webaula: trigger events, completion, etc...
     *
     * @param int $webaulaid the webaula instance id
     * @return array of warnings and status result
     * @since Moodle 3.0
     * @throws moodle_exception
     */
    public static function view_webaula($webaulaid) {
        global $DB, $CFG;
        require_once($CFG->dirroot . "/mod/webaula/lib.php");

        $params = self::validate_parameters(self::view_webaula_parameters(),
                                            array(
                                                'webaulaid' => $webaulaid
                                            ));
        $warnings = array();

        // Request and permission validation.
        $webaula = $DB->get_record('webaula', array('id' => $params['webaulaid']), '*', MUST_EXIST);
        list($course, $cm) = get_course_and_cm_from_instance($webaula, 'webaula');

        $context = context_module::instance($cm->id);
        self::validate_context($context);

        require_capability('mod/webaula:view', $context);

        // Call the webaula/lib API.
        webaula_view($webaula, $course, $cm, $context);

        $result = array();
        $result['status'] = true;
        $result['warnings'] = $warnings;
        return $result;
    }

    /**
     * Returns description of method result value
     *
     * @return external_description
     * @since Moodle 3.0
     */
    public static function view_webaula_returns() {
        return new external_single_structure(
            array(
                'status' => new external_value(PARAM_BOOL, 'status: true if success'),
                'warnings' => new external_warnings()
            )
        );
    }

}
