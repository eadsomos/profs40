<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('WP_CACHE', true); //Added by WP-Cache Manager
define( 'WPCACHEHOME', '/home/sites/somoseducacao.com.br/subdomains/profs/httpdocs/blogprofessores/wp-content/plugins/wp-super-cache/' ); //Added by WP-Cache Manager
define('DB_NAME', 'blogsomos');

/** MySQL database username */
define('DB_USER', 'root');

/** MySQL database password */
define('DB_PASSWORD', '7kilnp6y');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8mb4');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         '1&(-O!/FgP8vC]uK!u{LiGG#soS@zQ5z1hN+qrWGc-se/|GZ;f:Q$;5T1,W2:CjY');
define('SECURE_AUTH_KEY',  'V>UbM[d;Lztc/{+/k4c*Q1f}:;I.[qnE4~W(!BZ]u;p6UiASU]HQU8UWPu6Bu<!9');
define('LOGGED_IN_KEY',    '~oq% 44F1&wE0uK?$evo?an<YOc37r%TDj:#Eg> mSDGq^?7]=IBcWk!2F75}a1.');
define('NONCE_KEY',        '|K7Ug+ O1Q,,u}Zv7W4,8)/ft&nt._?eLK}`p;iXloVhv.%e``^)Y$b7)+pCA+`G');
define('AUTH_SALT',        'mOXmRQsUcMMV_Fjj7Td(rWlvHTWv/`oMRDS!r8ni>q6q@Q0/.}N)H>YX}h4WLI_Z');
define('SECURE_AUTH_SALT', 'f?#d~ByD[2[PuWWb2qYsC^Drp|/NYm.;Oyp{qFO!klB:%4-|W*FuD%nbi}#$@_8M');
define('LOGGED_IN_SALT',   '2?#];)+}Q j<(Vgj!J8WE)UH(s#Sw6Xc.Wm#5uj-2#C2Y.oce_fxP:Z;DBmy>E1q');
define('NONCE_SALT',       'yI(HEU>Tv)Ms27U^(@G%<7=>0}cI?3xdB8[x1x{9CJuT/nq/24W^b5z>c5wNr@mQ');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
