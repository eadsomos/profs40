<?php
  global $CFG, $DB;
  require_once($CFG->libdir. '/coursecatlib.php');

?>

<header>
 <script src="<?php echo $CFG->wwwroot;?>/theme/ganesha/javascript/LetterAvatar.js"></script>
  <nav class="navbar navbar-static-top" role="navigation">
    <div class="container">
      <div class="row-fluid">
        <div class="span8 esquerda">
          <div class="logo-home">
            <a href="<?php echo $CFG->wwwroot;?>">
              <img src="<?php echo get_logo_url(); ?>" height="60" alt="logo-nead">
            </a>
          </div>
        </div>
        <?php if (isloggedin()) {
          echo $OUTPUT->user_menu();
            
            
        }else{ ?>
         <div class="span4 centrabotoes">
           <div class="span6">
             <h3 class="entrarbtn direita"><a href="<?php echo $CFG->wwwroot;?>/login/index.php">entrar</a>
           </div>
           <div class="span6">
             <div class="cadastrarbox direita">
               <h3 class="cadastrarbtn direita"><a href="<?php echo $CFG->wwwroot;?>/signup/index.php">cadastrar</a></h3>
             </div>
           </div>
         </div>
        <?php } ?>
      </div>
    </div>
  </nav>
 
 
  <?php if(strpos($actual_link,$CFG->wwwroot.'/course') !== false){ ?>
  <div class="header-main separador-curso">
    <div class="container">
      <div class="row-fluid">
        <div class="seal">
           <?php
             /**
             * Display fullname and shortname of course
             * @author André Rodrigues <Wolk Ad>
             * @date 2015/12/19
             */
              if (isset($_GET['id'])) {
                try {
                  $courseid = $_GET['id'];
                  $c = $DB->get_record('course', array('id' => $courseid), '*', MUST_EXIST);
                  $course = new course_in_list($c);
                  $url = '';
                  foreach ($course->get_course_overviewfiles() as $file) {
                    $isimage = $file->is_valid_image();
                    $url = file_encode_url("$CFG->wwwroot/pluginfile.php",
                      '/'. $file->get_contextid(). '/'. $file->get_component(). '/'.
                      $file->get_filearea(). $file->get_filepath(). $file->get_filename(), !$isimage);
                  }
                  echo '<div id="circulo">';
                    echo '<img src="' . $url . '" alt="Ícone do Curso" title="Ícone do Curso" />';
                  echo '</div>';
                  echo '<div>';
                    echo '<h2 id="full_name"><b>' . $PAGE->course->fullname . '</b></h2>';
                    echo '<h3 id="actual_topic"> </h3>';
                  echo '</div>';
                } catch (Exception $e) {
                  // echo $e->getMessage();
                }
              }
           ?>
        </div>
      </div>
    </div>
  </div>
  <?php } ?>


</header>
<!--E.O.Header-->
