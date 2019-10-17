// Copyright 2014-2019, University of Colorado Boulder

/**
 * Contains the energy plot, along with the associated controls.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( require => {
  'use strict';

  // modules
  const AccordionBox = require( 'SUN/AccordionBox' );
  const AlignBox = require( 'SCENERY/nodes/AlignBox' );
  const AquaRadioButton = require( 'SUN/AquaRadioButton' );
  const BarChartNode = require( 'GRIDDLE/BarChartNode' );
  const ColorConstants = require( 'SUN/ColorConstants' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const DynamicProperty = require( 'AXON/DynamicProperty' );
  const EnergyLegendDialog = require( 'PENDULUM_LAB/energy/view/EnergyLegendDialog' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const InfoButton = require( 'SCENERY_PHET/buttons/InfoButton' );
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const MoveToTrashButton = require( 'SCENERY_PHET/MoveToTrashButton' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Panel = require( 'SUN/Panel' );
  const pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  const PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  const Range = require( 'DOT/Range' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const ZoomButton = require( 'SCENERY_PHET/buttons/ZoomButton' );

  // strings
  const energyGraphString = require( 'string!PENDULUM_LAB/energyGraph' );
  const legendKineticEnergyAbbreviationString = require( 'string!PENDULUM_LAB/legend.kineticEnergyAbbreviation' );
  const legendPotentialEnergyAbbreviationString = require( 'string!PENDULUM_LAB/legend.potentialEnergyAbbreviation' );
  const legendThermalEnergyAbbreviationString = require( 'string!PENDULUM_LAB/legend.thermalEnergyAbbreviation' );
  const legendTotalEnergyAbbreviationString = require( 'string!PENDULUM_LAB/legend.totalEnergyAbbreviation' );
  const pendulumMassPatternString = require( 'string!PENDULUM_LAB/pendulumMassPattern' );


  /**
   * @constructor
   *
   * @param {EnergyModel} model
   * @param {Property.<number>} chartHeightProperty
   * @param {Object} [options]
   */
  function EnergyBox( model, chartHeightProperty, options ) {
    options = merge( {}, PendulumLabConstants.BOX_OPTIONS, {
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

    const headerText = new Text( '', {
      font: PendulumLabConstants.ENERGY_HEADER_FONT,
      maxWidth: 122
    } );

    model.activeEnergyPendulumProperty.link( function( pendulum ) {
      headerText.text = StringUtils.fillIn( pendulumMassPatternString, {
        pendulumNumber: '' + ( pendulum.index + 1 )
      } );
      headerText.fill = pendulum.color;
    } );

    const kineticEnergyProperty = new DynamicProperty( model.activeEnergyPendulumProperty, { derive: 'kineticEnergyProperty' } );
    const potentialEnergyProperty = new DynamicProperty( model.activeEnergyPendulumProperty, { derive: 'potentialEnergyProperty' } );
    const thermalEnergyProperty = new DynamicProperty( model.activeEnergyPendulumProperty, {
      bidirectional: true,
      derive: 'thermalEnergyProperty'
    } );

    const clearThermalButton = new MoveToTrashButton( {
      arrowColor: PendulumLabConstants.THERMAL_ENERGY_COLOR,
      listener: thermalEnergyProperty.reset.bind( thermalEnergyProperty ),
      scale: 0.72
    } );
    thermalEnergyProperty.link( function( thermalEnergy ) {
      clearThermalButton.enabled = thermalEnergy !== 0;
    } );

    const chartRangeProperty = new DerivedProperty( [ chartHeightProperty ], function( chartHeight ) {
      return new Range( 0, chartHeight );
    } );
    const kineticBarEntry = { property: kineticEnergyProperty, color: PendulumLabConstants.KINETIC_ENERGY_COLOR };
    const potentialBarEntry = { property: potentialEnergyProperty, color: PendulumLabConstants.POTENTIAL_ENERGY_COLOR };
    const thermalBarEntry = { property: thermalEnergyProperty, color: PendulumLabConstants.THERMAL_ENERGY_COLOR };
    const barChartNode = new BarChartNode( [
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

    const content = new VBox( {
      spacing: 4,
      children: [
        headerText,
        barChartNode
      ]
    } );

    function createRadioButton( pendulum ) {
      const label = new Text( pendulum.index + 1, {
        font: PendulumLabConstants.TITLE_FONT
      } );
      const button = new AquaRadioButton( model.activeEnergyPendulumProperty, pendulum, label, {
        radius: label.height / 2.2,
        xSpacing: 3
      } );
      button.touchArea = button.localBounds.dilatedXY( 10, 5 );
      return button;
    }

    function createZoomButton( isIn ) {
      return new ZoomButton( merge( {
        in: isIn,
        listener: function() {
          const zoomMultiplier = 1.3;
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

    const radioButtonOne = createRadioButton( model.pendula[ 0 ] );
    const radioButtonTwo = createRadioButton( model.pendula[ 1 ] );

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

    const panel = new Panel( content, {
      cornerRadius: PendulumLabConstants.PANEL_CORNER_RADIUS
    } );

    const zoomOutButton = createZoomButton( false );
    const zoomInButton = createZoomButton( true );

    let energyDialog; // lazily created

    const infoButton = new InfoButton( {
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

    const radioButtonBox = new HBox( {
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

    const boxContent = new VBox( {
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
