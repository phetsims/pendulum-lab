// Copyright 2014-2020, University of Colorado Boulder

/**
 * Ruler model in 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (MLearner)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import pendulumLab from '../../pendulumLab.js';
import MovableComponent from './MovableComponent.js';

/**
 * @constructor
 *
 * @param {boolean} isInitiallyVisible
 */
function Ruler( isInitiallyVisible ) {
  MovableComponent.call( this, isInitiallyVisible );

  // @public (read-only) - Meters
  this.length = 1;
}

pendulumLab.register( 'Ruler', Ruler );

inherit( MovableComponent, Ruler );
export default Ruler;