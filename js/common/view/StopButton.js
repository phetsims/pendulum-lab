// Copyright 2017-2019, University of Colorado Boulder

/**
 * Stop button node in 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  const RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  const StopSignNode = require( 'SCENERY_PHET/StopSignNode' );

  /**
   * @constructor
   *
   * @param {Object} [options]
   */
  function StopButton( options ) {
    RectangularPushButton.call( this, merge( {
      xMargin: 7,
      yMargin: 3,
      touchAreaXDilation: 6,
      touchAreaYDilation: 6,
      baseColor: 'rgb( 231, 232, 233 )',
      content: new StopSignNode( {
        scale: 0.4
      } )
    }, options ) );
  }

  pendulumLab.register( 'StopButton', StopButton );

  return inherit( RectangularPushButton, StopButton );
} );
