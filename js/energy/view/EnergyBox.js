// Copyright 2014-2015, University of Colorado Boulder

/**
 * Contains the energy plot, along with the associated controls.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var AccordionBox = require( 'SUN/AccordionBox' );
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var DynamicProperty = require( 'AXON/DynamicProperty' );
  var EnergyGraphMode = require( 'PENDULUM_LAB/energy/EnergyGraphMode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var Property = require( 'AXON/Property' );
  var EnergyBarChartNode = require( 'PENDULUM_LAB/energy/view/EnergyBarChartNode' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var ZoomButton = require( 'SCENERY_PHET/buttons/ZoomButton' );

  // strings
  var energyGraphString = require( 'string!PENDULUM_LAB/energyGraph' );
  var patternEnergyOf0PendulumNumberString = require( 'string!PENDULUM_LAB/pattern.energyOf.0pendulumNumber' );

  // constants
  var GRAPH_WIDTH = PendulumLabConstants.LEFT_PANELS_MIN_WIDTH;

  /**
   * @constructor
   *
   * @param {EnergyModel} model
   * @param {number} energyGraphHeight - Height tuned number for the energy graph
   * @param {Object} [options]
   */
  function EnergyBox( model, energyGraphHeight, options ) {
    var headerText = new Text( '', {
      font: PendulumLabConstants.ENERGY_HEADER_FONT,
      maxWidth: 122
    } );

    model.energyGraphModeProperty.link( function( energyGraphMode ) {
      var index = energyGraphMode === EnergyGraphMode.ONE ? 0 : 1;
      headerText.text = StringUtils.format( patternEnergyOf0PendulumNumberString, '' + ( index + 1 ) );
      headerText.fill = model.pendula[ index ].color;
    } );

    // TODO: This should probably be in the model (or at least the index?)
    var activePendulum = new DerivedProperty( [ model.energyGraphModeProperty ], function( energyGraphMode ) {
      return model.pendula[ energyGraphMode === EnergyGraphMode.ONE ? 0 : 1 ];
    } );

    var kineticEnergyProperty = new DynamicProperty( activePendulum, { derive: 'kineticEnergyProperty' } );
    var potentialEnergyProperty = new DynamicProperty( activePendulum, { derive: 'potentialEnergyProperty' } );
    var thermalEnergyProperty = new DynamicProperty( activePendulum, {
      bidirectional: true,
      derive: 'thermalEnergyProperty'
    } );

    var graphNode = new EnergyBarChartNode( kineticEnergyProperty, potentialEnergyProperty, thermalEnergyProperty, model.energyZoomProperty, model.isEnergyGraphExpandedProperty, new Property( energyGraphHeight ) );
    var content = new VBox( {
      spacing: 4,
      children: [
        headerText,
        graphNode
      ]
    } );

    function createRadioButton( value, labelString ) {
      var label = new Text( labelString, {
        font: PendulumLabConstants.TITLE_FONT
      } );
      var button = new AquaRadioButton( model.energyGraphModeProperty, value, label, {
        radius: label.height / 2.2,
        xSpacing: 3
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

    var zoomOutButton = createZoomButton( false );
    var zoomInButton = createZoomButton( true );

    // add accordion box
    AccordionBox.call( this, new VBox( {
      spacing: 5, children: [
        new HBox( {
          spacing: 20,
          children: [
            radioButtonOne,
            radioButtonTwo
          ]
        } ),
        new Panel( content, {
          cornerRadius: PendulumLabConstants.PANEL_CORNER_RADIUS
        } ),
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
        font: PendulumLabConstants.TITLE_FONT,
        maxWidth: GRAPH_WIDTH * 0.90
      } ),
      titleAlignX: 'left',
      titleXMargin: 10,
      contentXMargin: 5,
      contentYMargin: 5,
      contentYSpacing: 0
    }, options ) );
  }

  pendulumLab.register( 'EnergyBox', EnergyBox );

  return inherit( AccordionBox, EnergyBox );
} );
