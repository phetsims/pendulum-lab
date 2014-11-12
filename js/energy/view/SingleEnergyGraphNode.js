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
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var KineticString = require( 'string!PENDULUM_LAB/kinetic' );
  var pattern_energyOf_0pendulumNumber = require( 'string!PENDULUM_LAB/pattern.energyOf.0pendulumNumber' );
  var PotentialString = require( 'string!PENDULUM_LAB/potential' );
  var ThermalString = require( 'string!PENDULUM_LAB/thermal' );
  var TotalString = require( 'string!PENDULUM_LAB/total' );

  // constants
  var ARROW_HEAD_WIDTH = 6;
  var ARROW_HEAD_HEAGHT = 7;
  var BAR_WIDTH = 6;
  var COLOR = {
    KINETIC: 'rgb( 31, 202, 46 )',
    POTENTIAL: 'rgb( 55, 132, 213 )',
    THERMAL: 'rgb( 253, 87, 31 )',
    TOTAL: 'rgb( 200, 201, 133 )'
  };
  var ENERGY_MULTIPLIER = 10;
  var FONT = new PhetFont( {size: 10, weight: 'bold'} );
  var SPACING = 4;

  /**
   * @param {PropertySet} pendulumModel - Property to select mode of energy graph representation.
   * @param {number} pendulumNumber - Index number of the graph.
   * @param {dimension} dimension of graph
   * @constructor
   */
  function SingleEnergyGraphNode( pendulumModel, pendulumNumber, dimension ) {
    // create header of graph
    var header = new Text( StringUtils.format( pattern_energyOf_0pendulumNumber, pendulumNumber ), {
      font: FONT,
      fill: pendulumModel.color
    } );

    // create labels for bars
    var kineticText = new Text( KineticString, {font: FONT, fill: COLOR.KINETIC, rotation: -Math.PI / 2} );
    var barLabels = new HBox( {
      resize: false,
      spacing: (dimension.width - ARROW_HEAD_WIDTH) / 4 - kineticText.width,
      align: 'top',
      children: [
        kineticText,
        new Text( PotentialString, {font: FONT, fill: COLOR.POTENTIAL, rotation: -Math.PI / 2} ),
        new Text( ThermalString, {font: FONT, fill: COLOR.THERMAL, rotation: -Math.PI / 2} ),
        new Text( TotalString, {font: FONT, fill: COLOR.TOTAL, rotation: -Math.PI / 2} )
      ]
    } );

    // rest of space will be used for graph and bars
    var graphHeight = dimension.height - header.height - barLabels.height - SPACING * 3;

    // create 'x' and 'y' axis
    var axisX = new Line( 0, graphHeight, dimension.width - ARROW_HEAD_WIDTH / 2, graphHeight, {stroke: 'black'} );
    var axisY = new ArrowNode( 0, graphHeight, 0, 0, {
      tailWidth: 2,
      headHeight: ARROW_HEAD_HEAGHT,
      headWidth: ARROW_HEAD_WIDTH
    } );

    // create bars
    var kineticEnergyBar = new Rectangle( 0, 0, BAR_WIDTH, 0, {fill: COLOR.KINETIC, rotation: Math.PI} );
    var potentialEnergyBar = new Rectangle( 0, 0, BAR_WIDTH, 0, {fill: COLOR.POTENTIAL, rotation: Math.PI} );
    var thermalEnergyBar = new Rectangle( 0, 0, BAR_WIDTH, 0, {fill: COLOR.THERMAL, rotation: Math.PI} );
    var totalEnergyBar = new Rectangle( 0, 0, BAR_WIDTH, 0, {fill: COLOR.TOTAL, rotation: Math.PI} );

    var bars = new HBox( {
      resize: false,
      x: axisY.bounds.maxX,
      y: graphHeight,
      spacing: (dimension.width - ARROW_HEAD_WIDTH) / 4 - BAR_WIDTH,
      align: 'bottom',
      children: [kineticEnergyBar, potentialEnergyBar, thermalEnergyBar, totalEnergyBar]
    } );

    VBox.call( this, {
      resize: false,
      spacing: SPACING,
      children: [header, new Node( {children: [axisX, axisY, bars]} ), barLabels]
    } );

    // add energy observers
    pendulumModel.property( 'kineticEnergy' ).link( function( kineticEnergy ) {
      kineticEnergyBar.setRectHeight( kineticEnergy * ENERGY_MULTIPLIER );
    } );

    pendulumModel.property( 'potentialEnergy' ).link( function( potentialEnergy ) {
      potentialEnergyBar.setRectHeight( potentialEnergy * ENERGY_MULTIPLIER );
    } );

    pendulumModel.property( 'thermalEnergy' ).link( function( thermalEnergy ) {
      thermalEnergyBar.setRectHeight( thermalEnergy * ENERGY_MULTIPLIER );
    } );

    pendulumModel.property( 'totalEnergy' ).link( function( totalEnergy ) {
      totalEnergyBar.setRectHeight( totalEnergy * ENERGY_MULTIPLIER );
    } );

  }

  return inherit( VBox, SingleEnergyGraphNode, {
    hide: function() {
      this.visible = false;
    },
    show: function() {
      this.visible = true;
    }
  } );
} );