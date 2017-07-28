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
  var NumberProperty = require( 'AXON/NumberProperty' );
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var PendulumLabScreenView = require( 'PENDULUM_LAB/common/view/PendulumLabScreenView' );

  /**
   * @constructor
   *
   * @param {PendulumLabModel} model
   */
  function EnergyScreenView( model, options ) {

    PendulumLabScreenView.call( this, model, options );

    // @protected {Property.<number>}
    this.chartHeightProperty = new NumberProperty( 200 );

    // create and add energy graph node to the bottom layer
    var energyGraphNode = new EnergyBox( model, this.chartHeightProperty, {
      left: this.layoutBounds.left + PendulumLabConstants.PANEL_PADDING,
      top: this.layoutBounds.top + PendulumLabConstants.PANEL_PADDING
    } );
    this.energyGraphLayer.addChild( energyGraphNode );

    // @protected {EnergyBox}
    this.energyGraphNode = energyGraphNode;

    // move ruler and stopwatch to the right side
    this.rulerNode.centerX += ( energyGraphNode.width + 10 );
    model.ruler.setInitialLocationValue( this.rulerNode.center );

    this.stopwatchNode.left = this.rulerNode.right + 10;
    model.stopwatch.setInitialLocationValue( this.stopwatchNode.center );

    this.resizeEnergyGraphToFit();
  }

  pendulumLab.register( 'EnergyScreenView', EnergyScreenView );

  return inherit( PendulumLabScreenView, EnergyScreenView, {
    /**
     * Changes the chart height so that the energy graph fits all available size
     * @protected
     */
    resizeEnergyGraphToFit: function() {
      var currentSpace = this.toolsControlPanelNode.top - this.energyGraphNode.bottom;
      var desiredSpace = PendulumLabConstants.PANEL_PADDING;

      this.chartHeightProperty.value += currentSpace - desiredSpace;
    }
  } );
} );
