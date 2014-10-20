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
  var AccordionBox = require( 'SUN/AccordionBox' );
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var EnergyGraphMode = require( 'PENDULUM_LAB/energy/EnergyGraphMode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var SingleEnergyGraphNode = require( 'PENDULUM_LAB/energy/view/SingleEnergyGraphNode' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var BothString = require( 'string!PENDULUM_LAB/both' );
  var EnergyGraphString = require( 'string!PENDULUM_LAB/energyGraph' );

  // constants
  var FONT = new PhetFont( 11 );
  var RADIO_BUTTON_OPTIONS = {
    radius: 9,
    xSpacing: 3
  };

  /**
   * {Property} energyGraphModeProperty - Property to select mode of energy graph representation
   * {Object} options
   * @constructor
   */
  function EnergyGraphNode( energyGraphModeProperty, options ) {
    AccordionBox.call( this, new VBox( {spacing: 5, children: [
        // radio buttons for switching energy graph mode
        new HBox( { spacing: 13, children: [
          new AquaRadioButton(
            energyGraphModeProperty,
            EnergyGraphMode.ONE,
            new Text( '1', {font: FONT} ),
            RADIO_BUTTON_OPTIONS ),
          new AquaRadioButton(
            energyGraphModeProperty,
            EnergyGraphMode.TWO,
            new Text( '2', {font: FONT} ),
            RADIO_BUTTON_OPTIONS ),
          new AquaRadioButton(
            energyGraphModeProperty,
            EnergyGraphMode.BOTH,
            new Text( BothString, {font: FONT} ),
            RADIO_BUTTON_OPTIONS )
        ]} ),
        new Panel( new HBox( {children: [
          new SingleEnergyGraphNode(),
          new SingleEnergyGraphNode()
        ]} ) )
      ]} ),
      _.extend( {
        cornerRadius: PendulumLabConstants.PANEL_CORNER_RADIUS,
        fill: PendulumLabConstants.PANEL_BACKGROUND_COLOR,

        buttonXMargin: 10,
        buttonYMargin: 6,

        titleNode: new Text( EnergyGraphString, {font: FONT} ),
        titleXMargin: 0,

        contentXMargin: 8,
        contentYMargin: 5
      }, options ) );
  }

  return inherit( AccordionBox, EnergyGraphNode );
} );