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
  var AlignBox = require( 'SCENERY/nodes/AlignBox' );
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var DynamicProperty = require( 'AXON/DynamicProperty' );
  var EnergyBarChartNode = require( 'PENDULUM_LAB/energy/view/EnergyBarChartNode' );
  var EnergyLegendDialog = require( 'PENDULUM_LAB/energy/view/EnergyLegendDialog' );
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var ZoomButton = require( 'SCENERY_PHET/buttons/ZoomButton' );

  // strings
  var energyGraphString = require( 'string!PENDULUM_LAB/energyGraph' );
  var pendulumMassPatternString = require( 'string!PENDULUM_LAB/pendulumMassPattern' );

  /**
   * @constructor
   *
   * @param {EnergyModel} model
   * @param {Property.<number>} chartHeightProperty
   * @param {Object} [options]
   */
  function EnergyBox( model, chartHeightProperty, options ) {
    options = _.extend( {}, PendulumLabConstants.BOX_OPTIONS, {
      expandedProperty: model.isEnergyBoxExpandedProperty,
      buttonXMargin: 10,
      buttonYMargin: 6,
      titleNode: new Text( energyGraphString, {
        font: PendulumLabConstants.TITLE_FONT,
        maxWidth: 110
      } ),
      titleAlignX: 'left',
      titleXMargin: 10,
      contentYSpacing: 0,
      resize: true
    }, options );

    var headerText = new Text( '', {
      font: PendulumLabConstants.ENERGY_HEADER_FONT,
      maxWidth: 122
    } );

    model.activeEnergyPendulumProperty.link( function( pendulum ) {
      headerText.text = StringUtils.fillIn( pendulumMassPatternString, {
        pendulumNumber: '' + ( pendulum.index + 1 )
      } );
      headerText.fill = pendulum.color;
    } );

    var kineticEnergyProperty = new DynamicProperty( model.activeEnergyPendulumProperty, { derive: 'kineticEnergyProperty' } );
    var potentialEnergyProperty = new DynamicProperty( model.activeEnergyPendulumProperty, { derive: 'potentialEnergyProperty' } );
    var thermalEnergyProperty = new DynamicProperty( model.activeEnergyPendulumProperty, {
      bidirectional: true,
      derive: 'thermalEnergyProperty'
    } );

    var graphNode = new EnergyBarChartNode( kineticEnergyProperty, potentialEnergyProperty, thermalEnergyProperty, model.energyZoomProperty, model.isEnergyBoxExpandedProperty, chartHeightProperty );
    var content = new VBox( {
      spacing: 4,
      children: [
        headerText,
        graphNode
      ]
    } );

    function createRadioButton( pendulum ) {
      var label = new Text( pendulum.index + 1, {
        font: PendulumLabConstants.TITLE_FONT
      } );
      var button = new AquaRadioButton( model.activeEnergyPendulumProperty, pendulum, label, {
        radius: label.height / 2.2,
        xSpacing: 3
      } );
      button.touchArea = button.localBounds.dilatedXY( 10, 5 );
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

    var radioButtonOne = createRadioButton( model.pendula[ 0 ] );
    var radioButtonTwo = createRadioButton( model.pendula[ 1 ] );

    // no need to unlink, present for the lifetime of the sim
    model.numberOfPendulaProperty.link( function( numberOfPendula ) {
      if ( numberOfPendula === 1 ) {
        model.activeEnergyPendulumProperty.value = model.pendula[ 0 ];
        radioButtonTwo.setEnabled( false );
      }
      else if ( numberOfPendula === 2 ) {
        radioButtonTwo.setEnabled( true );
      }
    } );

    var panel = new Panel( content, {
      cornerRadius: PendulumLabConstants.PANEL_CORNER_RADIUS
    } );

    var zoomOutButton = createZoomButton( false );
    var zoomInButton = createZoomButton( true );

    // Because zoom buttons don't support getting internal size, and other buttons don't resize, we need to do a
    // hacky workaround to get their content to be the same size.
    var chromeBounds = new RectangularPushButton( {
      content: new Node( { localBounds: new Bounds2( 0, 0, 0, 0 ) } )
    } ).bounds;
    var icon = new FontAwesomeNode( 'info_circle', {
      maxWidth: zoomInButton.width - chromeBounds.width,
      maxHeight: zoomInButton.height - chromeBounds.height
    } );

    var energyDialog; // lazily created
    var infoButton = new RectangularPushButton( {
      content: icon,
      baseColor: zoomOutButton.baseColor,
      left: panel.left,
      listener: function() {
        // Lazy creation.
        if ( !energyDialog ) {
          energyDialog = new EnergyLegendDialog();
        }
        energyDialog.show();
      },
      touchAreaXDilation: 10,
      touchAreaYDilation: 5
    } );

    var boxContent = new VBox( {
      spacing: 5,
      children: [
        new HBox( {
          spacing: 20,
          children: [
            radioButtonOne,
            radioButtonTwo
          ]
        } ),
        panel,
        new Node( {
          children: [
            infoButton,
            new HBox( {
              spacing: 10,
              children: [
                zoomOutButton,
                zoomInButton
              ],
              right: panel.right
            } )
          ]
        } ),
      ]
    } );

    // add accordion box
    AccordionBox.call( this, new AlignBox( boxContent, { group: PendulumLabConstants.LEFT_CONTENT_ALIGN_GROUP } ), options );
  }

  pendulumLab.register( 'EnergyBox', EnergyBox );

  return inherit( AccordionBox, EnergyBox );
} );
