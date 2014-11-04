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
  var HStrut = require( 'SUN/HStrut' );
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
  var COLOR = {
    KINETIC: 'rgb( 31, 202, 46 )',
    POTENTIAL: 'rgb( 55, 132, 213 )',
    THERMAL: 'rgb( 253, 87, 31 )',
    TOTAL: 'rgb( 200, 201, 133 )'
  };
  var FONT = new PhetFont( {size: 10, weight: 'bold'} );
  var PADDING_LEFT = 6;
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
    var barLabels = new HBox( {
      spacing: 3,
      align: 'top',
      children: [
        new HStrut( PADDING_LEFT / 2 ),
        new Text( KineticString, {font: FONT, fill: COLOR.KINETIC, rotation: -Math.PI / 2} ),
        new Text( PotentialString, {font: FONT, fill: COLOR.POTENTIAL, rotation: -Math.PI / 2} ),
        new Text( ThermalString, {font: FONT, fill: COLOR.THERMAL, rotation: -Math.PI / 2} ),
        new Text( TotalString, {font: FONT, fill: COLOR.TOTAL, rotation: -Math.PI / 2} )
      ]
    } );

    // rest of space will be used for graph and bars
    var barHeight = dimension.height - header.height - barLabels.height - SPACING * 3;

    // create 'x' and 'y' axis
    var axisX = new Line( PADDING_LEFT, barHeight, dimension.width - PADDING_LEFT, barHeight, {stroke: 'black'} );
    var axisY = new ArrowNode( 0, barHeight, 0, 0, {
      tailWidth: 2,
      headHeight: 7,
      headWidth: 6,
      x: PADDING_LEFT
    } );

    // create bars
    var bars = new HBox( {
      spacing: 8,
      align: 'bottom',
      children: [
        new HStrut( axisY.width - PADDING_LEFT + 1 ),
        new Rectangle( 0, 0, 6, barHeight, {fill: COLOR.KINETIC} ),
        new Rectangle( 0, 0, 6, barHeight / 2, {fill: COLOR.POTENTIAL} ),
        new Rectangle( 0, 0, 6, barHeight, {fill: COLOR.THERMAL} ),
        new Rectangle( 0, 0, 6, barHeight, {fill: COLOR.TOTAL} )
      ]
    } );

    VBox.call( this, {
      spacing: SPACING,
      children: [header, new Node( {children: [axisX, axisY, bars]} ), barLabels]
    } );
  }

  return inherit( VBox, SingleEnergyGraphNode, {
    hide: function() {
      this.visible = false;
    },
    show: function() {
      this.visible = true;
    },
    setWidth: function( width ) {
    }
  } );
} );