<?php
$footnote = theme_ganesha_get_setting('footnote', 'format_html');
$copyright_footer = theme_ganesha_get_setting('copyright_footer');
$infolink = theme_ganesha_get_setting('infolink');

?>
<!--Footer-->

<footer>
<?php  echo $OUTPUT->standard_footer_html(); ?>
</footer>

<div class="row-fluid">
	<div class="span12">
		<footer>
			<div class="row-fluid centromob">
				<div class="span6">
					<div class="cont-logo-footer">
						<img src="<?php echo $CFG->wwwroot;?>/theme/ganesha/pix/logo-footer.png" alt="footer" />
                        
					</div>
					<p><?php echo $footnote; ?></p>
					<br />
					<p><?php echo $copyright_footer; ?></p>
				</div>
				<div class="span2">
					<ul>
						<h3>SOMOS</h3>
						<li>
                        	<a href="http://www.somoseducacao.com.br/pt/somos-educacao/manifesto-somos/" target="_blank">Manifesto Somos</a>
                        </li>
						<li>
                        	<a href="http://www.somoseducacao.com.br/pt/somos-educacao/nossa-historia/" target="_blank">Nossa História</a>
                        </li>
						<li>
                        	<a href="http://www.somoseducacao.com.br/pt/somos-educacao/quem-somos/" target="_blank">Empresa</a>
                        </li>
					</ul>
				</div>

				<div class="span2">
					<ul>
						<h3>SISTEMAS</h3>
						<li><a href="http://www.somoseducacao.com.br/pt/solucoes-educacionais/sistemas-de-ensino/sistema-anglo-de-ensino/" target="_blank">Sistema Anglo de Ensino</a></li>
						<li><a href="http://www.somoseducacao.com.br/pt/solucoes-educacionais/sistemas-de-ensino/sistema-de-ensino-ph/" target="_blank">pH Sistema de Ensino</a></li>
						<li><a href="http://www.somoseducacao.com.br/pt/solucoes-educacionais/sistemas-de-ensino/sistema-maxi-de-ensino/" target="_blank">Sistema Maxi de Ensino</a></li>
						<li><a href="http://www.somoseducacao.com.br/pt/solucoes-educacionais/sistemas-de-ensino/sistema-de-ensino-ser/" target="_blank">Sistema de Ensino SER</a></li>
						<li><a href="http://www.somoseducacao.com.br/pt/solucoes-educacionais/sistemas-de-ensino/sistema-geo-de-ensino/" target="_blank">Sistema GEO de Ensino</a></li>
						<li><a href="http://www.somoseducacao.com.br/pt/solucoes-educacionais/sistemas-de-ensino/sistema-etb-de-ensino-tecnico/" target="_blank">Técnico</a></li>
					</ul>
				</div>
				<div class="span2">
					<ul>
						<h3>MAIS</h3>
						<li><a href="#">Privacidade</a></li>
						<li><a href="#">Contato</a></li>
						<li><a href="#">Ajuda</a></li>
					</ul>
				</div>
			</div>
		</footer>
	</div>
</div>

<link href="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/css/select2.min.css" rel="stylesheet" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/js/select2.min.js"></script>

<script>
$('.tabbable a').click(function (e) {
  e.preventDefault();
  $(this).tab('show');
})
</script>

<script src="<?php echo $CFG->wwwroot;?>/theme/ganesha/javascript/easyResponsiveTabs.js"></script>
<!-- Bootstrap Core JavaScript -->
<script type="text/javascript">
		$('#segmento').select2({
			placeholder: 'selecione seu segmento de atuação'
		});
		$('#estado').select2({
			placeholder: 'selecione seu estado'
		});
		$('#bairro').select2({
			placeholder: 'selecione sua bairro'
		});	
		$('#cidade').select2({
			placeholder: 'selecione sua cidade'
		});
		$('#escola').select2({
			placeholder: 'selecione sua escola',
			minimumInputLength: 2,
			language: "pt-BR"
		});
		
	</script>
	<!--Plug-in Initialisation-->
	<script type="text/javascript">
	$(document).ready(function() {
			//Vertical Tab
			$('#parentVerticalTab').easyResponsiveTabs({
					type: 'vertical', //Types: default, vertical, accordion
					width: 'auto', //auto or any width like 600px
					fit: true, // 100% fit in a container
					closed: 'accordion', // Start closed if in accordion view
					tabidentify: 'hor_1', // The tab groups identifier
					activate: function(event) { // Callback function if tab is switched
							var $tab = $(this);
							var $info = $('#nested-tabInfo2');
							var $name = $('span', $info);
							$name.text($tab.text());
							$info.show();
					}
			});

			//Vertical Tab
			$('#parentVerticalTab2').easyResponsiveTabs({
					type: 'vertical', //Types: default, vertical, accordion
					width: 'auto', //auto or any width like 600px
					fit: true, // 100% fit in a container
					closed: 'accordion', // Start closed if in accordion view
					tabidentify: 'hor_2', // The tab groups identifier
					activate: function(event) { // Callback function if tab is switched
							var $tab = $(this);
							var $info = $('#nested-tabInfo2');
							var $name = $('span', $info);
							$name.text($tab.text());
							$info.show();
					}
			});

			//Vertical Tab
			$('#parentVerticalTab3').easyResponsiveTabs({
					type: 'vertical', //Types: default, vertical, accordion
					width: 'auto', //auto or any width like 600px
					fit: true, // 100% fit in a container
					closed: 'accordion', // Start closed if in accordion view
					tabidentify: 'hor_3', // The tab groups identifier
					activate: function(event) { // Callback function if tab is switched
							var $tab = $(this);
							var $info = $('#nested-tabInfo2');
							var $name = $('span', $info);
							$name.text($tab.text());
							$info.show();
					}
			});
	});
</script>
<?php  echo $OUTPUT->standard_end_of_body_html() ?>
