// Copyright 2002-2014, University of Colorado Boulder

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
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var kineticString = require( 'string!PENDULUM_LAB/kinetic' );
  var pattern_energyOf_0pendulumNumber = require( 'string!PENDULUM_LAB/pattern.energyOf.0pendulumNumber' );
  var potentialString = require( 'string!PENDULUM_LAB/potential' );
  var thermalString = require( 'string!PENDULUM_LAB/thermal' );
  var totalString = require( 'string!PENDULUM_LAB/total' );

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
  var FONT = new PhetFont( { size: 10, weight: 'bold' } );
  var SPACING = 4;

  /**
   * @param {Pendulum} pendulum - Property with selected pendulum for energy graph representation.
   * @param {Property<boolean>} isEnergyGraphExpandedProperty - Property which track expansion of graph.
   * @param {number} pendulumNumber - Index number of the graph.
   * @param {dimension} dimension of graph.
   * @constructor
   */
  function SingleEnergyGraphNode( pendulum, isEnergyGraphExpandedProperty, pendulumNumber, dimension ) {
    var self = this;

    this._isEnergyGraphExpandedProperty = isEnergyGraphExpandedProperty;

    // create header of graph
    var header = new Text( StringUtils.format( pattern_energyOf_0pendulumNumber, pendulumNumber ), {
      font: FONT,
      fill: pendulum.color
    } );

    // create labels for bars
    var kineticText = new Text( kineticString, { font: FONT, fill: COLOR.KINETIC, rotation: -Math.PI / 2 } );
    var barLabels = new HBox( {
      resize: false,
      spacing: (dimension.width - ARROW_HEAD_WIDTH) / 4 - kineticText.width,
      align: 'top',
      children: [
        kineticText,
        new Text( potentialString, { font: FONT, fill: COLOR.POTENTIAL, rotation: -Math.PI / 2 } ),
        new Text( thermalString, { font: FONT, fill: COLOR.THERMAL, rotation: -Math.PI / 2 } ),
        new Text( totalString, { font: FONT, fill: COLOR.TOTAL, rotation: -Math.PI / 2 } )
      ]
    } );

    // rest of space will be used for graph and bars
    var graphHeight = dimension.height - header.height - barLabels.height - SPACING * 3;

    // create 'x' and 'y' axis
    var axisX = new Line( 0, graphHeight, dimension.width - ARROW_HEAD_WIDTH / 2, graphHeight, { stroke: 'black' } );
    var axisY = new ArrowNode( 0, graphHeight, 0, 0, {
      tailWidth: 2,
      headHeight: ARROW_HEAD_HEIGHT,
      headWidth: ARROW_HEAD_WIDTH
    } );

    // create bars
    this.energyMultiplier = 10; // @private
    this.kineticEnergyBar = new Rectangle( 0, 0, BAR_WIDTH, 0, { fill: COLOR.KINETIC, rotation: Math.PI } );
    this.kineticEnergyBarClone = new Rectangle( 0, 0, BAR_WIDTH, 0, { fill: COLOR.KINETIC } );
    this.potentialEnergyBar = new Rectangle( 0, 0, BAR_WIDTH, 0, { fill: COLOR.POTENTIAL, rotation: Math.PI } );
    this.potentialEnergyBarClone = new Rectangle( 0, 0, BAR_WIDTH, 0, { fill: COLOR.POTENTIAL } );
    this.thermalEnergyBar = new Rectangle( 0, 0, BAR_WIDTH, 0, { fill: COLOR.THERMAL, rotation: Math.PI } );
    this.thermalEnergyBarClone = new Rectangle( 0, 0, BAR_WIDTH, 0, { fill: COLOR.THERMAL } );

    var bars = new HBox( {
      resize: false,
      x: axisY.bounds.maxX,
      y: graphHeight,
      spacing: (dimension.width - ARROW_HEAD_WIDTH) / 4 - BAR_WIDTH,
      align: 'bottom',
      clipArea: Shape.rect( -axisY.width / 2, -graphHeight, dimension.width + axisY.width / 2, graphHeight ),
      children: [ this.kineticEnergyBar, this.potentialEnergyBar, this.thermalEnergyBar, new VBox( {
        rotation: Math.PI,
        children: [ this.thermalEnergyBarClone, this.potentialEnergyBarClone, this.kineticEnergyBarClone ]
      } ) ]
    } );

    VBox.call( this, {
      resize: false,
      spacing: SPACING,
      children: [ header, new Node( { children: [ bars, axisX, axisY ] } ), barLabels ]
    } );

    // add energy observers
    this.kineticEnergyProperty = pendulum.kineticEnergyProperty;
    this.kineticEnergyProperty.link( this.updateKineticEnergy.bind( this ) );
    this.potentialEnergyProperty = pendulum.potentialEnergyProperty;
    this.potentialEnergyProperty.link( this.updatePotentialEnergy.bind( this ) );
    this.thermalEnergyProperty = pendulum.thermalEnergyProperty;
    this.thermalEnergyProperty.link( this.updateThermalEnergy.bind( this ) );

    isEnergyGraphExpandedProperty.link( function( isEnergyGraphExpanded ) {
      if ( isEnergyGraphExpanded ) {
        self.updateAllEnergies();
      }
    } );
  }

  return inherit( VBox, SingleEnergyGraphNode, {
    hide: function() {
      this.visible = false;
    },
    show: function() {
      this.visible = true;
    },
    updateEnergy: function( node, nodeClone, energy ) {
      node.setRectHeight( energy * this.energyMultiplier );
      nodeClone.setRectHeight( energy * this.energyMultiplier );
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
      this.energyMultiplier *= 1.05;
      this.updateAllEnergies();
    },
    zoomOut: function() {
      this.energyMultiplier *= 0.95;
      this.updateAllEnergies();
    }
  } );
} );