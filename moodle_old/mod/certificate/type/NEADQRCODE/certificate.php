<?php

// This file is part of the Certificate module for Moodle - http://moodle.org/
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
 * A4_embedded certificate type
 *
 * @package    mod
 * @subpackage certificate
 * @copyright  Mark Nelson <markn@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
defined('MOODLE_INTERNAL') || die();

$pdf = new PDF($certificate->orientation, 'mm', 'A4', true, 'UTF-8', false);

$pdf->SetTitle($certificate->name);
$pdf->SetProtection(array('modify'));
$pdf->setPrintHeader(false);
$pdf->setPrintFooter(false);
$pdf->SetAutoPageBreak(false, 0);
$pdf->AddPage();

// Define variables
// Landscape
if ($certificate->orientation == 'L') {
     $x = 15;
    $y = 30;
    $sealx = 230;
    $sealy = 150;
    $sigx = 0;
    $sigy = 0;
    $custx = 15;
    $custy = 20;
    $wmarkx = 40;
    $wmarky = 31;
    $wmarkw = 212;
    $wmarkh = 148;
    $brdrx = 0;
    $brdry = 0;
    $brdrw = 297;
    $brdrh = 210;
    $codey = 175;
} else { // Portrait
    $x = 10;
    $y = 40;
    $sealx = 150;
    $sealy = 220;
    $sigx = 30;
    $sigy = 230;
    $custx = 30;
    $custy = 230;
    $wmarkx = 26;
    $wmarky = 58;
    $wmarkw = 158;
    $wmarkh = 170;
    $brdrx = 0;
    $brdry = 0;
    $brdrw = 210;
    $brdrh = 297;
    $codey = 250;
}


// Get font families.
$fontsans = get_config('certificate', 'fontsans');
$fontserif = get_config('certificate', 'fontserif');
// Add images and lines
certificate_print_image($pdf, $certificate, CERT_IMAGE_BORDER, $brdrx, $brdry, $brdrw, $brdrh);
certificate_draw_frame($pdf, $certificate);
// Set alpha to semi-transparency
$pdf->SetAlpha(0.2);
//certificate_print_image($pdf, $certificate, CERT_IMAGE_WATERMARK, $wmarkx, $wmarky, $wmarkw, $wmarkh);
$pdf->SetAlpha(1);
certificate_print_image($pdf, $certificate, CERT_IMAGE_SEAL, $sealx, $sealy, '', '');
certificate_print_image($pdf, $certificate, CERT_IMAGE_SIGNATURE, $sigx, $sigy, '', '');

$strname = fullname($USER);
$strcurso =  $course->fullname;
$strdata = certificate_get_date($certificate, $certrecord, $course);

$strnota = certificate_get_grade($certificate, $course);
$strhoras = $certificate->printhours;
$strcode = certificate_get_code($certificate, $certrecord);




$sqlinicio = "SELECT ue.timecreated 
	FROM mdl_enrol e 
	INNER JOIN mdl_user_enrolments ue ON e.id=ue.enrolid 
	INNER JOIN mdl_user u ON u.id=ue.userid 
	WHERE e.courseid=".$PAGE->course->id." AND u.id = ".$USER->id ."";

if ($datainicio = $DB->get_record_sql($sqlinicio)) {
$datainicio = $datainicio->timecreated;
$comecoCurso = userdate($datainicio, get_string('strftimedate', 'langconfig'));
} else {
$value = '';
}

$sql = "SELECT mdl_user_info_data.data
FROM mdl_user_info_data
INNER JOIN mdl_user_info_field
ON mdl_user_info_data.fieldid = mdl_user_info_field.id
WHERE mdl_user_info_data.userid = " . $USER->id . "
AND mdl_user_info_field.shortname = 'NOMEDAESCOLA'";

$cpf = "SELECT mdl_user_info_data.data
FROM mdl_user_info_data
INNER JOIN mdl_user_info_field
ON mdl_user_info_data.fieldid = mdl_user_info_field.id
WHERE mdl_user_info_data.userid = " . $USER->id . "
AND mdl_user_info_field.shortname = 'CPF'";

if ($escolaAtual = $DB->get_record_sql($sql)) {
$escolaAtual = $escolaAtual->data;
} else {
$value = '';
}

if ($cpfcursista = $DB->get_record_sql($cpf)) {
$cpfcursista = $cpfcursista->data;
} else {
$value = '';
}

if ($escolaAtual == "CENTRO UNIVERSITARIO ITALO BRASILEIRO - UNIITALO"){
	$strtexto =  "A Somos Educação certifica que <b>{$strname}</b>, aluno(a) no(a) {$escolaAtual}, portador do CPF {$cpfcursista}, concluiu o curso <b>{$strcurso}</b> realizado de <b>{$comecoCurso}</b> a <b>{$strdata}</b>, com carga horária de {$strhoras}, no qual obteve aproveitamento de: <b>{$strnota}</b>";
}else{
	$strtexto =  "A Somos Educação certifica que <b>{$strname}</b>, professor(a) no(a) {$escolaAtual}, portador do CPF {$cpfcursista}, concluiu o curso <b>{$strcurso}</b> realizado de <b>{$comecoCurso}</b> a <b>{$strdata}</b>, com carga horária de {$strhoras}, no qual obteve aproveitamento de: <b>{$strnota}</b>";
}

$tiranota = str_replace('Notas do curso:', '', $strtexto);


$result = str_replace('Módulo 2 - Anos Iniciais', '- ensino fundamental anos iniciais', $tiranota);

$result = str_replace('Nós na Sala de Aula: Música Módulo 2 - Anos Iniciais', 'Nós na Sala de Aula: Arte e Música - Anos Iniciais', $tiranota);

$strcodeIMP = "ID do certificado: <b>{$strcode}</b>";
// Add text
$pdf->SetTextColor(102, 102, 102);
certificate_print_text($pdf, $x, $y + 15, 'C', 'Helvetica', '', 40, 'Certificado de Participação');
$pdf->SetTextColor(102, 102, 102);

certificate_print_text($pdf, $x, $y + 50, 'C', 'Helvetica', '', 20, $result);
$pdf->SetTextColor(255, 255, 255);
certificate_print_text($pdf, $x + 10, $y + 168, 'L', 'Helvetica', '', 16, $strcodeIMP);
$pdf->SetTextColor(102, 102, 102);

$i = 0;
if ($certificate->printteacher) {
    $context = context_module::instance($cm->id);
    if ($teachers = get_users_by_capability($context, 'mod/certificate:printteacher', '', $sort = 'u.lastname ASC', '', '', '', '', false)) {
        foreach ($teachers as $teacher) {
            $i++;
            certificate_print_text($pdf, $sigx, $sigy + ($i * 4), 'L', 'freeserif', '', 12, fullname($teacher));
        }
    }
}



$pdf->AddPage();




certificate_print_text($pdf, $custx, $custy, 'L', null, null, null, $certificate->customtext);
certificate_print_image($pdf, $certificate, CERT_IMAGE_WATERMARK, $brdrx, $brdry, $brdrw, $brdrh);
certificate_draw_frame($pdf, $certificate);

certificate_print_text($pdf, $x -1, $y -20, 'L', 'Helvetica', '', 16, 'Ementa do curso');
certificate_print_text($pdf, $custx, $custy, 'L', 'Helvetica', '', 12, $certificate->customtext);
certificate_print_image($pdf, $certificate, CERT_IMAGE_SEAL, $brdrx, $brdry, $brdrw, $brdrh);

$pdf->write2DBarcode( $CFG->wwwroot . '/blocks/verify_certificate/index.php?certnumber='. certificate_get_code($certificate, $certrecord),'QRCODE,M',$sealx -220, $sealy +20,20,20,'','N');

$pdf->SetTextColor(255, 255, 255);
certificate_print_text($pdf, $x + 150, $y + 168, 'L', 'Helvetica', '', 16, $strcodeIMP);
