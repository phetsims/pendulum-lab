// Copyright 2014-2015, University of Colorado Boulder

/**
 * Return button node in 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var TextPushButton = require( 'SUN/buttons/TextPushButton' );

  // strings
  var returnString = require( 'string!PENDULUM_LAB/return' );

  // constants
  var FONT = new PhetFont( 12 );

  /**
   * Constructor for return button
   *
   * @param {Object} [options]
   * @constructor
   */
  function ReturnButtonNode( options ) {
    TextPushButton.call( this, returnString, _.extend( {
      font: FONT,
      baseColor: 'rgb( 231, 232, 233 )',
      touchAreaXDilation: 10,
      touchAreaYDilation: 10
    }, options ) );
  }

  pendulumLab.register( 'ReturnButtonNode', ReturnButtonNode );

  return inherit( TextPushButton, ReturnButtonNode );
} );
