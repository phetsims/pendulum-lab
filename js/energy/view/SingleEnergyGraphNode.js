// Copyright 2002-2014, University of Colorado Boulder

/**
 * Energy graph node in 'Pendulum Lab' simulation.
 * Contains graphs for Kinetic, Potential, Thermal and Total energy.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var KineticString = require( 'string!PENDULUM_LAB/kinetic' );
  var pattern_energyOf_0pendulumNumber = require( 'string!PENDULUM_LAB/pattern.energyOf.0pendulumNumber' );
  var PotentialString = require( 'string!PENDULUM_LAB/potential' );
  var ThermalString = require( 'string!PENDULUM_LAB/thermal' );
  var TotalString = require( 'string!PENDULUM_LAB/total' );

  // constants
  var FONT = new PhetFont( 11 );

  /**
   * {Property} energyGraphModeProperty - Property to select mode of energy graph representation
   * {Object} options
   * @constructor
   */
  function SingleEnergyGraphNode() {
    Node.call( this );

    this.addChild( new Rectangle( 0, 0, 58, 150 ) );
  }

  return inherit( Node, SingleEnergyGraphNode );
} );