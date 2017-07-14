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
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var SingleEnergyGraphNode = require( 'PENDULUM_LAB/energy/view/SingleEnergyGraphNode' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var ZoomButton = require( 'SCENERY_PHET/buttons/ZoomButton' );

  // strings
  var energyGraphString = require( 'string!PENDULUM_LAB/energyGraph' );

  // constants
  var GRAPH_WIDTH = PendulumLabConstants.LEFT_PANELS_MIN_WIDTH;

  /**
   * @constructor
   *
   * @param {EnergyModel} model
   * @param {number} energyGraphHeight - Height tuned number for the energy graph
   * @param {Object} [options]
   */
  function EnergyGraphNode( model, energyGraphHeight, options ) {
    var graphStorage = [];

    // create the energy graphs for each pendulum
    var content = new VBox( { align: 'center', resize: false } );
    model.pendula.forEach( function( pendulum, pendulumIndex ) {
      var graphNode = new SingleEnergyGraphNode( pendulum, model.energyZoomProperty, model.isEnergyGraphExpandedProperty, pendulumIndex + 1, new Dimension2( 80, energyGraphHeight ) );
      content.addChild( new HBox( {
        children: [
          new HStrut( ( GRAPH_WIDTH - graphNode.width ) / 2 ),
          graphNode,
          new HStrut( ( GRAPH_WIDTH - graphNode.width ) / 2 )
        ],
        resize: false
      } ) );
      graphStorage[ pendulumIndex ] = graphNode;
    } );

    function createRadioButton( value, labelString ) {
      var label = new Text( labelString, {
        font: new PhetFont( 16 )
      } );
      var button = new AquaRadioButton( model.energyGraphModeProperty, value, label, {
        radius: 9,
        xSpacing: 3,
        scale: 0.7
      } );
      button.touchArea = button.localBounds.dilatedXY( 15, 5 );
      return button;
    }

    function createZoomButton( isIn ) {
      return new ZoomButton( _.extend( {
        in: isIn,
        listener: function() {
          var zoomMultiplier = 1.3;
          if ( isIn ) {
            model.energyZoomProperty.value *= zoomMultiplier;
          }
          else {
            model.energyZoomProperty.value /= zoomMultiplier;
          }
        }
      }, {
        baseColor: '#eee',
        radius: 7,
        touchAreaXDilation: 10,
        touchAreaYDilation: 5
      } ) );
    }

    var radioButtonOne = createRadioButton( EnergyGraphMode.ONE, '1' );
    var radioButtonTwo = createRadioButton( EnergyGraphMode.TWO, '2' );

    var zoomOutButton = createZoomButton( false );
    var zoomInButton = createZoomButton( true );

    // add accordion box
    AccordionBox.call( this, new VBox( {
      spacing: 5, resize: false, children: [
        new HBox( {
          spacing: 20,
          children: [
            radioButtonOne,
            radioButtonTwo
          ]
        } ),
        new Panel( content, { resize: false } ),
        new HBox( {
          spacing: 20,
          children: [
            zoomOutButton,
            zoomInButton
          ]
        } )
      ]
    } ),
    _.extend( {
      expandedProperty: model.isEnergyGraphExpandedProperty,
      cornerRadius: PendulumLabConstants.PANEL_CORNER_RADIUS,
      fill: PendulumLabConstants.PANEL_BACKGROUND_COLOR,
      buttonXMargin: 10,
      buttonYMargin: 6,
      titleNode: new Text( energyGraphString, {
        font: new PhetFont( 11 ),
        maxWidth: GRAPH_WIDTH * 0.90
      } ),
      titleAlignX: 'left',
      titleXMargin: 10,
      contentXMargin: 5,
      contentYMargin: 5,
      contentYSpacing: 0
    }, options ) );

    // no need to unlink, present for the lifetime of the sim
    model.numberOfPendulaProperty.link( function( numberOfPendula ) {
      if ( numberOfPendula === 1 ) {
        model.energyGraphModeProperty.value = EnergyGraphMode.ONE;
        radioButtonTwo.setEnabled( false );
      }
      else if ( numberOfPendula === 2 ) {
        radioButtonTwo.setEnabled( true );
      }
    } );

    // no need to unlink, present for the lifetime of the sim
    model.energyGraphModeProperty.link( function( energyGraphMode ) {
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

  pendulumLab.register( 'EnergyGraphNode', EnergyGraphNode );

  return inherit( AccordionBox, EnergyGraphNode );
} );
