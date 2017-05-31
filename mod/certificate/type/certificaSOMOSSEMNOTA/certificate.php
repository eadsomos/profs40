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
 * @package    mod_certificate
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
    $x = 10;
    $y = 30;
    $sealx = 208;
    $sealy = 13;
    $sigx = 13;
    $sigy = 150;
    $custx = 14;
    $custy = 32;
    $wmarkx = 40;
    $wmarky = 31;
    $wmarkw = 212;
    $wmarkh = 148;
    $brdrx = 0;
    $brdry = 0;
    $brdrw = 297;
    $brdrh = 210;
    $codey = 175;
    $userx = 52;
    $usery = 25;
    $textox = 14;
    $textoy = 72;
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
$style1 = array('width' => 0.2, 'cap' => 'butt', 'join' => 'miter', 'dash' => 0, 'color' => array(229, 229, 229));
// Set alpha to semi-transparency
$pdf->SetAlpha(1);

certificate_print_image($pdf, $certificate, CERT_IMAGE_SIGNATURE, $sigx, $sigy, 97, 49);


$texto1 = "Concluiu o curso de formação continuada:";
$strcredit = certificate_get_grade($certificate, $course);
$tiranota = str_replace('Notas do curso:', '', $strcredit);

$sqlinicio = "SELECT ue.timecreated 
	FROM mdl_enrol e 
	INNER JOIN mdl_user_enrolments ue ON e.id=ue.enrolid 
	INNER JOIN mdl_user u ON u.id=ue.userid 
	WHERE e.courseid=".$PAGE->course->id." AND u.id = ".$USER->id ."";

if ($datainicio = $DB->get_record_sql($sqlinicio)) {
$datainicio = $datainicio->timecreated;
$comecoCurso = userdate($datainicio, get_string('strftimedate', 'langconfig'));
} else {
$value = 'usuário nao inscrito';
}

$struname =  fullname($USER);
$strsubject = $USER->profile['leciona'];
$strscool = $USER->profile['NOMEDAESCOLA'];
$strcpf = $USER->profile['CPF'];

$parte1 = "CPF: <b>{$strcpf}</b><br />PROFS de: <b>{$strsubject}</b><br />Escola: <b>{$strscool}</b></span>";
$strdini = $comecoCurso;
$strtermino = certificate_get_date($certificate, $certrecord, $course);
$strcargah = $certificate->printhours;
$texto2 = "Curso do projeto <b>PROFS</b> com carga horária de {$strcargah}.";
$texto3 = "Curso realizado de: {$strdini} a {$strtermino} ";
$strcode = certificate_get_code($certificate, $certrecord);
$codigo = "A SOMOS Educação confirma e identifica este certificado de participação do curso através do código:<b font-size='15px'>{$strcode}</b> que pode ser validado pelo cursista ou instituição com o QRcode no verso do certificado ou através do link:<a href='http://profs.somoseducacao.com.br/verify_certificate'>Certificado PROFS</a>";

//User picture
$picx = 10;  // Picture horizontal position.
$picy = 20;   // Picture vertical position.
$picw = 40; // Picture width.
$pich = 40; // Picture height.
$context = context_user::instance($USER->id, IGNORE_MISSING);
if ($context) {
    $fs = get_file_storage();
     
    // Prepare file record object
    $fileinfo = array(
        'component' => 'user',     // usually = table name
        'filearea' => 'icon',     // usually = table name
        'itemid' => 0,               // usually = ID of row in table
        'contextid' => $context->id, // ID of context
        'filepath' => '/',           // any path beginning and ending in /
        'filename' => 'f1.jpg'); // any filename 
    // Get file.
    $file = $fs->get_file($fileinfo['contextid'], $fileinfo['component'], $fileinfo['filearea'],
                          $fileinfo['itemid'], $fileinfo['filepath'], $fileinfo['filename']);
						  
						  
	 // Prepare file record object
    $infocert = array(
        'component' => 'theme_academi',		// usually = table name
        'filearea' => 'certificado',		// usually = table name
        'itemid' => 0,           			// usually = ID of row in table
        'contextid' => 1, 					// ID of context
        'filepath' => '/',           		// any path beginning and ending in /
        'filename' => 'noecxiste.png'); 	// any filename 
    // Get file.
    $filecert = $fs->get_file($fileinfo['contextid'], $fileinfo['component'], $fileinfo['filearea'],
                          $fileinfo['itemid'], $fileinfo['filepath'], $fileinfo['filename']);	 
					

    // Print image.
    if ($file) {
        $contenthash = $file->get_contenthash();
        $l1 = $contenthash[0] . $contenthash[1];
        $l2 = $contenthash[2] . $contenthash[3];
        $location = $CFG->dataroot . '/filedir' . '/' . $l1 . '/' . $l2 . '/' . $contenthash;
        $pdf->Image($location, $picx, $picy, $picw, $pich);
    } else {
		// Prepare file record object
		$fileinfo = array(
			'component' => 'theme_academi',     // usually = table name
			'filearea' => 'certificado',     	// usually = table name
			'itemid' => 0,               		// usually = ID of row in table
			'contextid' => 1, 					// ID of context
			'filepath' => '/',          		// any path beginning and ending in /
			'filename' => 'noecxiste.png'); 	// any filename 
		// Get file.
		$file = $fs->get_file($fileinfo['contextid'], $fileinfo['component'], $fileinfo['filearea'],
							  $fileinfo['itemid'], $fileinfo['filepath'], $fileinfo['filename']);
		
		$contenthash = $file->get_contenthash();
        $l1 = $contenthash[0] . $contenthash[1];
        $l2 = $contenthash[2] . $contenthash[3];
        $location = $CFG->dataroot . '/filedir' . '/' . $l1 . '/' . $l2 . '/' . $contenthash;
        $pdf->Image($location, $picx, $picy, $picw, $pich);
		
	}
}

// Add text
$pdf->SetTextColor(110, 110, 110);
//certificate_print_text($pdf, $x, $y + 20, 'C', $fontserif, '', 20, get_string('certify', 'certificate'));
certificate_print_text($pdf, $userx , $usery, 'L', $fontsans, 'italic', 30, fullname($USER), 160);
certificate_print_text($pdf, $userx , $usery + 12, 'L', $fontsans, '', 16, $parte1);
certificate_print_text($pdf, $textox, $textoy, 'L', $fontsans, '', 20, $texto1);
certificate_print_text($pdf, $textox, $textoy + 18, 'L', $fontsans, 'italic', 24, format_string($course->fullname), 190);
certificate_print_text($pdf, $textox, $textoy + 35, 'L', $fontsans, '', 20, $texto2, 190);
//$pdf->Image('http://www.infiniteguest.org/wp-content/uploads/2015/06/adventure-time.jpg', 10, 20, 40, 40);
//$pdf->Image($urlimg, 10, 20, 40, 40);
certificate_print_text($pdf, $textox, $textoy + 55, 'L', $fontsans, '', 14, $texto3, 190);
certificate_print_text($pdf, $textox +195, $textoy + 95, 'J', $fontsans, '', 11, $codigo, 79);
$pdf->Line(205, 195, 205, 15, $style1);
certificate_print_text($pdf, $x, $y + 112, 'C', $fontserif, '', 10, certificate_get_outcome($certificate, $course));
$i = 0;
if ($certificate->printteacher) {
    $context = context_module::instance($cm->id);
    if ($teachers = get_users_by_capability($context, 'mod/certificate:printteacher', '', $sort = 'u.lastname ASC', '', '', '', '', false)) {
        foreach ($teachers as $teacher) {
            $i++;
            certificate_print_text($pdf, $sigx, $sigy + ($i * 4), 'L', $fontserif, '', 12, fullname($teacher));
        }
    }
}

$pdf->AddPage();

certificate_print_image($pdf, $certificate, CERT_IMAGE_WATERMARK, $brdrx, $brdry, $brdrw, $brdrh);
certificate_draw_frame($pdf, $certificate);

certificate_print_text($pdf, $x -1, $y -20, 'L', $fontsans, 'italic', 30, 'Ementa');
certificate_print_text($pdf, $custx, $custy, 'J', $fontsans, '', 12, $certificate->customtext, 185 );
certificate_print_image($pdf, $certificate, CERT_IMAGE_SEAL, $sealx, $sealy, 71, 44);
$pdf->Line(205, 195, 205, 15, $style1);
$pdf->write2DBarcode( $CFG->wwwroot . '/blocks/verify_certificate/index.php?certnumber='. certificate_get_code($certificate, $certrecord),'QRCODE,M',254, 140,30,30,'','N');

certificate_print_text($pdf, $textox +195, $textoy + 105, 'J', $fontsans, '', 11, 'Para verificar a autenticidade, utilize um leitor de qrcode no código acima, ou utilize o código<b> '.$strcode.'</b> na area validação dentro do perfil.', 79);



