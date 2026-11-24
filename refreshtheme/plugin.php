<?php

// RackTables Refresh Theme - plugin (new plugin architecture, RackTables 0.21+).
// Adds css/theme.css after the default pi.css, so it overrides the stock look,
// and js/select-filter.js, a type-to-filter field for long drop-down lists.
// No database tables, no config variables: install/uninstall only toggle it.

function plugin_refreshtheme_info ()
{
	return array
	(
		'name' => 'refreshtheme',
		'longname' => 'Refresh Theme',
		'version' => '1.1.0',
		'home_url' => '',
	);
}

function plugin_refreshtheme_init ()
{
	// Served by RackTables itself (?module=chrome&uri=...) from $local_staticdir,
	// which defaults to the plugins/ directory.
	addCSSInternal ('refreshtheme/css/theme.css');
	// Type-to-filter field above long <select> lists (no dependencies).
	addJSInternal ('refreshtheme/js/select-filter.js');
}

function plugin_refreshtheme_install ()
{
	return TRUE;
}

function plugin_refreshtheme_uninstall ()
{
	return TRUE;
}

function plugin_refreshtheme_upgrade ()
{
	return TRUE;
}
