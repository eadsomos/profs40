﻿<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

	$url = 'http://api.d.somosid.com.br/PessoaFisica/readTokenless.json';
	$data = array('username' => 'melquiteste@melqui.com');
	
	
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


?>

<pre>
<?php 
print_r($resConvertida);
?>
</pre>