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
  var ARROW_HEAD_HEIGHT = 7;
  var BAR_WIDTH = 6;
  var COLOR = {
    KINETIC: 'rgb( 31, 202, 46 )',
    POTENTIAL: 'rgb( 55, 132, 213 )',
    THERMAL: 'rgb( 253, 87, 31 )',
    TOTAL: 'rgb( 0, 0, 0 )'
  };
  var FONT = new PhetFont( {size: 10, weight: 'bold'} );
  var SPACING = 4;

  /**
   * @param {PropertySet} pendulumModel - Property with selected mode of energy graph representation.
   * @param {Property} isEnergyGraphExpandedProperty - Property which track expansion of graph.
   * @param {number} pendulumNumber - Index number of the graph.
   * @param {dimension} dimension of graph
   * @constructor
   */
  function SingleEnergyGraphNode( pendulumModel, isEnergyGraphExpandedProperty, pendulumNumber, dimension ) {
    this._isEnergyGraphExpandedProperty = isEnergyGraphExpandedProperty;

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
      headHeight: ARROW_HEAD_HEIGHT,
      headWidth: ARROW_HEAD_WIDTH
    } );

    // create bars
    this.ENERGY_MULTIPLIER = 10;
    this.kineticEnergyBar = new Rectangle( 0, 0, BAR_WIDTH, 0, {fill: COLOR.KINETIC, rotation: Math.PI} );
    this.kineticEnergyBarClone = new Rectangle( 0, 0, BAR_WIDTH, 0, {fill: COLOR.KINETIC} );
    this.potentialEnergyBar = new Rectangle( 0, 0, BAR_WIDTH, 0, {fill: COLOR.POTENTIAL, rotation: Math.PI} );
    this.potentialEnergyBarClone = new Rectangle( 0, 0, BAR_WIDTH, 0, {fill: COLOR.POTENTIAL} );
    this.thermalEnergyBar = new Rectangle( 0, 0, BAR_WIDTH, 0, {fill: COLOR.THERMAL, rotation: Math.PI} );
    this.thermalEnergyBarClone = new Rectangle( 0, 0, BAR_WIDTH, 0, {fill: COLOR.THERMAL} );

    var bars = new HBox( {
      resize: false,
      x: axisY.bounds.maxX,
      y: graphHeight,
      spacing: (dimension.width - ARROW_HEAD_WIDTH) / 4 - BAR_WIDTH,
      align: 'bottom',
      children: [this.kineticEnergyBar, this.potentialEnergyBar, this.thermalEnergyBar, new VBox( {
        rotation: Math.PI,
        children: [this.thermalEnergyBarClone, this.potentialEnergyBarClone, this.kineticEnergyBarClone]
      } )]
    } );

    VBox.call( this, {
      resize: false,
      spacing: SPACING,
      children: [header, new Node( {children: [bars, axisX, axisY]} ), barLabels]
    } );

    // add energy observers
    this.kineticEnergyProperty = pendulumModel.property( 'kineticEnergy' );
    this.kineticEnergyProperty.link( this.updateKineticEnergy.bind( this ) );
    this.potentialEnergyProperty = pendulumModel.property( 'potentialEnergy' );
    this.potentialEnergyProperty.link( this.updatePotentialEnergy.bind( this ) );
    this.thermalEnergyProperty = pendulumModel.property( 'thermalEnergy' );
    this.thermalEnergyProperty.link( this.updateThermalEnergy.bind( this ) );
  }

  return inherit( VBox, SingleEnergyGraphNode, {
    hide: function() {
      this.visible = false;
    },
    show: function() {
      this.visible = true;
    },
    updateEnergy: function( node, nodeClone, energy ) {
      node.setRectHeight( energy * this.ENERGY_MULTIPLIER );
      nodeClone.setRectHeight( energy * this.ENERGY_MULTIPLIER );
    },
    updateKineticEnergy: function() {
      if ( this._isEnergyGraphExpandedProperty.value && this.visible ) {
        this.updateEnergy( this.kineticEnergyBar, this.kineticEnergyBarClone, this.kineticEnergyProperty.value );
      }
    },
    updatePotentialEnergy: function() {
      if ( this._isEnergyGraphExpandedProperty.value && this.visible ) {
        this.updateEnergy( this.potentialEnergyBar, this.potentialEnergyBarClone, this.potentialEnergyProperty.value );
      }
    },
    updateThermalEnergy: function() {
      if ( this._isEnergyGraphExpandedProperty.value && this.visible ) {
        this.updateEnergy( this.thermalEnergyBar, this.thermalEnergyBarClone, this.thermalEnergyProperty.value );
      }
    },
    updateAllEnergies: function() {
      this.updateKineticEnergy();
      this.updatePotentialEnergy();
      this.updateThermalEnergy();
    },
    zoomIn: function() {
      this.ENERGY_MULTIPLIER *= 1.05;
      this.updateAllEnergies();
    },
    zoomOut: function() {
      this.ENERGY_MULTIPLIER *= 0.95;
      this.updateAllEnergies();
    }
  } );
} );