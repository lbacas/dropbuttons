droptabs
========

Jquery plugin for hiding Bootstrap buttons inside a dropdown, when viewport is too small.

Usage:

Install
-------

You can download the latest stable version with download links in [Github Page](https://github.com/lbacas/dropbuttons).

Requirements
------------

This plugin was tested with JQuery 1.12.4, but should work with older versions.

Dropbuttons works with Bootstrap default [buttons](http://getbootstrap.com/css/#buttons) structure, but selectors can be modified for using with other scenarios.

Demo
------------
Demo available [here](https://lbacas.github.io/dropbuttons/).

Optional parameters
-------------------

Dropbuttons supports optional parameters.

### dropdownSelector
Jquery selector for the dropdown container.

**Default: 'div.dropdown'**

### dropdownMenuSelector
Jquery selector for the dropdown container (menu) that holds the elements (buttons).

**Default: 'ul.dropdown-menu'**

### dropdownButtonsSelector
Jquery selector for the elements (buttons). This will only select elements under current container.

**Default: 'li'**

### visibleButtonsSelector
Jquery selector for the visible elements (buttons). This will only select elements under current container.
**Will be changed soon, don't use it!

**Default: '>button:not(.dropdown)'**

### autoArrangeButtons
Wether to auto arrange buttons that are always visible in front of all other buttons.

**Default: 'true'**

