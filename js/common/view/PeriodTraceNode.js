// Copyright 2002-2014, University of Colorado Boulder

/**
 * Protractor node in 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var Shape = require( 'KITE/Shape' );

  // constants
  var EMPTY_SHAPE = new Shape();

  /**
   * @param {Array} pendulumModels - Array of pendulum models.
   * @param {Function} metersToPixels - Function to convert meters to pixels.
   * @param {Property} isPeriodTraceVisibleProperty - Property to control visibility of period trace path.
   * @param {Object} options for protractor node
   * @constructor
   */
  function PeriodTraceNode( pendulumModels, metersToPixels, isPeriodTraceVisibleProperty, options ) {
    var self = this;
    Node.call( this, options );

    pendulumModels.forEach( function( pendulumModel ) {
      // create array for store passed points and direction flag
      var pathPointsStorage = [], traceDirection, traceLength;

      // create trace path path
      var pathNode = new Path( EMPTY_SHAPE, {stroke: PendulumLabConstants.FIRST_PENDULUM_COLOR, lineWidth: 2} );
      self.addChild( pathNode );

      var clearPath = function() {
        pathNode.setShape( EMPTY_SHAPE );
        pathPointsStorage = [];
      };

      isPeriodTraceVisibleProperty.link( function( isPeriodTraceVisible ) {
        pathNode.visible = isPeriodTraceVisible;
      } );

      pendulumModel.property( 'angle' ).link( function( newAngle, oldAngle ) {
        if ( pathNode.visible && !pendulumModel.isUserControlled ) {
          if ( (pathPointsStorage.length === 0 || pathPointsStorage.length === 3) && (newAngle * oldAngle < 0) ) {
            if ( pathPointsStorage.length === 0 ) {
              traceDirection = newAngle;
              traceLength = metersToPixels( pendulumModel.length * 3 / 4 );
            }
            pathPointsStorage.push( {x: 0, y: traceLength} );
          }

          if ( pathPointsStorage.length === 1 || pathPointsStorage.length === 2 ) {
            if ( (traceDirection > 0 && newAngle < oldAngle) || (traceDirection < 0 && newAngle > oldAngle) ) {
              pathPointsStorage.push( {x: traceLength * Math.cos( newAngle ), y: traceLength * Math.sin( newAngle )} );
            }
          }
        }
      } );

      // clear trace if length was changed or moved by user
      pendulumModel.property( 'length' ).lazyLink( clearPath );
      pendulumModel.property( 'isUserControlled' ).lazyLink( clearPath );
    } );
  }

  return inherit( Node, PeriodTraceNode );
} );