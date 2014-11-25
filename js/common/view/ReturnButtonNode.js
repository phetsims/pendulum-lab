// Copyright 2002-2014, University of Colorado Boulder

/**
 * Return button node in 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var TextPushButton = require( 'SUN/buttons/TextPushButton' );

  // strings
  var ReturnString = require( 'string!PENDULUM_LAB/return' );

  // constants
  var FONT = new PhetFont( 12 );

  function ReturnButtonNode( options ) {
    TextPushButton.call( this, ReturnString, _.extend( {font: FONT, baseColor: 'rgb( 231, 232, 233 )'}, options ) );
  }

  return inherit( TextPushButton, ReturnButtonNode );
} );
