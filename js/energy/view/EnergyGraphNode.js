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
  var Line = require( 'SCENERY/nodes/Line' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var BothString = require( 'string!PENDULUM_LAB/both' );
  var EnergyGraphString = require( 'string!PENDULUM_LAB/energyGraph' );
  var OneString = require( 'string!PENDULUM_LAB/one' );
  var TwoString = require( 'string!PENDULUM_LAB/two' );

  // constants
  var FONT = new PhetFont( 11 );

  /**
   * {Property} energyGraphModeProperty - Property to select mode of energy graph representation
   * {Object} options
   * @constructor
   */
  function EnergyGraphNode( energyGraphModeProperty, options ) {
    AccordionBox.call( this, new VBox( {children: [
        new HBox( { spacing: 5, children: [
          new AquaRadioButton(
            energyGraphModeProperty,
            EnergyGraphMode.ONE,
            new Text( OneString, {font: FONT} ),
            {
              radius: PendulumLabConstants.RADIO_BUTTON_RADIUS,
              xSpacing: PendulumLabConstants.RADIO_BUTTON_X_SPACING
            } ),
          new AquaRadioButton(
            energyGraphModeProperty,
            EnergyGraphMode.TWO,
            new Text( TwoString, {font: FONT} ),
            {
              radius: PendulumLabConstants.RADIO_BUTTON_RADIUS,
              xSpacing: PendulumLabConstants.RADIO_BUTTON_X_SPACING
            } ),
          new AquaRadioButton(
            energyGraphModeProperty,
            EnergyGraphMode.BOTH,
            new Text( BothString, {font: FONT} ),
            {
              radius: PendulumLabConstants.RADIO_BUTTON_RADIUS,
              xSpacing: PendulumLabConstants.RADIO_BUTTON_X_SPACING
            } )
        ]} )
      ]} ),
      _.extend( {
        cornerRadius: PendulumLabConstants.PANEL_CORNER_RADIUS,
        fill: PendulumLabConstants.PANEL_BACKGROUND_COLOR,

        buttonXMargin: 10,
        buttonYMargin: 6,

        titleNode: new Text( EnergyGraphString, {font: FONT} ),
        titleXMargin: 0,

        contentXMargin: 8
      }, options ) );
  }

  return inherit( AccordionBox, EnergyGraphNode );
} );