// Copyright 2014-2015, University of Colorado Boulder

/**
 * Energy graph node in 'Pendulum Lab' simulation.
 * Contains graphs for Kinetic, Potential, Thermal, Total energy and zoom buttons.
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
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var SingleEnergyGraphNode = require( 'PENDULUM_LAB/energy/view/SingleEnergyGraphNode' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var ZoomButton = require( 'SCENERY_PHET/buttons/ZoomButton' );

  // strings
  var energyGraphString = require( 'string!PENDULUM_LAB/energyGraph' );

  // constants
  var FONT = new PhetFont( 11 );
  var GRAPH_WIDTH = 120;
  var MAGNIFYING_GLASS_RADIUS = 7;
  var SINGLE_GRAPH_SIZE = new Dimension2( 80, 225 );
  var RADIO_BUTTON_OPTIONS = {
    radius: 9,
    xSpacing: 3
  };

  /**
   * @param {Array.<Pendulum>} pendulums - Array of pendulum models.
   * @param {Property<boolean>} isEnergyGraphExpandedProperty - Property to track energy graphs visibility.
   * @param {Property<string>} energyGraphModeProperty - Property to select mode of energy graph representation
   * @param {Property<string>} numberOfPendulumsProperty - Property to control number of pendulums.
   * @param {Object} [options]
   * @constructor
   */
  function EnergyGraphNode( pendulums, isEnergyGraphExpandedProperty, energyGraphModeProperty, numberOfPendulumsProperty, options ) {
    var self = this;
    var graphStorage = [];

    // create energy graphs for each pendulum
    this._content = new VBox( { align: 'center', resize: false } );
    pendulums.forEach( function( pendulum, pendulumIndex ) {
      var graphNode = new SingleEnergyGraphNode( pendulum, isEnergyGraphExpandedProperty, pendulumIndex + 1, SINGLE_GRAPH_SIZE );
      self._content.addChild( new HBox( {
        children: [
          new HStrut( (GRAPH_WIDTH - graphNode.width) / 2 ),
          graphNode,
          new HStrut( (GRAPH_WIDTH - graphNode.width) / 2 )
        ]
      } ) );
      graphStorage[ pendulumIndex ] = graphNode;
    } );

    // create radio buttons for switching energy graph mode
    var radioButtonOne = new AquaRadioButton(
      energyGraphModeProperty,
      EnergyGraphMode.ONE,
      new Text( '1', { font: FONT } ),
      RADIO_BUTTON_OPTIONS );

    var radioButtonTwo = new AquaRadioButton(
      energyGraphModeProperty,
      EnergyGraphMode.TWO,
      new Text( '2', { font: FONT } ),
      RADIO_BUTTON_OPTIONS );
    radioButtonTwo.setEnabled = setEnabledRadioButton.bind( radioButtonTwo );

    // create zoom buttons
    var zoomOutButton = new ZoomButton( {
      baseColor: PendulumLabConstants.PANEL_BACKGROUND_COLOR,
      in: false,
      listener: function() {
        if ( energyGraphModeProperty.value === EnergyGraphMode.ONE ) {
          graphStorage[ 0 ].zoomOut();
        }
        else if ( energyGraphModeProperty.value === EnergyGraphMode.TWO ) {
          graphStorage[ 1 ].zoomOut();
        }
      },
      radius: MAGNIFYING_GLASS_RADIUS
    } );

    var zoomInButton = new ZoomButton( {
      baseColor: PendulumLabConstants.PANEL_BACKGROUND_COLOR,
      in: true,
      listener: function() {
        if ( energyGraphModeProperty.value === EnergyGraphMode.ONE ) {
          graphStorage[ 0 ].zoomIn();
        }
        else if ( energyGraphModeProperty.value === EnergyGraphMode.TWO ) {
          graphStorage[ 1 ].zoomIn();
        }
      },
      radius: MAGNIFYING_GLASS_RADIUS
    } );

    // add accordion box
    AccordionBox.call( this, new VBox( {
        spacing: 5, resize: false, children: [
          new HBox( { spacing: 20, children: [ radioButtonOne, radioButtonTwo ] } ),
          new Panel( this._content, { resize: false, pickable: false } ),
          new HBox( { spacing: 20, children: [ zoomOutButton, zoomInButton ] } )
        ]
      } ),
      _.extend( {
        expandedProperty: isEnergyGraphExpandedProperty,
        cornerRadius: PendulumLabConstants.PANEL_CORNER_RADIUS,
        fill: PendulumLabConstants.PANEL_BACKGROUND_COLOR,
        buttonXMargin: 10,
        buttonYMargin: 6,
        titleNode: new Text( energyGraphString, { font: FONT } ),
        titleAlignX: 'left',
        titleXMargin: 10,
        contentXMargin: 5,
        contentYMargin: 5,
        contentYSpacing: 0
      }, options ) );

    numberOfPendulumsProperty.link( function( numberOfPendulums ) {
      if ( numberOfPendulums === 1 ) {
        energyGraphModeProperty.value = EnergyGraphMode.ONE;
        radioButtonTwo.setEnabled( false );
      }
      else if ( numberOfPendulums === 2 ) {
        radioButtonTwo.setEnabled( true );
      }
    } );

    energyGraphModeProperty.link( function( energyGraphMode ) {
      if ( energyGraphMode === EnergyGraphMode.ONE ) {
        graphStorage[ 0 ].show();
        graphStorage[ 1 ].hide();
      }
      else if ( energyGraphMode === EnergyGraphMode.TWO ) {
        graphStorage[ 0 ].hide();
        graphStorage[ 1 ].show();
      }
    } );
  }

  var setEnabledRadioButton = function( enabled ) {
    if ( enabled ) {
      this.opacity = 1;
      this.pickable = true;
    }
    else {
      this.opacity = 0.5; // gray out when disabled
      this.pickable = false;
    }
  };

  return inherit( AccordionBox, EnergyGraphNode );
} );