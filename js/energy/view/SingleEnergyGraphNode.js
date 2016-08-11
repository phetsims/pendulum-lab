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
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var ClearThermalButton = require( 'PENDULUM_LAB/energy/view/ClearThermalButton' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var kineticString = require( 'string!PENDULUM_LAB/kinetic' );
  var patternEnergyOf0PendulumNumberString = require( 'string!PENDULUM_LAB/pattern.energyOf.0pendulumNumber' );
  var potentialString = require( 'string!PENDULUM_LAB/potential' );
  var thermalString = require( 'string!PENDULUM_LAB/thermal' );
  var totalString = require( 'string!PENDULUM_LAB/total' );

  // constants
  var ZOOM_MULTIPLIER = 1.3;
  var BAR_WIDTH = 8;
  var BAR_OFFSET = 4;

  var ARROW_HEAD_WIDTH = 6; // for the arrows on the x and y axis
  var ARROW_HEAD_HEIGHT = 7;
  var COLOR = {
    KINETIC: 'rgb( 31, 202, 46 )',
    POTENTIAL: 'rgb( 55, 132, 213 )',
    THERMAL: 'rgb( 253, 87, 31 )',
    TOTAL: 'rgb( 0, 0, 0 )'
  };
  var FONT = new PhetFont( { size: 11, weight: 'bold' } );
  var SPACING = 4;

  /**
   * @param {Pendulum} pendulum - Property with selected pendulum for energy graph representation.
   * @param {Property.<boolean>} isEnergyGraphExpandedProperty - Property which track expansion of graph.
   * @param {number} pendulumNumber - Index number of the graph.
   * @param {Dimension2} dimension - dimension of graph in view coordinates.
   * @constructor
   */
  function SingleEnergyGraphNode( pendulum, isEnergyGraphExpandedProperty, pendulumNumber, dimension ) {

    // @private
    this.pendulum = pendulum;
    this.isEnergyGraphExpandedProperty = isEnergyGraphExpandedProperty;

    var BAR_SPACING = dimension.width / 4 - BAR_WIDTH; // amount of space between bars (half on each side of each bar)

    // position of the bars of the energy bar graph
    var kineticCenterX = BAR_OFFSET + 0.5 * BAR_SPACING + 0 * BAR_WIDTH;
    var potentialCenterX = BAR_OFFSET + 1.5 * BAR_SPACING + 1 * BAR_WIDTH;
    var thermalCenterX = BAR_OFFSET + 2.5 * BAR_SPACING + 2 * BAR_WIDTH;
    var totalCenterX = BAR_OFFSET + 3.5 * BAR_SPACING + 3 * BAR_WIDTH;

    // header of graph
    var header = new Text( StringUtils.format( patternEnergyOf0PendulumNumberString, pendulumNumber ), {
      font: FONT,
      fill: pendulum.color,
      centerX: dimension.width / 2,
      maxWidth: 122
    } );

    // labels for bars
    var barLabelOptions = {
      font: FONT,
      rotation: -Math.PI / 2,
      top: +SPACING,
      maxWidth: 70
    };
    var kineticLabel = new Text( kineticString, _.extend( { fill: COLOR.KINETIC, centerX: kineticCenterX }, barLabelOptions ) );
    var potentialLabel = new Text( potentialString, _.extend( { fill: COLOR.POTENTIAL, centerX: potentialCenterX }, barLabelOptions ) );
    var thermalLabel = new Text( thermalString, _.extend( { fill: COLOR.THERMAL, centerX: thermalCenterX }, barLabelOptions ) );
    var totalLabel = new Text( totalString, _.extend( { fill: COLOR.TOTAL, centerX: totalCenterX }, barLabelOptions ) );
    var maxLabelHeight = Math.max( Math.max( kineticLabel.height, potentialLabel.height ), Math.max( thermalLabel.height, totalLabel.height ) );

    // rest of space will be used for graph and bars
    this.graphHeight = dimension.height - header.height - maxLabelHeight - SPACING * 2;
    header.bottom = -this.graphHeight - SPACING;

    // create 'x' and 'y' axis
    var axisX = new Line( 0, 0, dimension.width, 0, { stroke: 'black' } );
    var axisY = new ArrowNode( 0, 0, 0, this.graphHeight, {
      tailWidth: 2,
      headHeight: ARROW_HEAD_HEIGHT,
      headWidth: ARROW_HEAD_WIDTH
    } );

    // @private
    // individual bars
    this.kineticEnergyBar = new Rectangle( 0, 0, BAR_WIDTH, 0, {
      fill: COLOR.KINETIC,
      centerX: kineticCenterX
    } );
    this.potentialEnergyBar = new Rectangle( 0, 0, BAR_WIDTH, 0, {
      fill: COLOR.POTENTIAL,
      centerX: potentialCenterX
    } );
    this.thermalEnergyBar = new Rectangle( 0, 0, BAR_WIDTH, 0, {
      fill: COLOR.THERMAL,
      centerX: thermalCenterX
    } );

    // @private
    // combined 'total' bar
    this.totalKineticEnergyBar = new Rectangle( 0, 0, BAR_WIDTH, 0, {
      fill: COLOR.KINETIC,
      centerX: totalCenterX
    } );
    this.totalPotentialEnergyBar = new Rectangle( 0, 0, BAR_WIDTH, 0, {
      fill: COLOR.POTENTIAL,
      centerX: totalCenterX
    } );
    this.totalThermalEnergyBar = new Rectangle( 0, 0, BAR_WIDTH, 0, {
      fill: COLOR.THERMAL,
      centerX: totalCenterX
    } );

    var clearThermalButton = new ClearThermalButton( pendulum.thermalEnergyProperty, {
      centerX: thermalCenterX,
      top: thermalLabel.bottom + 5
    } );


    Node.call( this, {
      preventFit: true,
      children: [
        header,
        kineticLabel, potentialLabel, thermalLabel, totalLabel, clearThermalButton,
        new Node( {
          // flip the coordinate frame for easier positioning
          matrix: Matrix3.scale( 1, -1 ),
          children: [
            this.kineticEnergyBar, this.potentialEnergyBar, this.thermalEnergyBar,
            this.totalKineticEnergyBar, this.totalPotentialEnergyBar, this.totalThermalEnergyBar,
            axisX, axisY
          ]
        } )
      ]
    } );

    // add listeners to pendulum
    var updateListener = this.update.bind( this );
    pendulum.stepEmitter.addListener( updateListener );
    pendulum.resetEmitter.addListener( updateListener );
    pendulum.userMovedEmitter.addListener( updateListener );
    pendulum.lengthProperty.link( updateListener );
    pendulum.massProperty.link( updateListener );
    pendulum.energyMultiplierProperty.lazyLink( updateListener );
    isEnergyGraphExpandedProperty.link( updateListener );
  }

  pendulumLab.register( 'SingleEnergyGraphNode', SingleEnergyGraphNode );

  return inherit( Node, SingleEnergyGraphNode, {
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
      if ( this.isEnergyGraphExpandedProperty.value && this.visible ) {
        var energyMultiplier = this.pendulum.energyMultiplier;
        var maxHeight = this.graphHeight;

        var kineticEnergy = this.pendulum.kineticEnergy * energyMultiplier;
        var potentialEnergy = this.pendulum.potentialEnergy * energyMultiplier;
        var thermalEnergy = this.pendulum.thermalEnergy * energyMultiplier;

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
      }
    },
    /**
     * Updates the length of the bar graphs by multiplying each of them by a common factor
     * Mimics the actions of zooming in.
     * @public
     */
    zoomIn: function() {
      this.pendulum.energyMultiplier *= ZOOM_MULTIPLIER;
      this.update();
    },
    /**
     * Updates the length of the bar graphs by dividing each of them by a common factor
     * Mimics the actions of zooming out.
     * @public
     */
    zoomOut: function() {
      this.pendulum.energyMultiplier /= ZOOM_MULTIPLIER;
      this.update();
    }
  } );
} );