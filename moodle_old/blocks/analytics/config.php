<?php  // Moodle configuration file

unset($CFG);
global $CFG;
$CFG = new stdClass();

$CFG->dbtype    = 'mysqli';
$CFG->dblibrary = 'native';
$CFG->dbhost    = '127.0.0.1';
$CFG->dbname    = 'ead_etb_homolog';
$CFG->dbuser    = 'root';
$CFG->dbpass    = '5ks7ggvw';
#$CFG->dbuser    = 'homologa_etb';
#$CFG->dbpass    = 'etb321';
$CFG->prefix    = 'mdl_';
$CFG->dboptions = array (
  'dbpersist' => 0,
  'dbport' => '',
  'dbsocket' => '',
);

$CFG->wwwroot   = 'http://homologa.ead.grupoetb.com.br';
$CFG->dataroot  = '/home/sites/grupoetb.com.br/subdomains/ead/subdomains/homologa/moodledataetb/';
$CFG->admin     = 'admin';

$CFG->directorypermissions = 0777;

require_once(dirname(__FILE__) . '/lib/setup.php');

// There is no php closing tag in this file,
// it is intentional because it prevents trailing whitespace problems!
