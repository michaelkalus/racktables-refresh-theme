<?php

// RackTables Modern Theme - plugin (new plugin architecture, RackTables 0.21+).
// Adds css/theme.css after the default pi.css, so it overrides the stock look.
// No database tables, no config variables: install/uninstall only toggle it.

function plugin_moderntheme_info ()
{
	return array
	(
		'name' => 'moderntheme',
		'longname' => 'Modern Theme',
		'version' => '1.0.0',
		'home_url' => '',
	);
}

function plugin_moderntheme_init ()
{
	// Served by RackTables itself (?module=chrome&uri=...) from $local_staticdir,
	// which defaults to the plugins/ directory.
	addCSSInternal ('moderntheme/css/theme.css');
}

function plugin_moderntheme_install ()
{
	return TRUE;
}

function plugin_moderntheme_uninstall ()
{
	return TRUE;
}

function plugin_moderntheme_upgrade ()
{
	return TRUE;
}
