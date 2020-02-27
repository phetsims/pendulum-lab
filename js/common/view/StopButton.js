// Copyright 2017-2019, University of Colorado Boulder

/**
 * Stop button node in 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import StopSignNode from '../../../../scenery-phet/js/StopSignNode.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import pendulumLab from '../../pendulumLab.js';

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

inherit( RectangularPushButton, StopButton );
export default StopButton;