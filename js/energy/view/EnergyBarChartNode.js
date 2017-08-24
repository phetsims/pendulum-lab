// Copyright 2014-2015, University of Colorado Boulder

/**
 * Single graph node in 'Pendulum Lab' simulation.
 * Contains graphs for Kinetic, Potential, Thermal and Total energy for one pendulum.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var ClearThermalButton = require( 'SCENERY_PHET/ClearThermalButton' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var Node = require( 'SCENERY/nodes/Node' );
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RichText = require( 'SCENERY/nodes/RichText' );

  // strings
  var legendKineticEnergyAbbreviationString = require( 'string!PENDULUM_LAB/legend.kineticEnergyAbbreviation' );
  var legendPotentialEnergyAbbreviationString = require( 'string!PENDULUM_LAB/legend.potentialEnergyAbbreviation' );
  var legendThermalEnergyAbbreviationString = require( 'string!PENDULUM_LAB/legend.thermalEnergyAbbreviation' );
  var legendTotalEnergyAbbreviationString = require( 'string!PENDULUM_LAB/legend.totalEnergyAbbreviation' );

  // constants
  var BAR_WIDTH = 14;
  var BAR_OFFSET = 4;
  var SPACING = 4;
  var GRAPH_WIDTH = 122;

  /**
   * @constructor
   *
   * @param {Property.<number>} kineticEnergyProperty
   * @param {Property.<number>} potentialEnergyProperty
   * @param {Property.<number>} thermalEnergyProperty
   * @param {Property.<number>} zoomProperty
   * @param {Property.<boolean>} isEnergyBoxExpandedProperty - Property which track expansion of graph.
   * @param {Property.<number>} chartHeightProperty
   */
  function EnergyBarChartNode( kineticEnergyProperty, potentialEnergyProperty, thermalEnergyProperty, zoomProperty, isEnergyBoxExpandedProperty, chartHeightProperty ) {

    // @private {Property.<number>}
    this.kineticEnergyProperty = kineticEnergyProperty;
    this.potentialEnergyProperty = potentialEnergyProperty;
    this.thermalEnergyProperty = thermalEnergyProperty;
    this.zoomProperty = zoomProperty;
    this.chartHeightProperty = chartHeightProperty;

    // @private {Property.<boolean>}
    this.isEnergyBoxExpandedProperty = isEnergyBoxExpandedProperty;

    var BAR_SPACING = GRAPH_WIDTH / 4 - BAR_WIDTH; // amount of space between bars (half on each side of each bar)

    // position of the bars of the energy bar graph
    var kineticCenterX = BAR_OFFSET + 0.5 * BAR_SPACING + 0 * BAR_WIDTH;
    var potentialCenterX = BAR_OFFSET + 1.5 * BAR_SPACING + 1 * BAR_WIDTH;
    var thermalCenterX = BAR_OFFSET + 2.5 * BAR_SPACING + 2 * BAR_WIDTH;
    var totalCenterX = BAR_OFFSET + 3.5 * BAR_SPACING + 3 * BAR_WIDTH;

    // labels for bars
    var barLabelOptions = {
      font: PendulumLabConstants.ENERGY_BAR_FONT,
      rotation: -Math.PI / 2,
      top: SPACING,
      maxWidth: 90
    };
    var kineticLabel = new RichText( legendKineticEnergyAbbreviationString, _.extend( { fill: PendulumLabConstants.KINETIC_ENERGY_COLOR, centerX: kineticCenterX }, barLabelOptions ) );
    var potentialLabel = new RichText( legendPotentialEnergyAbbreviationString, _.extend( { fill: PendulumLabConstants.POTENTIAL_ENERGY_COLOR, centerX: potentialCenterX }, barLabelOptions ) );
    var thermalLabel = new RichText( legendThermalEnergyAbbreviationString, _.extend( { fill: PendulumLabConstants.THERMAL_ENERGY_COLOR, centerX: thermalCenterX }, barLabelOptions ) );
    var totalLabel = new RichText( legendTotalEnergyAbbreviationString, _.extend( { fill: PendulumLabConstants.TOTAL_ENERGY_COLOR, centerX: totalCenterX }, barLabelOptions ) );

    // create 'x' and 'y' axis
    var axisX = new Line( 0, 0, GRAPH_WIDTH, 0, { stroke: 'black' } );
    var axisY = new ArrowNode( 0, 0, 0, chartHeightProperty.value, {
      tailWidth: 2,
      headHeight: 7,
      headWidth: 6
    } );
    chartHeightProperty.link( function( height ) {
      axisY.setTailAndTip( 0, 0, 0, height );
    } );

    // @private {Rectangle} - Individual energy bars
    this.kineticEnergyBar = new Rectangle( 0, 0, BAR_WIDTH, 0, {
      fill: PendulumLabConstants.KINETIC_ENERGY_COLOR,
      centerX: kineticCenterX,
      stroke: 'black'
    } );
    this.potentialEnergyBar = new Rectangle( 0, 0, BAR_WIDTH, 0, {
      fill: PendulumLabConstants.POTENTIAL_ENERGY_COLOR,
      centerX: potentialCenterX,
      stroke: 'black'
    } );
    this.thermalEnergyBar = new Rectangle( 0, 0, BAR_WIDTH, 0, {
      fill: PendulumLabConstants.THERMAL_ENERGY_COLOR,
      centerX: thermalCenterX,
      stroke: 'black'
    } );

    // @private {Rectangle} - For the combined total bar
    this.totalKineticEnergyBar = new Rectangle( 0, 0, BAR_WIDTH, 0, {
      fill: PendulumLabConstants.KINETIC_ENERGY_COLOR,
      centerX: totalCenterX
    } );
    this.totalPotentialEnergyBar = new Rectangle( 0, 0, BAR_WIDTH, 0, {
      fill: PendulumLabConstants.POTENTIAL_ENERGY_COLOR,
      centerX: totalCenterX
    } );
    this.totalThermalEnergyBar = new Rectangle( 0, 0, BAR_WIDTH, 0, {
      fill: PendulumLabConstants.THERMAL_ENERGY_COLOR,
      centerX: totalCenterX
    } );
    this.totalHighlightBar = new Rectangle( 0, 0, BAR_WIDTH, 0, {
      stroke: 'black',
      centerX: totalCenterX
    } );

    function createArrow( fill, centerX ) {
      return new ArrowNode( 0, 0, 0, 18, {
        fill: fill,
        stroke: 'black',
        headHeight: 7,
        headWidth: 16,
        tailWidth: 10,
        centerX: centerX
      } );
    }

    // @private {ArrowNode}
    this.kineticEnergyArrow = createArrow( PendulumLabConstants.KINETIC_ENERGY_COLOR, kineticCenterX );
    this.potentialEnergyArrow = createArrow( PendulumLabConstants.POTENTIAL_ENERGY_COLOR, potentialCenterX );
    this.thermalEnergyArrow = createArrow( PendulumLabConstants.THERMAL_ENERGY_COLOR, thermalCenterX );
    this.totalEnergyArrow = createArrow( '#bbb', totalCenterX );

    var clearThermalButton = new ClearThermalButton( {
      listener: thermalEnergyProperty.reset.bind( thermalEnergyProperty ),
      centerX: thermalCenterX,
      top: thermalLabel.bottom + 5,
      scale: 0.72
    } );
    thermalEnergyProperty.link( function( thermalEnergy ) {
      clearThermalButton.enabled = thermalEnergy !== 0;
    } );

    Node.call( this, {
      preventFit: true,
      children: [
        kineticLabel, potentialLabel, thermalLabel, totalLabel, clearThermalButton,
        new Node( {
          // flip the coordinate frame for easier positioning
          matrix: Matrix3.scale( 1, -1 ),
          children: [
            this.kineticEnergyBar, this.potentialEnergyBar, this.thermalEnergyBar,
            this.totalKineticEnergyBar, this.totalPotentialEnergyBar, this.totalThermalEnergyBar,
            this.totalHighlightBar,
            this.kineticEnergyArrow, this.potentialEnergyArrow, this.thermalEnergyArrow, this.totalEnergyArrow,
            axisX, axisY
          ]
        } )
      ]
    } );

    var updateListener = this.update.bind( this );
    kineticEnergyProperty.lazyLink( updateListener );
    potentialEnergyProperty.lazyLink( updateListener );
    thermalEnergyProperty.lazyLink( updateListener );
    zoomProperty.lazyLink( updateListener );
    chartHeightProperty.lazyLink( updateListener );
    isEnergyBoxExpandedProperty.lazyLink( updateListener );
    this.update();
  }

  pendulumLab.register( 'EnergyBarChartNode', EnergyBarChartNode );

  return inherit( Node, EnergyBarChartNode, {
    /**
     * Hide the bar graph
     * @public
     */
    hide: function() {
      this.visible = false;
    },

    /**
     * Show the bar graph and update its status
     * @public
     */
    show: function() {
      this.visible = true;
      this.update();
    },

    /**
     * Update the heights of the bar graph
     * @private
     */
    update: function() {
      if ( this.isEnergyBoxExpandedProperty.value && this.visible ) {
        var energyMultiplier = 40 * this.zoomProperty.value;
        var maxHeight = this.chartHeightProperty.value;

        var arrowPadding = 5;
        maxHeight -= arrowPadding + this.kineticEnergyArrow.height;

        var kineticEnergy = this.kineticEnergyProperty.value * energyMultiplier;
        var potentialEnergy = this.potentialEnergyProperty.value * energyMultiplier;
        var thermalEnergy = this.thermalEnergyProperty.value * energyMultiplier;

        // individual bars
        this.kineticEnergyBar.rectHeight = Math.min( maxHeight, kineticEnergy );
        this.potentialEnergyBar.rectHeight = Math.min( maxHeight, potentialEnergy );
        this.thermalEnergyBar.rectHeight = Math.min( maxHeight, thermalEnergy );

        // combined bar, thermal on bottom, then potential, then kinetic
        var thermalHeight = Math.min( maxHeight, thermalEnergy );
        var potentialAndThermalHeight = Math.min( maxHeight, thermalEnergy + potentialEnergy );
        var totalHeight = Math.min( maxHeight, potentialAndThermalHeight + kineticEnergy );
        this.totalThermalEnergyBar.rectHeight = thermalHeight;
        this.totalPotentialEnergyBar.rectY = thermalHeight;
        this.totalPotentialEnergyBar.rectHeight = potentialAndThermalHeight - thermalHeight;
        this.totalKineticEnergyBar.rectY = potentialAndThermalHeight;
        this.totalKineticEnergyBar.rectHeight = totalHeight - potentialAndThermalHeight;
        this.totalHighlightBar.rectHeight = totalHeight;

        if ( kineticEnergy >= maxHeight ) {
          this.kineticEnergyArrow.visible = true;
          this.kineticEnergyArrow.bottom = this.chartHeightProperty.value;
        }
        else {
          this.kineticEnergyArrow.visible = false;
        }

        if ( potentialEnergy >= maxHeight ) {
          this.potentialEnergyArrow.visible = true;
          this.potentialEnergyArrow.bottom = this.chartHeightProperty.value;
        }
        else {
          this.potentialEnergyArrow.visible = false;
        }

        if ( thermalEnergy >= maxHeight ) {
          this.thermalEnergyArrow.visible = true;
          this.thermalEnergyArrow.bottom = this.chartHeightProperty.value;
        }
        else {
          this.thermalEnergyArrow.visible = false;
        }

        if ( kineticEnergy + potentialEnergy + thermalEnergy >= maxHeight ) {
          this.totalEnergyArrow.visible = true;
          this.totalEnergyArrow.bottom = this.chartHeightProperty.value;
        }
        else {
          this.totalEnergyArrow.visible = false;
        }
      }
    }
  } );
} );
