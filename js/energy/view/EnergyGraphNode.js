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
  var Dimension2 = require( 'DOT/Dimension2' );
  var EnergyGraphMode = require( 'PENDULUM_LAB/energy/EnergyGraphMode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var SingleEnergyGraphNode = require( 'PENDULUM_LAB/energy/view/SingleEnergyGraphNode' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var BothString = require( 'string!PENDULUM_LAB/both' );
  var EnergyGraphString = require( 'string!PENDULUM_LAB/energyGraph' );

  // constants
  var FONT = new PhetFont( 11 );
  var SINGLE_GRAPH_SIZE = new Dimension2( 66, 210 );
  var RADIO_BUTTON_OPTIONS = {
    radius: 9,
    xSpacing: 3
  };

  /**
   * @param {Array} pendulumModels - Pendulum models.
   * @param {Property} energyGraphModeProperty - Property to select mode of energy graph representation
   * @param {Object} options
   * @constructor
   */
  function EnergyGraphNode( pendulumModels, energyGraphModeProperty, options ) {
    var self = this;

    // create energy graphs for each pendulum
    this._content = new HBox();
    pendulumModels.forEach( function( pendulumModel, pendulumNumber ) {
      self._content.addChild( new SingleEnergyGraphNode( pendulumModel, pendulumNumber + 1, SINGLE_GRAPH_SIZE ) );
    } );

    // add accordion box
    AccordionBox.call( this, new VBox( {
        spacing: 5, resize: false, children: [
          // radio buttons for switching energy graph mode
          new HBox( {
            spacing: 10, children: [
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
            ]
          } ),
          new Panel( this._content )
        ]
      } ),
      _.extend( {
        cornerRadius: PendulumLabConstants.PANEL_CORNER_RADIUS,
        fill: PendulumLabConstants.PANEL_BACKGROUND_COLOR,

        buttonXMargin: 10,
        buttonYMargin: 6,

        titleNode: new Text( EnergyGraphString, {font: FONT} ),
        titleXMargin: 0,

        contentXMargin: 5,
        contentYMargin: 5
      }, options ) );

    energyGraphModeProperty.link( function( energyGraphMode ) {
      var graphOne = self._content.getChildAt( 0 ),
        graphTwo = self._content.getChildAt( 1 );

      if ( energyGraphMode === EnergyGraphMode.ONE ) {
        graphOne.show();
        graphTwo.hide();

        //graphOne.setWidth( SINGLE_GRAPH_SIZE.width * 2 );
      }
      else if ( energyGraphMode === EnergyGraphMode.TWO ) {
        graphOne.hide();
        graphTwo.show();

        //graphTwo.setWidth( SINGLE_GRAPH_SIZE.width * 2 );
      }
      else if ( energyGraphMode === EnergyGraphMode.BOTH ) {
        graphOne.show();
        graphTwo.show();

        //graphOne.setWidth( SINGLE_GRAPH_SIZE.width );
        //graphTwo.setWidth( SINGLE_GRAPH_SIZE.width );
      }
    } );
  }

  return inherit( AccordionBox, EnergyGraphNode );
} );