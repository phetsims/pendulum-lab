// Copyright 2014-2015, University of Colorado Boulder

/**
 * Stop button node in 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var StopSignNode = require( 'SCENERY_PHET/StopSignNode' );

  /**
   * @constructor
   *
   * @param {Object} [options]
   */
  function StopButton( options ) {
    RectangularPushButton.call( this, _.extend( {
      xMargin: 7,
      yMargin: 3,
      touchAreaXDilation: 6,
      touchAreaYDilation: 6,
      baseColor: 'rgb( 231, 232, 233 )',
      content: new StopSignNode( {
        scale: 0.4
      } ),
    }, options ) );
  }

  pendulumLab.register( 'StopButton', StopButton );

  return inherit( RectangularPushButton, StopButton );
} );
