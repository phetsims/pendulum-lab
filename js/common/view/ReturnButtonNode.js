// Copyright 2014-2015, University of Colorado Boulder

/**
 * Return button node in 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var TextPushButton = require( 'SUN/buttons/TextPushButton' );

  // strings
  var returnString = require( 'string!PENDULUM_LAB/return' );

  /**
   * @constructor
   *
   * @param {Object} [options]
   */
  function ReturnButtonNode( options ) {
    TextPushButton.call( this, returnString, _.extend( {
      font: new PhetFont( 12 ),
      baseColor: 'rgb( 231, 232, 233 )',
      touchAreaXDilation: 10,
      touchAreaYDilation: 6
    }, options ) );
  }

  pendulumLab.register( 'ReturnButtonNode', ReturnButtonNode );

  return inherit( TextPushButton, ReturnButtonNode );
} );
