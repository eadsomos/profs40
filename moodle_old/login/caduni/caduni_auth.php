<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

	$url = 'http://stage.caduniv2.editorasaraiva.com.br/Autenticacao.json';
	$data = array('email' => 'melquiteste@melqui.com', 'password' => '528020Sab#a');
	
	
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
	$nameUser = $resConvertida['name'];
	
	echo $nameUser;


?>

<pre>
<?php 
print_r($opts);
?>
</pre>