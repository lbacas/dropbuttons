/*
 * Dropbuttons v.1.0.2 Jquery Plugin
 * Tested with JQuery 1.12.4 and Bootstrap 3.3.7
 * Copyright (c) 2016 Luis Ig. Bacas Riveiro
 * Licensed under MIT (https://github.com/lbacas/dropbuttons/blob/master/LICENSE)
 * Based on work by Alexandru Boboc to droptabs plugin (https://github.com/pippogsm/droptabs).
 */

(function($) {

    $.fn.dropbuttons = function(o) {

		//Default options
		var s = $.extend({
			dropdownSelector        : "div.dropdown",
			dropdownMenuSelector    : "ul.dropdown-menu",
			dropdownButtonsSelector : "li",
			visibleButtonsSelector  : ">button:not(.dropdown)",
			autoArrangeButtons      : true,
            developmentId           : "dt-devInfo",
            development             : false,
            getHiddenElementWidth : function(elem, container) {
                var tempElem;
                if ( $(elem).attr('data-dropbuttons') === true ) {
                    tempElem = $(elem).clone();
                } else {
                    tempElem = $(elem).find('[data-dropbuttons]').first().clone();
                }

				var hiddenElementWidth = $(tempElem).appendTo(container).removeClass('hidden').css("position","fixed").outerWidth(true);
				$(tempElem).remove();
				return hiddenElementWidth;
			},
            addToDropdown  : function( elem ) {
                if ( elem.length === 1 ) {
                    var dropdownElem = $('<li></li>');
                    var dropdownLinkElem = $('<a href="#"></a>').appendTo(dropdownElem);
                    var content = '';
                    if ( elem.is('button') || elem.is('a') ) {
                        content = elem.html();
                    } else if ( elem.find('button, a').length > 0 ) {
                        content = elem.find('button, a').first().html();
                    } else {
                        content = elem.text();
                    }
                    dropdownLinkElem.html( content );

                    dropdownElem.append( elem.addClass('hidden').attr('data-dropbuttons', true) );
                    dropdownElem.addClass( elem.attr('data-dropbuttons-class') );
                    dropdownLinkElem.on('click', function() {
                        elem.trigger('click');
                    });
                    return dropdownElem;
                }
                return elem;

            },
            removeFromDropdown : function( dropdownElem ) {
                if ( dropdownElem.length === 1 ) {
                    var elem = dropdownElem.find('[data-dropbuttons]');
                    elem.insertBefore( dropdownElem );
                    dropdownElem.remove();
                    return elem.removeClass('hidden').removeAttr('data-dropbuttons');
                }
                return dropdownElem;
            }
        }, o);

        return this.each( function() {
			var $container = $(this);
			var dropdown = $(s.dropdownSelector, this);
			var dropdownMenu = $(s.dropdownMenuSelector, dropdown);

			var $dropdownButtons = function () {
				return $(s.dropdownButtonsSelector, dropdownMenu);
			};

			var $visibleButtons = function () {
				return $(s.visibleButtonsSelector, $container);
			};

            function getFirstHiddenElementWidth() {
                return s.getHiddenElementWidth( $dropdownButtons().first(), $container );
            }


			var visibleButtonsWidth = function () {
				var visibleButtonsWidth = 0;
				$($visibleButtons()).each(function( index ) {
					visibleButtonsWidth += parseInt($(this).outerWidth(true), 10);
				});
				visibleButtonsWidth = visibleButtonsWidth + parseInt($(dropdown).outerWidth(true), 10);
				return visibleButtonsWidth;
			};

			var availableSpace = function () {
				return $container.outerWidth(true) - visibleButtonsWidth();
			};

            // Start Development info
			if ( s.development ) {
				$('body').append('<div class="alert alert-success" id="'+ s.developmentId +'"></div>');
				var $developmentDiv = $('#' + s.developmentId);
				$($developmentDiv).css('position','fixed').css('right','20px').css('bottom','20px');

				var devPrint = function (label, elem) {
                    var labelId = label.replace(/\s+/g, '-').toLowerCase();
					if ($('#'+labelId).length > 0) {
						$('#'+labelId).text(label + ': ' + elem);
					} else {
						$('#dt-devInfo').append('<div id="' + labelId + '">' + label + ': ' + elem + '</div>');
					}
					return true;
				};
			}
			// End Development info

			var arrangeButtons = function () {
                var x = availableSpace();

				if (x < 0) { //we will hide buttons here
                    var elemAlwaysVisible = false;
					$( $visibleButtons().get().reverse() ).each(function( index ) {
                        elemAlwaysVisible = ( $(this).hasClass('always-visible') || $(this).find('.always-visible').length > 0 );
						if ( !elemAlwaysVisible ) {
                            x = x + $(this).outerWidth(true);
							s.addToDropdown( $(this) ).prependTo(dropdownMenu);
						}
						if (x >= 0) {return false;}
					});
				}

                x = availableSpace();
				if (x >= getFirstHiddenElementWidth()) { //and here we bring the buttons out
                    var hiddenElementWidth = 100000;
                    var elemAlwaysInDropdown = false;
					$($dropdownButtons()).each(function( index ) {
                        hiddenElementWidth = s.getHiddenElementWidth(this, $container);
                        elemAlwaysInDropdown = ( $(this).hasClass('always-dropdown') || $(this).find('.always-dropdown').length > 0 );
						if ( hiddenElementWidth < x && !elemAlwaysInDropdown ) {
                            x = x - hiddenElementWidth;
                            s.removeFromDropdown( $(this) ).appendTo($container);
						}
					 });
				}

				if ($dropdownButtons().length <= 0) {
					dropdown.hide();
				} else {
					dropdown.show();
					$container.append( dropdown );
				}

                // Start Development info
				if ( s.development && typeof devPrint === 'function' ) {
					devPrint("Container width", $container.outerWidth());
                    devPrint("Dropdown width", $(dropdown).outerWidth(true));
					devPrint("Visible buttons width", visibleButtonsWidth());
					devPrint("Available space", availableSpace());
					devPrint("First hidden", getFirstHiddenElementWidth());
				}
				// End Development info
			};

			/*
             * init
             */
            // Auto arrange buttons
			if (s.autoArrangeButtons) {
				var tempVisible = [];
				$($visibleButtons().get().reverse()).each(function( index ){
					if ($(this).hasClass('always-visible')) {
						tempVisible.push($(this));
						$(this).remove();
					}
				});
				for (var i = 0; i < tempVisible.length; i++ ) {
					$container.prepend(tempVisible[i]);
				}
			}
            // Hide buttons marked as 'always-dropdown'.
            var elemAlwaysInDropdown;
            $( $visibleButtons().get().reverse() ).each(function( index ) {
                elemAlwaysInDropdown = ( $(this).hasClass('always-dropdown') || $(this).find('.always-dropdown').length > 0 );
                if ( elemAlwaysInDropdown ) {
                    s.addToDropdown( $(this) ).prependTo(dropdownMenu);
                }
            });

			$(document).ready(function(){
				arrangeButtons();
			});

			$( window ).resize(function() {
				arrangeButtons();
			});
			return this;
        });
    };
}(jQuery));
