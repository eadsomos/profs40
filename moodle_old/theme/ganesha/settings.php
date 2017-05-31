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
 * Moodle's Clean theme, an example of how to make a Bootstrap theme
 *
 * DO NOT MODIFY THIS THEME!
 * COPY IT FIRST, THEN RENAME THE COPY AND MODIFY IT INSTEAD.
 *
 * For full information about creating Moodle themes, see:
 * http://docs.moodle.org/dev/Themes_2.0
 *
 * @package   theme_ganesha
 * @copyright 2015 Nephzat Dev Team, nephzat.com
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die;
$settings = null;

if (is_siteadmin()) {

    $ADMIN->add('themes', new admin_category('theme_ganesha', 'ganesha'));


    /* Curso 1 */
      $temp = new admin_settingpage('theme_ganesha_cursos', 'Curso 1');

    // Id do curso.
      $name = 'theme_ganesha/idcurso';
      $title = 'ID';
      $description = 'Insira o ID do curso do qual deseja deixar em destaque.';
      $default = 0;
      $setting = new admin_setting_configtext($name, $title, $description, $default);
      $setting->set_updatedcallback('theme_reset_all_caches');
      $temp->add($setting);

    //Imagem banner
      $name = 'theme_ganesha/bannercurso';
      $title = 'Banner';
      $description = 'Insira a imagem do banner do curso';
      $setting = new admin_setting_configstoredfile($name, $title, $description, 'bannercurso');
      $setting->set_updatedcallback('theme_reset_all_caches');
      $temp->add($setting);

    //Sobre o Curso
      $name = 'theme_ganesha/sobrecurso';
      $title = 'Sobre o Curso';
      $description = 'Fale um pouco sobre o curso';
      $default = 'Em breve...';
      $setting = new admin_setting_configtextarea($name, $title, $description, $default);
      $setting->set_updatedcallback('theme_reset_all_caches');
      $temp->add($setting);

    //Publico Alvo
      $name = 'theme_ganesha/publicoalvo';
      $title = 'Publico Alvo';
      $description = 'Qual o público Alvo do Curso?';
      $default = 'Em breve...';
      $setting = new admin_setting_configtextarea($name, $title, $description, $default);
      $setting->set_updatedcallback('theme_reset_all_caches');
      $temp->add($setting);

    //Duração
      $name = 'theme_ganesha/duracao';
      $title = 'Duração';
      $description = 'Qual a duração do curso?';
      $default = 'Em breve...';
      $setting = new admin_setting_configtextarea($name, $title, $description, $default);
      $setting->set_updatedcallback('theme_reset_all_caches');
      $temp->add($setting);

      
	  
	  //Escolha1.
      $name = 'theme_ganesha/escolha1';
      $title = 'Recurso 1';
      $description = 'Escolha o Tipo do Recurso 1';
      $default = 0;
      $choices = array(
          0 => 'Escolha o tipo',
          1 => 'Vídeo Instrucional',
          2 => 'Exemplo',
          3 => 'Contra Exemplo',
          4 => 'Texto',
      );
      $temp->add(new admin_setting_configselect($name, $title, $description, $default, $choices));

      //Texto1
        $name = 'theme_ganesha/texto1';
        $title = 'Texto da Escolha 1';
        $description = 'Coloque a descrição do conteúdo';
        $default = 'Em breve...';
        $setting = new admin_setting_configtextarea($name, $title, $description, $default);
        $setting->set_updatedcallback('theme_reset_all_caches');
        $temp->add($setting);
		
		

      
	  
	  //Escolha2.
      $name = 'theme_ganesha/escolha2';
      $title = 'Recurso 2';
      $description = 'Escolha o Tipo do Recurso 2';
      $default = 0;
      $choices = array(
          0 => 'Escolha o tipo',
          1 => 'Vídeo Instrucional',
          2 => 'Exemplo',
          3 => 'Contra Exemplo',
          4 => 'Texto',
      );
      $temp->add(new admin_setting_configselect($name, $title, $description, $default, $choices));

      //Texto2
        $name = 'theme_ganesha/texto2';
        $title = 'Texto da Escolha 2';
        $description = 'Coloque a descrição do conteúdo';
        $default = 'Em breve...';
        $setting = new admin_setting_configtextarea($name, $title, $description, $default);
        $setting->set_updatedcallback('theme_reset_all_caches');
        $temp->add($setting);
		
		
		


      //Escolha3.
      $name = 'theme_ganesha/escolha3';
      $title = 'Recurso 3';
      $description = 'Escolha o Tipo do Recurso 3';
      $default = 0;
      $choices = array(
          0 => 'Escolha o tipo',
          1 => 'Vídeo Instrucional',
          2 => 'Exemplo',
          3 => 'Contra Exemplo',
          4 => 'Texto',
      );
      $temp->add(new admin_setting_configselect($name, $title, $description, $default, $choices));

      //Texto3
        $name = 'theme_ganesha/texto3';
        $title = 'Texto da Escolha 3';
        $description = 'Coloque a descrição do conteúdo';
        $default = 'Em breve...';
        $setting = new admin_setting_configtextarea($name, $title, $description, $default);
        $setting->set_updatedcallback('theme_reset_all_caches');
        $temp->add($setting);
		
		
		
		
		
		//Escolha4.
		$name = 'theme_ganesha/escolha4';
		$title = 'Recurso 3';
		$description = 'Escolha o Tipo do Recurso 4';
		$default = 0;
		$choices = array(
		  0 => 'Escolha o tipo',
		  1 => 'Vídeo Instrucional',
		  2 => 'Exemplo',
		  3 => 'Contra Exemplo',
		  4 => 'Texto',
		);
		$temp->add(new admin_setting_configselect($name, $title, $description, $default, $choices));
		
		//Texto4
		$name = 'theme_ganesha/texto4';
		$title = 'Texto da Escolha 4';
		$description = 'Coloque a descrição do conteúdo';
		$default = 'Em breve...';
		$setting = new admin_setting_configtextarea($name, $title, $description, $default);
		$setting->set_updatedcallback('theme_reset_all_caches');
		$temp->add($setting);
		


      //modulos
        $name = 'theme_ganesha/modulo';
        $title = 'Ementa dos Módulos';
        $description = 'Coloque a descrição do conteúdo';
        $default = 'Em breve...';
        $setting = new admin_setting_configtextarea($name, $title, $description, $default);
        $setting->set_updatedcallback('theme_reset_all_caches');
        $temp->add($setting);

    $ADMIN->add('theme_ganesha', $temp);






    /* Curso 2 */
      $temp = new admin_settingpage('theme_ganesha_cursos2', 'Curso 2');

    // Id do curso.
      $name = 'theme_ganesha/idcurso2';
      $title = 'ID';
      $description = 'Insira o ID do curso do qual deseja deixar em destaque.';
      $default = 0;
      $setting = new admin_setting_configtext($name, $title, $description, $default);
      $setting->set_updatedcallback('theme_reset_all_caches');
      $temp->add($setting);

    //Imagem banner
      $name = 'theme_ganesha/bannercurso2';
      $title = 'Banner';
      $description = 'Insira a imagem do banner do curso';
      $setting = new admin_setting_configstoredfile($name, $title, $description, 'bannercurso2');
      $setting->set_updatedcallback('theme_reset_all_caches');
      $temp->add($setting);

    //Sobre o Curso
      $name = 'theme_ganesha/sobrecurso2';
      $title = 'Sobre o Curso';
      $description = 'Fale um pouco sobre o curso';
      $default = 'Em breve...';
      $setting = new admin_setting_configtextarea($name, $title, $description, $default);
      $setting->set_updatedcallback('theme_reset_all_caches');
      $temp->add($setting);

    //Publico Alvo
      $name = 'theme_ganesha/publicoalvo2';
      $title = 'Publico Alvo';
      $description = 'Qual o público Alvo do Curso?';
      $default = 'Em breve...';
      $setting = new admin_setting_configtextarea($name, $title, $description, $default);
      $setting->set_updatedcallback('theme_reset_all_caches');
      $temp->add($setting);

    //Duração
      $name = 'theme_ganesha/duracao2';
      $title = 'Duração';
      $description = 'Qual a duração do curso?';
      $default = 'Em breve...';
      $setting = new admin_setting_configtextarea($name, $title, $description, $default);
      $setting->set_updatedcallback('theme_reset_all_caches');
      $temp->add($setting);

      //Escolha1.
      $name = 'theme_ganesha/escolha12';
      $title = 'Recurso 1';
      $description = 'Escolha o Tipo do Recurso 1';
      $default = 0;
      $choices = array(
          0 => 'Escolha o tipo',
          1 => 'Vídeo Instrucional',
          2 => 'Exemplo',
          3 => 'Contra Exemplo',
          4 => 'Texto',
      );
      $temp->add(new admin_setting_configselect($name, $title, $description, $default, $choices));

      //Texto1
        $name = 'theme_ganesha/texto12';
        $title = 'Texto da Escolha 1';
        $description = 'Coloque a descrição do conteúdo';
        $default = 'Em breve...';
        $setting = new admin_setting_configtextarea($name, $title, $description, $default);
        $setting->set_updatedcallback('theme_reset_all_caches');
        $temp->add($setting);

      //Escolha2.
      $name = 'theme_ganesha/escolha22';
      $title = 'Recurso 2';
      $description = 'Escolha o Tipo do Recurso 2';
      $default = 0;
      $choices = array(
          0 => 'Escolha o tipo',
          1 => 'Vídeo Instrucional',
          2 => 'Exemplo',
          3 => 'Contra Exemplo',
          4 => 'Texto',
      );
      $temp->add(new admin_setting_configselect($name, $title, $description, $default, $choices));

      //Texto2
        $name = 'theme_ganesha/texto22';
        $title = 'Texto da Escolha 2';
        $description = 'Coloque a descrição do conteúdo';
        $default = 'Em breve...';
        $setting = new admin_setting_configtextarea($name, $title, $description, $default);
        $setting->set_updatedcallback('theme_reset_all_caches');
        $temp->add($setting);


      //Escolha3.
      $name = 'theme_ganesha/escolha32';
      $title = 'Recurso 3';
      $description = 'Escolha o Tipo do Recurso 3';
      $default = 0;
      $choices = array(
          0 => 'Escolha o tipo',
          1 => 'Vídeo Instrucional',
          2 => 'Exemplo',
          3 => 'Contra Exemplo',
          4 => 'Texto',
      );
      $temp->add(new admin_setting_configselect($name, $title, $description, $default, $choices));

      //Texto3
        $name = 'theme_ganesha/texto32';
        $title = 'Texto da Escolha 3';
        $description = 'Coloque a descrição do conteúdo';
        $default = 'Em breve...';
        $setting = new admin_setting_configtextarea($name, $title, $description, $default);
        $setting->set_updatedcallback('theme_reset_all_caches');
        $temp->add($setting);
		
		//Escolha4.
		$name = 'theme_ganesha/escolha42';
		$title = 'Recurso 3';
		$description = 'Escolha o Tipo do Recurso 4';
		$default = 0;
		$choices = array(
		  0 => 'Escolha o tipo',
		  1 => 'Vídeo Instrucional',
		  2 => 'Exemplo',
		  3 => 'Contra Exemplo',
		  4 => 'Texto',
		);
		$temp->add(new admin_setting_configselect($name, $title, $description, $default, $choices));
		
		//Texto4
		$name = 'theme_ganesha/texto42';
		$title = 'Texto da Escolha 4';
		$description = 'Coloque a descrição do conteúdo';
		$default = 'Em breve...';
		$setting = new admin_setting_configtextarea($name, $title, $description, $default);
		$setting->set_updatedcallback('theme_reset_all_caches');
		$temp->add($setting);		


      //modulos
        $name = 'theme_ganesha/modulo2';
        $title = 'Ementa dos Módulos';
        $description = 'Coloque a descrição do conteúdo';
        $default = 'Em breve...';
        $setting = new admin_setting_configtextarea($name, $title, $description, $default);
        $setting->set_updatedcallback('theme_reset_all_caches');
        $temp->add($setting);

    $ADMIN->add('theme_ganesha', $temp);








      /* Curso 3 */
        $temp = new admin_settingpage('theme_ganesha_cursos3', 'Curso 3');

      // Id do curso.
        $name = 'theme_ganesha/idcurso3';
        $title = 'ID';
        $description = 'Insira o ID do curso do qual deseja deixar em destaque.';
        $default = 0;
        $setting = new admin_setting_configtext($name, $title, $description, $default);
        $setting->set_updatedcallback('theme_reset_all_caches');
        $temp->add($setting);

      //Imagem banner
        $name = 'theme_ganesha/bannercurso3';
        $title = 'Banner';
        $description = 'Insira a imagem do banner do curso';
        $setting = new admin_setting_configstoredfile($name, $title, $description, 'bannercurso3');
        $setting->set_updatedcallback('theme_reset_all_caches');
        $temp->add($setting);

      //Sobre o Curso
        $name = 'theme_ganesha/sobrecurso3';
        $title = 'Sobre o Curso';
        $description = 'Fale um pouco sobre o curso';
        $default = 'Em breve...';
        $setting = new admin_setting_configtextarea($name, $title, $description, $default);
        $setting->set_updatedcallback('theme_reset_all_caches');
        $temp->add($setting);

      //Publico Alvo
        $name = 'theme_ganesha/publicoalvo3';
        $title = 'Publico Alvo';
        $description = 'Qual o público Alvo do Curso?';
        $default = 'Em breve...';
        $setting = new admin_setting_configtextarea($name, $title, $description, $default);
        $setting->set_updatedcallback('theme_reset_all_caches');
        $temp->add($setting);

      //Duração
        $name = 'theme_ganesha/duracao3';
        $title = 'Duração';
        $description = 'Qual a duração do curso?';
        $default = 'Em breve...';
        $setting = new admin_setting_configtextarea($name, $title, $description, $default);
        $setting->set_updatedcallback('theme_reset_all_caches');
        $temp->add($setting);

        //Escolha1.
        $name = 'theme_ganesha/escolha13';
        $title = 'Recurso 1';
        $description = 'Escolha o Tipo do Recurso 1';
        $default = 0;
        $choices = array(
          0 => 'Escolha o tipo',
          1 => 'Vídeo Instrucional',
          2 => 'Exemplo',
          3 => 'Contra Exemplo',
          4 => 'Texto',
        );
        $temp->add(new admin_setting_configselect($name, $title, $description, $default, $choices));

        //Texto1
          $name = 'theme_ganesha/texto13';
          $title = 'Texto da Escolha 1';
          $description = 'Coloque a descrição do conteúdo';
          $default = 'Em breve...';
          $setting = new admin_setting_configtextarea($name, $title, $description, $default);
          $setting->set_updatedcallback('theme_reset_all_caches');
          $temp->add($setting);

        //Escolha2.
        $name = 'theme_ganesha/escolha23';
        $title = 'Recurso 2';
        $description = 'Escolha o Tipo do Recurso 2';
        $default = 0;
        $choices = array(
          0 => 'Escolha o tipo',
          1 => 'Vídeo Instrucional',
          2 => 'Exemplo',
          3 => 'Contra Exemplo',
          4 => 'Texto',
        );
        $temp->add(new admin_setting_configselect($name, $title, $description, $default, $choices));

        //Texto2
          $name = 'theme_ganesha/texto23';
          $title = 'Texto da Escolha 2';
          $description = 'Coloque a descrição do conteúdo';
          $default = 'Em breve...';
          $setting = new admin_setting_configtextarea($name, $title, $description, $default);
          $setting->set_updatedcallback('theme_reset_all_caches');
          $temp->add($setting);


        //Escolha3.
        $name = 'theme_ganesha/escolha33';
        $title = 'Recurso 3';
        $description = 'Escolha o Tipo do Recurso 3';
        $default = 0;
        $choices = array(
          0 => 'Escolha o tipo',
          1 => 'Vídeo Instrucional',
          2 => 'Exemplo',
          3 => 'Contra Exemplo',
          4 => 'Texto',
        );
        $temp->add(new admin_setting_configselect($name, $title, $description, $default, $choices));

        //Texto3
          $name = 'theme_ganesha/texto33';
          $title = 'Texto da Escolha 3';
          $description = 'Coloque a descrição do conteúdo';
          $default = 'Em breve...';
          $setting = new admin_setting_configtextarea($name, $title, $description, $default);
          $setting->set_updatedcallback('theme_reset_all_caches');
          $temp->add($setting);
		  
		  
		//Escolha4.
		$name = 'theme_ganesha/escolha43';
		$title = 'Recurso 3';
		$description = 'Escolha o Tipo do Recurso 4';
		$default = 0;
		$choices = array(
		  0 => 'Escolha o tipo',
		  1 => 'Vídeo Instrucional',
		  2 => 'Exemplo',
		  3 => 'Contra Exemplo',
		  4 => 'Texto',
		);
		$temp->add(new admin_setting_configselect($name, $title, $description, $default, $choices));
		
		//Texto4
		$name = 'theme_ganesha/texto43';
		$title = 'Texto da Escolha 4';
		$description = 'Coloque a descrição do conteúdo';
		$default = 'Em breve...';
		$setting = new admin_setting_configtextarea($name, $title, $description, $default);
		$setting->set_updatedcallback('theme_reset_all_caches');
		$temp->add($setting);		  


        //modulos
          $name = 'theme_ganesha/modulo3';
          $title = 'Ementa dos Módulos';
          $description = 'Coloque a descrição do conteúdo';
          $default = 'Em breve...';
          $setting = new admin_setting_configtextarea($name, $title, $description, $default);
          $setting->set_updatedcallback('theme_reset_all_caches');
          $temp->add($setting);

      $ADMIN->add('theme_ganesha', $temp);









      /* Curso 3 */
        $temp = new admin_settingpage('theme_ganesha_cursos4', 'Curso 4');

      // Id do curso.
        $name = 'theme_ganesha/idcurso4';
        $title = 'ID';
        $description = 'Insira o ID do curso do qual deseja deixar em destaque.';
        $default = 0;
        $setting = new admin_setting_configtext($name, $title, $description, $default);
        $setting->set_updatedcallback('theme_reset_all_caches');
        $temp->add($setting);

      //Imagem banner
        $name = 'theme_ganesha/bannercurso4';
        $title = 'Banner';
        $description = 'Insira a imagem do banner do curso';
        $setting = new admin_setting_configstoredfile($name, $title, $description, 'bannercurso4');
        $setting->set_updatedcallback('theme_reset_all_caches');
        $temp->add($setting);

      //Sobre o Curso
        $name = 'theme_ganesha/sobrecurso4';
        $title = 'Sobre o Curso';
        $description = 'Fale um pouco sobre o curso';
        $default = 'Em breve...';
        $setting = new admin_setting_configtextarea($name, $title, $description, $default);
        $setting->set_updatedcallback('theme_reset_all_caches');
        $temp->add($setting);

      //Publico Alvo
        $name = 'theme_ganesha/publicoalvo4';
        $title = 'Publico Alvo';
        $description = 'Qual o público Alvo do Curso?';
        $default = 'Em breve...';
        $setting = new admin_setting_configtextarea($name, $title, $description, $default);
        $setting->set_updatedcallback('theme_reset_all_caches');
        $temp->add($setting);

      //Duração
        $name = 'theme_ganesha/duracao4';
        $title = 'Duração';
        $description = 'Qual a duração do curso?';
        $default = 'Em breve...';
        $setting = new admin_setting_configtextarea($name, $title, $description, $default);
        $setting->set_updatedcallback('theme_reset_all_caches');
        $temp->add($setting);

        //Escolha1.
        $name = 'theme_ganesha/escolha14';
        $title = 'Recurso 1';
        $description = 'Escolha o Tipo do Recurso 1';
        $default = 0;
        $choices = array(
          0 => 'Escolha o tipo',
          1 => 'Vídeo Instrucional',
          2 => 'Exemplo',
          3 => 'Contra Exemplo',
          4 => 'Texto',
        );
        $temp->add(new admin_setting_configselect($name, $title, $description, $default, $choices));

        //Texto1
          $name = 'theme_ganesha/texto14';
          $title = 'Texto da Escolha 1';
          $description = 'Coloque a descrição do conteúdo';
          $default = 'Em breve...';
          $setting = new admin_setting_configtextarea($name, $title, $description, $default);
          $setting->set_updatedcallback('theme_reset_all_caches');
          $temp->add($setting);

        //Escolha2.
        $name = 'theme_ganesha/escolha24';
        $title = 'Recurso 2';
        $description = 'Escolha o Tipo do Recurso 2';
        $default = 0;
        $choices = array(
          0 => 'Escolha o tipo',
          1 => 'Vídeo Instrucional',
          2 => 'Exemplo',
          3 => 'Contra Exemplo',
          4 => 'Texto',
        );
        $temp->add(new admin_setting_configselect($name, $title, $description, $default, $choices));

        //Texto2
          $name = 'theme_ganesha/texto24';
          $title = 'Texto da Escolha 2';
          $description = 'Coloque a descrição do conteúdo';
          $default = 'Em breve...';
          $setting = new admin_setting_configtextarea($name, $title, $description, $default);
          $setting->set_updatedcallback('theme_reset_all_caches');
          $temp->add($setting);


        //Escolha3.
        $name = 'theme_ganesha/escolha34';
        $title = 'Recurso 3';
        $description = 'Escolha o Tipo do Recurso 3';
        $default = 0;
        $choices = array(
          0 => 'Escolha o tipo',
          1 => 'Vídeo Instrucional',
          2 => 'Exemplo',
          3 => 'Contra Exemplo',
          4 => 'Texto',
        );
        $temp->add(new admin_setting_configselect($name, $title, $description, $default, $choices));

        //Texto3
          $name = 'theme_ganesha/texto34';
          $title = 'Texto da Escolha 3';
          $description = 'Coloque a descrição do conteúdo';
          $default = 'Em breve...';
          $setting = new admin_setting_configtextarea($name, $title, $description, $default);
          $setting->set_updatedcallback('theme_reset_all_caches');
          $temp->add($setting);
		  
		  
		//Escolha4.
		$name = 'theme_ganesha/escolha44';
		$title = 'Recurso 3';
		$description = 'Escolha o Tipo do Recurso 4';
		$default = 0;
		$choices = array(
		  0 => 'Escolha o tipo',
		  1 => 'Vídeo Instrucional',
		  2 => 'Exemplo',
		  3 => 'Contra Exemplo',
		  4 => 'Texto',
		);
		$temp->add(new admin_setting_configselect($name, $title, $description, $default, $choices));
		
		//Texto4
		$name = 'theme_ganesha/texto44';
		$title = 'Texto da Escolha 4';
		$description = 'Coloque a descrição do conteúdo';
		$default = 'Em breve...';
		$setting = new admin_setting_configtextarea($name, $title, $description, $default);
		$setting->set_updatedcallback('theme_reset_all_caches');
		$temp->add($setting);		  


        //modulos
          $name = 'theme_ganesha/modulo4';
          $title = 'Ementa dos Módulos';
          $description = 'Coloque a descrição do conteúdo';
          $default = 'Em breve...';
          $setting = new admin_setting_configtextarea($name, $title, $description, $default);
          $setting->set_updatedcallback('theme_reset_all_caches');
          $temp->add($setting);

      $ADMIN->add('theme_ganesha', $temp);




				/* Header Settings */
				$temp = new admin_settingpage('theme_ganesha_header', get_string('headerheading', 'theme_ganesha'));

    // Logo file setting.
    $name = 'theme_ganesha/logo';
    $title = get_string('logo','theme_ganesha');
    $description = get_string('logodesc', 'theme_ganesha');
    $setting = new admin_setting_configstoredfile($name, $title, $description, 'logo');
    $setting->set_updatedcallback('theme_reset_all_caches');
    $temp->add($setting);




    // Custom CSS file.
    $name = 'theme_ganesha/customcss';
    $title = get_string('customcss', 'theme_ganesha');
    $description = get_string('customcssdesc', 'theme_ganesha');
    $default = '';
    $setting = new admin_setting_configtextarea($name, $title, $description, $default);
    $setting->set_updatedcallback('theme_reset_all_caches');
    $temp->add($setting);

				$ADMIN->add('theme_ganesha', $temp);

    	/* Slideshow Settings Start */

				 $temp = new admin_settingpage('theme_ganesha_slideshow', get_string('slideshowheading', 'theme_ganesha'));
    $temp->add(new admin_setting_heading('theme_ganesha_slideshow', get_string('slideshowheadingsub', 'theme_ganesha'),
        format_text(get_string('slideshowdesc', 'theme_ganesha'), FORMAT_MARKDOWN)));

				// Display Slideshow.
    $name = 'theme_ganesha/toggleslideshow';
    $title = get_string('toggleslideshow', 'theme_ganesha');
    $description = get_string('toggleslideshowdesc', 'theme_ganesha');
    $yes = get_string('yes');
    $no = get_string('no');
    $default = 1;
    $choices = array(1 => $yes , 0 => $no);
    $setting = new admin_setting_configselect($name, $title, $description, $default, $choices);
    $setting->set_updatedcallback('theme_reset_all_caches');
    $temp->add($setting);

				// Number of slides.
    $name = 'theme_ganesha/numberofslides';
    $title = get_string('numberofslides', 'theme_ganesha');
    $description = get_string('numberofslides_desc', 'theme_ganesha');
    $default = 3;
    $choices = array(
        1 => '1',
        2 => '2',
        3 => '3',
        4 => '4',
        5 => '5',
        6 => '6',
        7 => '7',
        8 => '8',
        9 => '9',
        10 => '10',
        11 => '11',
        12 => '12',
    );
    $temp->add(new admin_setting_configselect($name, $title, $description, $default, $choices));


    $numberofslides = get_config('theme_ganesha', 'numberofslides');
    for ($i = 1; $i <= $numberofslides; $i++) {

								// This is the descriptor for Slide One
        $name = 'theme_ganesha/slide' . $i . 'info';
        $heading = get_string('slideno', 'theme_ganesha', array('slide' => $i));
        $information = get_string('slidenodesc', 'theme_ganesha', array('slide' => $i));
        $setting = new admin_setting_heading($name, $heading, $information);
        $temp->add($setting);

								 // Slide Image.
        $name = 'theme_ganesha/slide' . $i . 'image';
        $title = get_string('slideimage', 'theme_ganesha');
        $description = get_string('slideimagedesc', 'theme_ganesha');
        $setting = new admin_setting_configstoredfile($name, $title, $description, 'slide' . $i . 'image');
        $setting->set_updatedcallback('theme_reset_all_caches');
        $temp->add($setting);

        // Slide Caption.
        $name = 'theme_ganesha/slide' . $i . 'caption';
        $title = get_string('slidecaption', 'theme_ganesha');
        $description = get_string('slidecaptiondesc', 'theme_ganesha');
        $default = get_string('slidecaptiondefault','theme_ganesha', array('slideno' => sprintf('%02d', $i) ));
        $setting = new admin_setting_configtext($name, $title, $description, $default, PARAM_TEXT);
        $setting->set_updatedcallback('theme_reset_all_caches');
        $temp->add($setting);

								// Slide Description Text.
								$name = 'theme_ganesha/slide' . $i . 'desc';
								$title = get_string('slidedesc', 'theme_ganesha');
								$description = get_string('slidedesctext', 'theme_ganesha');
								$default = get_string('slidedescdefault','theme_ganesha');
								$setting = new admin_setting_confightmleditor($name, $title, $description, $default);
								$setting->set_updatedcallback('theme_reset_all_caches');
								$temp->add($setting);

				}

				$ADMIN->add('theme_ganesha', $temp);
				/* Slideshow Settings End*/

				/* Footer Settings start */

				$temp = new admin_settingpage('theme_ganesha_footer', get_string('footerheading', 'theme_ganesha'));

				/* Footer Content */
				$name = 'theme_ganesha/footnote';
    $title = get_string('footnote', 'theme_ganesha');
    $description = get_string('footnotedesc', 'theme_ganesha');
    $default = get_string('footnotedefault', 'theme_ganesha');
    $setting = new admin_setting_confightmleditor($name, $title, $description, $default);
    $setting->set_updatedcallback('theme_reset_all_caches');
    $temp->add($setting);

	// INFO Link

		$name = 'theme_ganesha/infolink';
    $title = get_string('infolink', 'theme_ganesha');
    $description = get_string('infolink_desc', 'theme_ganesha');
    $default = get_string('infolinkdefault', 'theme_ganesha');
    $setting = new admin_setting_configtextarea($name, $title, $description, $default);
    $setting->set_updatedcallback('theme_reset_all_caches');
    $temp->add($setting);

	// copyright

	$name = 'theme_ganesha/copyright_footer';
    $title = get_string('copyright_footer', 'theme_ganesha');
    $description = '';
    $default = get_string('copyright_default','theme_ganesha');
    $setting = new admin_setting_configtext($name, $title, $description, $default);
    $temp->add($setting);


				/* Address , Email , Phone No */

				$name = 'theme_ganesha/address';
    $title = get_string('address', 'theme_ganesha');
    $description = '';
    $default = get_string('defaultaddress','theme_ganesha');
    $setting = new admin_setting_configtext($name, $title, $description, $default);
    $temp->add($setting);


				$name = 'theme_ganesha/emailid';
    $title = get_string('emailid', 'theme_ganesha');
    $description = '';
    $default = get_string('defaultemailid','theme_ganesha');
    $setting = new admin_setting_configtext($name, $title, $description, $default);
    $temp->add($setting);

					$name = 'theme_ganesha/phoneno';
    $title = get_string('phoneno', 'theme_ganesha');
    $description = '';
    $default = get_string('defaultphoneno','theme_ganesha');
    $setting = new admin_setting_configtext($name, $title, $description, $default);
    $temp->add($setting);

					/* Facebook,Pinterest,Twitter,Google+ Settings */
				$name = 'theme_ganesha/fburl';
    $title = get_string('fburl', 'theme_ganesha');
    $description = get_string('fburldesc', 'theme_ganesha');
    $default = get_string('fburl_default','theme_ganesha');
    $setting = new admin_setting_configtext($name, $title, $description, $default);
    $temp->add($setting);

				$name = 'theme_ganesha/pinurl';
    $title = get_string('pinurl', 'theme_ganesha');
    $description = get_string('pinurldesc', 'theme_ganesha');
    $default = get_string('pinurl_default','theme_ganesha');
    $setting = new admin_setting_configtext($name, $title, $description, $default);
    $temp->add($setting);

				$name = 'theme_ganesha/twurl';
    $title = get_string('twurl', 'theme_ganesha');
    $description = get_string('twurldesc', 'theme_ganesha');
    $default = get_string('twurl_default','theme_ganesha');
    $setting = new admin_setting_configtext($name, $title, $description, $default);
    $temp->add($setting);

				$name = 'theme_ganesha/gpurl';
    $title = get_string('gpurl', 'theme_ganesha');
    $description = get_string('gpurldesc', 'theme_ganesha');
    $default = get_string('gpurl_default','theme_ganesha');
    $setting = new admin_setting_configtext($name, $title, $description, $default);
    $temp->add($setting);

    $ADMIN->add('theme_ganesha', $temp);
			 /*  Footer Settings end */


}
