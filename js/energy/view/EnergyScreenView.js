// Copyright 2014-2015, University of Colorado Boulder

/**
 * Main view node for Energy screen in 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var EnergyBox = require( 'PENDULUM_LAB/energy/view/EnergyBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var PendulumLabScreenView = require( 'PENDULUM_LAB/common/view/PendulumLabScreenView' );

  /**
   * @constructor
   *
   * @param {PendulumLabModel} model
   * @param {number} energyGraphHeight - Height tuned number for the energy graph
   */
  function EnergyScreenView( model, energyGraphHeight, options ) {

    PendulumLabScreenView.call( this, model, options );

    // create and add energy graph node to the bottom layer
    var energyGraphNode = new EnergyBox( model, energyGraphHeight, {
      left: this.layoutBounds.left + PendulumLabConstants.PANEL_PADDING,
      top: this.layoutBounds.top + PendulumLabConstants.PANEL_PADDING
    } );
    this.energyGraphLayer.addChild( energyGraphNode );

    // @public {EnergyBox} TODO check if protected is OK
    this.energyGraphNode = energyGraphNode;

    // move ruler and stopwatch to the right side
    this.rulerNode.centerX += ( energyGraphNode.width + 10 );
    model.ruler.setInitialLocationValue( this.rulerNode.center );

    this.stopwatchNode.left = this.rulerNode.right + 10;
    model.stopwatch.setInitialLocationValue( this.stopwatchNode.center );
  }

  pendulumLab.register( 'EnergyScreenView', EnergyScreenView );

  return inherit( PendulumLabScreenView, EnergyScreenView );
} );
