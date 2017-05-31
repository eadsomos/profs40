<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

//require_once('../lib/moodlelib.php');


$iduser = $_GET['idUser'];
$token = $_GET['token'];

$url = 'http://sso.somosid.com.br/PessoaFisica/info.json';
$data = array('idUser' => $iduser, 'token' => $token);




$opts = array(
	'http' => array(
		'header'  => "Content-type: application/json\r\n".
					 "idApplication: CE20BB12119441E09AFB5F4B7D26B567\r\n",
		'method'  => 'POST',
		'content' => json_encode($data)
	)
);
$context  = stream_context_create($opts);
$response = file_get_contents($url, false, $context);
$resConvertida = json_decode($response, true);


//authenticate_user_login($resConvertida[email]);


?>

<pre>
<?php 
print_r($resConvertida);
?>
</pre>