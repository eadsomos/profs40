<?php
/**
 * @package    theme_ganesha
 */

class theme_ganesha_core_renderer extends core_renderer {

    protected function mycourses($CFG){
        $mycourses = enrol_get_users_courses($_SESSION['USER']->id);
        global $DB;
        $courselist = array();
        foreach ($mycourses as $key=>$val){
            $courselist[] = $val->id;
        }

        $content = '';
		
		


        for($x=1;$x<=sizeof($courselist);$x++){
            $course = get_course($courselist[$x-1]);
            $title = $course->fullname;
						$descricao = format_string($course->summary);
						$textohome = $descricao;
            $category = $DB->get_record('course_categories',array('id'=>$course->category));
            $nomecategoria = $category->name;
            $idcategoria = $category->id;

            if ($course instanceof stdClass) {
                require_once($CFG->libdir. '/coursecatlib.php');
                $course = new course_in_list($course);
            }

            $url = $CFG->wwwroot."/theme/ganesha/pix/coursenoimage.jpg";
            foreach ($course->get_course_overviewfiles() as $file) {
                $isimage = $file->is_valid_image();
                $url = file_encode_url("$CFG->wwwroot/pluginfile.php",
                        '/'. $file->get_contextid(). '/'. $file->get_component(). '/'.
                        $file->get_filearea(). $file->get_filepath(). $file->get_filename(), !$isimage);
                if (!$isimage) {
                    $url = $CFG->wwwroot."/theme/ganesha/pix/coursenoimage.jpg";
                }
            }



						$textohome = (strlen($textohome) > 322) ? substr($textohome,0,320).'[...]' : $textohome;

            $content .= '<div class="row-fluid">
              <div class="span12 boxcontent">
                <div class="span4 imagecontent">
                  <a href="'.$CFG->wwwroot.'/course/view.php?id='.$courselist[$x-1].'" data-largesrc="'.$url.'" data-title="'.$title.'" data-description="'.format_string($course->summary).'">
                    <img src="'.$url.'" alt="'.$title.'"/>
                  </a>
                </div>
                <div class="span8 centralizador">
                  <div class="titulo-curso"><p>'.$title.'</p></div>
                  <div class="txt-curso"><p>'.$textohome.'</p></div>
                  <div class="row-fluid">
                    <div class="span4">
                      <div class="img-categoria" style="background:url('.$CFG->wwwroot.'/theme/ganesha/pix/imgcat/'.$idcategoria.'.png) no-repeat;"></div>
                      <div class="txt-categoria"><p>'.$nomecategoria.'</p></div>
                    </div>
                    <div class="span8">
                      <a href="'.$CFG->wwwroot.'/course/view.php?id='.$courselist[$x-1].'" class="btn btn-primary direita">ENTRAR</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>';
        }

        return $content;
    }

    protected function featuredcourses($CFG){
        global $DB;
        $idcursod = theme_ganesha_get_setting('idcurso');
        $idcursod2 = theme_ganesha_get_setting('idcurso2');
        $idcursod3 = theme_ganesha_get_setting('idcurso3');
        $idcursod4 = theme_ganesha_get_setting('idcurso4');
        
        $cursosdestaque =  "[$idcursod,$idcursod2,$idcursod3,$idcursod4]";
        $featuredcourses = $cursosdestaque; // colocar IDs do curso para exibir na home
        $courselist = json_decode($featuredcourses);
        $content = '';

        for($x=1;$x<=sizeof($courselist);$x++){
            $course = get_course($courselist[$x-1]);
            $title = $course->fullname;
            $descricao = format_string($course->summary);
						$textohome = $descricao;
            $category = $DB->get_record('course_categories',array('id'=>$course->category));
            $nomecategoria = $category->name;
            $idcategoria = $category->id;

            if ($course instanceof stdClass) {
                require_once($CFG->libdir. '/coursecatlib.php');
                $course = new course_in_list($course);
            }

            $url = $CFG->wwwroot."/theme/ganesha/pix/coursenoimage.jpg";
            foreach ($course->get_course_overviewfiles() as $file) {
                $isimage = $file->is_valid_image();
                $url = file_encode_url("$CFG->wwwroot/pluginfile.php",
                        '/'. $file->get_contextid(). '/'. $file->get_component(). '/'.
                        $file->get_filearea(). $file->get_filepath(). $file->get_filename(), !$isimage);
                if (!$isimage) {
                    $url = $CFG->wwwroot."/theme/ganesha/pix/coursenoimage.jpg";
                }
            }

						$textohome = (strlen($textohome) > 202) ? substr($textohome,0,200).'[...]' : $textohome;

            $content .= '<li class="span3">
		          <div class="thumbnail">
								<a href="'.$CFG->wwwroot.'/course/view.php?id='.$courselist[$x-1].'" data-largesrc="'.$url.'" data-title="'.$title.'" data-description="'.format_string($course->summary).'">
									<img src="'.$url.'" alt="'.$title.'"/>
								</a>
		            <div class="guarda-infos-curso">
		              <div class="img-categoria-home" style="background:url('.$CFG->wwwroot.'/theme/ganesha/pix/imgcat/'.$idcategoria.'.png) no-repeat;"></div>
		              <div class="txt-categoria"><p>'.$nomecategoria.'</p></div>
		              <div class="titulo-curso"><p>'.$title.'</p></div>
		              <div class="txt-curso-home"><p>'.$textohome.'</p></div>
		            </div>
		            <div class="row-fluid">
		              <div class="botoes-curso">
		                <div class="span6 centro">
		                  <div class="btn-saiba-curso">
		                    <a href="'.$CFG->wwwroot.'/theme/ganesha/cursos.php?id='.$courselist[$x-1].'"><p>SAIBA MAIS</p></a>
		                  </div>
		                </div>
		                <div class="span6 centro">
		                  <div class="btn-cadastrar-curso">
		                    <a href="'.$CFG->wwwroot.'/signup/index.php?curso='.$courselist[$x-1].'"><p>CADASTRAR</p></a>
		                  </div>
		                </div>
		              </div>
		            </div>
		          </div>
		        </li>';
        }

        return $content;
    }

    protected function navbar_button($CFG){

    }
}
