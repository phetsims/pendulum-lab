// Copyright 2014-2018, University of Colorado Boulder

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
  var BarChartNode = require( 'GRIDDLE/BarChartNode' );
  var ColorConstants = require( 'SUN/ColorConstants' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var DynamicProperty = require( 'AXON/DynamicProperty' );
  var EnergyLegendDialog = require( 'PENDULUM_LAB/energy/view/EnergyLegendDialog' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var InfoButton = require( 'SCENERY_PHET/buttons/InfoButton' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MoveToTrashButton = require( 'SCENERY_PHET/MoveToTrashButton' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var Range = require( 'DOT/Range' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var ZoomButton = require( 'SCENERY_PHET/buttons/ZoomButton' );

  // strings
  var energyGraphString = require( 'string!PENDULUM_LAB/energyGraph' );
  var legendKineticEnergyAbbreviationString = require( 'string!PENDULUM_LAB/legend.kineticEnergyAbbreviation' );
  var legendPotentialEnergyAbbreviationString = require( 'string!PENDULUM_LAB/legend.potentialEnergyAbbreviation' );
  var legendThermalEnergyAbbreviationString = require( 'string!PENDULUM_LAB/legend.thermalEnergyAbbreviation' );
  var legendTotalEnergyAbbreviationString = require( 'string!PENDULUM_LAB/legend.totalEnergyAbbreviation' );
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

    var clearThermalButton = new MoveToTrashButton( {
      arrowColor: PendulumLabConstants.THERMAL_ENERGY_COLOR,
      listener: thermalEnergyProperty.reset.bind( thermalEnergyProperty ),
      scale: 0.72
    } );
    thermalEnergyProperty.link( function( thermalEnergy ) {
      clearThermalButton.enabled = thermalEnergy !== 0;
    } );

    var chartRangeProperty = new DerivedProperty( [ chartHeightProperty ], function( chartHeight ) {
      return new Range( 0, chartHeight );
    } );
    var kineticBarEntry = { property: kineticEnergyProperty, color: PendulumLabConstants.KINETIC_ENERGY_COLOR };
    var potentialBarEntry = { property: potentialEnergyProperty, color: PendulumLabConstants.POTENTIAL_ENERGY_COLOR };
    var thermalBarEntry = { property: thermalEnergyProperty, color: PendulumLabConstants.THERMAL_ENERGY_COLOR };
    var barChartNode = new BarChartNode( [
      {
        entries: [ kineticBarEntry ],
        labelString: legendKineticEnergyAbbreviationString
      },
      {
        entries: [ potentialBarEntry ],
        labelString: legendPotentialEnergyAbbreviationString
      },
      {
        entries: [ thermalBarEntry ],
        labelString: legendThermalEnergyAbbreviationString,
        labelNode: clearThermalButton
      },
      {
        entries: [ kineticBarEntry, potentialBarEntry, thermalBarEntry ],
        labelString: legendTotalEnergyAbbreviationString,
        offScaleArrowFill: '#bbb'
      }
    ], chartRangeProperty, {
      barOptions: {
        // Apply a scaling correction (so that energyZoomProperty=1 corresponds to 40 * the actual energy amount)
        scaleProperty: new DerivedProperty( [ model.energyZoomProperty ], function( energyZoom ) { return 40 * energyZoom; } )
      }
    } );

    function barChartUpdate() {
      if ( model.isEnergyBoxExpandedProperty.value ) {
        barChartNode.update();
      }
    }

    kineticEnergyProperty.lazyLink( barChartUpdate );
    potentialEnergyProperty.lazyLink( barChartUpdate );
    thermalEnergyProperty.lazyLink( barChartUpdate );
    model.energyZoomProperty.lazyLink( barChartUpdate );
    chartRangeProperty.lazyLink( barChartUpdate );
    model.isEnergyBoxExpandedProperty.lazyLink( barChartUpdate );
    barChartUpdate();

    var content = new VBox( {
      spacing: 4,
      children: [
        headerText,
        barChartNode
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
        baseColor: ColorConstants.LIGHT_BLUE,
        radius: 7,
        touchAreaXDilation: 5,
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

    var energyDialog; // lazily created

    var infoButton = new InfoButton( {
      iconFill: 'rgb( 41, 106, 163 )',
      maxHeight: 1.1 * zoomInButton.height,
      left: panel.left,
      centerY: zoomOutButton.centerY,
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

    var radioButtonBox = new HBox( {
      spacing: 20,
      children: [
        radioButtonOne,
        radioButtonTwo
      ]
    } );

    // no need to unlink, present for the lifetime of the sim
    model.numberOfPendulaProperty.link( function( numberOfPendula ) {
      radioButtonBox.visible = numberOfPendula === 2;
    } );

    var boxContent = new VBox( {
      spacing: 5,
      children: [
        radioButtonBox,
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
        } )
      ]
    } );

    // add accordion box
    AccordionBox.call( this, new AlignBox( boxContent, { group: PendulumLabConstants.LEFT_CONTENT_ALIGN_GROUP } ), options );
  }

  pendulumLab.register( 'EnergyBox', EnergyBox );

  return inherit( AccordionBox, EnergyBox );
} );
