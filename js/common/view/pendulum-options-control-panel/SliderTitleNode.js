// Copyright 2002-2014, University of Colorado Boulder

/**
 * Title node with text for sliders in pendulum options control panel.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );

  // constants
  var FONT_TITLE = new PhetFont( {size: 11, weight: 'bold'} );

  /**
   * Constructor for the sliders title
   * @param {string} text of slider title
   * @param {Object} options
   * @constructor
   */
  function SliderTitleNode( text, options ) {
    Text.call( this, text, _.extend( {
      font: FONT_TITLE
    }, options ) );
  }

  return inherit( Text, SliderTitleNode );
} );
