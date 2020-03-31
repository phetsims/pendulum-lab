// Copyright 2014-2020, University of Colorado Boulder

/**
 * Body model for gravitational acceleration
 *
 * @author Andrey Zelenkov (Mlearner)
 */

import PhysicalConstants from '../../../../phet-core/js/PhysicalConstants.js';
import pendulumLabStrings from '../../pendulumLabStrings.js';
import pendulumLab from '../../pendulumLab.js';

const customString = pendulumLabStrings.custom;
const earthString = pendulumLabStrings.earth;
const jupiterString = pendulumLabStrings.jupiter;
const moonString = pendulumLabStrings.moon;
const planetXString = pendulumLabStrings.planetX;

/**
 * @constructor
 *
 * @param {string} title
 * @param {number|null} gravity - Gravitational acceleration on body (m/s^2) if defined.
 */
function Body( title, gravity ) {
  // @public {string} (read-only)
  this.title = title;

  // @public {number|null} (read-only) - Gravitation acceleration (if available) in meters/second^2
  this.gravity = gravity;
}

pendulumLab.register( 'Body', Body );

Body.MOON = new Body( moonString, 1.62 );
Body.EARTH = new Body( earthString, PhysicalConstants.GRAVITY_ON_EARTH );
Body.JUPITER = new Body( jupiterString, 24.79 );
Body.PLANET_X = new Body( planetXString, 14.2 );
Body.CUSTOM = new Body( customString, null );

// array of all the bodies used in the simulation.
Body.BODIES = [
  Body.MOON,
  Body.EARTH,
  Body.JUPITER,
  Body.PLANET_X,
  Body.CUSTOM
];

// verify that enumeration is immutable, without the runtime penalty in production code
if ( assert ) { Object.freeze( Body ); }

export default Body;